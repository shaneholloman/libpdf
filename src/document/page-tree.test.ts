import { describe, expect, it } from "vitest";
import { PdfArray } from "#src/objects/pdf-array";
import { PdfDict } from "#src/objects/pdf-dict";
import { PdfName } from "#src/objects/pdf-name";
import { PdfNumber } from "#src/objects/pdf-number";
import type { PdfObject } from "#src/objects/pdf-object";
import { PdfRef } from "#src/objects/pdf-ref";
import { PageTree } from "./page-tree";

/**
 * Create a resolver that looks up objects in a map.
 */
function createResolver(objects: Map<string, PdfObject>) {
  return async (ref: PdfRef): Promise<PdfObject | null> => {
    const key = `${ref.objectNumber}:${ref.generation}`;
    return objects.get(key) ?? null;
  };
}

/**
 * Create a simple Page dict.
 */
function createPage(): PdfDict {
  const page = new PdfDict();
  page.set("Type", PdfName.Page);
  page.set(
    "MediaBox",
    new PdfArray([PdfNumber.of(0), PdfNumber.of(0), PdfNumber.of(612), PdfNumber.of(792)]),
  );
  return page;
}

/**
 * Create a Pages (intermediate) node.
 */
function createPagesNode(kids: PdfRef[], count: number): PdfDict {
  const pages = new PdfDict();
  pages.set("Type", PdfName.Pages);
  pages.set("Kids", new PdfArray(kids));
  pages.set("Count", PdfNumber.of(count));
  return pages;
}

