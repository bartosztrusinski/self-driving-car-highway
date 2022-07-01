"use strict";
class CanvasSimulation {
    constructor() {
        this.saveBtn = document.querySelector("#save");
        this.discardBtn = document.querySelector("#discard");
        this.canvas = document.querySelector("#canvas");
        this.ctx = this.canvas.getContext("2d");
        this.traffic = [];
        this.aiCars = [];
        this.bestCar = null;
        this.keyboardCar = null;
        this.obstacles = [];
        this.levelHeight = 400;
        this.trafficColors = [
            "cornsilk",
            "cadetblue",
            "coral",
            "rebeccapurple",
            "steelblue",
            "mediumaquamarine",
            "paleturquoise",
        ];
        this.roadRenderer = new RoadRenderer(this.ctx);
        this.carRenderer = new CarRenderer(this.ctx);
        this.sensorRenderer = new SensorRenderer(this.ctx);
        this.animate = () => {
            this.setCameraOnBestCar();
            this.getObstacles();
            this.renderRoad();
            this.renderCarsUponUpdating();
            requestAnimationFrame(this.animate);
        };
        this.canvas.height = window.innerHeight;
        this.canvas.width = 400;
        this.enableStorageButtons();
    }
    createRoad(widthPercentage, lanes) {
        this.road = new Road(this.canvas.width / 2, this.canvas.width * widthPercentage, lanes);
    }
    createKeyboardCar(lane, shape, color) {
        this.keyboardCar = new KeyboardCar(this.road.getLaneCenter(lane), 0, color, shape);
    }
    createTraffic(levelsCount, shape) {
        this.traffic = [];
        for (let i = 1; i <= levelsCount; i++) {
            const laneToKeepOpen = Math.floor(Math.random() * this.road.getLaneCount());
            for (let laneIndex = 0; laneIndex < this.road.getLaneCount(); laneIndex++) {
                if (laneIndex === laneToKeepOpen)
                    continue;
                this.traffic.push(new TrafficCar(this.road.getLaneCenter(laneIndex), -i * this.levelHeight, getRandomElement(this.trafficColors), shape));
            }
        }
    }
    parallelizeAICars(carsCount, lane, shape, color, rayCount) {
        this.aiCars = [];
        for (let i = 0; i < carsCount; i++) {
            this.aiCars.push(new AICar(this.road.getLaneCenter(lane), 0, color, shape, rayCount));
        }
        this.bestCar = this.aiCars[0];
        this.applyBestBrainWithMutation();
    }
    applyBestBrainWithMutation() {
        const savedBrain = this.getBestBrain();
        if (!savedBrain)
            return;
        for (let i = 0; i < this.aiCars.length; i++) {
            this.aiCars[i].brain = JSON.parse(savedBrain);
            if (i > 0)
                NeuralNetwork.mutate(this.aiCars[i].brain, 0.1);
        }
    }
    setCameraOnBestCar() {
        this.findBestCar();
        if (!this.bestCar)
            return;
        this.canvas.height = window.innerHeight;
        this.ctx.translate(0, -this.bestCar.y + this.canvas.height * 0.7);
    }
    findBestCar() {
        if (!this.aiCars.length)
            return;
        this.bestCar = this.aiCars.find((car) => car.y === Math.min(...this.aiCars.map((car) => car.y)));
    }
    getObstacles() {
        this.obstacles = [...this.road.borders];
        if (!this.traffic.length)
            return;
        for (let car of this.traffic) {
            this.obstacles.push(...car.polygon);
        }
    }
    renderRoad() {
        this.roadRenderer.render(this.road);
    }
    renderCarsUponUpdating() {
        if (this.traffic.length) {
            this.traffic.forEach((car) => {
                car.update();
                this.carRenderer.render(car);
            });
        }
        if (this.aiCars.length) {
            this.aiCars.forEach((car) => {
                car.update(this.obstacles);
                this.ctx.globalAlpha = 0.7;
                this.carRenderer.render(car);
                car.sensor.disable();
                this.sensorRenderer.render(car.sensor);
                this.ctx.globalAlpha = 1;
            });
            if (this.bestCar) {
                this.carRenderer.render(this.bestCar);
                this.bestCar.sensor.enable();
                this.sensorRenderer.render(this.bestCar.sensor);
            }
        }
        if (this.keyboardCar) {
            this.keyboardCar.update(this.obstacles);
            this.carRenderer.render(this.keyboardCar);
        }
    }
    enableStorageButtons() {
        this.saveBtn.addEventListener("click", () => {
            this.saveBestBrain();
        });
        this.discardBtn.addEventListener("click", () => {
            this.discardBestBrain();
        });
    }
    saveBestBrain() {
        if (!this.bestCar)
            return;
        localStorage.setItem("bestBrain", JSON.stringify(this.bestCar.brain));
    }
    discardBestBrain() {
        localStorage.removeItem("bestBrain");
    }
    getBestBrain() {
        return localStorage.getItem("bestBrain");
    }
}
const simulation = new CanvasSimulation();
const rect = new Rectangle(60, 100);
simulation.createRoad(0.9, 3);
simulation.parallelizeAICars(300, 1, rect, "red", 5);
simulation.createTraffic(15, rect);
simulation.createKeyboardCar(2, rect, "aquamarine");
simulation.animate();
