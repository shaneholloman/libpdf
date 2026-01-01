/**
 * @libpdf/core
 *
 * A modern PDF library for TypeScript — parsing and generation.
 */

export { version } from "../package.json";

// ─────────────────────────────────────────────────────────────────────────────
// High-level API
// ─────────────────────────────────────────────────────────────────────────────

export { type LoadOptions, PDF, type SaveOptions } from "./api/pdf";

// ─────────────────────────────────────────────────────────────────────────────
// PDF Objects
// ─────────────────────────────────────────────────────────────────────────────

export type { PdfObject } from "./objects/object";
export { PdfArray } from "./objects/pdf-array";
export { PdfBool } from "./objects/pdf-bool";
export { PdfDict } from "./objects/pdf-dict";
export { PdfName } from "./objects/pdf-name";
export { PdfNull } from "./objects/pdf-null";
export { PdfNumber } from "./objects/pdf-number";
export { PdfRef } from "./objects/pdf-ref";
export { PdfStream } from "./objects/pdf-stream";
export { PdfString } from "./objects/pdf-string";
