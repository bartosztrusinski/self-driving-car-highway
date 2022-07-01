interface Renderer<T> {
  render(ctx: CanvasRenderingContext2D, object: T): void;
}

class LinesRenderer implements Renderer<Line[]> {
  public render(ctx: CanvasRenderingContext2D, lines: Line[]) {
    for (let line of lines) {
      ctx.beginPath();
      ctx.moveTo(line.start.x, line.start.y);
      ctx.lineTo(line.end.x, line.end.y);
      ctx.stroke();
    }
  }
}

class PolygonRenderer implements Renderer<Polygon> {
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

class CarRenderer {
  private renderer: PolygonRenderer;
  constructor(private ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.renderer = new PolygonRenderer();
  }

  public render(car: Car) {
    this.ctx.fillStyle = car.color;
    this.ctx.strokeStyle = car.color;
    this.ctx.lineWidth = 5;
    this.ctx.setLineDash([]);
    this.renderer.render(this.ctx, car.polygon);
  }
}

class SensorRenderer {
  private renderer: LinesRenderer;

  constructor(private ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.renderer = new LinesRenderer();
  }

  public render(sensor: Sensor) {
    if (!sensor.isEnabled()) return;
    this.ctx.lineWidth = 3;
    const { raysBefore, raysAfter } = sensor.getRaysSeparatedByOffsets();
    this.renderRays(raysBefore);
    this.renderRaysAfterTouch(raysAfter);
  }

  private renderRays(rays: Line[]) {
    this.ctx.strokeStyle = "yellow";
    this.renderer.render(this.ctx, rays);
  }

  private renderRaysAfterTouch(rays: Line[]) {
    this.ctx.strokeStyle = "black";
    this.renderer.render(this.ctx, rays);
  }
}

class RoadRenderer {
  private renderer: LinesRenderer;

  constructor(private ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.renderer = new LinesRenderer();
  }

  public render(road: Road) {
    this.renderBorders(road.borders);
    this.renderLaneLines(road.lines);
  }

  private renderBorders(borders: Line[]) {
    this.ctx.strokeStyle = "white";
    this.ctx.lineWidth = 6;
    this.ctx.setLineDash([]);
    this.renderer.render(this.ctx, borders);
  }

  private renderLaneLines(lines: Line[]) {
    this.ctx.strokeStyle = "white";
    this.ctx.lineWidth = 4;
    this.ctx.setLineDash([50, 50]);
    this.renderer.render(this.ctx, lines);
  }
}
