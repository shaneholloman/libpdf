/**
 * CMap (Character Map) for Type0 fonts.
 *
 * CMaps define how character codes map to CIDs (Character IDs).
 * They are used by Type0 (composite) fonts.
 *
 * Special cases:
 * - Identity-H / Identity-V: Character codes map directly to CIDs
 *
 * Format (from PDF spec):
 * - codespacerange: Defines valid code ranges
 * - cidchar: Individual code to CID mappings
 * - cidrange: Range mappings
 */

/**
 * Codespace range defines the valid range for character codes.
 */
export interface CodespaceRange {
  /** Start of the range */
  low: number;
  /** End of the range (inclusive) */
  high: number;
  /** Number of bytes for codes in this range */
  numBytes: number;
}

/**
 * CMap for mapping character codes to CIDs.
 */
export class CMap {
  /** CMap name (e.g., "Identity-H") */
  readonly name: string;

  /** Whether this is a vertical writing mode CMap */
  readonly vertical: boolean;

  /** Whether this is an identity CMap */
  readonly isIdentity: boolean;

  /** Codespace ranges */
  private readonly codespaceRanges: CodespaceRange[];

  /** Direct character code to CID mappings */
  private readonly charMappings: Map<number, number>;

  /** Range mappings: [start, end, baseCID] */
  private readonly rangeMappings: Array<{
    start: number;
    end: number;
    baseCID: number;
  }>;

  constructor(options: {
    name: string;
    vertical?: boolean;
    isIdentity?: boolean;
    codespaceRanges?: CodespaceRange[];
    charMappings?: Map<number, number>;
    rangeMappings?: Array<{ start: number; end: number; baseCID: number }>;
  }) {
    this.name = options.name;
    this.vertical = options.vertical ?? false;
    this.isIdentity = options.isIdentity ?? false;
    this.codespaceRanges = options.codespaceRanges ?? [];
    this.charMappings = options.charMappings ?? new Map();
    this.rangeMappings = options.rangeMappings ?? [];
  }

  /**
   * Look up CID for a character code.
   */
  lookup(code: number): number {
    // For identity CMaps, code = CID
    if (this.isIdentity) {
      return code;
    }

    // Check direct mappings first
    const direct = this.charMappings.get(code);

    if (direct !== undefined) {
      return direct;
    }

    // Check range mappings
    for (const range of this.rangeMappings) {
      if (code >= range.start && code <= range.end) {
        return range.baseCID + (code - range.start);
      }
    }

    // No mapping found - return 0 (.notdef)
    return 0;
  }

  /**
   * Check if a character code is valid in this CMap's codespace.
   */
  isValidCode(code: number): boolean {
    for (const range of this.codespaceRanges) {
      if (code >= range.low && code <= range.high) {
        return true;
      }
    }

    return this.codespaceRanges.length === 0;
  }

  /**
   * Get the codespace ranges.
   */
  getCodespaceRanges(): readonly CodespaceRange[] {
    return this.codespaceRanges;
  }

  /**
   * Encode text to character codes.
   * For Identity-H encoding, codes are Unicode code points.
   */
  encode(text: string): number[] {
    if (this.isIdentity) {
      // For Identity-H, each character becomes its code point
      const codes: number[] = [];

      for (const char of text) {
        const cp = char.codePointAt(0);

        if (cp !== undefined) {
          codes.push(cp);
        }
      }

      return codes;
    }

    // For other CMaps, need to reverse lookup
    // This is a simplified version - full CMap encoding is complex
    throw new Error(`Encoding not supported for CMap: ${this.name}`);
  }

  /**
   * Check if text can be encoded with this CMap.
   */
  canEncode(text: string): boolean {
    // Identity-H/V can encode any Unicode text.
    // Characters outside BMP (> 0xFFFF) are represented as surrogate pairs
    // in JavaScript strings, so each charCodeAt() returns a 16-bit value.
    if (this.isIdentity) {
      // All UTF-16 code units are valid (0x0000-0xFFFF)
      return true;
    }

    // For other CMaps, check if each UTF-16 code unit has a mapping
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);

      // Check if this code is in the codespace
      if (!this.isValidCode(code)) {
        return false;
      }

