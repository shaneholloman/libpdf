/**
 * Drawing API types and option interfaces.
 */

import type { EmbeddedFont } from "#src/fonts/embedded-font";
import type { Standard14FontName } from "#src/fonts/standard-14";
import type { Color } from "#src/helpers/colors";

// ─────────────────────────────────────────────────────────────────────────────
// Common Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Text alignment for multiline text.
 */
export type TextAlignment = "left" | "center" | "right" | "justify";

/**
 * Line cap style.
 * - "butt": Square end at endpoint (0)
 * - "round": Semicircular end (1)
 * - "square": Square end extending beyond endpoint (2)
 */
export type LineCap = "butt" | "round" | "square";

/**
 * Line join style.
 * - "miter": Sharp corner (0)
 * - "round": Rounded corner (1)
 * - "bevel": Beveled corner (2)
 */
export type LineJoin = "miter" | "round" | "bevel";

/**
 * Rotation specification.
 */
export interface Rotation {
  /** Rotation angle in degrees (counter-clockwise) */
  angle: number;
  /** Rotation center point (default: object center) */
  origin?: {
    x: number;
    y: number;
  };
}

/**
 * Font type - either a Standard 14 font name or an embedded font.
 */
export type FontInput = Standard14FontName | EmbeddedFont;

// ─────────────────────────────────────────────────────────────────────────────
// Text Options
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Options for drawing text.
 */
export interface DrawTextOptions {
  /** X position (default: 0) */
  x?: number;
  /** Y position (default: 0) */
  y?: number;
  /** Font to use (default: "Helvetica") */
  font?: FontInput;
  /** Font size in points (default: 12) */
  size?: number;
  /** Text color (default: black) */
  color?: Color;
  /** Opacity 0-1 (default: 1) */
  opacity?: number;

  // Multiline options
  /** Maximum width for word wrapping */
  maxWidth?: number;
  /** Line height in points (default: size * 1.2) */
  lineHeight?: number;
  /** Text alignment for multiline (default: "left") */
  alignment?: TextAlignment;

  // Transform
  /** Rotation */
  rotate?: Rotation;
}

// ─────────────────────────────────────────────────────────────────────────────
// Image Options
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Options for drawing an image.
 */
export interface DrawImageOptions {
  /** X position (default: 0) */
  x?: number;
  /** Y position (default: 0) */
  y?: number;
  /** Width in points (default: image natural width) */
  width?: number;
  /** Height in points (default: preserves aspect ratio if width set, otherwise natural height) */
  height?: number;
  /** Opacity 0-1 (default: 1) */
  opacity?: number;
  /** Rotation */
  rotate?: Rotation;
}

// ─────────────────────────────────────────────────────────────────────────────
// Shape Options
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Options for drawing a rectangle.
 */
export interface DrawRectangleOptions {
  /** X position (left edge) */
  x: number;
  /** Y position (bottom edge) */
  y: number;
  /** Width in points */
  width: number;
  /** Height in points */
  height: number;
  /** Fill color (omit for no fill) */
  color?: Color;
  /** Border/stroke color (omit for no stroke) */
  borderColor?: Color;
  /** Border width in points (default: 1 if borderColor set) */
  borderWidth?: number;
  /** Dash pattern array (e.g., [5, 3] for 5pt dash, 3pt gap) */
  borderDashArray?: number[];
  /** Dash pattern phase (default: 0) */
  borderDashPhase?: number;
  /** Corner radius for rounded rectangles */
  cornerRadius?: number;
  /** Fill opacity 0-1 (default: 1) */
  opacity?: number;
  /** Border opacity 0-1 (default: 1) */
  borderOpacity?: number;
  /** Rotation */
  rotate?: Rotation;
}

/**
 * Options for drawing a line.
 */
export interface DrawLineOptions {
  /** Start point */
  start: { x: number; y: number };
  /** End point */
  end: { x: number; y: number };
  /** Line color (default: black) */
  color?: Color;
  /** Line thickness in points (default: 1) */
  thickness?: number;
  /** Dash pattern array */
  dashArray?: number[];
  /** Dash pattern phase (default: 0) */
  dashPhase?: number;
  /** Line cap style (default: "butt") */
  lineCap?: LineCap;
  /** Opacity 0-1 (default: 1) */
  opacity?: number;
}

/**
 * Options for drawing a circle.
 */
export interface DrawCircleOptions {
  /** Center X coordinate */
  x: number;
  /** Center Y coordinate */
  y: number;
  /** Circle radius in points */
  radius: number;
  /** Fill color (omit for no fill) */
  color?: Color;
  /** Border/stroke color (omit for no stroke) */
  borderColor?: Color;
  /** Border width in points (default: 1 if borderColor set) */
  borderWidth?: number;
  /** Fill opacity 0-1 (default: 1) */
  opacity?: number;
  /** Border opacity 0-1 (default: 1) */
  borderOpacity?: number;
}

/**
 * Options for drawing an ellipse.
 */
export interface DrawEllipseOptions {
  /** Center X coordinate */
  x: number;
  /** Center Y coordinate */
  y: number;
  /** Horizontal radius in points */
  xRadius: number;
  /** Vertical radius in points */
  yRadius: number;
  /** Fill color (omit for no fill) */
  color?: Color;
  /** Border/stroke color (omit for no stroke) */
  borderColor?: Color;
  /** Border width in points (default: 1 if borderColor set) */
  borderWidth?: number;
  /** Fill opacity 0-1 (default: 1) */
  opacity?: number;
  /** Border opacity 0-1 (default: 1) */
  borderOpacity?: number;
  /** Rotation */
  rotate?: Rotation;
}

// ─────────────────────────────────────────────────────────────────────────────
// Path Options
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Options for path painting.
 */
export interface PathOptions {
  /** Fill color (omit for no fill) */
  color?: Color;
  /** Stroke color (omit for no stroke) */
  borderColor?: Color;
  /** Stroke width in points (default: 1 if borderColor set) */
  borderWidth?: number;
  /** Line cap style */
  lineCap?: LineCap;
  /** Line join style */
  lineJoin?: LineJoin;
  /** Miter limit for miter joins */
  miterLimit?: number;
  /** Dash pattern array */
  dashArray?: number[];
  /** Dash pattern phase */
  dashPhase?: number;
  /** Fill opacity 0-1 (default: 1) */
  opacity?: number;
  /** Stroke opacity 0-1 (default: 1) */
  borderOpacity?: number;
  /** Winding rule for fill (default: "nonzero") */
  windingRule?: "nonzero" | "evenodd";
}

// ─────────────────────────────────────────────────────────────────────────────
// Utility Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convert LineCap to PDF numeric value.
 */
export function lineCapToNumber(cap: LineCap): 0 | 1 | 2 {
  switch (cap) {
    case "butt":
      return 0;
    case "round":
      return 1;
    case "square":
      return 2;
  }
}

/**
 * Convert LineJoin to PDF numeric value.
 */
export function lineJoinToNumber(join: LineJoin): 0 | 1 | 2 {
  switch (join) {
    case "miter":
      return 0;
    case "round":
      return 1;
    case "bevel":
      return 2;
  }
}
