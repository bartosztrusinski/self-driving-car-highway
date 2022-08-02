import { Color, Line, Polygon } from './types';
import { LinesRenderer, PolygonRenderer } from './Renderer';

export interface CtxConfig {
  lineWidth: number;
  color: Color;
  lineDash: [number, number] | [];
  globalAlpha: number;
}

export default class Canvas {
  private ctx: CanvasRenderingContext2D;
  private linesRenderer = new LinesRenderer();
  private polygonRenderer = new PolygonRenderer();
  private defaultConfig: CtxConfig = {
    lineWidth: 5,
    color: Color.White,
    lineDash: [],
    globalAlpha: 1,
  };

  constructor(private canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  public get height() {
    return this.canvas.height;
  }

  public set height(height: number) {
    this.canvas.height = height;
  }

  public get width() {
    return this.canvas.width;
  }

  public set width(width: number) {
    this.canvas.width = width;
  }

  public configureContext(config: Partial<CtxConfig> = {}) {
    const configToUse = { ...this.defaultConfig, ...config };
    this.ctx.lineWidth = configToUse.lineWidth;
    this.ctx.strokeStyle = Color[configToUse.color];
    this.ctx.fillStyle = Color[configToUse.color];
    this.ctx.setLineDash(configToUse.lineDash);
    this.ctx.globalAlpha = configToUse.globalAlpha;
  }

  public setCameraHeight(y: number, heightRate = 0.5) {
    this.ctx.translate(0, -y + this.canvas.height * heightRate);
  }

  public renderPolygon(polygon: Polygon) {
    this.polygonRenderer.render(this.ctx, polygon);
    this.configureContext();
  }

  public renderLines(lines: Line[]) {
    this.linesRenderer.render(this.ctx, lines);
    this.configureContext();
  }
}
