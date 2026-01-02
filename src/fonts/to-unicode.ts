/**
 * ToUnicode CMap parser for text extraction.
 *
 * ToUnicode CMaps map character codes to Unicode strings, enabling
 * text extraction from PDF content streams.
 *
 * Format (from PDF spec):
 * - beginbfchar/endbfchar: Individual character mappings
 *   <srcCode> <dstString>
 *
 * - beginbfrange/endbfrange: Range mappings
 *   <srcCodeLo> <srcCodeHi> <dstString>  - incrementing range
 *   <srcCodeLo> <srcCodeHi> [<dst1> <dst2> ...] - array of destinations
 */

/**
 * ToUnicode map for converting character codes to Unicode strings.
 */
export class ToUnicodeMap {
  private readonly map: Map<number, string>;

  constructor(map?: Map<number, string>) {
    this.map = map ?? new Map();
  }

  /**
   * Get the Unicode string for a character code.
   */
  get(code: number): string | undefined {
    return this.map.get(code);
  }

  /**
   * Check if a character code has a mapping.
   */
  has(code: number): boolean {
    return this.map.has(code);
  }

  /**
   * Set a mapping from character code to Unicode string.
   */
  set(code: number, unicode: string): void {
    this.map.set(code, unicode);
  }

  /**
   * Get the number of mappings.
   */
  get size(): number {
    return this.map.size;
  }

  /**
   * Iterate over all mappings.
   */
  forEach(callback: (unicode: string, code: number) => void): void {
    this.map.forEach(callback);
  }

  /**
   * Get the underlying map (for advanced use).
   */
  getMap(): Map<number, string> {
    return this.map;
  }
}

/**
 * Parse a ToUnicode CMap stream and return a mapping.
 *
 * @param data - The raw CMap data (decoded stream content)
 * @returns Map from character codes to Unicode strings
 */
export function parseToUnicode(data: Uint8Array): ToUnicodeMap {
  const map = new ToUnicodeMap();

  // Decode as Latin-1 (each byte = one char, preserving binary data in hex strings)
  const text = bytesToLatin1(data);

  // Parse beginbfchar sections
  parseBfCharSections(text, map);

  // Parse beginbfrange sections
  parseBfRangeSections(text, map);

  return map;
}

/**
 * Convert bytes to Latin-1 string (each byte becomes a character).
 */
function bytesToLatin1(data: Uint8Array): string {
  // For CMap parsing, we just need to preserve the ASCII text and hex strings
  // Each byte becomes a character with that code point
  let result = "";
  for (let i = 0; i < data.length; i++) {
    result += String.fromCharCode(data[i]);
  }
  return result;
}

/**
 * Parse all beginbfchar/endbfchar sections.
 */
function parseBfCharSections(text: string, map: ToUnicodeMap): void {
  const sectionRegex = /beginbfchar\s*([\s\S]*?)\s*endbfchar/g;

  for (const match of text.matchAll(sectionRegex)) {
    parseBfCharContent(match[1], map);
  }
}

/**
 * Parse content within a bfchar section.
 * Format: <srcCode> <dstString>
 */
function parseBfCharContent(content: string, map: ToUnicodeMap): void {
  // Match pairs of hex strings
  const pairRegex = /<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>/g;

  for (const match of content.matchAll(pairRegex)) {
    const srcCode = parseInt(match[1], 16);
    const dstUnicode = hexToUnicode(match[2]);
    map.set(srcCode, dstUnicode);
  }
}

/**
 * Parse all beginbfrange/endbfrange sections.
 */
function parseBfRangeSections(text: string, map: ToUnicodeMap): void {
  const sectionRegex = /beginbfrange\s*([\s\S]*?)\s*endbfrange/g;

  for (const match of text.matchAll(sectionRegex)) {
    parseBfRangeContent(match[1], map);
  }
}

