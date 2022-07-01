interface Shape {
  create(obj: { x: number; y: number; angle: number }): Line[];
}

class Rectangle implements Shape {
  width: number;
  height: number;
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  create(obj: { x: number; y: number; angle: number }): Line[] {
    const radius = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);

    const topLeft: Point = {
      x: obj.x - radius * Math.sin(obj.angle + alpha),
      y: obj.y - radius * Math.cos(obj.angle + alpha),
    };
    const topRight: Point = {
      x: obj.x - radius * Math.sin(obj.angle - alpha),
      y: obj.y - radius * Math.cos(obj.angle - alpha),
    };
    const bottomLeft: Point = {
      x: obj.x - radius * Math.sin(Math.PI + obj.angle - alpha),
      y: obj.y - radius * Math.cos(Math.PI + obj.angle - alpha),
    };
    const bottomRight: Point = {
      x: obj.x - radius * Math.sin(Math.PI + obj.angle + alpha),
      y: obj.y - radius * Math.cos(Math.PI + obj.angle + alpha),
    };

    return [
      { start: topLeft, end: topRight },
      { start: topRight, end: bottomRight },
      { start: bottomRight, end: bottomLeft },
      { start: bottomLeft, end: topLeft },
    ];
  }
}
