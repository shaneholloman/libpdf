/**
 * TextState - Tracks the text rendering state during content stream processing.
 *
 * This class maintains all the state variables needed to correctly position
 * and measure text during extraction. It follows the PDF specification for
 * text state parameters (Section 9.3).
 */

import type { PdfFont } from "#src/fonts/pdf-font";
import { Matrix } from "#src/helpers/matrix";

/**
 * Graphics state that can be saved/restored with q/Q operators.
 */
export interface GraphicsState {
  /** Current transformation matrix */
  ctm: Matrix;
  /** Text state parameters */
  textState: TextStateParams;
}

/**
 * Text-specific state parameters.
 */
export interface TextStateParams {
  /** Character spacing (Tc) - extra space after each character */
  charSpacing: number;
  /** Word spacing (Tw) - extra space after space characters */
  wordSpacing: number;
  /** Horizontal scaling (Tz) - percentage, 100 = normal */
  horizontalScale: number;
  /** Leading (TL) - vertical distance between baselines */
  leading: number;
  /** Text rise (Ts) - superscript/subscript offset */
  rise: number;
  /** Text rendering mode (Tr) - 0=fill, 1=stroke, etc. */
  renderMode: number;
}

/**
 * Tracks all text rendering state during content stream processing.
 */
export class TextState {
  /** Current transformation matrix (graphics state) */
  ctm: Matrix = Matrix.identity();

  /** Text matrix (Tm) - set by Tm operator, updated by text operations */
  tm: Matrix = Matrix.identity();

  /** Text line matrix (Tlm) - set at start of each line */
  tlm: Matrix = Matrix.identity();

  /** Current font (set by Tf operator) */
  font: PdfFont | null = null;

  /** Current font size in points (set by Tf operator) */
  fontSize: number = 0;

  /** Character spacing (Tc) */
  charSpacing: number = 0;

  /** Word spacing (Tw) */
  wordSpacing: number = 0;

  /** Horizontal scaling percentage (Tz) - 100 = normal */
  horizontalScale: number = 100;

  /** Leading (TL) - vertical distance between baselines */
  leading: number = 0;

  /** Text rise (Ts) - superscript/subscript offset */
  rise: number = 0;

  /** Text rendering mode (Tr) */
  renderMode: number = 0;

  /** Graphics state stack for q/Q operators */
  private graphicsStateStack: GraphicsState[] = [];

  /**
   * Get the current position in user space.
   * This applies the CTM to the text matrix position.
   */
  get position(): { x: number; y: number } {
    // Text position is at the origin of the text matrix
    // transformed by the CTM
    return this.ctm.transformPoint(this.tm.e, this.tm.f + this.rise);
  }

  /**
   * Get the effective font size accounting for text matrix and CTM scaling.
   */
  get effectiveFontSize(): number {
    // The effective font size considers the text matrix scaling
    // and the CTM scaling
    const tmScale = this.tm.getScaleY();
    const ctmScale = this.ctm.getScaleY();

    return Math.abs(this.fontSize * tmScale * ctmScale);
  }

  /**
   * Get the horizontal scale factor in user space.
   */
  get effectiveHorizontalScale(): number {
    return (this.horizontalScale / 100) * this.tm.getScaleX() * this.ctm.getScaleX();
  }

  /**
   * Begin text object (BT operator).
   * Resets text matrix and line matrix to identity.
   */
  beginText(): void {
    this.tm = Matrix.identity();
    this.tlm = Matrix.identity();
  }

  /**
   * End text object (ET operator).
   */
  endText(): void {
    // Text matrices become undefined outside text objects
    // but we keep them for simplicity
  }

  /**
   * Set text matrix (Tm operator).
   * Sets both tm and tlm to the specified matrix.
   */
  setTextMatrix(a: number, b: number, c: number, d: number, e: number, f: number): void {
    this.tm = new Matrix(a, b, c, d, e, f);
    this.tlm = this.tm.clone();
  }

  /**
   * Move to start of next line (Td operator).
   * Translates the text line matrix and sets text matrix to it.
   */
  moveTextPosition(tx: number, ty: number): void {
    this.tlm = this.tlm.translate(tx, ty);
    this.tm = this.tlm.clone();
  }

  /**
   * Move to start of next line and set leading (TD operator).
   * Same as: -ty TL tx ty Td
   */
  moveTextPositionAndSetLeading(tx: number, ty: number): void {
    this.leading = -ty;
    this.moveTextPosition(tx, ty);
  }

  /**
   * Move to start of next line (T* operator).
   * Uses the current leading value.
   */
  moveToNextLine(): void {
    this.moveTextPosition(0, -this.leading);
  }

  /**
   * Advance the text position after showing a character.
   *
   * @param width - Character width in glyph units (1000 = 1 em)
   * @param isSpace - Whether this is a space character (for word spacing)
   */
  advanceChar(width: number, isSpace: boolean): void {
    // Width is in glyph units (1000 = 1 em)
    // Convert to text space units
    const w0 = width / 1000;

    // Calculate horizontal displacement
    // tx = ((w0 - Tj/1000) * Tfs + Tc + Tw) * Th
    // Note: For text extraction, we don't have Tj adjustments here
    // Those are handled separately in TJ processing
    const tx =
      (w0 * this.fontSize + this.charSpacing + (isSpace ? this.wordSpacing : 0)) *
      (this.horizontalScale / 100);

    // Update text matrix (translate in text space)
    this.tm = this.tm.translate(tx, 0);
  }

