import { Scene } from '@gacha-game-template/scene';
import { BackgroundLayer } from '../layers/background-layer.js';
import { InterfaceLayer } from '../layers/interface-layer.js';
import { NotificationLayer } from '../layers/notification-layer.js';

/**
 * MainScene - Main game screen with Options button
 * Button hitbox: centered horizontally, 100px from bottom, 200x60px
 */
export class MainScene extends Scene {
  // Public button hitbox coordinates for Scene Manager to check clicks
  public readonly optionsButtonX: number;
  public readonly optionsButtonY: number;
  public readonly optionsButtonWidth = 200;
  public readonly optionsButtonHeight = 60;

  constructor(rootElement: HTMLElement) {
    super();

    // Create canvas elements for each layer
    const backgroundCanvas = document.createElement('canvas');
    const interfaceCanvas = document.createElement('canvas');
    const notificationCanvas = document.createElement('canvas');

    // Set canvas dimensions to match viewport
    const width = window.innerWidth;
    const height = window.innerHeight;
    [backgroundCanvas, interfaceCanvas, notificationCanvas].forEach((canvas) => {
      canvas.width = width;
      canvas.height = height;
      rootElement.appendChild(canvas);
    });

    // Calculate button position (centered horizontally, 100px from bottom)
    this.optionsButtonX = (width - this.optionsButtonWidth) / 2;
    this.optionsButtonY = height - 100 - this.optionsButtonHeight;

    // Create and configure layers
    const backgroundLayer = new BackgroundLayer(backgroundCanvas);
    const interfaceLayer = new InterfaceLayer(interfaceCanvas);
    const notificationLayer = new NotificationLayer(notificationCanvas);

    // Inject render logic for BackgroundLayer - solid green background
    backgroundLayer.setRenderLogic((canvas) => {
      canvas.clear();
      canvas.rectangle(0, 0, width, height, { fill: 'green' });
    });

    // Inject render logic for InterfaceLayer - main screen text and Options button
    interfaceLayer.setRenderLogic((canvas) => {
      canvas.clear();
      // Main screen title
      canvas.text('Main Screen', width / 2, 100, {
        fill: 'white',
        font: 'bold 48px Arial',
        textAlign: 'center',
        textBaseline: 'middle',
      });

      // Options button background
      canvas.rectangle(
        this.optionsButtonX,
        this.optionsButtonY,
        this.optionsButtonWidth,
        this.optionsButtonHeight,
        { fill: 'grey', stroke: 'white', lineWidth: 2 }
      );

      // Options button text
      canvas.text(
        'Options',
        this.optionsButtonX + this.optionsButtonWidth / 2,
        this.optionsButtonY + this.optionsButtonHeight / 2,
        {
          fill: 'white',
          font: 'bold 24px Arial',
          textAlign: 'center',
          textBaseline: 'middle',
        }
      );
    });

    // Inject render logic for NotificationLayer - empty for now
    notificationLayer.setRenderLogic(() => {
      // Empty - no notifications
    });

    // Add layers to scene (rendering order)
    this.addLayer(backgroundLayer);
    this.addLayer(interfaceLayer);
    this.addLayer(notificationLayer);
  }
}
