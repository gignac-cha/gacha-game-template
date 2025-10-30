import type { Point, Size, DrawingOptions } from './types';
import { DrawingOptionsSchema } from './types';

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
   * Clear the entire canvas
   */
  clear(): void;
  /**
   * Clear a specific rectangular area of the canvas
   */
  clear(x: number, y: number, width: number, height: number): void;
  /**
   * Clear a specific rectangular area using Point and Size objects
   */
  clear(topLeft: Point, size: Size): void;
  clear(topLeftOrX?: Point | number, sizeOrY?: Size | number, width?: number, height?: number): void {
    if (topLeftOrX === undefined) {
      // No arguments - clear entire canvas
      this.context.clearRect(0, 0, this.element.width, this.element.height);
    } else if (typeof topLeftOrX === 'number') {
      // number overload - x, y, width, height
      if (sizeOrY === undefined || width === undefined || height === undefined) {
        throw new Error('When clearing with coordinates, all parameters (x, y, width, height) are required');
      }
      this.context.clearRect(topLeftOrX, sizeOrY as number, width, height);
    } else {
      // Point + Size overload
      if (!sizeOrY || typeof sizeOrY === 'number') {
        throw new Error('When clearing with Point, Size object is required');
      }
      this.context.clearRect(topLeftOrX.x, topLeftOrX.y, (sizeOrY as Size).width, (sizeOrY as Size).height);
    }
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

  /**
   * Apply drawing options to the context with runtime validation
   */
  private _applyOptions(ctx: CanvasRenderingContext2D, options?: DrawingOptions): void {
    if (!options) return;

    // Runtime validation with zod
    DrawingOptionsSchema.parse(options);

    if (options.fill !== undefined) ctx.fillStyle = options.fill;
    if (options.stroke !== undefined) ctx.strokeStyle = options.stroke;
    if (options.lineWidth !== undefined) ctx.lineWidth = options.lineWidth;
    if (options.font !== undefined) ctx.font = options.font;
    if (options.textAlign !== undefined) ctx.textAlign = options.textAlign;
    if (options.textBaseline !== undefined) ctx.textBaseline = options.textBaseline;
    if (options.lineCap !== undefined) ctx.lineCap = options.lineCap;
    if (options.lineJoin !== undefined) ctx.lineJoin = options.lineJoin;
  }

  // ========== Dot Methods ==========

  /**
   * Draw a dot at the specified point
   */
  dot(point: Point, options?: DrawingOptions): void;
  /**
   * Draw a dot at the specified coordinates
   */
  dot(x: number, y: number, options?: DrawingOptions): void;
  dot(pointOrX: Point | number, yOrOptions?: number | DrawingOptions, options?: DrawingOptions): void {
    let x: number, y: number, finalOptions: DrawingOptions | undefined;

    if (typeof pointOrX === 'number') {
      // number overload
      x = pointOrX;
      y = yOrOptions as number;
      finalOptions = options;
    } else {
      // Point overload
      x = pointOrX.x;
      y = pointOrX.y;
      finalOptions = yOrOptions as DrawingOptions | undefined;
    }

    this._draw((ctx) => {
      this._applyOptions(ctx, finalOptions);

      if (finalOptions?.fill) {
        ctx.fillRect(x, y, 1, 1);
      } else {
        // Default to fill if no options specified
        ctx.fillRect(x, y, 1, 1);
      }
    });
  }

  // ========== Line Methods ==========

  /**
   * Draw a line between two points
   */
  line(start: Point, end: Point, options?: DrawingOptions): void;
  /**
   * Draw a line between two coordinate pairs
   */
  line(x1: number, y1: number, x2: number, y2: number, options?: DrawingOptions): void;
  line(startOrX1: Point | number, endOrY1: Point | number, x2OrOptions?: number | DrawingOptions, y2OrOptions?: number | DrawingOptions, options?: DrawingOptions): void {
    let x1: number, y1: number, finalX2: number, finalY2: number, finalOptions: DrawingOptions | undefined;

    if (typeof startOrX1 === 'number') {
      // number overload
      x1 = startOrX1;
      y1 = endOrY1 as number;
      finalX2 = x2OrOptions as number;
      finalY2 = y2OrOptions as number;
      finalOptions = options;
    } else {
      // Point overload
      x1 = startOrX1.x;
      y1 = startOrX1.y;
      finalX2 = (endOrY1 as Point).x;
      finalY2 = (endOrY1 as Point).y;
      finalOptions = x2OrOptions as DrawingOptions | undefined;
    }

    this._draw((ctx) => {
      this._applyOptions(ctx, finalOptions);
      ctx.moveTo(x1, y1);
      ctx.lineTo(finalX2, finalY2);
      ctx.stroke();
    });
  }

  // ========== Lines (Polyline) Methods ==========

  /**
   * Draw a series of connected lines through multiple points
   */
  lines(points: Point[], options?: DrawingOptions): void {
    if (points.length < 2) return;

    this._draw((ctx) => {
      this._applyOptions(ctx, options);
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
  rectangle(topLeft: Point, size: Size, options?: DrawingOptions): void;
  /**
   * Draw a rectangle with specified coordinates and dimensions
   */
  rectangle(x: number, y: number, width: number, height: number, options?: DrawingOptions): void;
  rectangle(topLeftOrX: Point | number, sizeOrY: Size | number, widthOrOptions?: number | DrawingOptions, heightOrOptions?: number | DrawingOptions, options?: DrawingOptions): void {
    let x: number, y: number, w: number, h: number, finalOptions: DrawingOptions | undefined;

    if (typeof topLeftOrX === 'number') {
      // number overload
      x = topLeftOrX;
      y = sizeOrY as number;
      w = widthOrOptions as number;
      h = heightOrOptions as number;
      finalOptions = options;
    } else {
      // Point + Size overload
      x = topLeftOrX.x;
      y = topLeftOrX.y;
      w = (sizeOrY as Size).width;
      h = (sizeOrY as Size).height;
      finalOptions = widthOrOptions as DrawingOptions | undefined;
    }

    this._draw((ctx) => {
      this._applyOptions(ctx, finalOptions);

      if (finalOptions?.fill) {
        ctx.fillRect(x, y, w, h);
      }
      if (finalOptions?.stroke || finalOptions?.lineWidth !== undefined) {
        ctx.strokeRect(x, y, w, h);
      }
      // Default to stroke if no options specified
      if (!finalOptions?.fill && !finalOptions?.stroke && finalOptions?.lineWidth === undefined) {
        ctx.strokeRect(x, y, w, h);
      }
    });
  }

  // ========== Circle Methods ==========

  /**
   * Draw a circle with specified center point and radius
   */
  circle(center: Point, radius: number, options?: DrawingOptions): void;
  /**
   * Draw a circle with specified center coordinates and radius
   */
  circle(x: number, y: number, radius: number, options?: DrawingOptions): void;
  circle(centerOrX: Point | number, radiusOrY: number, radiusOrOptions?: number | DrawingOptions, options?: DrawingOptions): void {
    let x: number, y: number, r: number, finalOptions: DrawingOptions | undefined;

    if (typeof centerOrX === 'number') {
      // number overload
      x = centerOrX;
      y = radiusOrY;
      r = radiusOrOptions as number;
      finalOptions = options;
    } else {
      // Point overload
      x = centerOrX.x;
      y = centerOrX.y;
      r = radiusOrY;
      finalOptions = radiusOrOptions as DrawingOptions | undefined;
    }

    this._draw((ctx) => {
      this._applyOptions(ctx, finalOptions);
      ctx.arc(x, y, r, 0, Math.PI * 2);

      if (finalOptions?.fill) {
        ctx.fill();
      }
      if (finalOptions?.stroke || finalOptions?.lineWidth !== undefined) {
        ctx.stroke();
      }
      // Default to stroke if no options specified
      if (!finalOptions?.fill && !finalOptions?.stroke && finalOptions?.lineWidth === undefined) {
        ctx.stroke();
      }
    });
  }

  // ========== Text Methods ==========

  /**
   * Draw text at the specified position
   */
  text(content: string, position: Point, options?: DrawingOptions): void;
  /**
   * Draw text at the specified coordinates
   */
  text(content: string, x: number, y: number, options?: DrawingOptions): void;
  text(content: string, positionOrX: Point | number, yOrOptions?: number | DrawingOptions, options?: DrawingOptions): void {
    let x: number, y: number, finalOptions: DrawingOptions | undefined;

    if (typeof positionOrX === 'number') {
      // number overload
      x = positionOrX;
      y = yOrOptions as number;
      finalOptions = options;
    } else {
      // Point overload
      x = positionOrX.x;
      y = positionOrX.y;
      finalOptions = yOrOptions as DrawingOptions | undefined;
    }

    this._draw((ctx) => {
      this._applyOptions(ctx, finalOptions);

      // Default to fill for text
      ctx.fillText(content, x, y);

      if (finalOptions?.stroke || finalOptions?.lineWidth !== undefined) {
        ctx.strokeText(content, x, y);
      }
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
    let x: number, finalY: number;

    if (typeof positionOrX === 'number') {
      // number overload - y must be defined
      if (y === undefined) {
        throw new Error('y coordinate is required when x is a number');
      }
      x = positionOrX;
      finalY = y;
    } else {
      // Point overload
      x = positionOrX.x;
      finalY = positionOrX.y;
    }

    this._draw((ctx) => {
      ctx.drawImage(image, x, finalY);
    });
  }
}
