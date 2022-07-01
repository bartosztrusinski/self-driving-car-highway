"use strict";
class LinesRenderer {
    render(ctx, lines) {
        for (let line of lines) {
            ctx.beginPath();
            ctx.moveTo(line.start.x, line.start.y);
            ctx.lineTo(line.end.x, line.end.y);
            ctx.stroke();
        }
    }
}
class PolygonRenderer {
    render(ctx, polygon) {
        ctx.beginPath();
        ctx.moveTo(polygon[0].start.x, polygon[0].start.y);
        for (let i = 1; i < polygon.length; i++) {
            ctx.lineTo(polygon[i].start.x, polygon[i].start.y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}
class CarRenderer {
    constructor(ctx) {
        this.ctx = ctx;
        this.ctx = ctx;
        this.renderer = new PolygonRenderer();
    }
    render(car) {
        this.ctx.fillStyle = car.color;
        this.ctx.strokeStyle = car.color;
        this.ctx.lineWidth = 5;
        this.ctx.setLineDash([]);
        this.renderer.render(this.ctx, car.polygon);
    }
}
class SensorRenderer {
    constructor(ctx) {
        this.ctx = ctx;
        this.ctx = ctx;
        this.renderer = new LinesRenderer();
    }
    render(sensor) {
        if (!sensor.isEnabled())
            return;
        this.ctx.lineWidth = 3;
        const { raysBefore, raysAfter } = sensor.getRaysSeparatedByOffsets();
        this.renderRays(raysBefore);
        this.renderRaysAfterTouch(raysAfter);
    }
    renderRays(rays) {
        this.ctx.strokeStyle = "yellow";
        this.renderer.render(this.ctx, rays);
    }
    renderRaysAfterTouch(rays) {
        this.ctx.strokeStyle = "black";
        this.renderer.render(this.ctx, rays);
    }
}
class RoadRenderer {
    constructor(ctx) {
        this.ctx = ctx;
        this.ctx = ctx;
        this.renderer = new LinesRenderer();
    }
    render(road) {
        this.renderBorders(road.borders);
        this.renderLaneLines(road.lines);
    }
    renderBorders(borders) {
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 6;
        this.ctx.setLineDash([]);
        this.renderer.render(this.ctx, borders);
    }
    renderLaneLines(lines) {
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 4;
        this.ctx.setLineDash([50, 50]);
        this.renderer.render(this.ctx, lines);
    }
}