describe("PageTree", () => {
  describe("empty()", () => {
    it("creates an empty page tree", () => {
      const tree = PageTree.empty();

      expect(tree.getPageCount()).toBe(0);
      expect(tree.getPages()).toEqual([]);
      expect(tree.getPage(0)).toBeNull();
    });
  });

  describe("load() - flat tree", () => {
    it("loads a single-page document", async () => {
      const pageRef = PdfRef.of(3, 0);
      const page = createPage();

      const rootRef = PdfRef.of(1, 0);
      const root = createPagesNode([pageRef], 1);

      const objects = new Map<string, PdfObject>([
        ["1:0", root],
        ["3:0", page],
      ]);

      const tree = await PageTree.load(rootRef, createResolver(objects));

      expect(tree.getPageCount()).toBe(1);
      expect(tree.getPages()).toEqual([pageRef]);
      expect(tree.getPage(0)).toBe(pageRef);
    });

    it("loads a multi-page document", async () => {
      const page1Ref = PdfRef.of(3, 0);
      const page2Ref = PdfRef.of(4, 0);
      const page3Ref = PdfRef.of(5, 0);

      const rootRef = PdfRef.of(1, 0);
      const root = createPagesNode([page1Ref, page2Ref, page3Ref], 3);

      const objects = new Map<string, PdfObject>([
        ["1:0", root],
        ["3:0", createPage()],
        ["4:0", createPage()],
        ["5:0", createPage()],
      ]);

      const tree = await PageTree.load(rootRef, createResolver(objects));

      expect(tree.getPageCount()).toBe(3);
      expect(tree.getPages()).toEqual([page1Ref, page2Ref, page3Ref]);
      expect(tree.getPage(0)).toBe(page1Ref);
      expect(tree.getPage(1)).toBe(page2Ref);
      expect(tree.getPage(2)).toBe(page3Ref);
    });
  });

  describe("load() - nested tree", () => {
    it("loads a two-level tree", async () => {
      // Structure:
      // Root (1 0) /Kids [2 0 R, 5 0 R]
      //   ├── Intermediate (2 0) /Kids [3 0 R, 4 0 R]
      //   │     ├── Page (3 0)
      //   │     └── Page (4 0)
      //   └── Page (5 0)

      const page1Ref = PdfRef.of(3, 0);
      const page2Ref = PdfRef.of(4, 0);
      const page3Ref = PdfRef.of(5, 0);
      const intermediateRef = PdfRef.of(2, 0);
      const rootRef = PdfRef.of(1, 0);

      const intermediate = createPagesNode([page1Ref, page2Ref], 2);
      const root = createPagesNode([intermediateRef, page3Ref], 3);

      const objects = new Map<string, PdfObject>([
        ["1:0", root],
        ["2:0", intermediate],
        ["3:0", createPage()],
        ["4:0", createPage()],
        ["5:0", createPage()],
      ]);

      const tree = await PageTree.load(rootRef, createResolver(objects));

      expect(tree.getPageCount()).toBe(3);
      // Pages should be in document order: 3, 4, 5
      expect(tree.getPages()).toEqual([page1Ref, page2Ref, page3Ref]);
    });

    it("loads a deeply nested tree", async () => {
      // Structure:
      // Root (1 0) /Kids [2 0 R]
      //   └── Level1 (2 0) /Kids [3 0 R]
      //         └── Level2 (3 0) /Kids [4 0 R]
      //               └── Page (4 0)

      const pageRef = PdfRef.of(4, 0);
      const level2Ref = PdfRef.of(3, 0);
      const level1Ref = PdfRef.of(2, 0);
      const rootRef = PdfRef.of(1, 0);

      const level2 = createPagesNode([pageRef], 1);
      const level1 = createPagesNode([level2Ref], 1);
      const root = createPagesNode([level1Ref], 1);

      const objects = new Map<string, PdfObject>([
        ["1:0", root],
        ["2:0", level1],
        ["3:0", level2],
        ["4:0", createPage()],
      ]);

      const tree = await PageTree.load(rootRef, createResolver(objects));

      expect(tree.getPageCount()).toBe(1);
      expect(tree.getPage(0)).toBe(pageRef);
    });
  });

  describe("load() - edge cases", () => {
    it("handles circular references", async () => {
      // Root references itself via Kids
      const rootRef = PdfRef.of(1, 0);
      const pageRef = PdfRef.of(2, 0);

      const root = new PdfDict();
      root.set("Type", PdfName.Pages);
      root.set("Kids", new PdfArray([pageRef, rootRef])); // Circular!
      root.set("Count", PdfNumber.of(1));

      const objects = new Map<string, PdfObject>([
        ["1:0", root],
        ["2:0", createPage()],
      ]);

      const tree = await PageTree.load(rootRef, createResolver(objects));

      // Should not hang, should find the page
      expect(tree.getPageCount()).toBe(1);
      expect(tree.getPage(0)).toBe(pageRef);
    });

    it("handles missing /Type gracefully", async () => {
      const pageRef = PdfRef.of(2, 0);
      const rootRef = PdfRef.of(1, 0);

      // Page without /Type
      const page = new PdfDict();
      page.set(
        "MediaBox",
        new PdfArray([PdfNumber.of(0), PdfNumber.of(0), PdfNumber.of(612), PdfNumber.of(792)]),
      );

      const root = createPagesNode([pageRef], 1);

      const objects = new Map<string, PdfObject>([
        ["1:0", root],
        ["2:0", page],
      ]);

      const tree = await PageTree.load(rootRef, createResolver(objects));

      // Should skip the typeless node
      expect(tree.getPageCount()).toBe(0);
    });

    it("handles missing Kids array", async () => {
      const rootRef = PdfRef.of(1, 0);

      const root = new PdfDict();
      root.set("Type", PdfName.Pages);
      root.set("Count", PdfNumber.of(0));
      // No Kids array

      const objects = new Map<string, PdfObject>([["1:0", root]]);

      const tree = await PageTree.load(rootRef, createResolver(objects));

      expect(tree.getPageCount()).toBe(0);
    });

    it("handles unresolvable references", async () => {
      const pageRef = PdfRef.of(2, 0);
      const missingRef = PdfRef.of(99, 0);
      const rootRef = PdfRef.of(1, 0);

      const root = createPagesNode([pageRef, missingRef], 2);

      const objects = new Map<string, PdfObject>([
        ["1:0", root],
        ["2:0", createPage()],
        // 99:0 is missing
      ]);

      const tree = await PageTree.load(rootRef, createResolver(objects));

      // Should find the valid page, skip the missing one
      expect(tree.getPageCount()).toBe(1);
      expect(tree.getPage(0)).toBe(pageRef);
    });

    it("handles non-dict objects in Kids", async () => {
      const pageRef = PdfRef.of(2, 0);
      const rootRef = PdfRef.of(1, 0);

      const root = createPagesNode([pageRef], 1);

      const objects = new Map<string, PdfObject>([
        ["1:0", root],
        ["2:0", PdfNumber.of(42)], // Not a dict!
      ]);

      const tree = await PageTree.load(rootRef, createResolver(objects));

      expect(tree.getPageCount()).toBe(0);
    });
  });

  describe("getPages()", () => {
    it("returns a defensive copy", async () => {
      const pageRef = PdfRef.of(2, 0);
      const rootRef = PdfRef.of(1, 0);
      const root = createPagesNode([pageRef], 1);

      const objects = new Map<string, PdfObject>([
        ["1:0", root],
        ["2:0", createPage()],
      ]);

      const tree = await PageTree.load(rootRef, createResolver(objects));

      const pages1 = tree.getPages();
      const pages2 = tree.getPages();

      // Different array instances
      expect(pages1).not.toBe(pages2);
      // But same contents
      expect(pages1).toEqual(pages2);

      // Mutating returned array doesn't affect internal state
      pages1.push(PdfRef.of(99, 0));
      expect(tree.getPageCount()).toBe(1);
    });
  });

  describe("getPage()", () => {
    it("returns null for negative index", async () => {
      const pageRef = PdfRef.of(2, 0);
      const rootRef = PdfRef.of(1, 0);
      const root = createPagesNode([pageRef], 1);

      const objects = new Map<string, PdfObject>([
        ["1:0", root],
        ["2:0", createPage()],
      ]);

      const tree = await PageTree.load(rootRef, createResolver(objects));

      expect(tree.getPage(-1)).toBeNull();
      expect(tree.getPage(-100)).toBeNull();
    });

    it("returns null for index >= length", async () => {
      const pageRef = PdfRef.of(2, 0);
      const rootRef = PdfRef.of(1, 0);
      const root = createPagesNode([pageRef], 1);

      const objects = new Map<string, PdfObject>([
        ["1:0", root],
        ["2:0", createPage()],
      ]);

      const tree = await PageTree.load(rootRef, createResolver(objects));

      expect(tree.getPage(1)).toBeNull();
      expect(tree.getPage(100)).toBeNull();
    });

    it("returns null on empty tree", () => {
      const tree = PageTree.empty();

      expect(tree.getPage(0)).toBeNull();
    });
  });
});
