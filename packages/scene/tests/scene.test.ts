import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Scene } from '../sources/scene';
import { Layer } from '@gacha-game-template/layer';

// Mock the Layer class completely
vi.mock('@gacha-game-template/layer', () => {
  return {
    Layer: vi.fn(() => ({
      render: vi.fn(),
      setRenderLogic: vi.fn()
    }))
  };
});

// Concrete test implementation of abstract Scene class
class TestScene extends Scene {}

describe('Scene', () => {
  let scene: TestScene;

  beforeEach(() => {
    scene = new TestScene();
    vi.clearAllMocks();
  });

  describe('TR-2.1: addLayer and render loop verification', () => {
    it('should call render on all added layers with correct deltaTime', () => {
      // Create two mocked Layer instances
      const mockLayer1 = new Layer(document.createElement('canvas'));
      const mockLayer2 = new Layer(document.createElement('canvas'));

      // Add layers to scene
      scene.addLayer(mockLayer1);
      scene.addLayer(mockLayer2);

      // Call render with deltaTime of 16
      scene.render(16);

      // Verify both layers' render methods were called exactly once with deltaTime 16
      expect(mockLayer1.render).toHaveBeenCalledTimes(1);
      expect(mockLayer1.render).toHaveBeenCalledWith(16);

      expect(mockLayer2.render).toHaveBeenCalledTimes(1);
      expect(mockLayer2.render).toHaveBeenCalledWith(16);
    });

    it('should render layers in the order they were added', () => {
      const mockLayer1 = new Layer(document.createElement('canvas'));
      const mockLayer2 = new Layer(document.createElement('canvas'));
      const mockLayer3 = new Layer(document.createElement('canvas'));

      const callOrder: number[] = [];

      // Track call order
      vi.mocked(mockLayer1.render).mockImplementation(() => callOrder.push(1));
      vi.mocked(mockLayer2.render).mockImplementation(() => callOrder.push(2));
      vi.mocked(mockLayer3.render).mockImplementation(() => callOrder.push(3));

      scene.addLayer(mockLayer1);
      scene.addLayer(mockLayer2);
      scene.addLayer(mockLayer3);

      scene.render(16);

      // Verify rendering order matches addition order
      expect(callOrder).toEqual([1, 2, 3]);
    });
  });

  describe('TR-2.2: Empty scene rendering verification', () => {
    it('should not throw error when rendering a scene with no layers', () => {
      // Scene has no layers added
      expect(() => scene.render(16)).not.toThrow();
    });

    it('should handle multiple render calls on empty scene', () => {
      expect(() => {
        scene.render(16);
        scene.render(32);
        scene.render(8);
      }).not.toThrow();
    });
  });

  describe('TR-2.3: removeLayer verification', () => {
    it('should not call render on removed layer', () => {
      const mockLayer1 = new Layer(document.createElement('canvas'));
      const mockLayer2 = new Layer(document.createElement('canvas'));

      // Add both layers
      scene.addLayer(mockLayer1);
      scene.addLayer(mockLayer2);

      // Remove first layer
      scene.removeLayer(mockLayer1);

      // Render the scene
      scene.render(16);

      // Verify mockLayer1 was NOT called
      expect(mockLayer1.render).not.toHaveBeenCalled();

      // Verify mockLayer2 was called exactly once
      expect(mockLayer2.render).toHaveBeenCalledTimes(1);
      expect(mockLayer2.render).toHaveBeenCalledWith(16);
    });

    it('should handle removing non-existent layer gracefully', () => {
      const mockLayer1 = new Layer(document.createElement('canvas'));
      const mockLayer2 = new Layer(document.createElement('canvas'));

      scene.addLayer(mockLayer1);

      // Try to remove a layer that was never added
      expect(() => scene.removeLayer(mockLayer2)).not.toThrow();

      // Verify original layer is still there
      scene.render(16);
      expect(mockLayer1.render).toHaveBeenCalledTimes(1);
    });

    it('should handle removing the same layer multiple times', () => {
      const mockLayer1 = new Layer(document.createElement('canvas'));

      scene.addLayer(mockLayer1);
      scene.removeLayer(mockLayer1);

      // Try removing again
      expect(() => scene.removeLayer(mockLayer1)).not.toThrow();

      scene.render(16);
      expect(mockLayer1.render).not.toHaveBeenCalled();
    });

    it('should be able to remove all layers', () => {
      const mockLayer1 = new Layer(document.createElement('canvas'));
      const mockLayer2 = new Layer(document.createElement('canvas'));

      scene.addLayer(mockLayer1);
      scene.addLayer(mockLayer2);

      scene.removeLayer(mockLayer1);
      scene.removeLayer(mockLayer2);

      // Should behave like empty scene
      expect(() => scene.render(16)).not.toThrow();
      expect(mockLayer1.render).not.toHaveBeenCalled();
      expect(mockLayer2.render).not.toHaveBeenCalled();
    });
  });

  describe('Additional Scene behavior tests', () => {
    it('should allow adding the same layer instance multiple times', () => {
      const mockLayer = new Layer(document.createElement('canvas'));

      scene.addLayer(mockLayer);
      scene.addLayer(mockLayer);

      scene.render(16);

      // Layer should be rendered twice if added twice
      expect(mockLayer.render).toHaveBeenCalledTimes(2);
    });

    it('should support dynamic layer management during game loop', () => {
      const mockLayer1 = new Layer(document.createElement('canvas'));
      const mockLayer2 = new Layer(document.createElement('canvas'));

      scene.addLayer(mockLayer1);
      scene.render(16);
      expect(mockLayer1.render).toHaveBeenCalledTimes(1);

      scene.addLayer(mockLayer2);
      scene.render(16);
      expect(mockLayer1.render).toHaveBeenCalledTimes(2);
      expect(mockLayer2.render).toHaveBeenCalledTimes(1);

      scene.removeLayer(mockLayer1);
      scene.render(16);
      expect(mockLayer1.render).toHaveBeenCalledTimes(2); // Still 2, not called again
      expect(mockLayer2.render).toHaveBeenCalledTimes(2);
    });
  });
});
