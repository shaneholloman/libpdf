/**
 * LineGrouper - Groups extracted characters into lines and spans.
 *
 * Characters are grouped into lines based on their baseline Y coordinate,
 * and within lines into spans based on font/size changes.
 * Spaces are detected from gaps between characters.
 */

import type { ExtractedChar, TextLine, TextSpan } from "./types";
import { mergeBboxes } from "./types";

/**
 * Options for line grouping.
 */
export interface LineGrouperOptions {
  /**
   * Tolerance for grouping characters on the same baseline.
   * Characters within this Y distance are considered on the same line.
   * Default: 2 points
   */
  baselineTolerance?: number;

  /**
   * Factor of font size to detect word spacing.
   * If gap between characters exceeds this fraction of font size, insert a space.
   * Default: 0.3 (30% of font size)
   */
  spaceThreshold?: number;
}

/**
 * Group extracted characters into lines and spans.
 *
 * @param chars - Array of extracted characters
 * @param options - Grouping options
 * @returns Array of text lines
 */
export function groupCharsIntoLines(
  chars: ExtractedChar[],
  options: LineGrouperOptions = {},
): TextLine[] {
  if (chars.length === 0) {
    return [];
  }

  const baselineTolerance = options.baselineTolerance ?? 2;
  const spaceThreshold = options.spaceThreshold ?? 0.3;

  // Group characters by baseline
  const lineGroups = groupByBaseline(chars, baselineTolerance);

  // Convert each group to a TextLine
  const lines: TextLine[] = [];

  for (const group of lineGroups) {
    // Sort characters left-to-right within the line
    const sorted = [...group].sort((a, b) => a.bbox.x - b.bbox.x);

    // Group into spans and detect spaces
    const spans = groupIntoSpans(sorted, spaceThreshold);

    if (spans.length === 0) {
      continue;
    }

    // Build the line
    const lineText = spans.map(s => s.text).join("");
    const lineBbox = mergeBboxes(spans.map(s => s.bbox));
    const baseline = calculateAverageBaseline(sorted);

    lines.push({
      text: lineText,
      bbox: lineBbox,
      spans,
      baseline,
    });
  }

  // Sort lines top-to-bottom (higher Y = higher on page in PDF coordinates)
  lines.sort((a, b) => b.baseline - a.baseline);

  return lines;
}

/**
 * Group characters by baseline Y coordinate.
 */
function groupByBaseline(chars: ExtractedChar[], tolerance: number): ExtractedChar[][] {
  const groups: ExtractedChar[][] = [];

  for (const char of chars) {
    // Find an existing group with a similar baseline
    let foundGroup = false;

    for (const group of groups) {
      const avgBaseline = calculateAverageBaseline(group);

      if (Math.abs(char.baseline - avgBaseline) <= tolerance) {
        group.push(char);
        foundGroup = true;
        break;
      }
    }

    if (!foundGroup) {
      groups.push([char]);
    }
  }

  return groups;
}

/**
 * Group characters into spans based on font/size and detect spaces.
 */
function groupIntoSpans(chars: ExtractedChar[], spaceThreshold: number): TextSpan[] {
  if (chars.length === 0) {
    return [];
  }

  const spans: TextSpan[] = [];
  let currentSpan: ExtractedChar[] = [chars[0]];
  let currentFontName = chars[0].fontName;
  let currentFontSize = chars[0].fontSize;

  for (let i = 1; i < chars.length; i++) {
    const prevChar = chars[i - 1];
    const char = chars[i];

    // Check for font/size change
    const fontChanged =
      char.fontName !== currentFontName || Math.abs(char.fontSize - currentFontSize) > 0.5;

    // Check for space gap
    const gap = char.bbox.x - (prevChar.bbox.x + prevChar.bbox.width);
    const avgFontSize = (prevChar.fontSize + char.fontSize) / 2;
    const needsSpace = gap > avgFontSize * spaceThreshold;

    if (fontChanged) {
      // Complete current span
      spans.push(buildSpan(currentSpan));

      // Start new span
      currentSpan = [char];
      currentFontName = char.fontName;
      currentFontSize = char.fontSize;
    } else if (needsSpace) {
      // Add space to current span and continue
      // We insert a synthetic space character
      currentSpan.push(createSpaceChar(prevChar, char));
      currentSpan.push(char);
    } else {
      currentSpan.push(char);
    }
  }

  // Complete final span
  if (currentSpan.length > 0) {
    spans.push(buildSpan(currentSpan));
  }

  return spans;
}

/**
 * Build a TextSpan from characters.
 */
function buildSpan(chars: ExtractedChar[]): TextSpan {
  const text = chars.map(c => c.char).join("");
  const bbox = mergeBboxes(chars.map(c => c.bbox));

  // Use the first non-space character for font info
  const fontChar = chars.find(c => c.char !== " ") ?? chars[0];

  return {
    text,
    bbox,
    chars,
    fontSize: fontChar.fontSize,
    fontName: fontChar.fontName,
  };
}

/**
 * Create a synthetic space character between two characters.
 */
function createSpaceChar(before: ExtractedChar, after: ExtractedChar): ExtractedChar {
  const x = before.bbox.x + before.bbox.width;
  const width = after.bbox.x - x;

  return {
    char: " ",
    bbox: {
      x,
      y: before.bbox.y,
      width: Math.max(width, 0),
      height: before.bbox.height,
    },
    fontSize: (before.fontSize + after.fontSize) / 2,
    fontName: before.fontName,
    baseline: (before.baseline + after.baseline) / 2,
  };
}

/**
 * Calculate the average baseline of a group of characters.
 */
function calculateAverageBaseline(chars: ExtractedChar[]): number {
  if (chars.length === 0) {
    return 0;
  }

  const sum = chars.reduce((acc, c) => acc + c.baseline, 0);

  return sum / chars.length;
}

/**
 * Get plain text from extracted characters.
 * Inserts newlines between lines.
 */
export function getPlainText(lines: TextLine[]): string {
  return lines.map(line => line.text).join("\n");
}
