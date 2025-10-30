import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Layer } from '../sources/layer';
import { Canvas } from '@gacha-game-template/canvas';

// Mock the Canvas class from @gacha-game-template/canvas
vi.mock('@gacha-game-template/canvas', () => ({
  Canvas: vi.fn()
}));

describe('Layer', () => {
  let mockCanvasElement: HTMLCanvasElement;
  let mockCanvasInstance: any;

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();

    // Create a mock canvas element
    mockCanvasElement = document.createElement('canvas');

    // Create a mock Canvas instance that will be returned by the constructor
    mockCanvasInstance = {};

    // Make the Canvas constructor return our mock instance
    (Canvas as any).mockImplementation(() => mockCanvasInstance);
  });

  describe('TR-2.1: Constructor validation', () => {
    it('should call Canvas constructor with the provided element exactly once', () => {
      new Layer(mockCanvasElement);

      expect(Canvas).toHaveBeenCalledTimes(1);
      expect(Canvas).toHaveBeenCalledWith(mockCanvasElement);
    });
  });

  describe('TR-2.2: Default rendering validation', () => {
    it('should not throw an error when render is called without setRenderLogic', () => {
      const layer = new Layer(mockCanvasElement);

      expect(() => {
        layer.render(16);
      }).not.toThrow();
    });
  });

  describe('TR-2.3 & TR-2.4: Logic injection and execution validation', () => {
    it('should call the injected render logic with correct arguments', () => {
      const layer = new Layer(mockCanvasElement);
      const mockRenderLogic = vi.fn();

      layer.setRenderLogic(mockRenderLogic);
      layer.render(16);

      // TR-2.4.1: Verify mockRenderLogic was called exactly once
      expect(mockRenderLogic).toHaveBeenCalledTimes(1);

      // TR-2.4.2 & TR-2.4.3: Verify it was called with the mocked canvas instance and deltaTime
      expect(mockRenderLogic).toHaveBeenCalledWith(mockCanvasInstance, 16);
    });

    it('should allow changing render logic multiple times', () => {
      const layer = new Layer(mockCanvasElement);
      const firstLogic = vi.fn();
      const secondLogic = vi.fn();

      layer.setRenderLogic(firstLogic);
      layer.render(10);

      expect(firstLogic).toHaveBeenCalledTimes(1);
      expect(secondLogic).not.toHaveBeenCalled();

      layer.setRenderLogic(secondLogic);
      layer.render(20);

      expect(firstLogic).toHaveBeenCalledTimes(1); // Still 1, not called again
      expect(secondLogic).toHaveBeenCalledTimes(1);
      expect(secondLogic).toHaveBeenCalledWith(mockCanvasInstance, 20);
    });
  });
});
