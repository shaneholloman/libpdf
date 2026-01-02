/**
 * SimpleFont - Base class for single-byte encoded fonts.
 *
 * This handles TrueType, Type1, and Type3 fonts which use single-byte
 * character codes (0-255).
 *
 * Font structure:
 * <<
 *   /Type /Font
 *   /Subtype /TrueType  (or /Type1, /Type3)
 *   /BaseFont /Helvetica
 *   /FirstChar 32
 *   /LastChar 255
 *   /Widths [278 278 355 ...]
 *   /Encoding /WinAnsiEncoding  (or dict with /Differences)
 *   /FontDescriptor 10 0 R
 *   /ToUnicode 11 0 R
 * >>
 */

import { unicodeToGlyphName } from "#src/helpers/unicode";
import type { PdfArray } from "#src/objects/pdf-array";
import type { PdfDict } from "#src/objects/pdf-dict";
import type { PdfName } from "#src/objects/pdf-name";
import { DifferencesEncoding } from "./encodings/differences";
import type { FontEncoding } from "./encodings/encoding";
import { MacRomanEncoding } from "./encodings/mac-roman";
import { StandardEncoding } from "./encodings/standard";
import { SymbolEncoding } from "./encodings/symbol";
import { WinAnsiEncoding } from "./encodings/win-ansi";
import { ZapfDingbatsEncoding } from "./encodings/zapf-dingbats";
import { FontDescriptor } from "./font-descriptor";
import { PdfFont } from "./pdf-font";
import {
  getStandard14DefaultWidth,
  getStandard14GlyphWidth,
  isStandard14Font,
} from "./standard-14";
import type { ToUnicodeMap } from "./to-unicode";

export type SimpleFontSubtype = "TrueType" | "Type1" | "Type3" | "MMType1";

/**
 * SimpleFont handles single-byte encoded fonts (TrueType, Type1, Type3).
 */
export class SimpleFont extends PdfFont {
  /** Font subtype */
  readonly subtype: SimpleFontSubtype;

  /** Base font name */
  readonly baseFontName: string;

  /** First character code in the Widths array */
  readonly firstChar: number;

  /** Last character code in the Widths array */
  readonly lastChar: number;

  /** Width array indexed from firstChar */
  private readonly widths: number[];

  /** Font encoding for encode/decode */
  private readonly encoding: FontEncoding;

  /** ToUnicode map for text extraction (optional) */
  private readonly toUnicodeMap: ToUnicodeMap | null;

  /** Font descriptor with metrics */
  private readonly _descriptor: FontDescriptor | null;

  /** Whether this is a Standard 14 font */
  readonly isStandard14: boolean;

  constructor(options: {
    subtype: SimpleFontSubtype;
    baseFontName: string;
    firstChar?: number;
    lastChar?: number;
    widths?: number[];
    encoding?: FontEncoding;
    toUnicodeMap?: ToUnicodeMap | null;
    descriptor?: FontDescriptor | null;
  }) {
    super();
    this.subtype = options.subtype;
    this.baseFontName = options.baseFontName;
    this.firstChar = options.firstChar ?? 0;
    this.lastChar = options.lastChar ?? 255;
    this.widths = options.widths ?? [];
    this.encoding = options.encoding ?? WinAnsiEncoding.instance;
    this.toUnicodeMap = options.toUnicodeMap ?? null;
    this._descriptor = options.descriptor ?? null;
    this.isStandard14 = isStandard14Font(this.baseFontName);
  }

  /**
   * Get the font descriptor.
   */
  get descriptor(): FontDescriptor | null {
    return this._descriptor;
  }

  /**
   * Get the width of a character code in glyph units (1000 = 1 em).
   */
  getWidth(code: number): number {
    // Try explicit widths array first
    if (code >= this.firstChar && code <= this.lastChar) {
      const width = this.widths[code - this.firstChar];
      if (width !== undefined) {
        return width;
      }
    }

    // For Standard 14 fonts, use built-in metrics
    if (this.isStandard14) {
      // Get glyph name from encoding
      const glyphName = this.getGlyphName(code);
      if (glyphName) {
        const width = getStandard14GlyphWidth(this.baseFontName, glyphName);
        if (width !== undefined) {
          return width;
        }
      }
      return getStandard14DefaultWidth(this.baseFontName);
    }

    // Fall back to missing width
    return this._descriptor?.missingWidth ?? 0;
  }

  /**
   * Get the glyph name for a character code.
   */
  private getGlyphName(code: number): string | undefined {
    // Get Unicode from encoding
    const unicode = this.encoding.getUnicode(code);
    if (unicode === undefined) {
      return undefined;
    }

    // Map common Unicode to glyph names
    return unicodeToGlyphName(unicode);
  }

  /**
   * Encode text to character codes.
   */
  encodeText(text: string): number[] {
    return this.encoding.encode(text);
  }

  /**
   * Decode character code to Unicode string.
   */
  toUnicode(code: number): string {
    // Try ToUnicode map first (most accurate)
    if (this.toUnicodeMap?.has(code)) {
      // biome-ignore lint/style/noNonNullAssertion: checked with has(...)
      return this.toUnicodeMap.get(code)!;
    }

    // Fall back to encoding
    return this.encoding.decode(code);
  }

