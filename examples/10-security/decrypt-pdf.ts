/**
 * Example: Decrypt PDF and Save Unencrypted
 *
 * This example demonstrates loading an encrypted PDF with a password
 * and saving it without encryption (decrypted).
 *
 * Run: npx tsx examples/10-security/decrypt-pdf.ts
 */

import { black, PDF } from "../../src/index";
import { formatBytes, saveOutput } from "../utils";

async function main() {
  console.log("Decrypting PDF and saving unencrypted copy...\n");

  // Note: For this example to work with real encrypted PDFs,
  // you would need an encrypted PDF fixture and its password.
  //
  // The workflow demonstrates the pattern for decryption.

  console.log("=== Decryption Workflow ===\n");

  console.log("Step 1: Load encrypted PDF with password\n");
  console.log("  const encryptedBytes = await readFile('encrypted.pdf');");
  console.log("  const pdf = await PDF.load(encryptedBytes, {");
  console.log("    credentials: { password: 'your-password' }");
  console.log("  });\n");

  console.log("Step 2: Verify authentication\n");
  console.log("  if (!pdf.isAuthenticated) {");
  console.log("    throw new Error('Wrong password');");
  console.log("  }\n");

  console.log("Step 3: Save without encryption (full rewrite)\n");
  console.log("  const decryptedBytes = await pdf.save();");
  console.log("  // Note: Incremental save would preserve encryption\n");

  // Demonstrate with a mock unencrypted PDF
  console.log("=== Demo with Unencrypted PDF ===\n");

  const pdf = PDF.create();
  pdf.addPage({ size: "letter" });
  const page = await pdf.getPage(0);
  if (page) {
    page.drawText("Decrypted Document", {
      x: 180,
      y: page.height - 100,
      size: 28,
      color: black,
    });
    page.drawText("This document was saved without encryption.", {
      x: 130,
      y: page.height - 150,
      size: 14,
      color: black,
    });
  }

  // Show encryption status
  console.log(`Encrypted: ${pdf.isEncrypted}`);
  console.log(`Authenticated: ${pdf.isAuthenticated}`);

  // Save the document
  const bytes = await pdf.save();
  const outputPath = await saveOutput("10-security/decrypted.pdf", bytes);

  console.log(`\nSaved: ${outputPath}`);
  console.log(`Size: ${formatBytes(bytes.length)}`);

  console.log("\n=== Important Notes ===");
  console.log("1. Loading encrypted PDF requires the correct password");
  console.log("2. Save with { incremental: false } to remove encryption");
  console.log("3. Incremental save preserves original encryption");
  console.log("4. Check pdf.isAuthenticated to verify password was correct");
}

main().catch(console.error);
