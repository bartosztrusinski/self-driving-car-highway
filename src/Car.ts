interface Directions {
  forward: boolean;
  backwards: boolean;
  left: boolean;
  right: boolean;
}

interface Car {
  move(): void;
}
interface hasControls {
  controls: Controls;
}

interface hasBrain {
  brain: NeuralNetwork;
}

interface hasSensor {
  sensor: Sensor;
}
abstract class Car implements Car, Animated {
  private speed = 0;
  private acceleration = 0.1;
  private friction = 0.05;
  public angle = 0;
  private rotationSpeed = 0.01;
  public abstract maxSpeed: number;
  public isMoving: Directions = {
    forward: false,
    backwards: false,
    left: false,
    right: false,
  };
  public polygon: Polygon = [];

  constructor(
    public x: number,
    public y: number,
    public color: string,
    public shape: Shape
  ) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.shape = shape;
  }

  public abstract update(obstacles: Line[]): void;
  protected abstract updateMovingDirection(): void;

  public move() {
    this.updateMovingDirection();
    this.applyAcceleration();
    this.applySpeedLimits();
    this.applyFriction();
    this.applyRotation();
    this.y -= Math.cos(this.angle) * this.speed;
    this.x -= Math.sin(this.angle) * this.speed;
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

abstract class DamageableCar extends Car {
  public isDamaged = false;
  public damagedColor = "gray";
  public assessDamage(obstacles: Line[]) {
    if (polysIntersect(this.polygon, obstacles)) {
      this.isDamaged = true;
      this.color = this.damagedColor;
    }
  }
}

class KeyboardCar extends DamageableCar implements hasControls {
  public maxSpeed = 3;
  public controls: Controls = new KeyboardControls();

  constructor(x: number, y: number, color: string, shape: Shape) {
    super(x, y, color, shape);
  }

  public update(obstacles: Line[]) {
    if (this.isDamaged) return;

    this.move();
    this.polygon = this.shape.create(this);
    this.assessDamage(obstacles);
  }

  protected updateMovingDirection() {
    this.isMoving.forward = this.controls.isUpPressed();
    this.isMoving.backwards = this.controls.isDownPressed();
    this.isMoving.left = this.controls.isLeftPressed();
    this.isMoving.right = this.controls.isRightPressed();
  }
}

class AICar extends DamageableCar implements hasBrain, hasSensor {
  public maxSpeed = 2.5;
  public brain: NeuralNetwork;
  public sensor: Sensor;

  constructor(
    x: number,
    y: number,
    color: string,
    shape: Shape,
    rayCount: number
  ) {
    super(x, y, color, shape);
    this.brain = new NeuralNetwork([rayCount, 6, 4]);
    this.sensor = new Sensor(Math.PI / 2, rayCount, 300, this);
  }

  public update(obstacles: Line[]) {
    if (this.isDamaged) return;

    this.move();
    this.polygon = this.shape.create(this);
    this.assessDamage(obstacles);

    this.sensor.update(obstacles);
    const offsets = this.sensor.getOffsets().map((offset) => 1 - offset);
    NeuralNetwork.feedForward(offsets, this.brain);
  }

  protected updateMovingDirection() {
    this.isMoving.forward = this.brain.outputs[0] === 1;
    this.isMoving.backwards = this.brain.outputs[1] === 1;
    this.isMoving.left = this.brain.outputs[2] === 1;
    this.isMoving.right = this.brain.outputs[3] === 1;
  }
}

class TrafficCar extends Car {
  public maxSpeed = 2;

  constructor(x: number, y: number, color: string, shape: Shape) {
    super(x, y, color, shape);
  }

  public update() {
    this.move();
    this.polygon = this.shape.create(this);
  }

  protected updateMovingDirection() {
    this.isMoving.forward = true;
  }
}
