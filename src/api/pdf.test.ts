import { describe, expect, it } from "vitest";
import { PdfDict } from "#src/objects/pdf-dict";
import { PdfName } from "#src/objects/pdf-name";
import { PdfNumber } from "#src/objects/pdf-number";
import { PdfString } from "#src/objects/pdf-string";
import { loadFixture } from "#src/test-utils";
import { PDF } from "./pdf";

describe("PDF", () => {
  describe("loading", () => {
    it("loads a basic PDF", async () => {
      const bytes = await loadFixture("basic", "rot0.pdf");
      const pdf = await PDF.load(bytes);

      expect(pdf).toBeInstanceOf(PDF);
    });

    it("exposes version", async () => {
      const bytes = await loadFixture("basic", "rot0.pdf");
      const pdf = await PDF.load(bytes);

      expect(pdf.version).toMatch(/^\d\.\d$/);
    });

    it("detects non-linearized PDFs", async () => {
      const bytes = await loadFixture("basic", "rot0.pdf");
      const pdf = await PDF.load(bytes);

      expect(pdf.isLinearized).toBe(false);
    });

    it("reports encryption status", async () => {
      const bytes = await loadFixture("basic", "rot0.pdf");
      const pdf = await PDF.load(bytes);

      expect(pdf.isEncrypted).toBe(false);
      expect(pdf.isAuthenticated).toBe(true);
    });
  });

  describe("object access", () => {
    it("getCatalog returns catalog", async () => {
      const bytes = await loadFixture("basic", "rot0.pdf");
      const pdf = await PDF.load(bytes);

      const catalog = await pdf.getCatalog();

      expect(catalog).toBeInstanceOf(PdfDict);
      expect(catalog?.getName("Type")?.value).toBe("Catalog");
    });

    it("getPages returns page refs", async () => {
      const bytes = await loadFixture("basic", "rot0.pdf");
      const pdf = await PDF.load(bytes);

      const pages = await pdf.getPages();

      expect(pages.length).toBeGreaterThan(0);
    });

    it("getPageCount returns count", async () => {
      const bytes = await loadFixture("basic", "rot0.pdf");
      const pdf = await PDF.load(bytes);

      const count = await pdf.getPageCount();

      expect(count).toBeGreaterThan(0);
    });
  });

  describe("modification tracking", () => {
    it("hasChanges returns false for unmodified doc", async () => {
      const bytes = await loadFixture("basic", "rot0.pdf");
      const pdf = await PDF.load(bytes);

      expect(pdf.hasChanges()).toBe(false);
    });

    it("hasChanges returns true after modification", async () => {
      const bytes = await loadFixture("basic", "rot0.pdf");
      const pdf = await PDF.load(bytes);

      const catalog = await pdf.getCatalog();

      catalog?.set("ModDate", PdfString.fromString("D:20240101"));

      expect(pdf.hasChanges()).toBe(true);
    });

    it("hasChanges returns true when new object registered", async () => {
      const bytes = await loadFixture("basic", "rot0.pdf");
      const pdf = await PDF.load(bytes);

      pdf.register(new PdfDict());

      expect(pdf.hasChanges()).toBe(true);
    });
  });

  describe("object creation", () => {
    it("register returns ref", async () => {
      const bytes = await loadFixture("basic", "rot0.pdf");
      const pdf = await PDF.load(bytes);

      const ref = pdf.register(new PdfDict());

      expect(ref.objectNumber).toBeGreaterThan(0);
      expect(ref.generation).toBe(0);
    });

    it("createDict creates and registers dict", async () => {
      const bytes = await loadFixture("basic", "rot0.pdf");
      const pdf = await PDF.load(bytes);

      const ref = pdf.createDict({ Type: PdfName.of("Annot") });

      const obj = await pdf.getObject(ref);

      expect(obj).toBeInstanceOf(PdfDict);
      expect((obj as PdfDict).getName("Type")?.value).toBe("Annot");
    });

    it("createArray creates and registers array", async () => {
      const bytes = await loadFixture("basic", "rot0.pdf");
      const pdf = await PDF.load(bytes);

      const ref = pdf.createArray([PdfNumber.of(1), PdfNumber.of(2)]);

      expect(ref.objectNumber).toBeGreaterThan(0);
    });

    it("createStream creates and registers stream", async () => {
      const bytes = await loadFixture("basic", "rot0.pdf");
      const pdf = await PDF.load(bytes);

      const ref = pdf.createStream({ Filter: PdfName.FlateDecode }, new Uint8Array([1, 2, 3]));

      expect(ref.objectNumber).toBeGreaterThan(0);
    });
  });

  describe("incremental save check", () => {
    it("returns null for normal PDF", async () => {
      const bytes = await loadFixture("basic", "rot0.pdf");
      const pdf = await PDF.load(bytes);

      expect(pdf.canSaveIncrementally()).toBeNull();
    });
  });

  describe("saving", () => {
    it("save produces valid PDF bytes", async () => {
      const bytes = await loadFixture("basic", "rot0.pdf");
      const pdf = await PDF.load(bytes);

      const saved = await pdf.save();

      // Check for PDF header
      const header = new TextDecoder().decode(saved.slice(0, 8));

      expect(header).toMatch(/^%PDF-\d\.\d/);

      // Check for EOF
      const tail = new TextDecoder().decode(saved.slice(-10));

      expect(tail).toContain("%%EOF");
    });

    it("save preserves unmodified content", async () => {
      const bytes = await loadFixture("basic", "rot0.pdf");
      const pdf = await PDF.load(bytes);

      const saved = await pdf.save();
      const text = new TextDecoder().decode(saved);

      // Should contain catalog
      expect(text).toContain("/Type /Catalog");
    });

    it("incremental save appends to original", async () => {
      const bytes = await loadFixture("basic", "rot0.pdf");
      const pdf = await PDF.load(bytes);
      const originalLength = bytes.length;

      // Modify catalog
      const catalog = await pdf.getCatalog();

      catalog?.set("ModDate", PdfString.fromString("D:20240101"));

      const saved = await pdf.save({ incremental: true });

      // Should be longer than original
      expect(saved.length).toBeGreaterThan(originalLength);

      // Original bytes should be preserved
      for (let i = 0; i < originalLength; i++) {
        expect(saved[i]).toBe(bytes[i]);
      }
    });

    it("incremental save includes /Prev pointer", async () => {
      const bytes = await loadFixture("basic", "rot0.pdf");
      const pdf = await PDF.load(bytes);

      const catalog = await pdf.getCatalog();

      catalog?.set("Modified", PdfNumber.of(1));

      const saved = await pdf.save({ incremental: true });
      const text = new TextDecoder().decode(saved);

      expect(text).toContain("/Prev ");
    });

    it("save falls back to full when incremental not possible", async () => {
      const bytes = await loadFixture("basic", "rot0.pdf");
      const pdf = await PDF.load(bytes);

      // Manually set recovered flag
      (pdf as unknown as { recoveredViaBruteForce: boolean }).recoveredViaBruteForce = true;

      // Should not throw, just add warning
      const saved = await pdf.save({ incremental: true });

      expect(saved.length).toBeGreaterThan(0);
      expect(pdf.warnings.some(w => w.includes("not possible"))).toBe(true);
    });
  });

  describe("round-trip", () => {
    it("load -> save -> load preserves structure", async () => {
      const bytes = await loadFixture("basic", "rot0.pdf");
      const pdf1 = await PDF.load(bytes);

      const catalog1 = await pdf1.getCatalog();
      const pageCount1 = await pdf1.getPageCount();

      const saved = await pdf1.save();
      const pdf2 = await PDF.load(saved);

      const catalog2 = await pdf2.getCatalog();
      const pageCount2 = await pdf2.getPageCount();

      expect(catalog2?.getName("Type")?.value).toBe(catalog1?.getName("Type")?.value);
      expect(pageCount2).toBe(pageCount1);
    });

    it("load -> modify -> save -> load shows modification", async () => {
      const bytes = await loadFixture("basic", "rot0.pdf");
      const pdf1 = await PDF.load(bytes);

      // Add metadata
      const catalog = await pdf1.getCatalog();

      catalog?.set("CustomKey", PdfString.fromString("CustomValue"));

      const saved = await pdf1.save();
      const pdf2 = await PDF.load(saved);

      const catalog2 = await pdf2.getCatalog();

      expect(catalog2?.getString("CustomKey")?.asString()).toBe("CustomValue");
    });

    it("incremental save preserves ability to do another incremental", async () => {
      const bytes = await loadFixture("basic", "rot0.pdf");
      const pdf1 = await PDF.load(bytes);

      // First modification
      const catalog1 = await pdf1.getCatalog();

      catalog1?.set("Mod1", PdfNumber.of(1));

      const saved1 = await pdf1.save({ incremental: true });

      // Load and modify again
      const pdf2 = await PDF.load(saved1);
      const catalog2 = await pdf2.getCatalog();

      catalog2?.set("Mod2", PdfNumber.of(2));

      const saved2 = await pdf2.save({ incremental: true });

      // Verify both modifications exist
      const pdf3 = await PDF.load(saved2);
      const catalog3 = await pdf3.getCatalog();

      expect(catalog3?.getNumber("Mod1")?.value).toBe(1);
      expect(catalog3?.getNumber("Mod2")?.value).toBe(2);

      // Verify we have /Prev chain
      const text = new TextDecoder().decode(saved2);
      const prevCount = (text.match(/\/Prev /g) || []).length;

      expect(prevCount).toBeGreaterThanOrEqual(1);
    });
  });
});
