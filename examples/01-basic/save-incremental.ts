/**
 * Example: Save with Incremental Updates
 *
 * This example demonstrates how to load a PDF, make a modification, and save
 * it using incremental update mode. Incremental saves append changes to the
 * end of the file rather than rewriting the entire document, which:
 *
 * - Preserves the original document structure
 * - Maintains digital signatures (important for signed documents)
 * - Is generally faster for large documents with small changes
 *
 * Run: npx tsx examples/01-basic/save-incremental.ts
 */

import { PDF } from "../../src/index";
import { formatBytes, loadFixture, saveOutput } from "../utils";

async function main() {
  console.log("Demonstrating incremental saves...\n");

  // Load a PDF
  const bytes = await loadFixture("basic", "rot0.pdf");
  const pdf = await PDF.load(bytes);

  console.log("=== Original Document ===");
  console.log(`Page Count: ${pdf.getPageCount()}`);
  console.log(`Original Size: ${formatBytes(bytes.length)}`);
  console.log(`Can Save Incrementally: ${pdf.canSaveIncrementally()}`);
  console.log(`Has Changes: ${pdf.hasChanges()}`);

  // Make a modification - update the document title
  console.log("\n=== Making Changes ===");
  pdf.setTitle("Modified Document Title");
  pdf.setAuthor("Example Author");

  console.log(`Has Changes: ${pdf.hasChanges()}`);
  console.log(`Title: ${pdf.getTitle()}`);
  console.log(`Author: ${pdf.getAuthor()}`);

  // Save with full rewrite (default)
  console.log("\n=== Full Rewrite Save ===");
  const fullRewriteBytes = await pdf.save({ incremental: false });
  console.log(`Full rewrite size: ${formatBytes(fullRewriteBytes.length)}`);

  // Save with incremental update
  console.log("\n=== Incremental Save ===");
  if (pdf.canSaveIncrementally()) {
    const incrementalBytes = await pdf.save({ incremental: true });
    console.log(`Incremental size: ${formatBytes(incrementalBytes.length)}`);

    // Incremental saves are typically larger because they append
    // the original content plus the new changes
    console.log(`\nNote: Incremental saves append changes, so the file size includes`);
    console.log(`the original document plus the modifications.`);

    // Save the incremental version
    const outputPath = await saveOutput("01-basic/incremental-save.pdf", incrementalBytes);
    console.log(`\nSaved to: ${outputPath}`);

    // Verify the incremental save worked
    const verifyPdf = await PDF.load(incrementalBytes);
    console.log(`\nVerification:`);
    console.log(`  Title: ${verifyPdf.getTitle()}`);
    console.log(`  Author: ${verifyPdf.getAuthor()}`);
    console.log(`  Page Count: ${verifyPdf.getPageCount()}`);
  } else {
    console.log("This document cannot be saved incrementally.");
    console.log("(Newly created documents or those with structural changes may not support it)");
  }

  console.log("\n=== Done ===");
}

main().catch(console.error);
