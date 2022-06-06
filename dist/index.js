"use strict";
var canvas = document.querySelector("#canvas");
if (!canvas) {
    throw new Error("Canvas not found");
}
canvas.width = 400;
canvas.height = window.innerHeight;
