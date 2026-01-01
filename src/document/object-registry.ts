/**
 * Object registry for tracking PDF objects and their references.
 *
 * Manages the bidirectional mapping between PdfRef and PdfObject,
 * tracks new objects, and assigns object numbers.
 */

import type { PdfObject } from "#src/objects/object";
import { PdfRef } from "#src/objects/pdf-ref";
import type { XRefEntry } from "#src/parser/xref-parser";

/**
 * Registry for managing PDF objects and their references.
 *
 * Responsibilities:
 * - Map refs to objects (loaded and new)
 * - Map objects back to refs
 * - Track new objects separately from loaded
 * - Assign sequential object numbers to new objects
 */
export class ObjectRegistry {
  /** Objects loaded from the PDF (ref key → object) */
  private loaded = new Map<PdfRef, PdfObject>();

  /** New objects created by the user (ref → object) */
  private newObjects = new Map<PdfRef, PdfObject>();

  /** Reverse mapping: object → ref (uses WeakMap for GC) */
  private objectToRef = new WeakMap<object, PdfRef>();

  /** Next object number to assign */
  private _nextObjNum: number;

  /**
   * Create a new registry.
   *
   * @param xref - The xref table from parsing (used to determine next object number)
   */
  constructor(xref?: Map<number, XRefEntry>) {
    if (xref && xref.size > 0) {
      // Find max object number from xref
      const maxObjNum = Math.max(...xref.keys());

      this._nextObjNum = maxObjNum + 1;
    } else {
      // Start from 1 (0 is reserved for free list head)
      this._nextObjNum = 1;
    }
  }

  /**
   * Get the next object number that will be assigned.
   */
  get nextObjectNumber(): number {
    return this._nextObjNum;
  }

  /**
   * Register a loaded object (from parsing).
   *
   * @param ref - The object's reference
   * @param obj - The parsed object
   */
  addLoaded(ref: PdfRef, obj: PdfObject): void {
    this.loaded.set(ref, obj);

    // Only add to reverse map if it's an object type (not primitives)
    if (obj !== null && typeof obj === "object") {
      this.objectToRef.set(obj, ref);
    }
  }

  /**
   * Register a new object, assigning it a fresh object number.
   *
   * @param obj - The new object
   * @returns The assigned reference
   */
  register(obj: PdfObject): PdfRef {
    // Assign new object number, generation 0
    const ref = PdfRef.of(this._nextObjNum++, 0);

    this.newObjects.set(ref, obj);

    // Add to reverse map if it's an object type
    if (obj !== null && typeof obj === "object") {
      this.objectToRef.set(obj, ref);
    }

    return ref;
  }

  /**
   * Get the reference for an object.
   *
   * @param obj - The object to look up
   * @returns The reference, or undefined if not registered
   */
  getRef(obj: PdfObject): PdfRef | undefined {
    if (obj === null || typeof obj !== "object") {
      return undefined;
    }

    return this.objectToRef.get(obj);
  }

  /**
   * Get an object by reference.
   *
   * Checks both loaded and new objects.
   *
   * @param ref - The reference to look up
   * @returns The object, or undefined if not found
   */
  getObject(ref: PdfRef): PdfObject | undefined {
    return this.loaded.get(ref) ?? this.newObjects.get(ref);
  }

  /**
   * Check if an object is registered (loaded or new).
   */
  isRegistered(obj: PdfObject): boolean {
    return this.getRef(obj) !== undefined;
  }

  /**
   * Check if an object is new (not loaded from the PDF).
   */
  isNew(ref: PdfRef): boolean {
    return this.newObjects.has(ref);
  }

  /**
   * Get all new objects for serialization.
   */
  getNewObjects(): Map<PdfRef, PdfObject> {
    return new Map(this.newObjects);
  }

  /**
   * Get all loaded objects.
   */
  getLoadedObjects(): Map<PdfRef, PdfObject> {
    return new Map(this.loaded);
  }

  /**
   * Move new objects to loaded (called after successful save).
   *
   * This transitions new objects to "loaded" state so subsequent
   * modifications are tracked via dirty flags.
   */
  commitNewObjects(): void {
    for (const [ref, obj] of this.newObjects) {
      this.loaded.set(ref, obj);
    }

    this.newObjects.clear();
  }

  /**
   * Check if there are any new objects.
   */
  hasNewObjects(): boolean {
    return this.newObjects.size > 0;
  }

  /**
   * Iterate over all objects (loaded + new).
   */
  *entries(): IterableIterator<[PdfRef, PdfObject]> {
    yield* this.loaded;
    yield* this.newObjects;
  }
}