      // Check if there's a mapping for this code
      if (!this.charMappings.has(code)) {
        // Check range mappings
        let found = false;

        for (const range of this.rangeMappings) {
          if (code >= range.start && code <= range.end) {
            found = true;
            break;
          }
        }

        if (!found) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Read a character code from a byte string.
   * Returns the code and how many bytes were consumed.
   */
  readCharCode(bytes: Uint8Array, offset: number): { code: number; length: number } {
    // For identity, always 2 bytes
    if (this.isIdentity) {
      if (offset + 1 >= bytes.length) {
        return { code: bytes[offset] ?? 0, length: 1 };
      }

      const code = (bytes[offset] << 8) | bytes[offset + 1];

      return { code, length: 2 };
    }

    // Try each codespace range to find matching length
    let code = 0;

    for (let numBytes = 1; numBytes <= 4 && offset + numBytes <= bytes.length; numBytes++) {
      // Build code from bytes
      code = 0;

      for (let i = 0; i < numBytes; i++) {
        code = (code << 8) | bytes[offset + i];
      }

      // Check if this matches a codespace range
      for (const range of this.codespaceRanges) {
        if (range.numBytes === numBytes && code >= range.low && code <= range.high) {
          return { code, length: numBytes };
        }
      }
    }

    // Default to 1 byte
    return { code: bytes[offset] ?? 0, length: 1 };
  }

  /**
   * Get a predefined CMap by name.
   *
   * Currently only Identity-H and Identity-V are supported.
   * Other predefined CMaps (UniGB-UCS2-H, UniJIS-UCS2-H, etc.) return null.
   *
   * Note: Legacy CJK PDFs using predefined CMaps without ToUnicode maps
   * may not extract text correctly. Modern PDFs include ToUnicode maps
   * which take precedence for text extraction.
   */
  static getPredefined(name: string): CMap | null {
    if (name === "Identity-H") {
      return CMap.identityH();
    }

    if (name === "Identity-V") {
      return CMap.identityV();
    }

    // Other predefined CMaps (UniGB-*, UniJIS-*, etc.) not implemented.
    // Falls back to Identity-H in parseCompositeFont.
    return null;
  }

  /**
   * Create Identity-H CMap.
   */
  static identityH(): CMap {
    return new CMap({
      name: "Identity-H",
      vertical: false,
      isIdentity: true,
      codespaceRanges: [{ low: 0x0000, high: 0xffff, numBytes: 2 }],
    });
  }

  /**
   * Create Identity-V CMap.
   */
  static identityV(): CMap {
    return new CMap({
      name: "Identity-V",
      vertical: true,
      isIdentity: true,
      codespaceRanges: [{ low: 0x0000, high: 0xffff, numBytes: 2 }],
    });
  }
}

/**
 * Parse a CMap stream and return a CMap object.
 *
 * @param data - The raw CMap data (decoded stream content)
 * @param name - Optional name for the CMap
 * @returns Parsed CMap
 */
export function parseCMap(data: Uint8Array, name?: string): CMap {
  const text = bytesToLatin1(data);

  const codespaceRanges: CodespaceRange[] = [];
  const charMappings = new Map<number, number>();
  const rangeMappings: Array<{ start: number; end: number; baseCID: number }> = [];

  let cmapName = name ?? "";
  let vertical = false;

  // Parse CMap name
  const nameMatch = text.match(/\/CMapName\s+\/(\S+)/);

  if (nameMatch) {
    cmapName = nameMatch[1];
  }

  // Parse WMode (vertical)
  const wmodeMatch = text.match(/\/WMode\s+(\d)/);

  if (wmodeMatch) {
    vertical = wmodeMatch[1] === "1";
  }

  // Check if this is an identity CMap
  const isIdentity = cmapName === "Identity-H" || cmapName === "Identity-V";

  // Parse codespace ranges
  parseCodespaceRanges(text, codespaceRanges);

  // Parse cidchar sections
  parseCidCharSections(text, charMappings);

  // Parse cidrange sections
  parseCidRangeSections(text, rangeMappings);

  return new CMap({
    name: cmapName,
    vertical,
    isIdentity,
    codespaceRanges,
    charMappings,
    rangeMappings,
  });
}

/**
 * Parse all begincodespacerange/endcodespacerange sections.
 */
function parseCodespaceRanges(text: string, ranges: CodespaceRange[]): void {
  const sectionRegex = /begincodespacerange\s*([\s\S]*?)\s*endcodespacerange/g;

  for (const match of text.matchAll(sectionRegex)) {
    parseCodespaceContent(match[1], ranges);
  }
}

/**
 * Parse content within a codespacerange section.
 * Format: <low> <high>
 */
function parseCodespaceContent(content: string, ranges: CodespaceRange[]): void {
  const pairRegex = /<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>/g;

  for (const match of content.matchAll(pairRegex)) {
    const low = parseInt(match[1], 16);
    const high = parseInt(match[2], 16);
    // Number of bytes is half the hex string length
    const numBytes = Math.max(match[1].length, match[2].length) / 2;
    ranges.push({ low, high, numBytes: Math.ceil(numBytes) });
  }
}

/**
 * Parse all begincidchar/endcidchar sections.
 */
function parseCidCharSections(text: string, mappings: Map<number, number>): void {
  const sectionRegex = /begincidchar\s*([\s\S]*?)\s*endcidchar/g;

  for (const match of text.matchAll(sectionRegex)) {
    parseCidCharContent(match[1], mappings);
  }
}

/**
 * Parse content within a cidchar section.
 * Format: <code> <cid>
 */
function parseCidCharContent(content: string, mappings: Map<number, number>): void {
  const pairRegex = /<([0-9A-Fa-f]+)>\s+(\d+)/g;

  for (const match of content.matchAll(pairRegex)) {
    const code = parseInt(match[1], 16);
    const cid = parseInt(match[2], 10);
    mappings.set(code, cid);
  }
}

/**
 * Parse all begincidrange/endcidrange sections.
 */
function parseCidRangeSections(
  text: string,
  ranges: Array<{ start: number; end: number; baseCID: number }>,
): void {
  const sectionRegex = /begincidrange\s*([\s\S]*?)\s*endcidrange/g;

  for (const match of text.matchAll(sectionRegex)) {
    parseCidRangeContent(match[1], ranges);
  }
}

/**
 * Parse content within a cidrange section.
 * Format: <start> <end> <baseCID>
 */
function parseCidRangeContent(
  content: string,
  ranges: Array<{ start: number; end: number; baseCID: number }>,
): void {
  const rangeRegex = /<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s+(\d+)/g;

  for (const match of content.matchAll(rangeRegex)) {
    const start = parseInt(match[1], 16);
    const end = parseInt(match[2], 16);
    const baseCID = parseInt(match[3], 10);
    ranges.push({ start, end, baseCID });
  }
}

/**
 * Convert bytes to Latin-1 string (each byte becomes a character).
 */
function bytesToLatin1(data: Uint8Array): string {
  let result = "";

  for (let i = 0; i < data.length; i++) {
    result += String.fromCharCode(data[i]);
  }

  return result;
}
