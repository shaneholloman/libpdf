/**
 * Utility functions for @libpdf/core examples.
 *
 * These helpers make examples self-contained and easy to run.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

/**
 * Base path for fixtures (relative to examples directory).
 */
const FIXTURES_PATH = join(import.meta.dirname, "..", "fixtures");

/**
 * Base path for example output files.
 */
const OUTPUT_PATH = join(import.meta.dirname, "output");

/**
 * Load a fixture file.
 *
 * @param category - The fixture category (subdirectory)
 * @param filename - The filename within that category
 * @returns The file contents as Uint8Array
 *
 * @example
 * ```ts
 * const pdfBytes = await loadFixture("basic", "rot0.pdf");
 * const imageBytes = await loadFixture("images", "sample.jpg");
 * ```
 */
export async function loadFixture(category: string, filename: string): Promise<Uint8Array> {
  const path = join(FIXTURES_PATH, category, filename);
  const buffer = await readFile(path);

  return new Uint8Array(buffer);
}

/**
 * Save example output to the output directory.
 *
 * Creates the output directory and any subdirectories as needed.
 *
 * @param filename - The output filename (can include subdirectories)
 * @param data - The data to write
 * @returns The full path to the saved file
 *
 * @example
 * ```ts
 * const bytes = await pdf.save();
 * const path = await saveOutput("my-document.pdf", bytes);
 * console.log(`Saved to: ${path}`);
 * ```
 */
export async function saveOutput(filename: string, data: Uint8Array): Promise<string> {
  const fullPath = join(OUTPUT_PATH, filename);

  // Ensure directory exists
  await mkdir(dirname(fullPath), { recursive: true });

  // Write the file
  await writeFile(fullPath, data);

  return fullPath;
}

/**
 * Format bytes as a human-readable size string.
 *
 * @param bytes - Number of bytes
 * @returns Formatted string like "1.5 KB" or "2.3 MB"
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
