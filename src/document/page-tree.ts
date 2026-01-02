import { PdfDict } from "#src/objects/pdf-dict";
import type { PdfObject } from "#src/objects/pdf-object";
import { PdfRef } from "#src/objects/pdf-ref";

/**
 * Manages the page tree structure of a PDF document.
 *
 * Provides sync access to pages after initial async load.
 * The page tree is walked once during load, then all access is O(1).
 */
export class PageTree {
  /** Page refs in document order */
  private readonly pages: PdfRef[];

  private constructor(pages: PdfRef[]) {
    this.pages = pages;
  }

  /**
   * Load and build the page tree by walking from the root.
   * This is the only async operation.
   */
  static async load(
    pagesRef: PdfRef,
    getObject: (ref: PdfRef) => Promise<PdfObject | null>,
  ): Promise<PageTree> {
    const pages: PdfRef[] = [];
    const visited = new Set<string>();

    const walk = async (ref: PdfRef): Promise<void> => {
      const key = `${ref.objectNumber} ${ref.generation}`;

      if (visited.has(key)) {
        // Circular reference - skip to avoid infinite loop
        return;
      }

      visited.add(key);

      const node = await getObject(ref);

      if (!(node instanceof PdfDict)) {
        return;
      }

      const type = node.getName("Type")?.value;

      if (type === "Page") {
        pages.push(ref);
      } else if (type === "Pages") {
        const kids = node.getArray("Kids");

        if (kids) {
          for (let i = 0; i < kids.length; i++) {
            const kid = kids.at(i);

            if (kid instanceof PdfRef) {
              await walk(kid);
            }
          }
        }
      }
      // If no /Type or unknown type, skip silently (lenient parsing)
    };

    await walk(pagesRef);

    return new PageTree(pages);
  }

  /**
   * Create an empty page tree.
   */
  static empty(): PageTree {
    return new PageTree([]);
  }

  /**
   * Get all page references in document order.
   * Returns a copy to prevent external mutation.
   */
  getPages(): PdfRef[] {
    return [...this.pages];
  }

  /**
   * Get page count.
   */
  getPageCount(): number {
    return this.pages.length;
  }

  /**
   * Get a single page by index (0-based).
   * Returns null if index out of bounds.
   */
  getPage(index: number): PdfRef | null {
    if (index < 0 || index >= this.pages.length) {
      return null;
    }

    return this.pages[index];
  }
}
