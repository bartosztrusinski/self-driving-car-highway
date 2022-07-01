"use strict";
class Car {
    constructor(x, y, color, shape) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.shape = shape;
        this.speed = 0;
        this.acceleration = 0.1;
        this.friction = 0.05;
        this.angle = 0;
        this.rotationSpeed = 0.01;
        this.isMoving = {
            forward: false,
            backwards: false,
            left: false,
            right: false,
        };
        this.polygon = [];
        this.x = x;
        this.y = y;
        this.color = color;
        this.shape = shape;
    }
    move() {
        this.updateMovingDirection();
        this.applyAcceleration();
        this.applySpeedLimits();
        this.applyFriction();
        this.applyRotation();
        this.y -= Math.cos(this.angle) * this.speed;
        this.x -= Math.sin(this.angle) * this.speed;
    }
    applyAcceleration() {
        if (this.isMoving.forward)
            this.speed += this.acceleration;
        if (this.isMoving.backwards)
            this.speed -= this.acceleration;
    }
    applySpeedLimits() {
        if (this.speed > this.maxSpeed)
            this.speed = this.maxSpeed;
        if (this.speed < -this.maxSpeed)
            this.speed = -this.maxSpeed;
    }
    applyFriction() {
        if (this.speed > 0)
            this.speed -= this.friction;
        if (this.speed < 0)
            this.speed += this.friction;
        if (Math.abs(this.speed) < this.friction)
            this.speed = 0;
    }
    applyRotation() {
        if (this.speed != 0) {
            const flipControls = this.speed < 0 ? -1 : 1;
            if (this.isMoving.left)
                this.angle += flipControls * this.rotationSpeed;
            if (this.isMoving.right)
                this.angle -= flipControls * this.rotationSpeed;
        }
    }
}
class DamageableCar extends Car {
    constructor() {
        super(...arguments);
        this.isDamaged = false;
        this.damagedColor = "gray";
    }
    assessDamage(obstacles) {
        if (polysIntersect(this.polygon, obstacles)) {
            this.isDamaged = true;
            this.color = this.damagedColor;
        }
    }
}
class KeyboardCar extends DamageableCar {
    constructor(x, y, color, shape) {
        super(x, y, color, shape);
        this.maxSpeed = 3;
        this.controls = new KeyboardControls();
    }
    update(obstacles) {
        if (this.isDamaged)
            return;
        this.move();
        this.polygon = this.shape.create(this);
        this.assessDamage(obstacles);
    }
    updateMovingDirection() {
        this.isMoving.forward = this.controls.isUpPressed();
        this.isMoving.backwards = this.controls.isDownPressed();
        this.isMoving.left = this.controls.isLeftPressed();
        this.isMoving.right = this.controls.isRightPressed();
    }
}
class AICar extends DamageableCar {
    constructor(x, y, color, shape, rayCount) {
        super(x, y, color, shape);
        this.maxSpeed = 2.5;
        this.brain = new NeuralNetwork([rayCount, 6, 4]);
        this.sensor = new Sensor(Math.PI / 2, rayCount, 300, this);
    }
    update(obstacles) {
        if (this.isDamaged)
            return;
        this.move();
        this.polygon = this.shape.create(this);
        this.assessDamage(obstacles);
        this.sensor.update(obstacles);
        const offsets = this.sensor.getOffsets().map((offset) => 1 - offset);
        NeuralNetwork.feedForward(offsets, this.brain);
    }
    updateMovingDirection() {
        this.isMoving.forward = this.brain.outputs[0] === 1;
        this.isMoving.backwards = this.brain.outputs[1] === 1;
        this.isMoving.left = this.brain.outputs[2] === 1;
        this.isMoving.right = this.brain.outputs[3] === 1;
    }
}
class TrafficCar extends Car {
    constructor(x, y, color, shape) {
        super(x, y, color, shape);
        this.maxSpeed = 2;
    }
    update() {
        this.move();
        this.polygon = this.shape.create(this);
    }
    updateMovingDirection() {
        this.isMoving.forward = true;
    }
}
