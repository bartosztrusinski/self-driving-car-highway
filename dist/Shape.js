"use strict";
class Rectangle {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
    create(obj) {
        const radius = Math.hypot(this.width, this.height) / 2;
        const alpha = Math.atan2(this.width, this.height);
        const topLeft = {
            x: obj.x - radius * Math.sin(obj.angle + alpha),
            y: obj.y - radius * Math.cos(obj.angle + alpha),
        };
        const topRight = {
            x: obj.x - radius * Math.sin(obj.angle - alpha),
            y: obj.y - radius * Math.cos(obj.angle - alpha),
        };
        const bottomLeft = {
            x: obj.x - radius * Math.sin(Math.PI + obj.angle - alpha),
            y: obj.y - radius * Math.cos(Math.PI + obj.angle - alpha),
        };
        const bottomRight = {
            x: obj.x - radius * Math.sin(Math.PI + obj.angle + alpha),
            y: obj.y - radius * Math.cos(Math.PI + obj.angle + alpha),
        };
        return [
            { start: topLeft, end: topRight },
            { start: topRight, end: bottomRight },
            { start: bottomRight, end: bottomLeft },
            { start: bottomLeft, end: topLeft },
        ];
    }
}
