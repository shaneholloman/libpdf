/**
 * Example: Create Form Fields
 *
 * This example demonstrates how to create a new PDF with various form fields
 * including text inputs, checkboxes, radio buttons, and dropdowns.
 *
 * Run: npx tsx examples/03-forms/create-form-fields.ts
 */

import { black, PDF, rgb, TextAlignment } from "../../src/index";
import { formatBytes, saveOutput } from "../utils";

async function main() {
  console.log("Creating a PDF with form fields...\n");

  // Create a new PDF document
  const pdf = PDF.create();

  // Add a page
  const page = pdf.addPage({ size: "letter" });

  // Get the page object for drawing
  const pageObj = await pdf.getPage(0);
  if (!pageObj) {
    throw new Error("Failed to get page");
  }

  // Get or create the form
  const form = await pdf.getOrCreateForm();

  // Draw a title
  pageObj.drawText("Registration Form", {
    x: 200,
    y: 750,
    size: 24,
    color: black,
  });

  // === Text Fields ===
  console.log("Creating text fields...");

  // Full name field
  const nameLabel = "Full Name:";
  pageObj.drawText(nameLabel, { x: 50, y: 700, size: 12, color: black });

  const nameField = form.createTextField("fullName", {
    fontSize: 12,
    maxLength: 50,
  });
  await pageObj.drawField(nameField, { x: 150, y: 695, width: 300, height: 20 });

  // Email field
  pageObj.drawText("Email:", { x: 50, y: 660, size: 12, color: black });

  const emailField = form.createTextField("email", {
    fontSize: 12,
    maxLength: 100,
  });
  await pageObj.drawField(emailField, { x: 150, y: 655, width: 300, height: 20 });

  // Phone field
  pageObj.drawText("Phone:", { x: 50, y: 620, size: 12, color: black });

  const phoneField = form.createTextField("phone", {
    fontSize: 12,
    maxLength: 20,
  });
  await pageObj.drawField(phoneField, { x: 150, y: 615, width: 200, height: 20 });

  // Comments (multiline)
  pageObj.drawText("Comments:", { x: 50, y: 580, size: 12, color: black });

  const commentsField = form.createTextField("comments", {
    fontSize: 10,
    multiline: true,
  });
  await pageObj.drawField(commentsField, { x: 150, y: 500, width: 300, height: 80 });

  console.log("  - Created: fullName, email, phone, comments");

  // === Checkboxes ===
  console.log("Creating checkboxes...");

  pageObj.drawText("Preferences:", { x: 50, y: 460, size: 12, color: black });

  // Newsletter checkbox
  const newsletterCheckbox = form.createCheckbox("newsletter", {
    symbol: "check",
  });
  await pageObj.drawField(newsletterCheckbox, { x: 150, y: 440, width: 18, height: 18 });
  pageObj.drawText("Subscribe to newsletter", { x: 175, y: 442, size: 11, color: black });

  // Terms checkbox
  const termsCheckbox = form.createCheckbox("agreeTerms", {
    symbol: "check",
  });
  await pageObj.drawField(termsCheckbox, { x: 150, y: 410, width: 18, height: 18 });
  pageObj.drawText("I agree to the terms and conditions", {
    x: 175,
    y: 412,
    size: 11,
    color: black,
  });

  console.log("  - Created: newsletter, agreeTerms");

  // === Radio Buttons ===
  console.log("Creating radio buttons...");

  pageObj.drawText("Contact Method:", { x: 50, y: 370, size: 12, color: black });

  const contactMethod = form.createRadioGroup("contactMethod", {
    options: ["email", "phone", "mail"],
  });

  // Draw each radio option
  await pageObj.drawField(contactMethod, {
    x: 150,
    y: 350,
    width: 16,
    height: 16,
    option: "email",
  });
  pageObj.drawText("Email", { x: 175, y: 352, size: 11, color: black });

  await pageObj.drawField(contactMethod, {
    x: 250,
    y: 350,
    width: 16,
    height: 16,
    option: "phone",
  });
  pageObj.drawText("Phone", { x: 275, y: 352, size: 11, color: black });

  await pageObj.drawField(contactMethod, {
    x: 350,
    y: 350,
    width: 16,
    height: 16,
    option: "mail",
  });
  pageObj.drawText("Mail", { x: 375, y: 352, size: 11, color: black });

  console.log("  - Created: contactMethod (email/phone/mail)");

  // === Dropdown ===
  console.log("Creating dropdown...");

  pageObj.drawText("Country:", { x: 50, y: 310, size: 12, color: black });

  const countryDropdown = form.createDropdown("country", {
    options: [
      "United States",
      "Canada",
      "United Kingdom",
      "Australia",
      "Germany",
      "France",
      "Japan",
      "Other",
    ],
  });
  await pageObj.drawField(countryDropdown, { x: 150, y: 305, width: 200, height: 20 });

  console.log("  - Created: country dropdown");

  // === Another Text Field with alignment ===
  pageObj.drawText("Reference #:", { x: 50, y: 270, size: 12, color: black });

  const refField = form.createTextField("referenceNumber", {
    fontSize: 12,
    alignment: TextAlignment.Right,
    maxLength: 10,
    defaultValue: "REF-0001",
  });
  await pageObj.drawField(refField, { x: 150, y: 265, width: 100, height: 20 });

  console.log("  - Created: referenceNumber (right-aligned, with default value)");

  // Add some instructions at the bottom
  pageObj.drawText("Please fill out all required fields and submit.", {
    x: 50,
    y: 200,
    size: 10,
    color: rgb(0.5, 0.5, 0.5),
  });

  // Summary
  console.log("\n=== Form Summary ===");
  console.log(`Total fields: ${form.fieldCount}`);
  console.log(`Field names: ${form.getFieldNames().join(", ")}`);

  // Save the document
  console.log("\n=== Saving Document ===");
  const savedBytes = await pdf.save();
  const outputPath = await saveOutput("03-forms/created-form.pdf", savedBytes);

  console.log(`Output: ${outputPath}`);
  console.log(`Size: ${formatBytes(savedBytes.length)}`);

  // Verify the form
  console.log("\n=== Verification ===");
  const verifyPdf = await PDF.load(savedBytes);
  const verifyForm = await verifyPdf.getForm();

  if (verifyForm) {
    console.log(`Loaded form with ${verifyForm.fieldCount} fields`);

    // Check reference number has default value
    const refVerify = verifyForm.getTextField("referenceNumber");
    console.log(`Reference number default: "${refVerify?.getValue()}"`);
  }
}

main().catch(console.error);
