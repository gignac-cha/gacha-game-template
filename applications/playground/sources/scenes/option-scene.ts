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

  private elapsedTime = 0;

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
      canvas.rectangle(0, 0, width, height, { fill: 'rgba(0, 0, 0, 0.7)' });
    });

    // Inject render logic for DialogLayer - options dialog box with settings
    dialogLayer.setRenderLogic((canvas, deltaTime) => {
      canvas.clear();
      this.elapsedTime += deltaTime;

      // Dialog shadow
      canvas.rectangle(
        this.dialogX + 10,
        this.dialogY + 10,
        this.dialogWidth,
        this.dialogHeight,
        {
          fill: 'rgba(0, 0, 0, 0.5)',
        }
      );

      // Dialog background with gradient
      canvas.rectangle(this.dialogX, this.dialogY, this.dialogWidth, this.dialogHeight, {
        fill: 'rgba(70, 80, 90, 0.95)',
        stroke: 'white',
        lineWidth: 4,
      });

      // Title bar
      canvas.rectangle(this.dialogX, this.dialogY, this.dialogWidth, 100, {
        fill: 'rgba(50, 60, 70, 0.9)',
      });

      // Dialog title
      canvas.text('Options Menu', this.dialogX + this.dialogWidth / 2, this.dialogY + 50, {
        fill: 'white',
        font: 'bold 36px Arial',
        textAlign: 'center',
        textBaseline: 'middle',
      });

      // Draw option items
      const optionStartY = this.dialogY + 130;
      const optionSpacing = 70;

      // Option 1: Sound Volume
      this.drawOption(
        canvas,
        this.dialogX + 50,
        optionStartY,
        'Sound',
        '🔊',
        0.75,
        'slider'
      );

      // Option 2: Music Volume
      this.drawOption(
        canvas,
        this.dialogX + 50,
        optionStartY + optionSpacing,
        'Music',
        '🎵',
        0.5,
        'slider'
      );

      // Option 3: Graphics Quality
      this.drawOption(
        canvas,
        this.dialogX + 50,
        optionStartY + optionSpacing * 2,
        'Quality',
        '⚙️',
        1.0,
        'checkbox'
      );
    });

    // Inject render logic for ButtonLayer - Close button with animation
    buttonLayer.setRenderLogic((canvas, deltaTime) => {
      canvas.clear();
      this.elapsedTime += deltaTime;

      // Button pulse animation
      const pulse = 1 + Math.sin(this.elapsedTime / 300) * 0.03;

      // Close button shadow
      canvas.rectangle(
        this.closeButtonX + 3,
        this.closeButtonY + 3,
        this.closeButtonWidth,
        this.closeButtonHeight,
        { fill: 'rgba(0, 0, 0, 0.4)' }
      );

      // Close button background
      canvas.rectangle(
        this.closeButtonX,
        this.closeButtonY,
        this.closeButtonWidth * pulse,
        this.closeButtonHeight * pulse,
        { fill: 'rgba(200, 80, 80, 0.9)', stroke: 'white', lineWidth: 3 }
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

  /**
   * Helper method to draw an option item
   */
  private drawOption(
    canvas: any,
    x: number,
    y: number,
    label: string,
    icon: string,
    value: number,
    type: 'slider' | 'checkbox'
  ): void {
    // Icon/Label area background
    canvas.rectangle(x, y - 15, 450, 50, {
      fill: 'rgba(90, 100, 110, 0.5)',
      stroke: 'rgba(255, 255, 255, 0.3)',
      lineWidth: 1,
    });

    // Icon (simplified as circle with text)
    canvas.circle(x + 25, y + 10, 18, {
      fill: 'rgba(100, 150, 200, 0.8)',
      stroke: 'white',
      lineWidth: 2,
    });

    // Label text
    canvas.text(label, x + 60, y + 10, {
      fill: 'white',
      font: 'bold 20px Arial',
      textAlign: 'left',
      textBaseline: 'middle',
    });

    // Control (slider or checkbox)
    if (type === 'slider') {
      // Slider track
      const sliderX = x + 250;
      const sliderWidth = 180;
      const sliderHeight = 8;

      canvas.rectangle(sliderX, y + 6, sliderWidth, sliderHeight, {
        fill: 'rgba(50, 50, 50, 0.8)',
        stroke: 'rgba(255, 255, 255, 0.5)',
        lineWidth: 1,
      });

      // Slider fill
      canvas.rectangle(sliderX, y + 6, sliderWidth * value, sliderHeight, {
        fill: 'rgba(100, 180, 255, 0.9)',
      });

      // Slider handle
      canvas.circle(sliderX + sliderWidth * value, y + 10, 12, {
        fill: 'white',
        stroke: 'rgba(100, 180, 255, 1)',
        lineWidth: 3,
      });

      // Value text
      canvas.text(`${Math.round(value * 100)}%`, x + 450, y + 10, {
        fill: 'white',
        font: '16px Arial',
        textAlign: 'right',
        textBaseline: 'middle',
      });
    } else {
      // Checkbox
      const checkboxX = x + 380;
      const checkboxSize = 30;

      canvas.rectangle(checkboxX, y - 5, checkboxSize, checkboxSize, {
        fill: value > 0.5 ? 'rgba(100, 180, 100, 0.9)' : 'rgba(150, 150, 150, 0.5)',
        stroke: 'white',
        lineWidth: 2,
      });

      // Checkmark
      if (value > 0.5) {
        canvas.line(checkboxX + 8, y + 10, checkboxX + 12, y + 15, {
          stroke: 'white',
          lineWidth: 3,
        });
        canvas.line(checkboxX + 12, y + 15, checkboxX + 22, y + 3, {
          stroke: 'white',
          lineWidth: 3,
        });
      }

      // Status text
      canvas.text(value > 0.5 ? 'High' : 'Low', x + 450, y + 10, {
        fill: 'white',
        font: '16px Arial',
        textAlign: 'right',
        textBaseline: 'middle',
      });
    }
  }
}
