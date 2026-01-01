import type { PdfObject } from "./object";

/**
 * PDF array object (mutable).
 *
 * In PDF: `[1 2 3]`, `[/Name (string) 42]`
 *
 * Tracks modifications via a dirty flag for incremental save support.
 */
export class PdfArray {
  get type(): "array" {
    return "array";
  }

  private items: PdfObject[] = [];

  /**
   * Dirty flag for modification tracking.
   * Set to true when the array is mutated, cleared after save.
   */
  dirty = false;

  constructor(items?: PdfObject[]) {
    if (items) {
      this.items = [...items];
    }
  }

  /**
   * Clear the dirty flag. Called after saving.
   */
  clearDirty(): void {
    this.dirty = false;
  }

  get length(): number {
    return this.items.length;
  }

  /**
   * Get item at index. Returns undefined if out of bounds.
   */
  at(index: number): PdfObject | undefined {
    return this.items.at(index);
  }

  /**
   * Set item at index. Extends array if needed.
   */
  set(index: number, value: PdfObject): void {
    this.items[index] = value;
    this.dirty = true;
  }

  push(...values: PdfObject[]): void {
    this.items.push(...values);
    this.dirty = true;
  }

  pop(): PdfObject | undefined {
    const value = this.items.pop();
    if (value !== undefined) {
      this.dirty = true;
    }
    return value;
  }

  /**
   * Remove item at index, shifting subsequent items.
   */
  remove(index: number): void {
    this.items.splice(index, 1);
    this.dirty = true;
  }

  /**
   * Iterate over items.
   */
  *[Symbol.iterator](): Iterator<PdfObject> {
    yield* this.items;
  }

  /**
   * Get all items as a new array.
   */
  toArray(): PdfObject[] {
    return [...this.items];
  }

  /**
   * Create array from items.
   */
  static of(...items: PdfObject[]): PdfArray {
    return new PdfArray(items);
  }
}