  /**
   * Apply a TJ position adjustment.
   *
   * @param adjustment - Adjustment in thousandths of an em
   *                     Negative = move right, Positive = move left
   */
  applyTjAdjustment(adjustment: number): void {
    // Adjustment is in thousandths of em, negative = move right
    const tx = (-adjustment / 1000) * this.fontSize * (this.horizontalScale / 100);
    this.tm = this.tm.translate(tx, 0);
  }

  /**
   * Save graphics state (q operator).
   */
  saveGraphicsState(): void {
    this.graphicsStateStack.push({
      ctm: this.ctm.clone(),
      textState: {
        charSpacing: this.charSpacing,
        wordSpacing: this.wordSpacing,
        horizontalScale: this.horizontalScale,
        leading: this.leading,
        rise: this.rise,
        renderMode: this.renderMode,
      },
    });
  }

  /**
   * Restore graphics state (Q operator).
   */
  restoreGraphicsState(): void {
    const saved = this.graphicsStateStack.pop();

    if (saved) {
      this.ctm = saved.ctm;
      this.charSpacing = saved.textState.charSpacing;
      this.wordSpacing = saved.textState.wordSpacing;
      this.horizontalScale = saved.textState.horizontalScale;
      this.leading = saved.textState.leading;
      this.rise = saved.textState.rise;
      this.renderMode = saved.textState.renderMode;
    }
  }

  /**
   * Modify current transformation matrix (cm operator).
   * Prepends the given matrix to the CTM.
   */
  concatMatrix(a: number, b: number, c: number, d: number, e: number, f: number): void {
    const newMatrix = new Matrix(a, b, c, d, e, f);
    this.ctm = newMatrix.multiply(this.ctm);
  }

  /**
   * Calculate the bounding box for a character at the current position.
   *
   * @param width - Character width in glyph units (1000 = 1 em)
   * @returns Bounding box in user space
   */
  getCharBbox(width: number): {
    x: number;
    y: number;
    width: number;
    height: number;
    baseline: number;
  } {
    // Get font metrics - fall back to FontBBox if ascent/descent are 0 or missing
    let ascender = this.font?.descriptor?.ascent;
    let descender = this.font?.descriptor?.descent;

    // If ascent/descent are 0 or missing, try to derive from FontBBox
    // This is common for Type3 fonts and some poorly-formed PDFs
    if (!ascender && !descender && this.font?.descriptor?.fontBBox) {
      const bbox = this.font.descriptor.fontBBox;
      // FontBBox is [llx, lly, urx, ury] - ascent is ury, descent is lly
      ascender = bbox[3]; // ury
      descender = bbox[1]; // lly (typically negative or 0)
    }

    // Final fallback to reasonable defaults
    if (!ascender) {
      ascender = 800;
    }
    if (descender === undefined || descender === null) {
      descender = -200;
    }

    // Calculate glyph dimensions in scaled text space (after fontSize)
    // These are in "text rendering space" before Tm rotation/scaling
    const glyphWidthScaled = (width / 1000) * this.fontSize * (this.horizontalScale / 100);
    const glyphHeightScaled = ((ascender - descender) / 1000) * this.fontSize;
    const descenderScaled = (descender / 1000) * this.fontSize;

    // Current text position from Tm (translation component)
    const textX = this.tm.e;
    const textY = this.tm.f + this.rise;

    // Build the combined transformation matrix: CTM * Tm
    // This transforms from text rendering space to user space
    const combined = this.ctm.multiply(this.tm);

    // Transform baseline point to user space
    const baselinePoint = this.ctm.transformPoint(textX, textY);

    // Define glyph corners in text rendering space (relative to origin)
    // We'll compute positions relative to (0,0) then add the translation
    // Bottom-left of glyph is at (0, descender), top-right is at (width, ascender)
    const corners = [
      { x: 0, y: descenderScaled }, // bottom-left
      { x: glyphWidthScaled, y: descenderScaled }, // bottom-right
      { x: glyphWidthScaled, y: descenderScaled + glyphHeightScaled }, // top-right
      { x: 0, y: descenderScaled + glyphHeightScaled }, // top-left
    ];

    // Transform each corner through combined matrix (without translation, then add it)
    // The Tm translation (e, f) positions the glyph, but we already have the baseline point
    // We need to transform the glyph shape through the rotation/scale part of the matrix
    const transformedCorners = corners.map(corner => {
      // Transform the corner offset through Tm (rotation/scale only, no translation)
      // Then through CTM
      const tmRotated = {
        x: this.tm.a * corner.x + this.tm.c * corner.y,
        y: this.tm.b * corner.x + this.tm.d * corner.y,
      };
      // Now transform through CTM (rotation/scale only)
      return {
        x: baselinePoint.x + (this.ctm.a * tmRotated.x + this.ctm.c * tmRotated.y),
        y: baselinePoint.y + (this.ctm.b * tmRotated.x + this.ctm.d * tmRotated.y),
      };
    });

    // Compute axis-aligned bounding box from transformed corners
    const xs = transformedCorners.map(c => c.x);
    const ys = transformedCorners.map(c => c.y);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
      baseline: baselinePoint.y,
    };
  }

  /**
   * Clone the current text state.
   */
  clone(): TextState {
    const copy = new TextState();
    copy.ctm = this.ctm.clone();
    copy.tm = this.tm.clone();
    copy.tlm = this.tlm.clone();
    copy.font = this.font;
    copy.fontSize = this.fontSize;
    copy.charSpacing = this.charSpacing;
    copy.wordSpacing = this.wordSpacing;
    copy.horizontalScale = this.horizontalScale;
    copy.leading = this.leading;
    copy.rise = this.rise;
    copy.renderMode = this.renderMode;

    return copy;
  }
}