/**
 * Parse content within a bfrange section.
 * Format:
 *   <srcCodeLo> <srcCodeHi> <dstStringStart> - incrementing range
 *   <srcCodeLo> <srcCodeHi> [<dst1> <dst2> ...] - array of destinations
 */
function parseBfRangeContent(content: string, map: ToUnicodeMap): void {
  // Split into lines and process each
  const lines = content.trim().split(/\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Try to match range with array: <lo> <hi> [<d1> <d2> ...]
    const arrayMatch = trimmed.match(/^<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*\[([\s\S]*)\]$/);

    if (arrayMatch) {
      const lo = parseInt(arrayMatch[1], 16);
      const hi = parseInt(arrayMatch[2], 16);
      const arrayContent = arrayMatch[3];

      // Extract all hex strings from the array
      const hexMatches = arrayContent.match(/<([0-9A-Fa-f]+)>/g);
      if (hexMatches) {
        const destinations = hexMatches.map(h => hexToUnicode(h.slice(1, -1)));

        // Map each code in range to corresponding destination
        for (let code = lo; code <= hi && code - lo < destinations.length; code++) {
          map.set(code, destinations[code - lo]);
        }
      }
      continue;
    }

    // Try to match range with start code: <lo> <hi> <dstStart>
    const rangeMatch = trimmed.match(/^<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>$/);

    if (rangeMatch) {
      const lo = parseInt(rangeMatch[1], 16);
      const hi = parseInt(rangeMatch[2], 16);
      const dstHex = rangeMatch[3];

      // Map the range with incrementing Unicode values
      mapBfRange(lo, hi, dstHex, map);
    }
  }
}

/**
 * Map a range of character codes to incrementing Unicode values.
 *
 * The destination string is incremented for each code in the range.
 * For multi-byte destinations, only the last byte is incremented,
 * with carry to previous bytes when needed.
 */
function mapBfRange(lo: number, hi: number, dstHex: string, map: ToUnicodeMap): void {
  // Validate range to prevent excessive iterations
  const MAX_RANGE = 0xffffff;
  if (hi - lo > MAX_RANGE) {
    return;
  }

  // Convert hex to array of code units (2 bytes per code unit for UTF-16BE)
  const codeUnits = hexToCodeUnits(dstHex);
  if (codeUnits.length === 0) {
    return;
  }

  for (let code = lo; code <= hi; code++) {
    // Convert current code units to string
    map.set(code, String.fromCharCode(...codeUnits));

    // Increment the code units for next iteration
    incrementCodeUnits(codeUnits);
  }
}

/**
 * Convert hex string to array of 16-bit code units (UTF-16BE).
 */
function hexToCodeUnits(hex: string): number[] {
  const codeUnits: number[] = [];

  // Pad to even length if needed
  const padded = hex.length % 4 !== 0 ? hex.padStart(Math.ceil(hex.length / 4) * 4, "0") : hex;

  for (let i = 0; i < padded.length; i += 4) {
    codeUnits.push(parseInt(padded.slice(i, i + 4), 16));
  }

  return codeUnits;
}

/**
 * Increment array of code units (with carry).
 * Modifies the array in place.
 */
function incrementCodeUnits(codeUnits: number[]): void {
  // Start from the last code unit and work backwards
  for (let i = codeUnits.length - 1; i >= 0; i--) {
    codeUnits[i]++;
    if (codeUnits[i] <= 0xffff) {
      // No overflow, done
      break;
    }
    // Overflow - wrap and carry
    codeUnits[i] = 0;
    // Continue to increment previous code unit
  }
}

/**
 * Convert hex string to Unicode string.
 *
 * The hex string represents UTF-16BE encoded data:
 * - 4 hex chars = 1 BMP character
 * - 8 hex chars = surrogate pair (supplementary character)
 */
function hexToUnicode(hex: string): string {
  const codeUnits = hexToCodeUnits(hex);
  return String.fromCharCode(...codeUnits);
}
