interface Reading {
  x: number;
  y: number;
  offset: number;
}

interface SensorReaderInterface {
  read(sensor: Sensor, obstacle: any): void;
}

class Sensor implements Animated {
  public readings: (Reading | null)[] = [];
  public rays: Line[] = [];
  private reader = new SensorReader();
  private enabled = false;

  constructor(
    private raySpread: number,
    private rayCount: number,
    private rayLength: number,
    private origin: { x: number; y: number; angle: number }
  ) {
    this.raySpread = raySpread;
    this.rayCount = rayCount;
    this.rayLength = rayLength;
  }

  public getOffsets() {
    return this.readings.map((reading) =>
      reading === null ? 1 : reading.offset
    );
  }

  public getRaysSeparatedByOffsets() {
    const raysBefore: Line[] = [],
      raysAfter: Line[] = [];

    this.rays.forEach((ray, i) => {
      const separationPoint = this.readings[i]
        ? { x: this.readings[i]!.x, y: this.readings[i]!.y }
        : ray.end;

      raysBefore.push({ start: ray.start, end: separationPoint });
      raysAfter.push({ start: separationPoint, end: ray.end });
    });

    return { raysBefore, raysAfter };
  }

  public isEnabled() {
    return this.enabled;
  }

  public enable() {
    this.enabled = true;
  }

  public disable() {
    this.enabled = false;
  }

  public update(obstacles: Line[]) {
    const { x, y, angle } = this.origin;
    this.cast(x, y, angle);
    this.readings = this.reader.read(this, obstacles);
  }

  private cast(x: number, y: number, angle: number) {
    const start = { x, y };
    this.rays = [];
    for (let i = 0; i < this.rayCount; i++) {
      const percentage = this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1);
      const rayAngle =
        linearInterpolation(
          this.raySpread / 2,
          -this.raySpread / 2,
          percentage
        ) + angle;
      const end = {
        x: start.x - Math.sin(rayAngle) * this.rayLength,
        y: start.y - Math.cos(rayAngle) * this.rayLength,
      };

      this.rays.push({ start, end });
    }
  }
}

class SensorReader implements SensorReaderInterface {
  public read(sensor: Sensor, obstacles: Line[]) {
    return sensor.rays.map((ray) => this.getClosestReading(ray, obstacles));
  }

  private getClosestReading(ray: Line, obstacles: Line[]) {
    const touches: Reading[] = [];

    for (let obstacle of obstacles) {
      const touch = getIntersection(ray, obstacle);
      if (touch) touches.push(touch);
    }

    if (touches.length === 0) return null;

    const offsets = touches.map((touch) => touch.offset);
    const minOffset = Math.min(...offsets);
    return <Reading>touches.find((t) => t.offset === minOffset);
  }
}
