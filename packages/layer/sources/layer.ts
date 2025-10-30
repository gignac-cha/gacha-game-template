import { Canvas } from '@gacha-game-template/canvas';
import { RenderCallback } from './types';

export class Layer {
  private readonly canvas: Canvas;
  private renderLogic: RenderCallback;

  constructor(element: HTMLCanvasElement) {
    this.canvas = new Canvas(element);
    this.renderLogic = () => {};
  }

  public setRenderLogic(logic: RenderCallback): void {
    this.renderLogic = logic;
  }

  public render(deltaTime: number): void {
    this.renderLogic(this.canvas, deltaTime);
  }
}
