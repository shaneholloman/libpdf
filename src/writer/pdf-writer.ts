/**
 * PDF file writer.
 *
 * Supports both full save (rewrite everything) and incremental save
 * (append only changed objects).
 */

import { clearAllDirtyFlags, collectChanges } from "#src/document/change-collector";
import type { ObjectRegistry } from "#src/document/object-registry";
import type { PdfObject } from "#src/objects/object";
import type { PdfRef } from "#src/objects/pdf-ref";
import { serializeIndirectObject } from "./serializer";
import { writeXRefStream, writeXRefTable, type XRefWriteEntry } from "./xref-writer";

const textEncoder = new TextEncoder();

function encode(str: string): Uint8Array {
  return textEncoder.encode(str);
}

function concat(...arrays: Uint8Array[]): Uint8Array {
  const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
  const result = new Uint8Array(totalLength);

  let offset = 0;

  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }

  return result;
}

/**
 * Options for PDF writing.
 */
export interface WriteOptions {
  /** PDF version string (default: "1.7") */
  version?: string;

  /** Root catalog reference */
  root: PdfRef;

  /** Info dictionary reference (optional) */
  info?: PdfRef;

  /** Encrypt dictionary reference (optional) */
  encrypt?: PdfRef;

  /** Document ID (optional, two 16-byte arrays) */
  id?: [Uint8Array, Uint8Array];

  /** Use XRef stream instead of table (PDF 1.5+) */
  useXRefStream?: boolean;
}

/**
 * Options for incremental save.
 */
export interface IncrementalWriteOptions extends WriteOptions {
  /** Original PDF bytes */
  originalBytes: Uint8Array;

  /** Offset of the original xref */
  originalXRefOffset: number;
}

/**
 * Result of a write operation.
 */
export interface WriteResult {
  /** The written PDF bytes */
  bytes: Uint8Array;

  /** Byte offset where the xref section starts */
  xrefOffset: number;
}

/**
 * Write a complete PDF from scratch.
 *
 * Structure:
 * ```
 * %PDF-X.Y
 * %[binary comment]
 * 1 0 obj
 * ...
 * endobj
 * 2 0 obj
 * ...
 * xref
 * ...
 * trailer
 * ...
 * startxref
 * ...
 * %%EOF
 * ```
 */
export function writeComplete(registry: ObjectRegistry, options: WriteOptions): WriteResult {
  const parts: Uint8Array[] = [];

  // Version
  const version = options.version ?? "1.7";

  parts.push(encode(`%PDF-${version}\n`));

  // Binary comment (signals binary file to text tools)
  // Use high-byte characters as recommended by PDF spec
  parts.push(new Uint8Array([0x25, 0xe2, 0xe3, 0xcf, 0xd3, 0x0a])); // %âãÏÓ\n

  // Track offsets for xref
  const offsets = new Map<number, { offset: number; generation: number }>();

  // Collect all objects
  const allObjects = new Map<PdfRef, PdfObject>();

  for (const [ref, obj] of registry.entries()) {
    allObjects.set(ref, obj);
  }

  // Write objects and record offsets
  let currentOffset = parts.reduce((sum, p) => sum + p.length, 0);

  for (const [ref, obj] of allObjects) {
    offsets.set(ref.objectNumber, {
      offset: currentOffset,
      generation: ref.generation,
    });

    const objBytes = serializeIndirectObject(ref, obj);

    parts.push(objBytes);
    currentOffset += objBytes.length;
  }

  // Record xref offset before writing it
  const xrefOffset = currentOffset;

  // Build xref entries
  const entries: XRefWriteEntry[] = [
    // Object 0 is always the free list head
    { objectNumber: 0, generation: 65535, type: "free", offset: 0 },
  ];

  for (const [objNum, info] of offsets) {
    entries.push({
      objectNumber: objNum,
      generation: info.generation,
      type: "inuse",
      offset: info.offset,
    });
  }

  // Calculate size (max object number + 1)
  const size = Math.max(0, ...entries.map(e => e.objectNumber)) + 1;

  // Write xref section
  if (options.useXRefStream) {
    // XRef stream needs its own object number
    const xrefObjNum = registry.nextObjectNumber;

    const { bytes: xrefBytes } = writeXRefStream({
      entries,
      size: size + 1, // Include xref stream itself
      xrefOffset,
      root: options.root,
      info: options.info,
      encrypt: options.encrypt,
      id: options.id,
      streamObjectNumber: xrefObjNum,
    });

    parts.push(xrefBytes);
  } else {
    const xrefBytes = writeXRefTable({
      entries,
      size,
      xrefOffset,
      root: options.root,
      info: options.info,
      encrypt: options.encrypt,
      id: options.id,
    });

    parts.push(xrefBytes);
  }

  return {
    bytes: concat(...parts),
    xrefOffset,
  };
}

