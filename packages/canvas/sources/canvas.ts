import type { Point, Size } from './types';

/**
 * Canvas class wraps HTMLCanvasElement and provides a flexible, overloaded API
 * for 2D rendering operations.
 */
export class Canvas {
  private context: CanvasRenderingContext2D;

  constructor(public element: HTMLCanvasElement) {
    const ctx = element.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D rendering context. Canvas may already be using a different context type.');
    }
    this.context = ctx;
  }

  /**
   * Private wrapper that ensures all drawing operations are isolated
   * by saving/restoring the canvas state and beginning a new path.
   */
  private _draw(drawingFunction: (context: CanvasRenderingContext2D) => void): void {
    this.context.save();
    this.context.beginPath();
    drawingFunction(this.context);
    this.context.restore();
  }

  // ========== Dot Methods ==========

  /**
   * Draw a dot at the specified point
   */
  dot(point: Point): void;
  /**
   * Draw a dot at the specified coordinates
   */
  dot(x: number, y: number): void;
  dot(pointOrX: Point | number, y?: number): void {
    const x = typeof pointOrX === 'number' ? pointOrX : pointOrX.x;
    const finalY = typeof pointOrX === 'number' ? y! : pointOrX.y;

    this._draw((ctx) => {
      ctx.fillRect(x, finalY, 1, 1);
    });
  }

  // ========== Line Methods ==========

  /**
   * Draw a line between two points
   */
  line(start: Point, end: Point): void;
  /**
   * Draw a line between two coordinate pairs
   */
  line(x1: number, y1: number, x2: number, y2: number): void;
  line(startOrX1: Point | number, endOrY1: Point | number, x2?: number, y2?: number): void {
    let x1: number, y1: number, finalX2: number, finalY2: number;

    if (typeof startOrX1 === 'number') {
      // number overload
      x1 = startOrX1;
      y1 = endOrY1 as number;
      finalX2 = x2!;
      finalY2 = y2!;
    } else {
      // Point overload
      x1 = startOrX1.x;
      y1 = startOrX1.y;
      finalX2 = (endOrY1 as Point).x;
      finalY2 = (endOrY1 as Point).y;
    }

    this._draw((ctx) => {
      ctx.moveTo(x1, y1);
      ctx.lineTo(finalX2, finalY2);
      ctx.stroke();
    });
  }

  // ========== Lines (Polyline) Methods ==========

  /**
   * Draw a series of connected lines through multiple points
   */
  lines(points: Point[]): void {
    if (points.length < 2) return;

    this._draw((ctx) => {
      ctx.moveTo(points[0].x, points[0].y);

      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }

      ctx.stroke();
    });
  }

  // ========== Rectangle Methods ==========

  /**
   * Draw a rectangle with specified top-left corner and size
   */
  rectangle(topLeft: Point, size: Size): void;
  /**
   * Draw a rectangle with specified coordinates and dimensions
   */
  rectangle(x: number, y: number, width: number, height: number): void;
  rectangle(topLeftOrX: Point | number, sizeOrY: Size | number, width?: number, height?: number): void {
    let x: number, y: number, w: number, h: number;

    if (typeof topLeftOrX === 'number') {
      // number overload
      x = topLeftOrX;
      y = sizeOrY as number;
      w = width!;
      h = height!;
    } else {
      // Point + Size overload
      x = topLeftOrX.x;
      y = topLeftOrX.y;
      w = (sizeOrY as Size).width;
      h = (sizeOrY as Size).height;
    }

    this._draw((ctx) => {
      ctx.strokeRect(x, y, w, h);
    });
  }

  // ========== Circle Methods ==========

  /**
   * Draw a circle with specified center point and radius
   */
  circle(center: Point, radius: number): void;
  /**
   * Draw a circle with specified center coordinates and radius
   */
  circle(x: number, y: number, radius: number): void;
  circle(centerOrX: Point | number, radiusOrY: number, radius?: number): void {
    let x: number, y: number, r: number;

    if (typeof centerOrX === 'number') {
      // number overload
      x = centerOrX;
      y = radiusOrY;
      r = radius!;
    } else {
      // Point overload
      x = centerOrX.x;
      y = centerOrX.y;
      r = radiusOrY;
    }

    this._draw((ctx) => {
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();
    });
  }

  // ========== Text Methods ==========

  /**
   * Draw text at the specified position
   */
  text(content: string, position: Point, options?: { [key: string]: any }): void;
  /**
   * Draw text at the specified coordinates
   */
  text(content: string, x: number, y: number, options?: { [key: string]: any }): void;
  text(content: string, positionOrX: Point | number, yOrOptions?: number | { [key: string]: any }, options?: { [key: string]: any }): void {
    let x: number, y: number, finalOptions: { [key: string]: any } | undefined;

    if (typeof positionOrX === 'number') {
      // number overload
      x = positionOrX;
      y = yOrOptions as number;
      finalOptions = options;
    } else {
      // Point overload
      x = positionOrX.x;
      y = positionOrX.y;
      finalOptions = yOrOptions as { [key: string]: any } | undefined;
    }

    this._draw((ctx) => {
      // Apply options if provided
      if (finalOptions) {
        if (finalOptions.font) ctx.font = finalOptions.font;
        if (finalOptions.textAlign) ctx.textAlign = finalOptions.textAlign;
        if (finalOptions.textBaseline) ctx.textBaseline = finalOptions.textBaseline;
        if (finalOptions.fillStyle) ctx.fillStyle = finalOptions.fillStyle;
      }

      ctx.fillText(content, x, y);
    });
  }

  // ========== Image Methods ==========

  /**
   * Draw an image at the specified position
   */
  image(image: HTMLImageElement, position: Point): void;
  /**
   * Draw an image at the specified coordinates
   */
  image(image: HTMLImageElement, x: number, y: number): void;
  image(image: HTMLImageElement, positionOrX: Point | number, y?: number): void {
    const x = typeof positionOrX === 'number' ? positionOrX : positionOrX.x;
    const finalY = typeof positionOrX === 'number' ? y! : positionOrX.y;

    this._draw((ctx) => {
      ctx.drawImage(image, x, finalY);
    });
  }
}
