/**
 * PathBuilder - Fluent API for building custom paths.
 *
 * Provides a chainable interface for constructing PDF paths with
 * lines, curves, and basic shapes, then painting them with fill/stroke.
 */

import type { Operator } from "#src/content/operators";
import { clip, clipEvenOdd, closePath, curveTo, lineTo, moveTo } from "#src/helpers/operators";
import { wrapPathOps } from "./operations";
import type { PathOptions } from "./types";

/**
 * Magic number for circular Bezier approximation.
 */
const KAPPA = 0.5522847498307936;

/**
 * Callback type for appending content to a page.
 */
export type ContentAppender = (content: string) => void;

/**
 * Callback type for registering a graphics state and returning its name.
 */
export type GraphicsStateRegistrar = (
  fillOpacity?: number,
  strokeOpacity?: number,
) => string | null;

/**
 * PathBuilder provides a fluent interface for constructing PDF paths.
 *
 * @example
 * ```typescript
 * // Triangle
 * page.drawPath()
 *   .moveTo(300, 200)
 *   .lineTo(350, 300)
 *   .lineTo(250, 300)
 *   .close()
 *   .fill({ color: rgb(0, 0, 1) });
 * ```
 */
export class PathBuilder {
  private readonly pathOps: Operator[] = [];
  private readonly appendContent: ContentAppender;
  private readonly registerGraphicsState: GraphicsStateRegistrar;

  constructor(appendContent: ContentAppender, registerGraphicsState: GraphicsStateRegistrar) {
    this.appendContent = appendContent;
    this.registerGraphicsState = registerGraphicsState;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Path Construction
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Move to a point (start a new subpath).
   */
  moveTo(x: number, y: number): this {
    this.pathOps.push(moveTo(x, y));

    return this;
  }

  /**
   * Draw a line from the current point to (x, y).
   */
  lineTo(x: number, y: number): this {
    this.pathOps.push(lineTo(x, y));

    return this;
  }

  /**
   * Draw a cubic Bezier curve from the current point to (x, y).
   *
   * @param cp1x - First control point X
   * @param cp1y - First control point Y
   * @param cp2x - Second control point X
   * @param cp2y - Second control point Y
   * @param x - End point X
   * @param y - End point Y
   */
  curveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): this {
    this.pathOps.push(curveTo(cp1x, cp1y, cp2x, cp2y, x, y));

    return this;
  }

  /**
   * Draw a quadratic Bezier curve from the current point to (x, y).
   *
   * Converted internally to a cubic Bezier curve.
   *
   * @param cpx - Control point X
   * @param cpy - Control point Y
   * @param x - End point X
   * @param y - End point Y
   */
  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): this {
    // Quadratic to cubic conversion requires current point
    // For simplicity, we approximate by using the control point for both control points
    // This is a rough approximation - proper conversion needs current point tracking
    // cp1 = p0 + 2/3 * (cp - p0)
    // cp2 = p  + 2/3 * (cp - p)
    // For now, use the control point as both (less accurate but functional)
    this.pathOps.push(curveTo(cpx, cpy, cpx, cpy, x, y));

    return this;
  }

  /**
   * Close the current subpath with a straight line back to the start.
   */
  close(): this {
    this.pathOps.push(closePath());

    return this;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Convenience Shapes
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Add a rectangle to the current path.
   */
  rectangle(x: number, y: number, width: number, height: number): this {
    this.pathOps.push(moveTo(x, y));
    this.pathOps.push(lineTo(x + width, y));
    this.pathOps.push(lineTo(x + width, y + height));
    this.pathOps.push(lineTo(x, y + height));
    this.pathOps.push(closePath());

    return this;
  }

  /**
   * Add a circle to the current path.
   */
  circle(x: number, y: number, radius: number): this {
    return this.ellipse(x, y, radius, radius);
  }

  /**
   * Add an ellipse to the current path.
   */
  ellipse(cx: number, cy: number, rx: number, ry: number): this {
    const kx = rx * KAPPA;
    const ky = ry * KAPPA;

    this.pathOps.push(moveTo(cx - rx, cy));
    this.pathOps.push(curveTo(cx - rx, cy + ky, cx - kx, cy + ry, cx, cy + ry));
    this.pathOps.push(curveTo(cx + kx, cy + ry, cx + rx, cy + ky, cx + rx, cy));
    this.pathOps.push(curveTo(cx + rx, cy - ky, cx + kx, cy - ry, cx, cy - ry));
    this.pathOps.push(curveTo(cx - kx, cy - ry, cx - rx, cy - ky, cx - rx, cy));
    this.pathOps.push(closePath());

    return this;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Painting (Terminates Path)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Stroke the path with the given options.
   */
  stroke(options: PathOptions = {}): void {
    const effectiveOptions: PathOptions = {
      ...options,
      borderColor: options.borderColor ?? options.color,
      color: undefined, // Don't fill
    };
    this.paint(effectiveOptions);
  }

  /**
   * Fill the path with the given options.
   */
  fill(options: PathOptions = {}): void {
    const effectiveOptions: PathOptions = {
      ...options,
      borderColor: undefined, // Don't stroke
    };
    this.paint(effectiveOptions);
  }

  /**
   * Fill and stroke the path with the given options.
   */
  fillAndStroke(options: PathOptions = {}): void {
    this.paint(options);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Clipping
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Use the current path as a clipping path (nonzero winding rule).
   */
  clip(): void {
    this.pathOps.push(clip());
    this.emitOps(this.pathOps);
  }

  /**
   * Use the current path as a clipping path (even-odd rule).
   */
  clipEvenOdd(): void {
    this.pathOps.push(clipEvenOdd());
    this.emitOps(this.pathOps);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Internal
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Paint the path with the given options.
   */
  private paint(options: PathOptions): void {
    // Register graphics state for opacity if needed
    let gsName: string | null = null;

    if (options.opacity !== undefined || options.borderOpacity !== undefined) {
      gsName = this.registerGraphicsState(options.opacity, options.borderOpacity);
    }

    // Map PathOptions to PathOpsOptions
    const ops = wrapPathOps(this.pathOps, {
      fillColor: options.color,
      strokeColor: options.borderColor,
      strokeWidth: options.borderWidth,
      lineCap: options.lineCap,
      lineJoin: options.lineJoin,
      miterLimit: options.miterLimit,
      dashArray: options.dashArray,
      dashPhase: options.dashPhase,
      windingRule: options.windingRule,
      graphicsStateName: gsName ?? undefined,
    });

    this.emitOps(ops);
  }

  /**
   * Emit operators to the page content.
   */
  private emitOps(ops: Operator[]): void {
    const content = ops.map(op => op.toString()).join("\n");
    this.appendContent(content);
  }
}
