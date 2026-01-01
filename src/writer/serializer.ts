/**
 * PDF object serialization.
 *
 * Converts PdfObject instances to PDF byte format for writing.
 */

import type { PdfObject } from "#src/objects/object";
import { PdfArray } from "#src/objects/pdf-array";
import { PdfBool } from "#src/objects/pdf-bool";
import { PdfDict } from "#src/objects/pdf-dict";
import { PdfName } from "#src/objects/pdf-name";
import { PdfNull } from "#src/objects/pdf-null";
import { PdfNumber } from "#src/objects/pdf-number";
import { PdfRef } from "#src/objects/pdf-ref";
import { PdfStream } from "#src/objects/pdf-stream";
import { PdfString } from "#src/objects/pdf-string";

const textEncoder = new TextEncoder();

/**
 * Encode a string to UTF-8 bytes.
 */
function encode(str: string): Uint8Array {
  return textEncoder.encode(str);
}

/**
 * Concatenate multiple Uint8Arrays into one.
 */
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

// Characters that need hex escaping in names (PDF 1.7 spec 7.3.5)
// These are: whitespace, delimiters (), <>, [], {}, /, %, #
// Plus anything outside printable ASCII (33-126)
const NAME_NEEDS_ESCAPE = new Set([
  0x00,
  0x09,
  0x0a,
  0x0c,
  0x0d,
  0x20, // whitespace
  0x28,
  0x29, // ()
  0x3c,
  0x3e, // <>
  0x5b,
  0x5d, // []
  0x7b,
  0x7d, // {}
  0x2f, // /
  0x25, // %
  0x23, // #
]);

/**
 * Escape a PDF name for serialization.
 *
 * Uses #XX hex escaping for:
 * - Bytes outside printable ASCII (33-126)
 * - Delimiter characters
 * - The # character itself
 */
function escapeName(name: string): string {
  const bytes = encode(name);

  let result = "";

  for (const byte of bytes) {
    if (byte < 33 || byte > 126 || NAME_NEEDS_ESCAPE.has(byte)) {
      // Use hex escape
      result += `#${byte.toString(16).toUpperCase().padStart(2, "0")}`;
    } else {
      result += String.fromCharCode(byte);
    }
  }

  return result;
}

/**
 * Escape a PDF literal string for serialization.
 *
 * Handles:
 * - Balanced parentheses (allowed in literal strings)
 * - Backslash escaping for \, (, )
 * - Special characters: \n, \r, \t, \b, \f
 */
function escapeLiteralString(bytes: Uint8Array): Uint8Array {
  // Pre-scan to estimate size (most strings won't need much escaping)
  let escapeCount = 0;

  for (const byte of bytes) {
    if (byte === 0x5c || byte === 0x28 || byte === 0x29) {
      // \ ( )
      escapeCount++;
    }
  }

  if (escapeCount === 0) {
    return bytes;
  }

  const result = new Uint8Array(bytes.length + escapeCount);
  let j = 0;

  for (const byte of bytes) {
    if (byte === 0x5c) {
      // backslash
      result[j++] = 0x5c;
      result[j++] = 0x5c;
    } else if (byte === 0x28) {
      // (
      result[j++] = 0x5c;
      result[j++] = 0x28;
    } else if (byte === 0x29) {
      // )
      result[j++] = 0x5c;
      result[j++] = 0x29;
    } else {
      result[j++] = byte;
    }
  }

  return result;
}

/**
 * Convert bytes to hex string.
 */
function bytesToHex(bytes: Uint8Array): string {
  let hex = "";

  for (const byte of bytes) {
    hex += byte.toString(16).toUpperCase().padStart(2, "0");
  }

  return hex;
}

/**
 * Format a number for PDF output.
 *
 * - Integers are written without decimal point
 * - Reals use minimal precision (no trailing zeros)
 * - Very small/large numbers use exponential notation
 */
function formatNumber(value: number): string {
  if (Number.isInteger(value)) {
    return value.toString();
  }

  // Use fixed precision, then strip trailing zeros
  // PDF spec recommends up to 5 decimal places
  let str = value.toFixed(5);

  // Remove trailing zeros and unnecessary decimal point
  str = str.replace(/\.?0+$/, "");

  // Handle edge case where we stripped everything after decimal
  if (str === "" || str === "-") {
    return "0";
  }

  return str;
}

