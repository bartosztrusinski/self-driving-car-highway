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
    Car.prototype.draw = function (ctx) {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    };
    Car.prototype.move = function () {
        this.updateDirections();
        if (this.isAccelerating())
            this.speed += this.acceleration;
        else
            this.speed -= this.acceleration;
        if (this.speed > this.maxSpeed)
            this.speed = this.maxSpeed;
        if (this.speed < 0)
            this.speed = 0;
        if (this.isGoing.forward)
            this.y -= this.speed;
        if (this.isGoing.backwards)
            this.y += this.speed;
        if (this.isGoing.left)
            this.x -= this.speed;
        if (this.isGoing.right)
            this.x += this.speed;
    };
    Car.prototype.updateDirections = function () {
        this.isGoing.forward = this.controls.isUpPressed();
        this.isGoing.backwards = this.controls.isDownPressed();
        this.isGoing.left = this.controls.isLeftPressed();
        this.isGoing.right = this.controls.isRightPressed();
    };
    Car.prototype.isAccelerating = function () {
        for (var direction in this.isGoing) {
            if (this.isGoing[direction]) {
                return true;
            }
        }
        return false;
    };
    return Car;
}());
