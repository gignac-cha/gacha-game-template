import { Layer } from '@gacha-game-template/layer';

/**
 * Abstract base class for managing game scenes.
 *
 * Scene acts as a "Director" that:
 * 1. Owns a collection of Layer instances
 * 2. Orchestrates rendering by calling each layer's render method in order
 * 3. Does NOT inject render logic - that's the responsibility of concrete subclasses
 *
 * Concrete scene implementations (BattleScene, GachaScene, etc.) should extend
 * this class and inject appropriate render logic into their layers.
 */
export abstract class Scene {
  /**
   * Protected array of Layer instances.
   * Accessible to subclasses but not externally.
   * Rendering order matches the order layers were added.
   */
  protected readonly layers: Layer[] = [];

  /**
   * Adds a Layer instance to this scene.
   * Layers will be rendered in the order they are added.
   *
   * @param layer - The Layer instance to add
   */
  public addLayer(layer: Layer): void {
    this.layers.push(layer);
  }

  /**
   * Removes a Layer instance from this scene.
   *
   * @param layer - The Layer instance to remove
   */
  public removeLayer(layer: Layer): void {
    const index = this.layers.indexOf(layer);
    if (index > -1) {
      this.layers.splice(index, 1);
    }
  }

  /**
   * Main rendering loop called by the game loop.
   * Orchestrates rendering by calling render on each layer in sequence.
   *
   * @param deltaTime - Time elapsed since last frame in milliseconds
   */
  public render(deltaTime: number): void {
    for (const layer of this.layers) {
      layer.render(deltaTime);
    }
  }
}
