interface Directions {
  forward: boolean;
  backwards: boolean;
  left: boolean;
  right: boolean;
  [key: string]: boolean;
}

class Car {
  private isGoing: Directions;
  private controls: Controls;
  private acceleration: number;
  private speed: number;
  private maxSpeed: number;

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
    this.acceleration = 0.03;
    this.maxSpeed = 2;
    this.isGoing = {
      forward: false,
      backwards: false,
      left: false,
      right: false,
    };
    this.controls = new Controls();
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "red";
    ctx.fillRect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
  }

  public move() {
    this.updateDirections();

    if (this.isAccelerating()) this.speed += this.acceleration;
    else this.speed -= this.acceleration;

    if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
    if (this.speed < 0) this.speed = 0;

    if (this.isGoing.forward) this.y -= this.speed;
    if (this.isGoing.backwards) this.y += this.speed;
    if (this.isGoing.left) this.x -= this.speed;
    if (this.isGoing.right) this.x += this.speed;
  }

  private updateDirections() {
    this.isGoing.forward = this.controls.isUpPressed();
    this.isGoing.backwards = this.controls.isDownPressed();
    this.isGoing.left = this.controls.isLeftPressed();
    this.isGoing.right = this.controls.isRightPressed();
  }

  private isAccelerating() {
    for (let direction in this.isGoing) {
      if (this.isGoing[direction]) {
        return true;
      }
    }
    return false;
  }
}
