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

  private elapsedTime = 0;
  private cards: Array<{
    x: number;
    y: number;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    floatOffset: number;
  }> = [];

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

    // Generate sample gacha cards
    const rarities: Array<'common' | 'rare' | 'epic' | 'legendary'> = [
      'common',
      'common',
      'rare',
      'rare',
      'epic',
      'legendary',
    ];
    const cardWidth = 120;
    const cardSpacing = 30;
    const totalWidth = rarities.length * (cardWidth + cardSpacing) - cardSpacing;
    const startX = (width - totalWidth) / 2;

    rarities.forEach((rarity, index) => {
      this.cards.push({
        x: startX + index * (cardWidth + cardSpacing),
        y: height / 2 - 50,
        rarity,
        floatOffset: index * 0.5,
      });
    });

    // Create and configure layers
    const backgroundLayer = new BackgroundLayer(backgroundCanvas);
    const interfaceLayer = new InterfaceLayer(interfaceCanvas);
    const notificationLayer = new NotificationLayer(notificationCanvas);

    // Inject render logic for BackgroundLayer - gradient green background
    backgroundLayer.setRenderLogic((canvas) => {
      canvas.clear();
      // Gradient effect with rectangles (dark green to lighter green)
      for (let i = 0; i < 10; i++) {
        const greenValue = 40 + i * 15;
        canvas.rectangle(0, (height / 10) * i, width, height / 10 + 1, {
          fill: `rgb(0, ${greenValue}, ${greenValue - 20})`,
        });
      }
    });

    // Inject render logic for InterfaceLayer - main screen with gacha cards
    interfaceLayer.setRenderLogic((canvas, deltaTime) => {
      canvas.clear();
      this.elapsedTime += deltaTime;

      // Main screen title
      canvas.text('Main Screen', width / 2, 80, {
        fill: 'white',
        font: 'bold 48px Arial',
        textAlign: 'center',
        textBaseline: 'middle',
      });

      // Subtitle
      canvas.text('Your Gacha Collection', width / 2, 130, {
        fill: 'rgba(255, 255, 255, 0.8)',
        font: '24px Arial',
        textAlign: 'center',
        textBaseline: 'middle',
      });

      // Draw gacha cards with floating animation
      const cardWidth = 120;
      const cardHeight = 160;

      for (const card of this.cards) {
        const floatY = Math.sin((this.elapsedTime + card.floatOffset * 1000) / 800) * 10;

        // Card rarity colors
        const rarityColors = {
          common: { bg: 'rgba(180, 180, 180, 0.9)', border: 'white' },
          rare: { bg: 'rgba(100, 150, 255, 0.9)', border: 'lightblue' },
          epic: { bg: 'rgba(180, 100, 255, 0.9)', border: 'violet' },
          legendary: { bg: 'rgba(255, 200, 50, 0.9)', border: 'gold' },
        };

        const colors = rarityColors[card.rarity];

        // Card shadow
        canvas.rectangle(card.x + 5, card.y + floatY + 5, cardWidth, cardHeight, {
          fill: 'rgba(0, 0, 0, 0.3)',
        });

        // Card background
        canvas.rectangle(card.x, card.y + floatY, cardWidth, cardHeight, {
          fill: colors.bg,
          stroke: colors.border,
          lineWidth: 3,
        });

        // Card character placeholder (circle)
        canvas.circle(card.x + cardWidth / 2, card.y + floatY + 50, 30, {
          fill: 'rgba(255, 255, 255, 0.5)',
          stroke: 'white',
          lineWidth: 2,
        });

        // Character eyes
        canvas.circle(card.x + cardWidth / 2 - 10, card.y + floatY + 45, 4, {
          fill: 'black',
        });
        canvas.circle(card.x + cardWidth / 2 + 10, card.y + floatY + 45, 4, {
          fill: 'black',
        });

        // Character mouth
        canvas.line(
          card.x + cardWidth / 2 - 8,
          card.y + floatY + 58,
          card.x + cardWidth / 2 + 8,
          card.y + floatY + 58,
          { stroke: 'black', lineWidth: 2 }
        );

        // Rarity text
        canvas.text(
          card.rarity.toUpperCase(),
          card.x + cardWidth / 2,
          card.y + floatY + 110,
          {
            fill: 'white',
            font: 'bold 14px Arial',
            textAlign: 'center',
            textBaseline: 'middle',
          }
        );

        // Stars for rarity
        const starCount =
          card.rarity === 'legendary'
            ? 5
            : card.rarity === 'epic'
              ? 4
              : card.rarity === 'rare'
                ? 3
                : 2;
        const starSpacing = 15;
        const starStartX = card.x + (cardWidth - (starCount - 1) * starSpacing) / 2;

        for (let i = 0; i < starCount; i++) {
          canvas.circle(starStartX + i * starSpacing, card.y + floatY + 135, 5, {
            fill: 'gold',
            stroke: 'white',
            lineWidth: 1,
          });
        }
      }

      // Options button background with hover effect
      const buttonPulse = 1 + Math.sin(this.elapsedTime / 500) * 0.05;
      canvas.rectangle(
        this.optionsButtonX,
        this.optionsButtonY,
        this.optionsButtonWidth,
        this.optionsButtonHeight * buttonPulse,
        { fill: 'rgba(70, 70, 70, 0.9)', stroke: 'white', lineWidth: 3 }
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
