import { Line, Polygon } from './types';

interface Renderer<T> {
  render(ctx: CanvasRenderingContext2D, object: T): void;
}

export class LinesRenderer implements Renderer<Line[]> {
  public render(ctx: CanvasRenderingContext2D, lines: Line[]) {
    for (const line of lines) {
      ctx.beginPath();
      ctx.moveTo(line.start.x, line.start.y);
      ctx.lineTo(line.end.x, line.end.y);
      ctx.stroke();
    }
  }
}

export class PolygonRenderer implements Renderer<Polygon> {
  public render(ctx: CanvasRenderingContext2D, polygon: Polygon) {
    ctx.beginPath();
    ctx.moveTo(polygon[0].start.x, polygon[0].start.y);
    for (let i = 1; i < polygon.length; i++) {
      ctx.lineTo(polygon[i].start.x, polygon[i].start.y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
}
