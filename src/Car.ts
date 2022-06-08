interface Directions {
  forward: boolean;
  backwards: boolean;
  left: boolean;
  right: boolean;
  [key: string]: boolean;
}

class Car {
  private isMoving: Directions;
  private controls: Controls;
  private acceleration: number;
  private speed: number;
  private maxSpeed: number;
  private angle: number;
  private rotationSpeed: number;
  private friction: number;

  constructor(
    private x: number,
    private y: number,
    private width: number,
    private height: number
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.11;
    this.maxSpeed = 2.2;
    this.friction = 0.04;
    this.angle = 0.0;
    this.rotationSpeed = 0.02;

    this.controls = new Controls();

    this.isMoving = {
      forward: false,
      backwards: false,
      left: false,
      right: false,
    };
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.save();

    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);

    ctx.fillStyle = "red";
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

    ctx.restore();
  }

  public updatePosition() {
    this.updateMovingDirection();
    this.applyAcceleration();
    this.applySpeedLimits();
    this.applyFriction();
    this.applyRotation();
    this.y -= Math.cos(this.angle) * this.speed;
    this.x -= Math.sin(this.angle) * this.speed;
  }

  private updateMovingDirection() {
    this.isMoving.forward = this.controls.isUpPressed();
    this.isMoving.backwards = this.controls.isDownPressed();
    this.isMoving.left = this.controls.isLeftPressed();
    this.isMoving.right = this.controls.isRightPressed();
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
