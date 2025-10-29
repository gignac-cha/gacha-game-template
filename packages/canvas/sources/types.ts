import { z } from 'zod';

/**
 * Represents a 2D point with x and y coordinates
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Represents dimensions with width and height
 */
export interface Size {
  width: number;
  height: number;
}

/**
 * Represents a 2D vector with delta x and delta y
 */
export interface Vector {
  dx: number;
  dy: number;
}

/**
 * Drawing options for styling canvas operations
 */
export interface DrawingOptions {
  /** Fill color (e.g., '#FF0000', 'red', 'rgba(255, 0, 0, 0.5)') */
  fill?: string;
  /** Stroke color */
  stroke?: string;
  /** Line width for strokes */
  lineWidth?: number;
  /** Font specification for text (e.g., '16px Arial') */
  font?: string;
  /** Text alignment */
  textAlign?: CanvasTextAlign;
  /** Text baseline */
  textBaseline?: CanvasTextBaseline;
  /** Line cap style */
  lineCap?: CanvasLineCap;
  /** Line join style */
  lineJoin?: CanvasLineJoin;
}

/**
 * Zod schema for validating DrawingOptions at runtime
 */
export const DrawingOptionsSchema = z.object({
  fill: z.string().optional(),
  stroke: z.string().optional(),
  lineWidth: z.number().positive().optional(),
  font: z.string().optional(),
  textAlign: z.enum(['start', 'end', 'left', 'right', 'center']).optional(),
  textBaseline: z.enum(['top', 'hanging', 'middle', 'alphabetic', 'ideographic', 'bottom']).optional(),
  lineCap: z.enum(['butt', 'round', 'square']).optional(),
  lineJoin: z.enum(['bevel', 'round', 'miter']).optional(),
}).strict();
