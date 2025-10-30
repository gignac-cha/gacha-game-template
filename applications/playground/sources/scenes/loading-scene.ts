import { Scene } from '@gacha-game-template/scene';
import { BackgroundLayer } from '../layers/background-layer.js';
import { LoadingLayer } from '../layers/loading-layer.js';

/**
 * LoadingScene - Initial loading screen shown for 5 seconds
 */
export class LoadingScene extends Scene {
  constructor(rootElement: HTMLElement) {
    super();

    // Create canvas elements for each layer
    const backgroundCanvas = document.createElement('canvas');
    const loadingCanvas = document.createElement('canvas');

    // Set canvas dimensions to match viewport
    const width = window.innerWidth;
    const height = window.innerHeight;
    [backgroundCanvas, loadingCanvas].forEach((canvas) => {
      canvas.width = width;
      canvas.height = height;
      rootElement.appendChild(canvas);
    });

    // Create and configure layers
    const backgroundLayer = new BackgroundLayer(backgroundCanvas);
    const loadingLayer = new LoadingLayer(loadingCanvas);

    // Inject render logic for BackgroundLayer - solid black background
    backgroundLayer.setRenderLogic((canvas) => {
      canvas.clear();
      canvas.rectangle(0, 0, width, height, { fill: 'black' });
    });

    // Inject render logic for LoadingLayer - "Loading..." text
    loadingLayer.setRenderLogic((canvas) => {
      canvas.clear();
      canvas.text('Loading...', width / 2, height / 2, {
        fill: 'white',
        font: '32px Arial',
        textAlign: 'center',
        textBaseline: 'middle',
      });
    });

    // Add layers to scene (rendering order)
    this.addLayer(backgroundLayer);
    this.addLayer(loadingLayer);
  }
}
