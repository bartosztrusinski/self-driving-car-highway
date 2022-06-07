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
var car = new Car(100, 100, 30, 50);
animate();
function animate() {
    car.draw(ctx);
    car.move();
    requestAnimationFrame(animate);
}
