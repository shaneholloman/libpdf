/**
 * Example: Remove Pages from a PDF
 *
 * This example demonstrates how to load a PDF and remove specific pages
 * by index.
 *
 * Run: npx tsx examples/02-pages/remove-pages.ts
 */

import { PDF } from "../../src/index";
import { formatBytes, loadFixture, saveOutput } from "../utils";

async function main() {
  console.log("Removing pages from a PDF...\n");

  // Load a multi-page PDF
  // First, let's create one since we might not have a multi-page fixture
  const pdf = PDF.create();

  // Add 5 pages
  for (let i = 1; i <= 5; i++) {
    pdf.addPage({ size: "letter" });
  }

  console.log("=== Original Document ===");
  console.log(`Page count: ${pdf.getPageCount()}`);

  // Remove page at index 2 (the third page, since indices are 0-based)
  console.log("\nRemoving page at index 2 (page 3)...");
  pdf.removePage(2);
  console.log(`Page count after removal: ${pdf.getPageCount()}`);

  // Remove the first page
  console.log("\nRemoving first page (index 0)...");
  pdf.removePage(0);
  console.log(`Page count after removal: ${pdf.getPageCount()}`);

  // Remove the last page
  console.log("\nRemoving last page...");
  pdf.removePage(pdf.getPageCount() - 1);
  console.log(`Page count after removal: ${pdf.getPageCount()}`);

  console.log("\n=== Final Document ===");
  console.log(`Remaining pages: ${pdf.getPageCount()}`);

  // Save the modified document
  const bytes = await pdf.save();
  const outputPath = await saveOutput("02-pages/pages-removed.pdf", bytes);

  console.log(`\nSaved to: ${outputPath}`);
  console.log(`File size: ${formatBytes(bytes.length)}`);

  // Demonstrate removing pages from an existing PDF
  console.log("\n=== Removing from Existing PDF ===");
  const existingBytes = await loadFixture("basic", "rot0.pdf");
  const existingPdf = await PDF.load(existingBytes);

  console.log(`Loaded PDF with ${existingPdf.getPageCount()} page(s)`);

  // Only remove if there are multiple pages
  if (existingPdf.getPageCount() > 1) {
    existingPdf.removePage(0);
    console.log(`After removing first page: ${existingPdf.getPageCount()} page(s)`);

    const modifiedBytes = await existingPdf.save();
    await saveOutput("02-pages/existing-page-removed.pdf", modifiedBytes);
  } else {
    console.log("Cannot remove the only page from a document.");
  }
}

main().catch(console.error);
