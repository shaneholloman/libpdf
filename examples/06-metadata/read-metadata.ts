/**
 * Example: Read Metadata
 *
 * This example demonstrates how to load a PDF and read all document metadata
 * fields using the high-level getters.
 *
 * Run: npx tsx examples/06-metadata/read-metadata.ts
 */

import { PDF } from "../../src/index";
import { loadFixture } from "../utils";

async function main() {
  console.log("Reading document metadata...\n");

  // Load a PDF
  const bytes = await loadFixture("basic", "rot0.pdf");
  const pdf = await PDF.load(bytes);

  console.log("=== Document Metadata ===\n");

  // Read individual metadata fields
  const title = pdf.getTitle();
  const author = pdf.getAuthor();
  const subject = pdf.getSubject();
  const keywords = pdf.getKeywords();
  const creator = pdf.getCreator();
  const producer = pdf.getProducer();
  const creationDate = pdf.getCreationDate();
  const modificationDate = pdf.getModificationDate();
  const trapped = pdf.getTrapped();
  const language = pdf.getLanguage();

  // Display each field
  console.log("Title:", title ?? "(not set)");
  console.log("Author:", author ?? "(not set)");
  console.log("Subject:", subject ?? "(not set)");

  if (keywords && keywords.length > 0) {
    console.log("Keywords:", keywords.join(", "));
  } else {
    console.log("Keywords: (not set)");
  }

  console.log("Creator:", creator ?? "(not set)");
  console.log("Producer:", producer ?? "(not set)");

  if (creationDate) {
    console.log("Creation Date:", creationDate.toISOString());
    console.log("  Local:", creationDate.toLocaleString());
  } else {
    console.log("Creation Date: (not set)");
  }

  if (modificationDate) {
    console.log("Modification Date:", modificationDate.toISOString());
    console.log("  Local:", modificationDate.toLocaleString());
  } else {
    console.log("Modification Date: (not set)");
  }

  console.log("Trapped:", trapped ?? "(not set)");
  console.log("Language:", language ?? "(not set)");

  // Also demonstrate the bulk getter
  console.log("\n=== Using getMetadata() (bulk getter) ===\n");

  const allMetadata = pdf.getMetadata();
  console.log(JSON.stringify(allMetadata, null, 2));

  // Show what the metadata object structure looks like
  console.log("\n=== Metadata Object Structure ===");
  console.log("The getMetadata() method returns:");
  console.log("  {");
  console.log("    title?: string,");
  console.log("    author?: string,");
  console.log("    subject?: string,");
  console.log("    keywords?: string[],");
  console.log("    creator?: string,");
  console.log("    producer?: string,");
  console.log("    creationDate?: Date,");
  console.log("    modificationDate?: Date,");
  console.log("    trapped?: 'True' | 'False' | 'Unknown',");
  console.log("    language?: string,");
  console.log("  }");
}

main().catch(console.error);
