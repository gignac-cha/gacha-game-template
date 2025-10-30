import { Scene } from '@gacha-game-template/scene';
import { BackgroundLayer } from '../layers/background-layer.js';
import { DialogLayer } from '../layers/dialog-layer.js';
import { ButtonLayer } from '../layers/button-layer.js';
import { NotificationLayer } from '../layers/notification-layer.js';

/**
 * OptionScene - Options menu overlay with Close button
 * Dialog: centered, 600x400px
 * Close button: centered horizontally in dialog, 50px from dialog bottom, 150x50px
 */
export class OptionScene extends Scene {
  // Public button hitbox coordinates for Scene Manager to check clicks
  public readonly closeButtonX: number;
  public readonly closeButtonY: number;
  public readonly closeButtonWidth = 150;
  public readonly closeButtonHeight = 50;

  private readonly dialogX: number;
  private readonly dialogY: number;
  private readonly dialogWidth = 600;
  private readonly dialogHeight = 400;

  constructor(rootElement: HTMLElement) {
    super();

    // Create canvas elements for each layer
    const backgroundCanvas = document.createElement('canvas');
    const dialogCanvas = document.createElement('canvas');
    const buttonCanvas = document.createElement('canvas');
    const notificationCanvas = document.createElement('canvas');

    // Set canvas dimensions to match viewport
    const width = window.innerWidth;
    const height = window.innerHeight;
    [backgroundCanvas, dialogCanvas, buttonCanvas, notificationCanvas].forEach((canvas) => {
      canvas.width = width;
      canvas.height = height;
      rootElement.appendChild(canvas);
    });

    // Calculate dialog position (centered)
    this.dialogX = (width - this.dialogWidth) / 2;
    this.dialogY = (height - this.dialogHeight) / 2;

    // Calculate close button position (centered in dialog, 50px from dialog bottom)
    this.closeButtonX = this.dialogX + (this.dialogWidth - this.closeButtonWidth) / 2;
    this.closeButtonY = this.dialogY + this.dialogHeight - 50 - this.closeButtonHeight;

    // Create and configure layers
    const backgroundLayer = new BackgroundLayer(backgroundCanvas);
    const dialogLayer = new DialogLayer(dialogCanvas);
    const buttonLayer = new ButtonLayer(buttonCanvas);
    const notificationLayer = new NotificationLayer(notificationCanvas);

    // Inject render logic for BackgroundLayer - semi-transparent gray overlay
    backgroundLayer.setRenderLogic((canvas) => {
      canvas.clear();
      canvas.rectangle(0, 0, width, height, { fill: 'rgba(0, 0, 0, 0.5)' });
    });

    // Inject render logic for DialogLayer - options dialog box
    dialogLayer.setRenderLogic((canvas) => {
      canvas.clear();
      // Dialog background
      canvas.rectangle(this.dialogX, this.dialogY, this.dialogWidth, this.dialogHeight, {
        fill: 'darkgray',
        stroke: 'white',
        lineWidth: 3,
      });

      // Dialog title
      canvas.text('Options Menu', this.dialogX + this.dialogWidth / 2, this.dialogY + 60, {
        fill: 'white',
        font: 'bold 36px Arial',
        textAlign: 'center',
        textBaseline: 'middle',
      });
    });

    // Inject render logic for ButtonLayer - Close button
    buttonLayer.setRenderLogic((canvas) => {
      canvas.clear();
      // Close button background
      canvas.rectangle(
        this.closeButtonX,
        this.closeButtonY,
        this.closeButtonWidth,
        this.closeButtonHeight,
        { fill: 'grey', stroke: 'white', lineWidth: 2 }
      );

      // Close button text
      canvas.text(
        'Close',
        this.closeButtonX + this.closeButtonWidth / 2,
        this.closeButtonY + this.closeButtonHeight / 2,
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
    this.addLayer(dialogLayer);
    this.addLayer(buttonLayer);
    this.addLayer(notificationLayer);
  }
}
