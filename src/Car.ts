interface Directions {
  forward: boolean;
  backwards: boolean;
  left: boolean;
  right: boolean;
}
class Car {
  private isMoving: Directions = {
    forward: false,
    backwards: false,
    left: false,
    right: false,
  };
  private controls: Controls | null = null;
  private sensor: Sensor | null = null;
  private speed = 0;
  private maxSpeed = 1;
  private acceleration = 0.1;
  private friction = 0.05;
  private angle = 0;
  private rotationSpeed = 0.01;
  private width = 60;
  private height = 100;
  private isDamaged = false;
  private polygon: Line[] = [];

  constructor(
    private x: number,
    private y: number,
    private color: string,
    type: String
  ) {
    this.x = x;
    this.y = y;
    this.color = color;

    if (type === "traffic") {
      this.initTrafficCar();
    } else if (type === "controls") {
      this.initControlsCar();
    }
  }

  private initTrafficCar() {
    this.maxSpeed = 2;
    this.controls = null;
    this.sensor = null;
  }

  private initControlsCar() {
    this.maxSpeed = 5;
    this.controls = new Controls();
    this.sensor = new Sensor(this.getCoords(), this.angle, Math.PI / 2, 5, 300);
  }

  public getCoords(): Point {
    return { x: this.x, y: this.y };
  }

  public getPolygon() {
    return this.polygon;
  }

  public draw(ctx: CanvasRenderingContext2D, obstacles: Line[]) {
    if (this.isDamaged) {
      ctx.fillStyle = "gray";
    } else {
      ctx.fillStyle = this.color;
    }

    ctx.beginPath();
    ctx.moveTo(this.polygon[0].start.x, this.polygon[0].start.y);
    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].start.x, this.polygon[i].start.y);
    }
    ctx.closePath();
    ctx.fill();

    if (this.sensor) this.sensor.draw(ctx, obstacles);
  }

  public update(obstacles: Line[]) {
    if (!this.isDamaged) {
      this.createPolygon();
      this.assessDamage(this.polygon, obstacles);
      this.move();
    }
    if (this.sensor) this.sensor.updateOrigin(this.getCoords(), this.angle);
  }

  public createPolygon() {
    const radius = Math.hypot(this.width, this.height) / 2;
    const angle = Math.atan2(this.width, this.height);

    const topLeft: Point = {
      x: this.x - radius * Math.sin(this.angle + angle),
      y: this.y - radius * Math.cos(this.angle + angle),
    };
    const topRight: Point = {
      x: this.x - radius * Math.sin(this.angle - angle),
      y: this.y - radius * Math.cos(this.angle - angle),
    };
    const bottomLeft: Point = {
      x: this.x - radius * Math.sin(Math.PI + this.angle - angle),
      y: this.y - radius * Math.cos(Math.PI + this.angle - angle),
    };
    const bottomRight: Point = {
      x: this.x - radius * Math.sin(Math.PI + this.angle + angle),
      y: this.y - radius * Math.cos(Math.PI + this.angle + angle),
    };

    const topLine = {
      start: topLeft,
      end: topRight,
    };

    this.polygon = [
      topLine,
      { start: topRight, end: bottomRight },
      { start: bottomRight, end: bottomLeft },
      { start: bottomLeft, end: topLeft },
    ];

    // return polygon;
  }

  private assessDamage(polygon: Line[], borders: Line[]) {
    if (polysIntersect(polygon, borders)) {
      this.isDamaged = true;
      return;
    }
  }

  private move() {
    if (!this.controls) {
      this.isMoving.forward = true;
    } else {
      this.updateMovingDirection();
    }
    this.applyAcceleration();
    this.applySpeedLimits();
    this.applyFriction();
    this.applyRotation();
    this.y -= Math.cos(this.angle) * this.speed;
    this.x -= Math.sin(this.angle) * this.speed;
  }

  private updateMovingDirection() {
    if (this.controls) {
      this.isMoving.forward = this.controls.isUpPressed();
      this.isMoving.backwards = this.controls.isDownPressed();
      this.isMoving.left = this.controls.isLeftPressed();
      this.isMoving.right = this.controls.isRightPressed();
    }
  }

  private applyAcceleration() {
    if (this.isMoving.forward) this.speed += this.acceleration;
    if (this.isMoving.backwards) this.speed -= this.acceleration;
  }

  private applySpeedLimits() {
    if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
    if (this.speed < -this.maxSpeed) this.speed = -this.maxSpeed;
  }

  private applyFriction() {
    if (this.speed > 0) this.speed -= this.friction;
    if (this.speed < 0) this.speed += this.friction;
    if (Math.abs(this.speed) < this.friction) this.speed = 0;
  }

  private applyRotation() {
    if (this.speed != 0) {
      const flipControls = this.speed < 0 ? -1 : 1;
      if (this.isMoving.left) this.angle += flipControls * this.rotationSpeed;
      if (this.isMoving.right) this.angle -= flipControls * this.rotationSpeed;
    }
  }
}
