/**
 * Text extraction module for PDF documents.
 *
 * Provides functionality to extract text content with position information
 * from PDF pages, and search for text patterns.
 */

export { getPlainText, groupCharsIntoLines, type LineGrouperOptions } from "./line-grouper";
export { TextExtractor, type TextExtractorOptions } from "./text-extractor";
export { searchPage, searchPages } from "./text-search";
export { TextState } from "./text-state";
export * from "./types";
