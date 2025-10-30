/**
 * Scene Manager - Entry point and orchestrator for the playground application
 *
 * Responsibilities:
 * 1. DOM setup and management
 * 2. Current scene state management
 * 3. Game loop (requestAnimationFrame)
 * 4. Scene transitions
 * 5. Global input handling
 */

import { Scene } from '@gacha-game-template/scene';
import { LoadingScene } from './scenes/loading-scene.js';
import { TitleScene } from './scenes/title-scene.js';
import { MainScene } from './scenes/main-scene.js';
import { OptionScene } from './scenes/option-scene.js';

// ========== State Management ==========

let currentScene: Scene | null = null;
let rootElement: HTMLElement | null = null;
let lastFrameTime = 0;

// ========== Scene Management Functions ==========

/**
 * Changes the current scene to a new scene
 * Clears the root element and initializes the new scene
 */
function changeScene(newScene: Scene): void {
  if (!rootElement) {
    throw new Error('Root element not initialized');
  }

  // Clear all canvas elements from the root
  rootElement.innerHTML = '';

  // Set the new scene as current
  currentScene = newScene;

  console.log(`Scene changed to: ${newScene.constructor.name}`);
}

// ========== Game Loop ==========

/**
 * Main game loop - called every frame via requestAnimationFrame
 */
function gameLoop(currentTime: number): void {
  // Calculate delta time in milliseconds
  const deltaTime = lastFrameTime === 0 ? 0 : currentTime - lastFrameTime;
  lastFrameTime = currentTime;

  // Render current scene if it exists
  if (currentScene) {
    currentScene.render(deltaTime);
  }

  // Request next frame
  requestAnimationFrame(gameLoop);
}

// ========== Input Handling ==========

/**
 * Global click event handler
 * Implements all scene transition logic based on FR-5
 */
function handleClick(event: MouseEvent): void {
  if (!currentScene) return;

  const clickX = event.clientX;
  const clickY = event.clientY;

  // FR-5.3: TitleScene -> MainScene on any click
  if (currentScene instanceof TitleScene) {
    if (!rootElement) return;
    changeScene(new MainScene(rootElement));
    return;
  }

  // FR-5.4: MainScene -> OptionScene on "Options" button click
  if (currentScene instanceof MainScene) {
    const { optionsButtonX, optionsButtonY, optionsButtonWidth, optionsButtonHeight } = currentScene;

    // Check if click is within the Options button hitbox
    if (
      clickX >= optionsButtonX &&
      clickX <= optionsButtonX + optionsButtonWidth &&
      clickY >= optionsButtonY &&
      clickY <= optionsButtonY + optionsButtonHeight
    ) {
      if (!rootElement) return;
      changeScene(new OptionScene(rootElement));
      return;
    }
  }

  // FR-5.5: OptionScene -> MainScene on "Close" button click
  if (currentScene instanceof OptionScene) {
    const { closeButtonX, closeButtonY, closeButtonWidth, closeButtonHeight } = currentScene;

    // Check if click is within the Close button hitbox
    if (
      clickX >= closeButtonX &&
      clickX <= closeButtonX + closeButtonWidth &&
      clickY >= closeButtonY &&
      clickY <= closeButtonY + closeButtonHeight
    ) {
      if (!rootElement) return;
      changeScene(new MainScene(rootElement));
      return;
    }
  }
}

// ========== Initialization ==========

/**
 * Initialize the application
 */
function init(): void {
  // Get the root element from the DOM
  rootElement = document.getElementById('game-root');
  if (!rootElement) {
    throw new Error('Root element #game-root not found');
  }

  console.log('Playground application initialized');

  // FR-5.1: Start with LoadingScene
  changeScene(new LoadingScene(rootElement));

  // FR-5.2: Auto-transition to TitleScene after exactly 5 seconds
  setTimeout(() => {
    if (!rootElement) return;
    changeScene(new TitleScene(rootElement));
  }, 5000);

  // Start the game loop
  requestAnimationFrame(gameLoop);

  // Register global click handler
  window.addEventListener('click', handleClick);

  console.log('Game loop started. LoadingScene will auto-transition to TitleScene in 5 seconds.');
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
