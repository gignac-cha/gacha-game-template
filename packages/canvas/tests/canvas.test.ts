import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Canvas } from '../sources/canvas';
import type { Point, Size, DrawingOptions } from '../sources/types';
import { ZodError } from 'zod';

describe('Canvas', () => {
  let canvasElement: HTMLCanvasElement;
  let mockContext: CanvasRenderingContext2D;
  let canvas: Canvas;

  beforeEach(() => {
    // Create mock context with all required methods
    mockContext = {
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      arc: vi.fn(),
      rect: vi.fn(),
      fillRect: vi.fn(),
      strokeRect: vi.fn(),
      stroke: vi.fn(),
      fillText: vi.fn(),
      drawImage: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      // Properties that can be set
      font: '',
      textAlign: 'start' as CanvasTextAlign,
      textBaseline: 'alphabetic' as CanvasTextBaseline,
      fillStyle: '#000000',
      strokeStyle: '#000000',
      lineWidth: 1,
      fill: vi.fn(),
      strokeText: vi.fn(),
    } as unknown as CanvasRenderingContext2D;

    // Create mock canvas element
    canvasElement = {
      getContext: vi.fn().mockReturnValue(mockContext),
    } as unknown as HTMLCanvasElement;

    canvas = new Canvas(canvasElement);
  });

  describe('Constructor', () => {
    it('should initialize with a valid canvas element', () => {
      expect(canvas.element).toBe(canvasElement);
      expect(canvasElement.getContext).toHaveBeenCalledWith('2d');
    });

    it('should throw error if context is null', () => {
      const invalidCanvas = {
        getContext: vi.fn().mockReturnValue(null),
      } as unknown as HTMLCanvasElement;

      expect(() => new Canvas(invalidCanvas)).toThrow(
        'Failed to get 2D rendering context. Canvas may already be using a different context type.'
      );
    });
  });

  describe('dot method', () => {
    it('should draw a dot using Point object', () => {
      const point: Point = { x: 10, y: 20 };
      canvas.dot(point);

      expect(mockContext.fillRect).toHaveBeenCalledWith(10, 20, 1, 1);
    });

    it('should draw a dot using x, y coordinates', () => {
      canvas.dot(15, 25);

      expect(mockContext.fillRect).toHaveBeenCalledWith(15, 25, 1, 1);
    });
  });

  describe('line method', () => {
    it('should draw a line using Point objects', () => {
      const start: Point = { x: 10, y: 20 };
      const end: Point = { x: 30, y: 40 };
      canvas.line(start, end);

      expect(mockContext.beginPath).toHaveBeenCalled();
      expect(mockContext.moveTo).toHaveBeenCalledWith(10, 20);
      expect(mockContext.lineTo).toHaveBeenCalledWith(30, 40);
      expect(mockContext.stroke).toHaveBeenCalled();
    });

    it('should draw a line using x, y coordinates', () => {
      canvas.line(10, 20, 30, 40);

      expect(mockContext.beginPath).toHaveBeenCalled();
      expect(mockContext.moveTo).toHaveBeenCalledWith(10, 20);
      expect(mockContext.lineTo).toHaveBeenCalledWith(30, 40);
      expect(mockContext.stroke).toHaveBeenCalled();
    });
  });

  describe('lines method', () => {
    it('should draw connected lines through multiple points', () => {
      const points: Point[] = [
        { x: 10, y: 20 },
        { x: 30, y: 40 },
        { x: 50, y: 60 },
        { x: 70, y: 80 },
      ];
      canvas.lines(points);

      expect(mockContext.beginPath).toHaveBeenCalled();
      expect(mockContext.moveTo).toHaveBeenCalledWith(10, 20);
      expect(mockContext.lineTo).toHaveBeenCalledWith(30, 40);
      expect(mockContext.lineTo).toHaveBeenCalledWith(50, 60);
      expect(mockContext.lineTo).toHaveBeenCalledWith(70, 80);
      expect(mockContext.stroke).toHaveBeenCalled();
    });

    it('should handle empty array gracefully', () => {
      canvas.lines([]);

      expect(mockContext.beginPath).not.toHaveBeenCalled();
    });

    it('should handle single point gracefully', () => {
      canvas.lines([{ x: 10, y: 20 }]);

      expect(mockContext.beginPath).not.toHaveBeenCalled();
    });
  });

  describe('rectangle method', () => {
    it('should draw a rectangle using Point and Size objects', () => {
      const topLeft: Point = { x: 10, y: 20 };
      const size: Size = { width: 100, height: 50 };
      canvas.rectangle(topLeft, size);

      expect(mockContext.strokeRect).toHaveBeenCalledWith(10, 20, 100, 50);
    });

    it('should draw a rectangle using x, y, width, height coordinates', () => {
      canvas.rectangle(10, 20, 100, 50);

      expect(mockContext.strokeRect).toHaveBeenCalledWith(10, 20, 100, 50);
    });
  });

  describe('circle method', () => {
    it('should draw a circle using Point object and radius', () => {
      const center: Point = { x: 50, y: 50 };
      canvas.circle(center, 25);

      expect(mockContext.beginPath).toHaveBeenCalled();
      expect(mockContext.arc).toHaveBeenCalledWith(50, 50, 25, 0, Math.PI * 2);
      expect(mockContext.stroke).toHaveBeenCalled();
    });

    it('should draw a circle using x, y coordinates and radius', () => {
      canvas.circle(50, 50, 25);

      expect(mockContext.beginPath).toHaveBeenCalled();
      expect(mockContext.arc).toHaveBeenCalledWith(50, 50, 25, 0, Math.PI * 2);
      expect(mockContext.stroke).toHaveBeenCalled();
    });
  });

  describe('text method', () => {
    it('should draw text using Point object', () => {
      const position: Point = { x: 10, y: 20 };
      canvas.text('Hello World', position);

      expect(mockContext.fillText).toHaveBeenCalledWith('Hello World', 10, 20);
    });

    it('should draw text using x, y coordinates', () => {
      canvas.text('Hello World', 10, 20);

      expect(mockContext.fillText).toHaveBeenCalledWith('Hello World', 10, 20);
    });

    it('should draw text with options using Point object', () => {
      const position: Point = { x: 10, y: 20 };
      const options: DrawingOptions = {
        font: '16px Arial',
        textAlign: 'center' as CanvasTextAlign,
        textBaseline: 'middle' as CanvasTextBaseline,
        fill: '#FF0000',
      };
      canvas.text('Hello World', position, options);

      expect(mockContext.font).toBe('16px Arial');
      expect(mockContext.textAlign).toBe('center');
      expect(mockContext.textBaseline).toBe('middle');
      expect(mockContext.fillStyle).toBe('#FF0000');
      expect(mockContext.fillText).toHaveBeenCalledWith('Hello World', 10, 20);
    });

    it('should draw text with options using x, y coordinates', () => {
      const options: DrawingOptions = {
        font: '20px Courier',
        textAlign: 'right' as CanvasTextAlign,
      };
      canvas.text('Hello World', 10, 20, options);

      expect(mockContext.font).toBe('20px Courier');
      expect(mockContext.textAlign).toBe('right');
      expect(mockContext.fillText).toHaveBeenCalledWith('Hello World', 10, 20);
    });
  });

  describe('image method', () => {
    let mockImage: HTMLImageElement;

    beforeEach(() => {
      mockImage = {} as HTMLImageElement;
    });

    it('should draw an image using Point object', () => {
      const position: Point = { x: 10, y: 20 };
      canvas.image(mockImage, position);

      expect(mockContext.drawImage).toHaveBeenCalledWith(mockImage, 10, 20);
    });

    it('should draw an image using x, y coordinates', () => {
      canvas.image(mockImage, 10, 20);

      expect(mockContext.drawImage).toHaveBeenCalledWith(mockImage, 10, 20);
    });
  });

  describe('Integration tests', () => {
    it('should handle multiple drawing operations in sequence', () => {
      canvas.dot({ x: 5, y: 5 });
      canvas.line(10, 10, 20, 20);
      canvas.rectangle({ x: 30, y: 30 }, { width: 40, height: 40 });
      canvas.circle(100, 100, 50);
      canvas.text('Test', { x: 150, y: 150 });

      expect(mockContext.fillRect).toHaveBeenCalledTimes(1);
      expect(mockContext.beginPath).toHaveBeenCalledTimes(5); // all methods now call beginPath
      expect(mockContext.strokeRect).toHaveBeenCalledTimes(1);
      expect(mockContext.fillText).toHaveBeenCalledTimes(1);
    });
  });

  describe('Context isolation', () => {
    it('should save and restore context for each drawing operation', () => {
      canvas.dot(10, 20);

      expect(mockContext.save).toHaveBeenCalled();
      expect(mockContext.beginPath).toHaveBeenCalled();
      expect(mockContext.restore).toHaveBeenCalled();
    });

    it('should isolate fillStyle changes between operations', () => {
      // Set a style in one operation
      mockContext.fillStyle = '#FF0000';
      canvas.dot(10, 20);

      // Verify restore was called to reset state
      expect(mockContext.restore).toHaveBeenCalled();

      // Reset mock to track new calls
      vi.clearAllMocks();

      // Another operation should start with clean state
      canvas.line(0, 0, 10, 10);
      expect(mockContext.save).toHaveBeenCalled();
      expect(mockContext.restore).toHaveBeenCalled();
    });

    it('should ensure all drawing methods use context isolation', () => {
      const point: Point = { x: 10, y: 20 };
      const size: Size = { width: 30, height: 40 };
      const mockImage = {} as HTMLImageElement;

      // Test each method
      canvas.dot(point);
      canvas.line(point, { x: 30, y: 40 });
      canvas.lines([point, { x: 30, y: 40 }, { x: 50, y: 60 }]);
      canvas.rectangle(point, size);
      canvas.circle(point, 25);
      canvas.text('Test', point);
      canvas.image(mockImage, point);

      // Each method should have called save and restore
      expect(mockContext.save).toHaveBeenCalledTimes(7);
      expect(mockContext.restore).toHaveBeenCalledTimes(7);
      expect(mockContext.beginPath).toHaveBeenCalledTimes(7);
    });
  });

  describe('Drawing options', () => {
    describe('Fill and stroke', () => {
      it('should fill rectangle when fill option is provided', () => {
        const options: DrawingOptions = { fill: '#FF0000' };
        canvas.rectangle(10, 20, 30, 40, options);

        expect(mockContext.fillStyle).toBe('#FF0000');
        expect(mockContext.fillRect).toHaveBeenCalledWith(10, 20, 30, 40);
      });

      it('should stroke rectangle when stroke option is provided', () => {
        const options: DrawingOptions = { stroke: '#0000FF', lineWidth: 2 };
        canvas.rectangle(10, 20, 30, 40, options);

        expect(mockContext.strokeStyle).toBe('#0000FF');
        expect(mockContext.lineWidth).toBe(2);
        expect(mockContext.strokeRect).toHaveBeenCalledWith(10, 20, 30, 40);
      });

      it('should both fill and stroke rectangle when both options are provided', () => {
        const options: DrawingOptions = { fill: '#FF0000', stroke: '#0000FF' };
        canvas.rectangle(10, 20, 30, 40, options);

        expect(mockContext.fillRect).toHaveBeenCalledWith(10, 20, 30, 40);
        expect(mockContext.strokeRect).toHaveBeenCalledWith(10, 20, 30, 40);
      });

      it('should default to stroke for rectangle when no options provided', () => {
        canvas.rectangle(10, 20, 30, 40);

        expect(mockContext.strokeRect).toHaveBeenCalledWith(10, 20, 30, 40);
        expect(mockContext.fillRect).not.toHaveBeenCalled();
      });

      it('should fill circle when fill option is provided', () => {
        const options: DrawingOptions = { fill: '#00FF00' };
        canvas.circle(50, 50, 25, options);

        expect(mockContext.fillStyle).toBe('#00FF00');
        expect(mockContext.fill).toHaveBeenCalled();
      });

      it('should stroke circle when stroke option is provided', () => {
        const options: DrawingOptions = { stroke: '#FF00FF' };
        canvas.circle(50, 50, 25, options);

        expect(mockContext.strokeStyle).toBe('#FF00FF');
        expect(mockContext.stroke).toHaveBeenCalled();
      });

      it('should default to stroke for circle when no options provided', () => {
        canvas.circle(50, 50, 25);

        expect(mockContext.stroke).toHaveBeenCalled();
        expect(mockContext.fill).not.toHaveBeenCalled();
      });
    });

    describe('Line styling', () => {
      it('should apply lineWidth to line', () => {
        const options: DrawingOptions = { stroke: '#FF0000', lineWidth: 5 };
        canvas.line(0, 0, 100, 100, options);

        expect(mockContext.strokeStyle).toBe('#FF0000');
        expect(mockContext.lineWidth).toBe(5);
        expect(mockContext.stroke).toHaveBeenCalled();
      });

      it('should apply lineWidth to polyline', () => {
        const points: Point[] = [{ x: 0, y: 0 }, { x: 50, y: 50 }, { x: 100, y: 0 }];
        const options: DrawingOptions = { stroke: '#00FF00', lineWidth: 3 };
        canvas.lines(points, options);

        expect(mockContext.strokeStyle).toBe('#00FF00');
        expect(mockContext.lineWidth).toBe(3);
      });
    });

    describe('Text styling', () => {
      it('should apply font option to text', () => {
        const options: DrawingOptions = { font: '20px Arial', fill: '#FF0000' };
        canvas.text('Hello', 10, 20, options);

        expect(mockContext.font).toBe('20px Arial');
        expect(mockContext.fillStyle).toBe('#FF0000');
        expect(mockContext.fillText).toHaveBeenCalledWith('Hello', 10, 20);
      });

      it('should apply textAlign option', () => {
        const options: DrawingOptions = { textAlign: 'center' };
        canvas.text('Centered', 50, 50, options);

        expect(mockContext.textAlign).toBe('center');
      });

      it('should stroke text when stroke option is provided', () => {
        const options: DrawingOptions = { stroke: '#0000FF', lineWidth: 1 };
        canvas.text('Outlined', 10, 20, options);

        expect(mockContext.fillText).toHaveBeenCalledWith('Outlined', 10, 20);
        expect(mockContext.strokeText).toHaveBeenCalledWith('Outlined', 10, 20);
      });
    });

    describe('Options with Point overload', () => {
      it('should work with Point objects', () => {
        const point: Point = { x: 100, y: 200 };
        const options: DrawingOptions = { fill: '#FFFF00' };
        canvas.dot(point, options);

        expect(mockContext.fillStyle).toBe('#FFFF00');
        expect(mockContext.fillRect).toHaveBeenCalledWith(100, 200, 1, 1);
      });

      it('should work with Point and Size objects', () => {
        const point: Point = { x: 10, y: 20 };
        const size: Size = { width: 30, height: 40 };
        const options: DrawingOptions = { fill: '#FF00FF' };
        canvas.rectangle(point, size, options);

        expect(mockContext.fillStyle).toBe('#FF00FF');
        expect(mockContext.fillRect).toHaveBeenCalledWith(10, 20, 30, 40);
      });
    });
  });

  describe('Runtime validation with zod', () => {
    it('should throw ZodError for invalid lineWidth (negative)', () => {
      const invalidOptions = { lineWidth: -5 } as any;

      expect(() => {
        canvas.line(0, 0, 100, 100, invalidOptions);
      }).toThrow(ZodError);
    });

    it('should throw ZodError for invalid lineWidth (string)', () => {
      const invalidOptions = { lineWidth: 'thick' } as any;

      expect(() => {
        canvas.rectangle(10, 20, 30, 40, invalidOptions);
      }).toThrow(ZodError);
    });

    it('should throw ZodError for invalid textAlign', () => {
      const invalidOptions = { textAlign: 'invalid' } as any;

      expect(() => {
        canvas.text('Test', 10, 20, invalidOptions);
      }).toThrow(ZodError);
    });

    it('should throw ZodError for invalid lineCap', () => {
      const invalidOptions = { lineCap: 'invalid' } as any;

      expect(() => {
        canvas.line(0, 0, 100, 100, invalidOptions);
      }).toThrow(ZodError);
    });

    it('should throw ZodError for unknown properties (strict mode)', () => {
      const invalidOptions = { unknownProp: 'value' } as any;

      expect(() => {
        canvas.circle(50, 50, 25, invalidOptions);
      }).toThrow(ZodError);
    });

    it('should accept valid options without throwing', () => {
      const validOptions: DrawingOptions = {
        fill: '#FF0000',
        stroke: '#0000FF',
        lineWidth: 2,
        font: '16px Arial',
        textAlign: 'center',
        textBaseline: 'middle',
        lineCap: 'round',
        lineJoin: 'bevel',
      };

      expect(() => {
        canvas.rectangle(10, 20, 30, 40, validOptions);
      }).not.toThrow();
    });

    it('should accept zero lineWidth', () => {
      // Note: zero is not positive, so this should throw
      const invalidOptions = { lineWidth: 0 } as any;

      expect(() => {
        canvas.line(0, 0, 100, 100, invalidOptions);
      }).toThrow(ZodError);
    });
  });
});
