/**
 * Example: Load and Inspect a PDF
 *
 * This example demonstrates how to load a PDF file and inspect its basic
 * properties like page count, page sizes, and encryption status.
 *
 * Run: npx tsx examples/01-basic/load-and-inspect.ts
 */

import { PDF } from "../../src/index";
import { formatBytes, loadFixture } from "../utils";

async function main() {
  // Load a PDF from the fixtures directory
  console.log("Loading PDF...\n");
  const bytes = await loadFixture("basic", "rot0.pdf");
  const pdf = await PDF.load(bytes);

  // Print basic document info
  console.log("=== Document Properties ===");
  console.log(`PDF Version: ${pdf.version}`);
  console.log(`File Size: ${formatBytes(bytes.length)}`);
  console.log(`Page Count: ${pdf.getPageCount()}`);
  console.log(`Encrypted: ${pdf.isEncrypted ? "Yes" : "No"}`);
  console.log(`Linearized: ${pdf.isLinearized ? "Yes" : "No"}`);
  console.log(`Uses XRef Streams: ${pdf.usesXRefStreams ? "Yes" : "No"}`);

  // Check for any parsing warnings
  if (pdf.warnings.length > 0) {
    console.log(`\nWarnings: ${pdf.warnings.length}`);
    for (const warning of pdf.warnings) {
      console.log(`  - ${warning}`);
    }
  }

  // Iterate through pages and show dimensions
  console.log("\n=== Page Information ===");
  const pages = await pdf.getPages();

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    if (!page) {
      continue;
    }

    console.log(`\nPage ${i + 1}:`);
    console.log(`  Size: ${page.width.toFixed(2)} x ${page.height.toFixed(2)} points`);
    console.log(
      `  Size (inches): ${(page.width / 72).toFixed(2)} x ${(page.height / 72).toFixed(2)}`,
    );
    console.log(`  Rotation: ${page.rotation} degrees`);
    console.log(`  Orientation: ${page.isLandscape ? "Landscape" : "Portrait"}`);

    // Show page boxes (using x1/y1/x2/y2 coordinates)
    const mediaBox = page.getMediaBox();
    const cropBox = page.getCropBox();

    const mediaWidth = mediaBox.x2 - mediaBox.x1;
    const mediaHeight = mediaBox.y2 - mediaBox.y1;

    console.log(
      `  Media Box: [${mediaBox.x1}, ${mediaBox.y1}, ${mediaBox.x2}, ${mediaBox.y2}] (${mediaWidth} x ${mediaHeight})`,
    );

    // Show crop box if different from media box
    if (
      cropBox.x1 !== mediaBox.x1 ||
      cropBox.y1 !== mediaBox.y1 ||
      cropBox.x2 !== mediaBox.x2 ||
      cropBox.y2 !== mediaBox.y2
    ) {
      const cropWidth = cropBox.x2 - cropBox.x1;
      const cropHeight = cropBox.y2 - cropBox.y1;
      console.log(
        `  Crop Box: [${cropBox.x1}, ${cropBox.y1}, ${cropBox.x2}, ${cropBox.y2}] (${cropWidth} x ${cropHeight})`,
      );
    }
  }

  // Show metadata if available
  console.log("\n=== Document Metadata ===");
  const title = pdf.getTitle();
  const author = pdf.getAuthor();
  const subject = pdf.getSubject();
  const creator = pdf.getCreator();
  const producer = pdf.getProducer();
  const creationDate = pdf.getCreationDate();
  const modificationDate = pdf.getModificationDate();

  console.log(`Title: ${title ?? "(not set)"}`);
  console.log(`Author: ${author ?? "(not set)"}`);
  console.log(`Subject: ${subject ?? "(not set)"}`);
  console.log(`Creator: ${creator ?? "(not set)"}`);
  console.log(`Producer: ${producer ?? "(not set)"}`);
  console.log(`Created: ${creationDate?.toISOString() ?? "(not set)"}`);
  console.log(`Modified: ${modificationDate?.toISOString() ?? "(not set)"}`);

  console.log("\n=== Done ===");
}

main().catch(console.error);
