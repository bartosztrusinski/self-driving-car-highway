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
        this.brain = null;
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
        switch (type) {
            case "traffic":
                this.initTrafficCar();
                break;
            case "controls":
                this.initControlsCar();
                break;
            case "ai":
                this.initAICar();
                break;
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
    initAICar() {
        this.maxSpeed = 2.5;
        this.controls = new Controls();
        this.sensor = new Sensor(this.getCoords(), this.angle, Math.PI / 2, 5, 250);
        this.brain = new NeuralNetwork([5, 6, 4]);
    }
    getCoords() {
        return { x: this.x, y: this.y };
    }
    getPolygon() {
        return this.polygon;
    }
    draw(ctx, drawSensor = false) {
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
        if (this.sensor && drawSensor)
            this.sensor.draw(ctx);
    }
    update(obstacles) {
        if (!this.isDamaged) {
            this.createPolygon();
            this.assessDamage(this.polygon, obstacles);
            this.move();
        }
        if (this.sensor) {
            this.sensor.update(this.getCoords(), this.angle, obstacles);
            if (this.brain) {
                const offsets = this.sensor.readings.map((r) => r === null ? 0 : 1 - r.offset);
                NeuralNetwork.feedForward(offsets, this.brain);
            }
        }
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
            if (this.brain) {
                this.isMoving.forward = this.brain.outputs[0];
                this.isMoving.backwards = this.brain.outputs[1];
                this.isMoving.left = this.brain.outputs[2];
                this.isMoving.right = this.brain.outputs[3];
            }
            else {
                this.isMoving.forward = this.controls.isUpPressed();
                this.isMoving.backwards = this.controls.isDownPressed();
                this.isMoving.left = this.controls.isLeftPressed();
                this.isMoving.right = this.controls.isRightPressed();
            }
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
