"use strict";
class Road {
    constructor(horizontalCenter, width, laneCount = 3) {
        this.width = width;
        this.laneCount = laneCount;
        const infinity = 1000000;
        this.top = -infinity;
        this.bottom = infinity;
        this.left = horizontalCenter - width / 2;
        this.right = horizontalCenter + width / 2;
        this.laneCount = laneCount;
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
    getLaneCenter(laneIndex) {
        laneIndex = clamp(laneIndex, 0, this.laneCount - 1);
        const laneWidth = this.width / this.laneCount;
        return (linearInterpolation(this.left, this.right, laneIndex / this.laneCount) +
            laneWidth / 2);
    }
    getBorders() {
        return this.borders;
    }
    draw(ctx) {
        ctx.lineWidth = 4;
        ctx.strokeStyle = "white";
        ctx.setLineDash([40, 40]);
        for (let i = 1; i < this.laneCount; i++) {
            const linePosition = linearInterpolation(this.left, this.right, i / this.laneCount);
            ctx.beginPath();
            ctx.moveTo(linePosition, this.bottom);
            ctx.lineTo(linePosition, this.top);
            ctx.stroke();
        }
        ctx.setLineDash([]);
        this.borders.forEach((border) => {
            ctx.beginPath();
            ctx.moveTo(border.start.x, border.start.y);
            ctx.lineTo(border.end.x, border.end.y);
            ctx.stroke();
        });
    }
}
