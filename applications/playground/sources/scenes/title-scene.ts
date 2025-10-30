import { Scene } from '@gacha-game-template/scene';
import { BackgroundLayer } from '../layers/background-layer.js';
import { InterfaceLayer } from '../layers/interface-layer.js';
import { EffectLayer } from '../layers/effect-layer.js';

/**
 * TitleScene - Title screen with "Click to Start" prompt
 */
export class TitleScene extends Scene {
  constructor(rootElement: HTMLElement) {
    super();

    // Create canvas elements for each layer
    const backgroundCanvas = document.createElement('canvas');
    const interfaceCanvas = document.createElement('canvas');
    const effectCanvas = document.createElement('canvas');

    // Set canvas dimensions to match viewport
    const width = window.innerWidth;
    const height = window.innerHeight;
    [backgroundCanvas, interfaceCanvas, effectCanvas].forEach((canvas) => {
      canvas.width = width;
      canvas.height = height;
      rootElement.appendChild(canvas);
    });

    // Create and configure layers
    const backgroundLayer = new BackgroundLayer(backgroundCanvas);
    const interfaceLayer = new InterfaceLayer(interfaceCanvas);
    const effectLayer = new EffectLayer(effectCanvas);

    // Inject render logic for BackgroundLayer - solid blue background
    backgroundLayer.setRenderLogic((canvas) => {
      canvas.clear();
      canvas.rectangle(0, 0, width, height, { fill: 'blue' });
    });

    // Inject render logic for InterfaceLayer - title and instruction text
    interfaceLayer.setRenderLogic((canvas) => {
      canvas.clear();
      // Title text
      canvas.text('Title Screen', width / 2, height / 2 - 50, {
        fill: 'white',
        font: 'bold 48px Arial',
        textAlign: 'center',
        textBaseline: 'middle',
      });
      // Instruction text
      canvas.text('Click to Start', width / 2, height / 2 + 50, {
        fill: 'white',
        font: '24px Arial',
        textAlign: 'center',
        textBaseline: 'middle',
      });
    });

    // Inject render logic for EffectLayer - empty (no effects for now)
    effectLayer.setRenderLogic(() => {
      // Empty - no effects
    });

    // Add layers to scene (rendering order)
    this.addLayer(backgroundLayer);
    this.addLayer(interfaceLayer);
    this.addLayer(effectLayer);
  }
}