/**
 * Write an incremental update to a PDF.
 *
 * Appends only the changed/new objects to the original PDF bytes,
 * preserving the original content exactly.
 *
 * Structure:
 * ```
 * [original PDF bytes]
 * [modified object 1]
 * [modified object 2]
 * ...
 * xref
 * ...
 * trailer
 * << ... /Prev [originalXRefOffset] >>
 * startxref
 * ...
 * %%EOF
 * ```
 */
export function writeIncremental(
  registry: ObjectRegistry,
  options: IncrementalWriteOptions,
): WriteResult {
  // Collect changes
  const changes = collectChanges(registry);

  // If no changes, return original (should caller handle this?)
  if (changes.modified.size === 0 && changes.created.size === 0) {
    return {
      bytes: options.originalBytes,
      xrefOffset: options.originalXRefOffset,
    };
  }

  const parts: Uint8Array[] = [];

  // Start with original bytes
  parts.push(options.originalBytes);

  // Ensure there's a newline before appended content
  const lastByte = options.originalBytes[options.originalBytes.length - 1];

  if (lastByte !== 0x0a && lastByte !== 0x0d) {
    parts.push(encode("\n"));
  }

  // Track current offset (after original bytes + potential newline)
  let currentOffset = parts.reduce((sum, p) => sum + p.length, 0);

  // Track offsets for new xref
  const offsets = new Map<number, { offset: number; generation: number }>();

  // Write modified objects
  for (const [ref, obj] of changes.modified) {
    offsets.set(ref.objectNumber, {
      offset: currentOffset,
      generation: ref.generation,
    });

    const objBytes = serializeIndirectObject(ref, obj);

    parts.push(objBytes);
    currentOffset += objBytes.length;
  }

  // Write new objects
  for (const [ref, obj] of changes.created) {
    offsets.set(ref.objectNumber, {
      offset: currentOffset,
      generation: ref.generation,
    });

    const objBytes = serializeIndirectObject(ref, obj);

    parts.push(objBytes);
    currentOffset += objBytes.length;
  }

  // Record xref offset
  const xrefOffset = currentOffset;

  // Build xref entries (only for changed objects)
  const entries: XRefWriteEntry[] = [];

  for (const [objNum, info] of offsets) {
    entries.push({
      objectNumber: objNum,
      generation: info.generation,
      type: "inuse",
      offset: info.offset,
    });
  }

  // Calculate size (all objects including unchanged)
  const size = Math.max(changes.maxObjectNumber + 1, registry.nextObjectNumber);

  // Write xref section with /Prev pointer
  if (options.useXRefStream) {
    const xrefObjNum = registry.nextObjectNumber;

    const { bytes: xrefBytes } = writeXRefStream({
      entries,
      size,
      xrefOffset,
      prev: options.originalXRefOffset,
      root: options.root,
      info: options.info,
      encrypt: options.encrypt,
      id: options.id,
      streamObjectNumber: xrefObjNum,
    });

    parts.push(xrefBytes);
  } else {
    const xrefBytes = writeXRefTable({
      entries,
      size,
      xrefOffset,
      prev: options.originalXRefOffset,
      root: options.root,
      info: options.info,
      encrypt: options.encrypt,
      id: options.id,
    });

    parts.push(xrefBytes);
  }

  // Clear dirty flags and commit new objects
  clearAllDirtyFlags(registry);
  registry.commitNewObjects();

  return {
    bytes: concat(...parts),
    xrefOffset,
  };
}

/**
 * Utility to check if incremental save produced valid output.
 *
 * Verifies that:
 * 1. Original bytes are preserved exactly
 * 2. New content starts after original
 * 3. Basic structure is valid
 */
export function verifyIncrementalSave(
  original: Uint8Array,
  result: Uint8Array,
): { valid: boolean; error?: string } {
  // Result must be at least as long as original
  if (result.length < original.length) {
    return { valid: false, error: "Result shorter than original" };
  }

  // Original bytes must be preserved exactly
  for (let i = 0; i < original.length; i++) {
    if (result[i] !== original[i]) {
      return {
        valid: false,
        error: `Byte mismatch at offset ${i}: expected ${original[i]}, got ${result[i]}`,
      };
    }
  }

  // Check for %%EOF at end
  const tail = new TextDecoder().decode(result.slice(-10));

  if (!tail.includes("%%EOF")) {
    return { valid: false, error: "Missing %%EOF at end" };
  }

  return { valid: true };
}
