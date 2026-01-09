/**
 * Example: Get Page Dimensions
 *
 * This example demonstrates how to iterate through all pages in a PDF
 * and retrieve their dimensions, rotation, and orientation.
 *
 * Run: npx tsx examples/02-pages/get-page-dimensions.ts
 */

import { PDF } from "../../src/index";
import { loadFixture } from "../utils";

/**
 * Convert points to inches.
 */
function pointsToInches(points: number): number {
  return points / 72;
}

/**
 * Convert points to millimeters.
 */
function pointsToMm(points: number): number {
  return (points / 72) * 25.4;
}

/**
 * Detect common page sizes.
 */
function detectPageSize(width: number, height: number): string {
  // Allow 1 point tolerance for size matching
  const tolerance = 1;

  const sizes: Array<{ name: string; width: number; height: number }> = [
    { name: "Letter", width: 612, height: 792 },
    { name: "Legal", width: 612, height: 1008 },
    { name: "Tabloid", width: 792, height: 1224 },
    { name: "A4", width: 595.28, height: 841.89 },
    { name: "A5", width: 419.53, height: 595.28 },
    { name: "A3", width: 841.89, height: 1190.55 },
  ];

  // Check both portrait and landscape orientations
  for (const size of sizes) {
    if (
      (Math.abs(width - size.width) <= tolerance && Math.abs(height - size.height) <= tolerance) ||
      (Math.abs(width - size.height) <= tolerance && Math.abs(height - size.width) <= tolerance)
    ) {
      return size.name;
    }
  }

  return "Custom";
}

async function main() {
  console.log("Reading page dimensions from a PDF...\n");

  // Load a PDF
  const bytes = await loadFixture("basic", "rot0.pdf");
  const pdf = await PDF.load(bytes);

  console.log(`=== Document: ${pdf.getPageCount()} page(s) ===\n`);

  // Get all pages
  const pages = await pdf.getPages();

  // Display information for each page
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    if (!page) {
      continue;
    }

    const pageNum = i + 1;
    const { width, height, rotation } = page;
    const orientation = page.isLandscape ? "Landscape" : "Portrait";
    const sizeType = detectPageSize(width, height);

    console.log(`Page ${pageNum}:`);
    console.log(`  Dimensions: ${width.toFixed(2)} x ${height.toFixed(2)} points`);
    console.log(
      `             ${pointsToInches(width).toFixed(2)} x ${pointsToInches(height).toFixed(2)} inches`,
    );
    console.log(
      `             ${pointsToMm(width).toFixed(1)} x ${pointsToMm(height).toFixed(1)} mm`,
    );
    console.log(`  Size Type:  ${sizeType}`);
    console.log(`  Rotation:   ${rotation} degrees`);
    console.log(`  Orientation: ${orientation}`);

    // Show page boxes
    const mediaBox = page.getMediaBox();
    console.log(`  Media Box: [${mediaBox.x1}, ${mediaBox.y1}, ${mediaBox.x2}, ${mediaBox.y2}]`);

    const cropBox = page.getCropBox();
    const isCropped =
      cropBox.x1 !== mediaBox.x1 ||
      cropBox.y1 !== mediaBox.y1 ||
      cropBox.x2 !== mediaBox.x2 ||
      cropBox.y2 !== mediaBox.y2;

    if (isCropped) {
      console.log(`  Crop Box:  [${cropBox.x1}, ${cropBox.y1}, ${cropBox.x2}, ${cropBox.y2}]`);
    }

    // Check for bleed, trim, and art boxes
    const bleedBox = page.getBleedBox();
    const trimBox = page.getTrimBox();
    const artBox = page.getArtBox();

    // Only show these if they differ from media/crop box
    const bleedDiffers =
      bleedBox.x1 !== mediaBox.x1 ||
      bleedBox.y1 !== mediaBox.y1 ||
      bleedBox.x2 !== mediaBox.x2 ||
      bleedBox.y2 !== mediaBox.y2;

    const trimDiffers =
      trimBox.x1 !== mediaBox.x1 ||
      trimBox.y1 !== mediaBox.y1 ||
      trimBox.x2 !== mediaBox.x2 ||
      trimBox.y2 !== mediaBox.y2;

    const artDiffers =
      artBox.x1 !== mediaBox.x1 ||
      artBox.y1 !== mediaBox.y1 ||
      artBox.x2 !== mediaBox.x2 ||
      artBox.y2 !== mediaBox.y2;

    if (bleedDiffers) {
      console.log(`  Bleed Box: [${bleedBox.x1}, ${bleedBox.y1}, ${bleedBox.x2}, ${bleedBox.y2}]`);
    }
    if (trimDiffers) {
      console.log(`  Trim Box:  [${trimBox.x1}, ${trimBox.y1}, ${trimBox.x2}, ${trimBox.y2}]`);
    }
    if (artDiffers) {
      console.log(`  Art Box:   [${artBox.x1}, ${artBox.y1}, ${artBox.x2}, ${artBox.y2}]`);
    }

    console.log("");
  }

  // Also show how to create a multi-page document with different sizes
  console.log("=== Creating Multi-Size Document ===\n");

  const multiPdf = PDF.create();
  multiPdf.addPage({ size: "letter" });
  multiPdf.addPage({ size: "a4" });
  multiPdf.addPage({ size: "legal" });
  multiPdf.addPage({ width: 400, height: 600 }); // Custom size

  const multiPages = await multiPdf.getPages();
  for (let i = 0; i < multiPages.length; i++) {
    const page = multiPages[i];
    if (!page) {
      continue;
    }

    const sizeType = detectPageSize(page.width, page.height);
    console.log(
      `Page ${i + 1}: ${page.width.toFixed(0)} x ${page.height.toFixed(0)} points (${sizeType})`,
    );
  }
}

main().catch(console.error);
