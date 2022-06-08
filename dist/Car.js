"use strict";
var Car = /** @class */ (function () {
    function Car(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
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
    Car.prototype.draw = function (ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle);
        ctx.fillStyle = "red";
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    };
    Car.prototype.updatePosition = function () {
        this.updateMovingDirection();
        this.applyAcceleration();
        this.applySpeedLimits();
        this.applyFriction();
        this.applyRotation();
        this.y -= Math.cos(this.angle) * this.speed;
        this.x -= Math.sin(this.angle) * this.speed;
    };
    Car.prototype.updateMovingDirection = function () {
        this.isMoving.forward = this.controls.isUpPressed();
        this.isMoving.backwards = this.controls.isDownPressed();
        this.isMoving.left = this.controls.isLeftPressed();
        this.isMoving.right = this.controls.isRightPressed();
    };
    Car.prototype.applyAcceleration = function () {
        if (this.isMoving.forward)
            this.speed += this.acceleration;
        if (this.isMoving.backwards)
            this.speed -= this.acceleration;
    };
    Car.prototype.applySpeedLimits = function () {
        if (this.speed > this.maxSpeed)
            this.speed = this.maxSpeed;
        if (this.speed < -this.maxSpeed)
            this.speed = -this.maxSpeed;
    };
    Car.prototype.applyFriction = function () {
        if (this.speed > 0)
            this.speed -= this.friction;
        if (this.speed < 0)
            this.speed += this.friction;
        if (Math.abs(this.speed) < this.friction)
            this.speed = 0;
    };
    Car.prototype.applyRotation = function () {
        if (this.speed != 0) {
            var flipControls = this.speed < 0 ? -1 : 1;
            if (this.isMoving.left)
                this.angle += flipControls * this.rotationSpeed;
            if (this.isMoving.right)
                this.angle -= flipControls * this.rotationSpeed;
        }
    };
    return Car;
}());
