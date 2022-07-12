import { Line, Polygon, Color } from "./types";
import { polysIntersect, getRandomEnum } from "./utility";
import Sensor from "./Sensor";
import NeuralNetwork from "./NeuralNetwork";
import Shape, { Rectangle } from "./Shape";
import Controls, { KeyboardControls } from "./Controls";

export interface Car {
  move(): void;
}

interface hasBrain {
  brain: NeuralNetwork;
}

interface hasSensor {
  sensor: Sensor;
}

export function hasSensor(obj: any): obj is hasSensor {
  return "sensor" in obj && obj.sensor instanceof Sensor;
}

export abstract class Car implements Car {
  private speed = 0;
  protected angle = 0;
  public polygon: Polygon = [];
  protected isMoving = {
    forward: false,
    backwards: false,
    left: false,
    right: false,
  };

  constructor(
    protected _x = 0,
    protected _y = 0,
    protected _color: Color = getRandomEnum(Color)!,
    protected shape: Shape = new Rectangle(60, 100),
    protected maxSpeed = 2,
    private acceleration = 0.1,
    private friction = 0.05,
    private rotationSpeed = 0.01
  ) {
    this._x = _x;
    this._y = _y;
    this._color = _color;
    this.shape = shape;
    this.maxSpeed = maxSpeed;
    this.acceleration = acceleration;
    this.friction = friction;
    this.rotationSpeed = rotationSpeed;
  }

  public abstract update(): void;
  protected abstract updateMovingDirection(): void;

  public get x() {
    return this._x;
  }

  public get y() {
    return this._y;
  }

  public get color() {
    return this._color;
  }

  public move() {
    this.applyAcceleration();
    this.applySpeedLimits();
    this.applyFriction();
    this.applyRotation();
    this._y -= Math.cos(this.angle) * this.speed;
    this._x -= Math.sin(this.angle) * this.speed;
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
  protected isDamaged = false;
  protected damagedColor = Color.DimGray;
  public assessDamage(obstacles: Line[]) {
    if (polysIntersect(this.polygon, obstacles)) {
      this.isDamaged = true;
      this._color = this.damagedColor;
    }
  }
}

export class KeyboardCar extends DamageableCar {
  constructor(
    x?: number,
    y?: number,
    color?: Color,
    shape?: Shape,
    private controls: Controls = new KeyboardControls(),
    maxSpeed = 3,
    acceleration?: number,
    friction?: number,
    rotationSpeed?: number
  ) {
    super(x, y, color, shape, maxSpeed, acceleration, friction, rotationSpeed);
  }

  public update(obstacles: Line[] = []) {
    const { _x: x, _y: y, angle } = this;
    if (this.isDamaged) return;
    this.updateMovingDirection();
    this.move();
    this.polygon = this.shape.create(x, y, angle);
    this.assessDamage(obstacles);
  }

  protected updateMovingDirection() {
    this.isMoving.forward = this.controls.isUpPressed();
    this.isMoving.backwards = this.controls.isDownPressed();
    this.isMoving.left = this.controls.isLeftPressed();
    this.isMoving.right = this.controls.isRightPressed();
  }
}

export class AICar extends DamageableCar implements hasBrain, hasSensor {
  public brain = new NeuralNetwork([this._sensor.rayCount, 6, 4]);

  constructor(
    x?: number,
    y?: number,
    color?: Color,
    shape?: Shape,
    private _sensor = new Sensor(Math.PI / 2, 5, 300),
    maxSpeed = 2.5,
    acceleration?: number,
    friction?: number,
    rotationSpeed?: number
  ) {
    super(x, y, color, shape, maxSpeed, acceleration, friction, rotationSpeed);
  }

  public get sensor(): Sensor {
    return this._sensor;
  }

  public update(obstacles: Line[] = []) {
    const { _x: x, _y: y, angle } = this;
    if (this.isDamaged) return;
    this.updateMovingDirection();
    this.move();
    this.polygon = this.shape.create(x, y, angle);
    this.assessDamage(obstacles);
    this._sensor.update(x, y, angle, obstacles);
    const reversedOffsets = this._sensor.offsets.map(
      (offset) => 1 - (offset || 1)
    );
    NeuralNetwork.feedForward(this.brain, reversedOffsets);
  }

  protected updateMovingDirection() {
    this.isMoving.forward = Boolean(this.brain.outputs[0]);
    this.isMoving.backwards = Boolean(this.brain.outputs[1]);
    this.isMoving.left = Boolean(this.brain.outputs[2]);
    this.isMoving.right = Boolean(this.brain.outputs[3]);
  }
}

export class TrafficCar extends Car {
  constructor(
    x?: number,
    y?: number,
    color?: Color,
    shape?: Shape,
    maxSpeed = 2,
    acceleration?: number,
    friction?: number,
    rotationSpeed?: number
  ) {
    super(x, y, color, shape, maxSpeed, acceleration, friction, rotationSpeed);
  }

  public update() {
    const { _x: x, _y: y, angle } = this;
    this.updateMovingDirection();
    this.move();
    this.polygon = this.shape.create(x, y, angle);
  }

  protected updateMovingDirection() {
    this.isMoving.forward = true;
  }
}
