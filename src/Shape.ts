import { Line, Point } from "./types";

export default interface Shape {
  create(x: number, y: number, shapeAngle: number): Line[];
}

export class Rectangle implements Shape {
  constructor(private width: number, private height: number) {
    this.width = width;
    this.height = height;
  }

  public create(x: number, y: number, rectAngle: number): Line[] {
    const radius = Math.hypot(this.width, this.height) / 2;
    const radiusAngle = Math.atan2(this.width, this.height);

    const topLeft: Point = {
      x: x - radius * Math.sin(rectAngle + radiusAngle),
      y: y - radius * Math.cos(rectAngle + radiusAngle),
    };
    const topRight: Point = {
      x: x - radius * Math.sin(rectAngle - radiusAngle),
      y: y - radius * Math.cos(rectAngle - radiusAngle),
    };
    const bottomLeft: Point = {
      x: x - radius * Math.sin(Math.PI + rectAngle - radiusAngle),
      y: y - radius * Math.cos(Math.PI + rectAngle - radiusAngle),
    };
    const bottomRight: Point = {
      x: x - radius * Math.sin(Math.PI + rectAngle + radiusAngle),
      y: y - radius * Math.cos(Math.PI + rectAngle + radiusAngle),
    };

    return [
      { start: topLeft, end: topRight },
      { start: topRight, end: bottomRight },
      { start: bottomRight, end: bottomLeft },
      { start: bottomLeft, end: topLeft },
    ];
  }
}