/**
 * Serialize a PDF object to bytes.
 *
 * @param obj - The object to serialize
 * @returns The PDF byte representation
 */
export function serializeObject(obj: PdfObject): Uint8Array {
  if (obj instanceof PdfNull) {
    return encode("null");
  }

  if (obj instanceof PdfBool) {
    return encode(obj.value ? "true" : "false");
  }

  if (obj instanceof PdfNumber) {
    return encode(formatNumber(obj.value));
  }

  if (obj instanceof PdfName) {
    return encode(`/${escapeName(obj.value)}`);
  }

  if (obj instanceof PdfString) {
    return serializeString(obj);
  }

  if (obj instanceof PdfRef) {
    return encode(obj.toString());
  }

  if (obj instanceof PdfArray) {
    return serializeArray(obj);
  }

  if (obj instanceof PdfStream) {
    return serializeStream(obj);
  }

  if (obj instanceof PdfDict) {
    return serializeDict(obj);
  }

  // Should never reach here with proper types
  throw new Error(`Unknown object type: ${(obj as { type: string }).type}`);
}

/**
 * Serialize a PDF string.
 */
function serializeString(obj: PdfString): Uint8Array {
  if (obj.format === "hex") {
    return encode(`<${bytesToHex(obj.bytes)}>`);
  }

  // Literal format
  const escaped = escapeLiteralString(obj.bytes);
  return concat(encode("("), escaped, encode(")"));
}

/**
 * Serialize a PDF array.
 */
function serializeArray(arr: PdfArray): Uint8Array {
  const parts: Uint8Array[] = [encode("[")];

  let first = true;

  for (const item of arr) {
    if (!first) {
      parts.push(encode(" "));
    }

    parts.push(serializeObject(item));
    first = false;
  }

  parts.push(encode("]"));

  return concat(...parts);
}

/**
 * Serialize a PDF dictionary.
 */
function serializeDict(dict: PdfDict): Uint8Array {
  const parts: Uint8Array[] = [encode("<<")];

  for (const [key, value] of dict) {
    // Keys are PdfName
    parts.push(encode(`/${escapeName(key.value)}`));
    parts.push(encode(" "));
    parts.push(serializeObject(value));
  }

  parts.push(encode(">>"));

  return concat(...parts);
}

/**
 * Serialize a PDF stream.
 *
 * Streams consist of:
 * 1. Dictionary (with /Length entry)
 * 2. "stream" keyword followed by newline
 * 3. Raw stream data
 * 4. Newline followed by "endstream" keyword
 */
function serializeStream(stream: PdfStream): Uint8Array {
  // Create a copy of the dict with updated Length
  // We don't want to modify the original dict
  const dictParts: Uint8Array[] = [encode("<<")];

  // Add Length first
  dictParts.push(encode(`/Length ${stream.data.length}`));

  // Add other entries (skip Length if present, we already added it)
  for (const [key, value] of stream) {
    if (key.value !== "Length") {
      dictParts.push(encode(`/${escapeName(key.value)}`));
      dictParts.push(encode(" "));
      dictParts.push(serializeObject(value));
    }
  }

  dictParts.push(encode(">>"));

  const dictBytes = concat(...dictParts);

  // Per PDF spec, stream keyword followed by single newline (or CRLF)
  // endstream preceded by newline
  return concat(dictBytes, encode("\nstream\n"), stream.data, encode("\nendstream"));
}

/**
 * Serialize an indirect object definition.
 *
 * Format: "N G obj\n[object]\nendobj\n"
 *
 * @param ref - The object reference
 * @param obj - The object to serialize
 * @returns The complete indirect object definition
 */
export function serializeIndirectObject(ref: PdfRef, obj: PdfObject): Uint8Array {
  return concat(
    encode(`${ref.objectNumber} ${ref.generation} obj\n`),
    serializeObject(obj),
    encode("\nendobj\n"),
  );
}