  /**
   * Check if text can be encoded with this font.
   */
  canEncode(text: string): boolean {
    for (const char of text) {
      if (!this.encoding.canEncode(char)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Get width of text in points at a given font size.
   */
  getTextWidth(text: string, fontSize: number): number {
    let totalWidth = 0;
    const codes = this.encodeText(text);

    for (const code of codes) {
      totalWidth += this.getWidth(code);
    }

    return (totalWidth * fontSize) / 1000;
  }

  /**
   * Get the font encoding.
   */
  getEncoding(): FontEncoding {
    return this.encoding;
  }
}

/**
 * Parse a SimpleFont from a PDF font dictionary.
 */
export function parseSimpleFont(
  dict: PdfDict,
  options: {
    resolveRef?: (ref: unknown) => PdfDict | PdfArray | null;
    decodeStream?: (stream: unknown) => Uint8Array | null;
  } = {},
): SimpleFont {
  const subtypeName = dict.getName("Subtype");
  const subtype = (subtypeName?.value ?? "TrueType") as SimpleFontSubtype;
  const baseFontName = dict.getName("BaseFont")?.value ?? "Unknown";
  const firstChar = dict.getNumber("FirstChar")?.value ?? 0;
  const lastChar = dict.getNumber("LastChar")?.value ?? 255;

  // Parse widths array
  const widthsArray = dict.getArray("Widths");
  const widths: number[] = [];
  if (widthsArray) {
    for (let i = 0; i < widthsArray.length; i++) {
      const item = widthsArray.at(i);
      if (item && item.type === "number") {
        widths.push(item.value);
      } else {
        widths.push(0);
      }
    }
  }

  // Parse encoding
  const encoding = parseEncoding(dict, options.resolveRef);

  // Parse FontDescriptor
  let descriptor: FontDescriptor | null = null;
  const descriptorRef = dict.get("FontDescriptor");
  if (descriptorRef && options.resolveRef) {
    const descriptorDict = options.resolveRef(descriptorRef);
    if (descriptorDict && "getString" in descriptorDict) {
      descriptor = FontDescriptor.parse(descriptorDict as PdfDict);
    }
  }

  // Parse ToUnicode (handled externally due to stream decoding)
  // The caller should provide a decoded ToUnicodeMap if available

  return new SimpleFont({
    subtype,
    baseFontName,
    firstChar,
    lastChar,
    widths,
    encoding,
    descriptor,
  });
}

/**
 * Parse encoding from font dictionary.
 */
function parseEncoding(
  dict: PdfDict,
  resolveRef?: (ref: unknown) => PdfDict | PdfArray | null,
): FontEncoding {
  const encodingValue = dict.get("Encoding");

  if (!encodingValue) {
    // Default encoding based on font type
    const baseFontName = dict.getName("BaseFont")?.value ?? "";

    if (baseFontName === "Symbol") {
      return SymbolEncoding.instance;
    }

    if (baseFontName === "ZapfDingbats") {
      return ZapfDingbatsEncoding.instance;
    }

    return StandardEncoding.instance;
  }

  // Name encoding (e.g., /WinAnsiEncoding)
  if (encodingValue.type === "name") {
    return getEncodingByName((encodingValue as PdfName).value);
  }

  // Dictionary encoding with /BaseEncoding and /Differences
  if (encodingValue.type === "dict") {
    return parseEncodingDict(encodingValue as PdfDict);
  }

  // Reference to encoding dict
  if (encodingValue.type === "ref" && resolveRef) {
    const resolved = resolveRef(encodingValue);

    if (resolved && resolved.type === "dict") {
      return parseEncodingDict(resolved);
    }
  }

  return WinAnsiEncoding.instance;
}

/**
 * Parse encoding dictionary.
 */
function parseEncodingDict(dict: PdfDict): FontEncoding {
  // Get base encoding
  const baseEncodingName = dict.getName("BaseEncoding");
  const baseEncoding = baseEncodingName
    ? getEncodingByName(baseEncodingName.value)
    : WinAnsiEncoding.instance;

  // Parse differences array
  const differencesArray = dict.getArray("Differences");
  if (!differencesArray || differencesArray.length === 0) {
    return baseEncoding;
  }

  // Convert array to [number, string, string, ...] format
  const items: Array<number | string> = [];
  for (let i = 0; i < differencesArray.length; i++) {
    const item = differencesArray.at(i);

    if (item) {
      if (item.type === "number") {
        items.push(item.value);
      } else if (item.type === "name") {
        items.push(item.value);
      }
    }
  }

  const differences = DifferencesEncoding.parseDifferencesArray(items);

  return new DifferencesEncoding(baseEncoding, differences);
}

/**
 * Get encoding by name.
 */
function getEncodingByName(name: string): FontEncoding {
  switch (name) {
    case "WinAnsiEncoding":
      return WinAnsiEncoding.instance;
    case "MacRomanEncoding":
      return MacRomanEncoding.instance;
    case "StandardEncoding":
      return StandardEncoding.instance;
    case "MacExpertEncoding":
      // MacExpertEncoding not implemented - fall back
      return StandardEncoding.instance;
    default:
      return WinAnsiEncoding.instance;
  }
}
