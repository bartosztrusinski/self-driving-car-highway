"use strict";
class Sensor {
    constructor(raySpread, rayCount, rayLength, origin) {
        this.raySpread = raySpread;
        this.rayCount = rayCount;
        this.rayLength = rayLength;
        this.origin = origin;
        this.readings = [];
        this.rays = [];
        this.reader = new SensorReader();
        this.enabled = false;
        this.raySpread = raySpread;
        this.rayCount = rayCount;
        this.rayLength = rayLength;
    }
    getOffsets() {
        return this.readings.map((reading) => reading === null ? 1 : reading.offset);
    }
    getRaysSeparatedByOffsets() {
        const raysBefore = [], raysAfter = [];
        this.rays.forEach((ray, i) => {
            const separationPoint = this.readings[i]
                ? { x: this.readings[i].x, y: this.readings[i].y }
                : ray.end;
            raysBefore.push({ start: ray.start, end: separationPoint });
            raysAfter.push({ start: separationPoint, end: ray.end });
        });
        return { raysBefore, raysAfter };
    }
    isEnabled() {
        return this.enabled;
    }
    enable() {
        this.enabled = true;
    }
    disable() {
        this.enabled = false;
    }
    update(obstacles) {
        const { x, y, angle } = this.origin;
        this.cast(x, y, angle);
        this.readings = this.reader.read(this, obstacles);
    }
    cast(x, y, angle) {
        const start = { x, y };
        this.rays = [];
        for (let i = 0; i < this.rayCount; i++) {
            const percentage = this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1);
            const rayAngle = linearInterpolation(this.raySpread / 2, -this.raySpread / 2, percentage) + angle;
            const end = {
                x: start.x - Math.sin(rayAngle) * this.rayLength,
                y: start.y - Math.cos(rayAngle) * this.rayLength,
            };
            this.rays.push({ start, end });
        }
    }
}
class SensorReader {
    read(sensor, obstacles) {
        return sensor.rays.map((ray) => this.getClosestReading(ray, obstacles));
    }
    getClosestReading(ray, obstacles) {
        const touches = [];
        for (let obstacle of obstacles) {
            const touch = getIntersection(ray, obstacle);
            if (touch)
                touches.push(touch);
        }
        if (touches.length === 0)
            return null;
        const offsets = touches.map((touch) => touch.offset);
        const minOffset = Math.min(...offsets);
        return touches.find((t) => t.offset === minOffset);
    }
}
