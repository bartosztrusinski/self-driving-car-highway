"use strict";
const canvas = document.querySelector("#canvas");
const saveBtn = document.querySelector("#save");
const discardBtn = document.querySelector("#discard");
if (!canvas || !saveBtn || !discardBtn) {
    throw new Error("Canvas or buttons not found");
}
const ctx = canvas.getContext("2d");
if (!ctx) {
    throw new Error("Canvas context not found");
}
canvas.width = 400;
canvas.height = window.innerHeight;
const road = new Road(canvas.width / 2, canvas.width * 0.9);
const N = 500;
const cars = createCars(N);
let bestCar = cars[0];
const brain = localStorage.getItem("bestBrain");
if (brain) {
    for (let car of cars) {
        car.brain = JSON.parse(brain);
        NeuralNetwork.mutate(car.brain, 0.1);
    }
}
saveBtn.addEventListener("click", () => {
    if (bestCar.brain)
        saveBrain(bestCar.brain);
});
discardBtn.addEventListener("click", () => {
    discardBrain();
});
function saveBrain(brain) {
    localStorage.setItem("bestBrain", JSON.stringify(brain));
}
function discardBrain() {
    localStorage.removeItem("bestBrain");
}
function createCars(num) {
    const cars = [];
    for (let i = 0; i < num; i++) {
        cars.push(new Car(road.getLaneCenter(1), 0, "red", "ai"));
    }
    return cars;
}
const traffic = [
    new Car(road.getLaneCenter(1), -400, "blue", "traffic"),
    new Car(road.getLaneCenter(0), -800, "green", "traffic"),
    new Car(road.getLaneCenter(2), -800, "green", "traffic"),
    new Car(road.getLaneCenter(0), -1200, "blue", "traffic"),
    new Car(road.getLaneCenter(2), -1200, "blue", "traffic"),
    new Car(road.getLaneCenter(1), -1500, "yellow", "traffic"),
];
const animate = () => {
    bestCar = cars.find((car) => car.getCoords().y === Math.min(...cars.map((car) => car.getCoords().y)));
    canvas.height = window.innerHeight;
    ctx.translate(0, -bestCar.getCoords().y + canvas.height * 0.7);
    const obstacles = [...road.getBorders()];
    for (let trafficCar of traffic)
        obstacles.push(...trafficCar.getPolygon());
    road.draw(ctx);
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < cars.length; i++) {
        cars[i].update(obstacles);
        cars[i].draw(ctx);
    }
    ctx.globalAlpha = 1;
    bestCar.draw(ctx, true);
    for (let trafficCar of traffic) {
        trafficCar.update([]);
        trafficCar.draw(ctx);
    }
    requestAnimationFrame(animate);
};
animate();
