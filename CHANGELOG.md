# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-01-23

### Fixed

- Page content corruption when calling many draw operations (e.g., drawing 100+ rectangles). A missing return statement caused nested `Contents` arrays that lost original page content.

### Changed

- PdfDict getter methods (`get`, `getArray`, `getDict`, etc.) now accept an optional resolver callback to automatically dereference `PdfRef` values. This simplifies internal code and reduces boilerplate when working with PDF objects.

### Internal

- Migrated codebase to use the new ref resolver pattern, removing ~450 lines of manual `instanceof PdfRef` checks.

## [0.1.1] - 2026-01-22

### Fixed

- Resources stored as indirect references on page dictionaries are now properly resolved.

### Changed

- Unified `RefResolver` type across the codebase.
- `PDF.getObject()` removed in favor of direct `registry.resolve()` calls.

## [0.1.0] - 2026-01-21

First public release. LibPDF provides a complete PDF toolkit for TypeScript with parsing, modification, and generation capabilities.

### Core Features

**Parsing**

- Load any PDF, including malformed documents with automatic recovery
- Decrypt password-protected files (RC4, AES-128, AES-256)
- Parse all PDF versions from 1.0 to 2.0

**Forms**

- Fill text fields, checkboxes, radio buttons, dropdowns, and list boxes
- Read existing form values
- Create new form fields programmatically
- Flatten forms to static content

**Digital Signatures**

- Sign documents with P12/PFX certificates
- Sign with Web Crypto API keys
- Sign with Google Cloud KMS (HSM-backed)
- PAdES compliance: B-B, B-T, B-LT, B-LTA profiles
- Long-term validation with embedded OCSP/CRL responses
- Document Security Store (DSS) support

**Page Manipulation**

- Add, remove, and reorder pages
- Copy pages between documents
- Merge multiple PDFs
- Split PDFs into separate documents
- Embed pages as overlays or watermarks

**Drawing**

- Draw text with embedded or standard fonts
- Draw shapes: rectangles, circles, lines, paths
- Embed images: JPEG, PNG (with alpha)
- Font subsetting for smaller file sizes

**Annotations** (Beta)

- Create and modify annotations
- Support for text, link, stamp, highlight, underline, strikeout, square, circle, line, polygon, polyline, ink, caret, file attachment, and popup annotations
- Flatten annotations to page content

**Text Extraction**

- Extract text with position information
- Search text with bounding box results
- Line grouping based on reading order

**Attachments**

- Embed files in PDFs
- Extract embedded attachments

**Security**

- Encrypt documents with passwords
- Set document permissions (print, copy, modify)
- Remove encryption from documents

**Incremental Saves**

- Append changes without rewriting the entire file
- Preserve existing signatures when modifying documents

### Known Limitations

- Signature verification is not yet implemented
- TrueType Collection (.ttc) fonts must be extracted first
- JBIG2 and JPEG2000 images pass through without decoding
- Certificate-based encryption is not supported
- JavaScript form actions are ignored

### Breaking Changes from Beta

- `TextAlignment` for forms now uses string literals (`"left"`, `"center"`, `"right"`) instead of numeric constants
- `Rectangle` uses `{ x, y, width, height }` instead of corner coordinates
- Object resolution is synchronous (removed async from many internal APIs)
