"use strict";
class Car {
    constructor(x, y, color, type) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.isMoving = {
            forward: false,
            backwards: false,
            left: false,
            right: false,
        };
        this.controls = null;
        this.sensor = null;
        this.speed = 0;
        this.maxSpeed = 1;
        this.acceleration = 0.1;
        this.friction = 0.05;
        this.angle = 0;
        this.rotationSpeed = 0.01;
        this.width = 60;
        this.height = 100;
        this.isDamaged = false;
        this.polygon = [];
        this.x = x;
        this.y = y;
        this.color = color;
        if (type === "traffic") {
            this.initTrafficCar();
        }
        else if (type === "controls") {
            this.initControlsCar();
        }
    }
    initTrafficCar() {
        this.maxSpeed = 2;
        this.controls = null;
        this.sensor = null;
    }
    initControlsCar() {
        this.maxSpeed = 5;
        this.controls = new Controls();
        this.sensor = new Sensor(this.getCoords(), this.angle, Math.PI / 2, 5, 300);
    }
    getCoords() {
        return { x: this.x, y: this.y };
    }
    getPolygon() {
        return this.polygon;
    }
    draw(ctx, obstacles) {
        if (this.isDamaged) {
            ctx.fillStyle = "gray";
        }
        else {
            ctx.fillStyle = this.color;
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].start.x, this.polygon[0].start.y);
        for (let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].start.x, this.polygon[i].start.y);
        }
        ctx.closePath();
        ctx.fill();
        if (this.sensor)
            this.sensor.draw(ctx, obstacles);
    }
    update(obstacles) {
        if (!this.isDamaged) {
            this.createPolygon();
            this.assessDamage(this.polygon, obstacles);
            this.move();
        }
        if (this.sensor)
            this.sensor.updateOrigin(this.getCoords(), this.angle);
    }
    createPolygon() {
        const radius = Math.hypot(this.width, this.height) / 2;
        const angle = Math.atan2(this.width, this.height);
        const topLeft = {
            x: this.x - radius * Math.sin(this.angle + angle),
            y: this.y - radius * Math.cos(this.angle + angle),
        };
        const topRight = {
            x: this.x - radius * Math.sin(this.angle - angle),
            y: this.y - radius * Math.cos(this.angle - angle),
        };
        const bottomLeft = {
            x: this.x - radius * Math.sin(Math.PI + this.angle - angle),
            y: this.y - radius * Math.cos(Math.PI + this.angle - angle),
        };
        const bottomRight = {
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
    assessDamage(polygon, borders) {
        if (polysIntersect(polygon, borders)) {
            this.isDamaged = true;
            return;
        }
    }
    move() {
        if (!this.controls) {
            this.isMoving.forward = true;
        }
        else {
            this.updateMovingDirection();
        }
        this.applyAcceleration();
        this.applySpeedLimits();
        this.applyFriction();
        this.applyRotation();
        this.y -= Math.cos(this.angle) * this.speed;
        this.x -= Math.sin(this.angle) * this.speed;
    }
    updateMovingDirection() {
        if (this.controls) {
            this.isMoving.forward = this.controls.isUpPressed();
            this.isMoving.backwards = this.controls.isDownPressed();
            this.isMoving.left = this.controls.isLeftPressed();
            this.isMoving.right = this.controls.isRightPressed();
        }
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
