"use strict";
class Road {
    constructor(horizontalCenter, width, laneCount) {
        this.width = width;
        this.laneCount = laneCount;
        this.borders = [];
        this.lines = [];
        const infinity = 1000000;
        this.top = -infinity;
        this.bottom = infinity;
        this.left = horizontalCenter - width / 2;
        this.right = horizontalCenter + width / 2;
        this.laneCount = laneCount;
        this.setBorders();
        this.setLines();
    }
    getLaneCount() {
        return this.laneCount;
    }
    getLaneCenter(laneIndex) {
        laneIndex = clamp(laneIndex, 0, this.laneCount - 1);
        const laneWidth = this.width / this.laneCount;
        return (linearInterpolation(this.left, this.right, laneIndex / this.laneCount) +
            laneWidth / 2);
    }
    setBorders() {
        const leftBorder = {
            start: { x: this.left, y: this.top },
            end: { x: this.left, y: this.bottom },
        };
        const bottomBorder = {
            start: { x: this.right, y: this.top },
            end: { x: this.right, y: this.bottom },
        };
        this.borders = [leftBorder, bottomBorder];
    }
    setLines() {
        this.lines = [];
        for (let i = 1; i < this.laneCount; i++) {
            const x = linearInterpolation(this.left, this.right, i / this.laneCount);
            this.lines.push({
                start: { x, y: this.bottom },
                end: { x, y: this.top },
            });
        }
    }
}
