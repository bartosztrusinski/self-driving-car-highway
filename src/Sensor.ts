import { Line, Intersection } from "./types";
import { linearInterpolation, getIntersection } from "./utility";

type Reading = Intersection;

interface ReaderInterface {
  read(rays: Line[], target: any): void;
}

export default class Sensor {
  private _rays: Line[] = [];
  private obstacleReader = new TargetReader();

  constructor(
    private raySpread: number,
    private _rayCount: number,
    private rayLength: number
  ) {
    this.raySpread = raySpread;
    this._rayCount = _rayCount;
    this.rayLength = rayLength;
  }

  public clone() {
    return new Sensor(this.raySpread, this._rayCount, this.rayLength);
  }

  public get rayCount() {
    return this._rayCount;
  }

  public get readings() {
    return [...this.obstacleReader.readings];
  }

  public get offsets() {
    return [...this.obstacleReader.offsets];
  }

  public get rays(): Line[] {
    return this._rays.map((ray, i) => {
      const { x, y } = this.readings[i] || ray.end;
      return { start: ray.start, end: { x, y } };
    });
  }

  public get raysBehindObstacles(): Line[] {
    return this._rays.map((ray, i) => {
      const { x, y } = this.readings[i] || ray.end;
      return { start: { x, y }, end: ray.end };
    });
  }

  public update(x: number, y: number, angle: number, obstacles: Line[]) {
    this.castRays(x, y, angle);
    this.obstacleReader.read(this._rays, obstacles);
  }

  private castRays(x: number, y: number, sensorAngle: number) {
    const start = { x, y };
    this._rays = [];
    for (let i = 0; i < this._rayCount; i++) {
      const angle = sensorAngle + this.getRayAngle(i);
      const end = {
        x: start.x - Math.sin(angle) * this.rayLength,
        y: start.y - Math.cos(angle) * this.rayLength,
      };
      this._rays.push({ start, end });
    }
  }

  private getRayAngle(rayIndex: number) {
    return linearInterpolation(
      this.raySpread / 2,
      -this.raySpread / 2,
      this.getSpreadPercentage(rayIndex)
    );
  }

  private getSpreadPercentage(rayIndex: number) {
    return this._rayCount === 1 ? 0.5 : rayIndex / (this._rayCount - 1);
  }
}

class TargetReader implements ReaderInterface {
  private _readings: (Reading | null)[] = [];

  public get readings() {
    return [...this._readings];
  }

  public get offsets() {
    return this._readings.map((reading) => reading?.offset || null);
  }

  public read(rays: Line[], targets: Line[]) {
    this._readings = rays.map((ray) => this.getReading(ray, targets));
  }

  private getReading(ray: Line, targets: Line[]): Reading | null {
    const intersections = this.getIntersections(ray, targets);
    return intersections.length > 0
      ? this.getClosestIntersection(intersections)
      : null;
  }

  private getClosestIntersection(intersections: Intersection[]) {
    return intersections.reduce((acc, i) => (i.offset < acc.offset ? i : acc));
  }

  private getIntersections(ray: Line, targets: Line[]) {
    return targets
      .map((target) => getIntersection(ray, target))
      .filter((i): i is Intersection => i !== null);
  }
}
