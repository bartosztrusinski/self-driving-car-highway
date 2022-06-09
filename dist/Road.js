"use strict";
var Road = /** @class */ (function () {
    function Road(horizontalCenter, width, laneCount) {
        if (laneCount === void 0) { laneCount = 3; }
        this.width = width;
        this.laneCount = laneCount;
        this.infinity = 1000000;
        this.left = horizontalCenter - width / 2;
        this.right = horizontalCenter + width / 2;
        this.top = -this.infinity;
        this.bottom = this.infinity;
        this.laneCount = laneCount;
        var leftBorder = {
            start: { x: this.left, y: this.top },
            end: { x: this.left, y: this.bottom },
        };
        var bottomBorder = {
            start: { x: this.right, y: this.top },
            end: { x: this.right, y: this.bottom },
        };
        this.borders = [leftBorder, bottomBorder];
    }
    Road.prototype.getLaneCenter = function (laneIndex) {
        laneIndex = clamp(laneIndex, 0, this.laneCount - 1);
        var laneWidth = this.width / this.laneCount;
        return (linearInterpolation(this.left, this.right, laneIndex / this.laneCount) +
            laneWidth / 2);
    };
    Road.prototype.draw = function (ctx) {
        ctx.lineWidth = 4;
        ctx.strokeStyle = "white";
        this.borders.forEach(function (border) {
            ctx.beginPath();
            ctx.moveTo(border.start.x, border.start.y);
            ctx.lineTo(border.end.x, border.end.y);
            ctx.stroke();
        });
        for (var i = 1; i < this.laneCount; i++) {
            var linePosition = linearInterpolation(this.left, this.right, i / this.laneCount);
            ctx.beginPath();
            ctx.setLineDash([20, 25]);
            ctx.moveTo(linePosition, this.bottom);
            ctx.lineTo(linePosition, this.top);
            ctx.stroke();
        }
    };
    return Road;
}());
