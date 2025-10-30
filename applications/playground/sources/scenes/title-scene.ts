import { Scene } from '@gacha-game-template/scene';
import { BackgroundLayer } from '../layers/background-layer.js';
import { InterfaceLayer } from '../layers/interface-layer.js';
import { EffectLayer } from '../layers/effect-layer.js';

/**
 * TitleScene - Title screen with "Click to Start" prompt
 */
export class TitleScene extends Scene {
  private elapsedTime = 0;
  private stars: Array<{ x: number; y: number; size: number; speed: number }> = [];

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

    // Generate random stars
    for (let i = 0; i < 50; i++) {
      this.stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.5 + 0.2,
      });
    }

    // Create and configure layers
    const backgroundLayer = new BackgroundLayer(backgroundCanvas);
    const interfaceLayer = new InterfaceLayer(interfaceCanvas);
    const effectLayer = new EffectLayer(effectCanvas);

    // Inject render logic for BackgroundLayer - gradient blue background
    backgroundLayer.setRenderLogic((canvas) => {
      canvas.clear();
      // Gradient effect with rectangles (dark blue to lighter blue)
      for (let i = 0; i < 10; i++) {
        const blueValue = 20 + i * 15;
        canvas.rectangle(0, (height / 10) * i, width, height / 10 + 1, {
          fill: `rgb(0, ${blueValue}, ${blueValue + 80})`,
        });
      }
    });

    // Inject render logic for InterfaceLayer - title, logo, and instruction text
    interfaceLayer.setRenderLogic((canvas, deltaTime) => {
      canvas.clear();
      this.elapsedTime += deltaTime;

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw game logo (stylized gacha machine using shapes)
      const logoY = centerY - 150;

      // Machine body
      canvas.rectangle(centerX - 60, logoY, 120, 100, {
        fill: 'rgba(255, 100, 150, 0.9)',
        stroke: 'white',
        lineWidth: 3,
      });

      // Machine top (dome)
      canvas.circle(centerX, logoY, 50, {
        fill: 'rgba(150, 200, 255, 0.7)',
        stroke: 'white',
        lineWidth: 3,
      });

      // Prize window
      canvas.circle(centerX, logoY + 30, 25, {
        fill: 'rgba(255, 255, 100, 0.8)',
        stroke: 'white',
        lineWidth: 2,
      });

      // Dispenser slot
      canvas.rectangle(centerX - 20, logoY + 90, 40, 15, {
        fill: 'rgba(50, 50, 50, 0.8)',
        stroke: 'white',
        lineWidth: 2,
      });

      // Title text with glow effect
      const titlePulse = 1 + Math.sin(this.elapsedTime / 300) * 0.1;
      canvas.text('GACHA GAME', centerX, centerY + 20, {
        fill: 'white',
        font: `bold ${48 * titlePulse}px Arial`,
        textAlign: 'center',
        textBaseline: 'middle',
      });

      // Subtitle
      canvas.text('Playground Demo', centerX, centerY + 60, {
        fill: 'rgba(255, 255, 255, 0.8)',
        font: '24px Arial',
        textAlign: 'center',
        textBaseline: 'middle',
      });

      // Instruction text with blink effect
      const blinkOpacity = Math.sin(this.elapsedTime / 400) > 0 ? 1 : 0.3;
      canvas.text('Click to Start', centerX, centerY + 120, {
        fill: `rgba(255, 255, 255, ${blinkOpacity})`,
        font: 'bold 28px Arial',
        textAlign: 'center',
        textBaseline: 'middle',
      });
    });

    // Inject render logic for EffectLayer - twinkling stars
    effectLayer.setRenderLogic((canvas, deltaTime) => {
      canvas.clear();
      this.elapsedTime += deltaTime;

      // Draw twinkling stars
      for (const star of this.stars) {
        const twinkle = Math.sin(this.elapsedTime * star.speed * 0.01) * 0.5 + 0.5;
        const opacity = 0.3 + twinkle * 0.7;

        canvas.circle(star.x, star.y, star.size, {
          fill: `rgba(255, 255, 255, ${opacity})`,
        });
      }
    });

    // Add layers to scene (rendering order)
    this.addLayer(backgroundLayer);
    this.addLayer(effectLayer);
    this.addLayer(interfaceLayer);
  }
}
