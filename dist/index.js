"use strict";
var canvas = document.querySelector("#canvas");
if (!canvas) {
    throw new Error("Canvas not found");
}
canvas.width = 200;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");
if (!ctx) {
    throw new Error("Canvas context not found");
}
var road = new Road(canvas.width / 2, canvas.width * 0.9);
var car = new Car(road.getLaneCenter(1), 300, 30, 50);
animate();
function animate() {
    ctx === null || ctx === void 0 ? void 0 : ctx.save();
    canvas.height = window.innerHeight;
    ctx === null || ctx === void 0 ? void 0 : ctx.translate(0, -car.getCoords().y + canvas.height * 0.7);
    car.updatePosition();
    road.draw(ctx);
    car.draw(ctx);
    ctx === null || ctx === void 0 ? void 0 : ctx.restore();
    requestAnimationFrame(animate);
}
