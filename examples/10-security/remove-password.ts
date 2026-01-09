/**
 * Example: Remove Password Protection
 *
 * This example demonstrates how to remove password protection from
 * an encrypted PDF using the removeProtection() method.
 *
 * Run: npx tsx examples/10-security/remove-password.ts
 */

import { PDF } from "../../src/index";
import { formatBytes, loadFixture, saveOutput } from "../utils";

async function main() {
  console.log("Removing password protection from PDF...\n");

  // Load an encrypted PDF fixture
  // PasswordSample-256bit.pdf uses: owner="owner", user="user"
  const bytes = await loadFixture("encryption", "PasswordSample-256bit.pdf");

  console.log("=== Loading Encrypted PDF ===\n");
  console.log(`Original size: ${formatBytes(bytes.length)}`);

  // Load with the owner password (required to remove protection)
  const pdf = await PDF.load(bytes, {
    credentials: "owner",
  });

  console.log(`Encrypted: ${pdf.isEncrypted}`);
  console.log(`Authenticated: ${pdf.isAuthenticated}`);
  console.log(`Has owner access: ${pdf.hasOwnerAccess()}`);
  console.log(`Page count: ${pdf.getPageCount()}`);

  // Get current security info
  const security = pdf.getSecurity();
  console.log(`\nCurrent security:`);
  console.log(`  Algorithm: ${security.algorithm}`);
  console.log(`  Key length: ${security.keyLength} bits`);

  // Remove protection
  console.log("\n=== Removing Protection ===\n");
  pdf.removeProtection();
  console.log("Called removeProtection()");

  // Save the unprotected PDF
  const unprotectedBytes = await pdf.save();
  const outputPath = await saveOutput("10-security/unprotected.pdf", unprotectedBytes);

  console.log("\n=== Saved Unprotected PDF ===\n");
  console.log(`Output: ${outputPath}`);
  console.log(`Size: ${formatBytes(unprotectedBytes.length)}`);

  // Verify the saved PDF is not encrypted
  console.log("\n=== Verification ===\n");
  const verifyPdf = await PDF.load(unprotectedBytes);
  console.log(`Encrypted: ${verifyPdf.isEncrypted}`);
  console.log(`Page count: ${verifyPdf.getPageCount()}`);

  console.log("\n=== Notes ===");
  console.log("1. Owner password is required to remove protection");
  console.log("2. User password alone cannot remove protection (insufficient permissions)");
  console.log("3. The saved PDF can be opened without any password");
}

main().catch(console.error);
