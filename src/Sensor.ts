interface Reading {
  x: number;
  y: number;
  offset: number;
}

class Sensor {
  private rayOrigin: { x: number; y: number; angle: number };
  private rays: Line[];
  private readings: Reading[];

  constructor(
    coords: Point,
    angle: number,
    private raySpread: number,
    private rayCount: number,
    private rayLength: number
  ) {
    this.rayOrigin = { x: coords.x, y: coords.y, angle };
    this.raySpread = raySpread;
    this.rayCount = rayCount;
    this.rayLength = rayLength;
    this.readings = [];
    this.rays = [];
  }

  private getClosestReading(ray: Line, obstacles: Line[]) {
    this.readings = [];
    for (let obstacle of obstacles) {
      const reading = getIntersection(
        ray.start,
        ray.end,
        obstacle.start,
        obstacle.end
      );
      if (reading) {
        this.readings.push(reading);
      }
    }
    if (this.readings.length === 0) {
      return null;
    }
    const offsets = this.readings.map((reading) => reading.offset);
    const minOffset = Math.min(...offsets);
    return this.readings.find((reading) => reading.offset === minOffset);
  }

  private castRays() {
    const start = { x: this.rayOrigin.x, y: this.rayOrigin.y };

    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      const percentage = this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1);
      const rayAngle =
        linearInterpolation(
          this.raySpread / 2,
          -this.raySpread / 2,
          percentage
        ) + this.rayOrigin.angle;
      const end = {
        x: start.x - Math.sin(rayAngle) * this.rayLength,
        y: start.y - Math.cos(rayAngle) * this.rayLength,
      };

      this.rays.push({ start, end });
    }
  }

  public updateOrigin(coords: Point, angle: number) {
    const { x, y } = coords;
    this.rayOrigin = { x, y, angle };
    this.castRays();
  }

  public draw(ctx: CanvasRenderingContext2D, obstacles: Line[]) {
    this.rays.forEach((ray, i) => {
      let end = this.getClosestReading(ray, obstacles);
      if (end === null || end === undefined) {
        end = ray.end;
      }

      ctx.strokeStyle = "yellow";
      ctx.beginPath();
      ctx.moveTo(ray.start.x, ray.start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      ctx.strokeStyle = "black";
      ctx.beginPath();
      ctx.moveTo(end.x, end.y);
      ctx.lineTo(ray.end.x, ray.end.y);
      ctx.stroke();
    });
  }
}
