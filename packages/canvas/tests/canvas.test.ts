import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Canvas } from '../sources/canvas';
import type { Point, Size } from '../sources/types';

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
      // Properties that can be set
      font: '',
      textAlign: 'start' as CanvasTextAlign,
      textBaseline: 'alphabetic' as CanvasTextBaseline,
      fillStyle: '#000000',
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
      const options = {
        font: '16px Arial',
        textAlign: 'center' as CanvasTextAlign,
        textBaseline: 'middle' as CanvasTextBaseline,
        fillStyle: '#FF0000',
      };
      canvas.text('Hello World', position, options);

      expect(mockContext.font).toBe('16px Arial');
      expect(mockContext.textAlign).toBe('center');
      expect(mockContext.textBaseline).toBe('middle');
      expect(mockContext.fillStyle).toBe('#FF0000');
      expect(mockContext.fillText).toHaveBeenCalledWith('Hello World', 10, 20);
    });

    it('should draw text with options using x, y coordinates', () => {
      const options = {
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
      expect(mockContext.beginPath).toHaveBeenCalledTimes(2); // line + circle
      expect(mockContext.strokeRect).toHaveBeenCalledTimes(1);
      expect(mockContext.fillText).toHaveBeenCalledTimes(1);
    });
  });
});
