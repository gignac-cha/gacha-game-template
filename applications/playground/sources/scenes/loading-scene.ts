import { Scene } from '@gacha-game-template/scene';
import { BackgroundLayer } from '../layers/background-layer.js';
import { LoadingLayer } from '../layers/loading-layer.js';

/**
 * LoadingScene - Initial loading screen shown for 5 seconds
 */
export class LoadingScene extends Scene {
  private elapsedTime = 0;

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

    // Inject render logic for BackgroundLayer - gradient background
    backgroundLayer.setRenderLogic((canvas) => {
      canvas.clear();
      // Dark blue to black gradient effect with rectangles
      for (let i = 0; i < 5; i++) {
        const alpha = 0.2 - i * 0.04;
        canvas.rectangle(0, (height / 5) * i, width, height / 5, {
          fill: `rgba(0, 20, 40, ${alpha})`,
        });
      }
      canvas.rectangle(0, 0, width, height, { fill: 'rgba(0, 10, 30, 0.8)' });
    });

    // Inject render logic for LoadingLayer - animated spinner and text
    loadingLayer.setRenderLogic((canvas, deltaTime) => {
      canvas.clear();
      this.elapsedTime += deltaTime;

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw spinning circles (loading spinner)
      const spinnerRadius = 50;
      const numCircles = 8;
      for (let i = 0; i < numCircles; i++) {
        const angle = (this.elapsedTime / 500 + (i / numCircles) * Math.PI * 2) % (Math.PI * 2);
        const x = centerX + Math.cos(angle) * spinnerRadius;
        const y = centerY + Math.sin(angle) * spinnerRadius;
        const opacity = 0.3 + (i / numCircles) * 0.7;

        canvas.circle(x, y, 8, { fill: `rgba(100, 180, 255, ${opacity})` });
      }

      // Draw "Loading..." text
      canvas.text('Loading...', centerX, centerY + 100, {
        fill: 'white',
        font: 'bold 32px Arial',
        textAlign: 'center',
        textBaseline: 'middle',
      });

      // Draw animated dots
      const dotCount = Math.floor((this.elapsedTime / 300) % 4);
      const dots = '.'.repeat(dotCount);
      canvas.text(dots, centerX + 90, centerY + 100, {
        fill: 'white',
        font: 'bold 32px Arial',
        textAlign: 'left',
        textBaseline: 'middle',
      });

      // Draw progress bar
      const progressWidth = 300;
      const progressHeight = 10;
      const progressX = centerX - progressWidth / 2;
      const progressY = centerY + 150;
      const progress = (this.elapsedTime % 5000) / 5000; // 5 second cycle

      // Progress bar background
      canvas.rectangle(progressX, progressY, progressWidth, progressHeight, {
        stroke: 'rgba(255, 255, 255, 0.3)',
        lineWidth: 2,
      });

      // Progress bar fill
      canvas.rectangle(progressX, progressY, progressWidth * progress, progressHeight, {
        fill: 'rgba(100, 180, 255, 0.8)',
      });
    });

    // Add layers to scene (rendering order)
    this.addLayer(backgroundLayer);
    this.addLayer(loadingLayer);
  }
}
