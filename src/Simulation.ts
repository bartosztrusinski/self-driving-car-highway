import { Car, AICar, TrafficCar, KeyboardCar, hasSensor } from "./Car";
import Road from "./Road";
import Sensor from "./Sensor";
import UIDataStore from "./DataStore";
import Controls from "./Controls";
import NeuralNetwork from "./NeuralNetwork";
import Shape from "./Shape";
import Canvas, { CtxConfig } from "./Canvas";
import { Line, Color } from "./types";
import { getRandomNumber } from "./utility";

interface CarConfig {
  x: number;
  y: number;
  shape: Shape;
  color: Color;
  maxSpeed: number;
  acceleration: number;
  friction: number;
  rotationSpeed: number;
  sensor: Sensor;
  controls: Controls;
}

export default class Simulation {
  public carConfig: Partial<CarConfig> = {};
  private road: Road;
  private traffic: TrafficCar[] = [];
  private AICars: AICar[] = [];
  private keyboardCar?: KeyboardCar;
  private mutationRate = 0.2;
  private canvas: Canvas;
  private brainStore: UIDataStore<NeuralNetwork>;
  private startTime: number | null = null;

  constructor(
    canvasElement: HTMLCanvasElement,
    saveBtn: HTMLButtonElement,
    discardBtn: HTMLButtonElement,
    road: Road,
    mutationRate?: number
  ) {
    this.canvas = new Canvas(canvasElement);
    this.brainStore = new UIDataStore(saveBtn, discardBtn);
    this.road = road;
    this.mutationRate = mutationRate || this.mutationRate;
  }

  public getRoadLaneCenter(laneIndex: number) {
    return this.road.getLaneCenter(laneIndex);
  }

  public createKeyboardCar() {
    const {
      x,
      y,
      color,
      shape,
      controls,
      maxSpeed,
      acceleration,
      friction,
      rotationSpeed,
    } = this.carConfig;
    this.keyboardCar = new KeyboardCar(
      x,
      y,
      color,
      shape,
      controls,
      maxSpeed,
      acceleration,
      friction,
      rotationSpeed
    );
  }

  public createTraffic(levelCount: number, heightBetweenLevels: number) {
    this.traffic = [];
    for (let i = 1; i <= levelCount; i++) {
      const laneToKeepOpen = getRandomNumber(0, this.road.laneCount - 1);
      const levelHeight = -i * heightBetweenLevels;
      this.createTrafficLevel(laneToKeepOpen, levelHeight);
    }
  }

  private createTrafficLevel(laneToKeepOpen: number, levelHeight: number) {
    for (let laneIdx = 0; laneIdx < this.road.laneCount; laneIdx++) {
      if (laneIdx === laneToKeepOpen) continue;
      this.traffic.push(
        new TrafficCar(this.road.getLaneCenter(laneIdx), levelHeight)
      );
    }
  }

  public parallelizeAICars(carCount: number) {
    const {
      x,
      y,
      color,
      shape,
      sensor,
      maxSpeed,
      acceleration,
      friction,
      rotationSpeed,
    } = this.carConfig;
    this.AICars = [];
    for (let i = 0; i < carCount; i++) {
      this.AICars.push(
        new AICar(
          x,
          y,
          color,
          shape,
          sensor?.clone(),
          maxSpeed,
          acceleration,
          friction,
          rotationSpeed
        )
      );
    }

    this.setAIBrains();
  }

  private setAIBrains() {
    if (!this.brainStore.data) return;
    for (let i = 0; i < this.AICars.length; i++) {
      this.AICars[i].brain = this.brainStore.data;
      if (i > 0) NeuralNetwork.mutate(this.AICars[i].brain, this.mutationRate);
    }
  }

  public init() {
    requestAnimationFrame(this.animate);
  }

  private animate = (timestamp: number) => {
    const bestAICar = this.getFarthestAICar();
    const focusedCar = bestAICar || this.keyboardCar;
    this.canvas.height = window.innerHeight;
    focusedCar
      ? this.setCameraOn(focusedCar)
      : this.moveCameraForward(timestamp, 0.337);
    this.renderRoad();
    this.updateCars(this.getObstacles());
    this.renderCars();
    if (bestAICar) {
      this.renderCar(bestAICar, {}, true);
      this.brainStore.data = bestAICar.brain;
    }
    requestAnimationFrame(this.animate);
  };

  private getFarthestAICar() {
    return this.AICars.find(
      (car) => car.y === Math.min(...this.AICars.map((car) => car.y))
    );
  }

  private setCameraOn(car: Car) {
    this.canvas.setCameraHeight(car.y, 0.7);
  }

  private moveCameraForward(timestamp: number, speedRate: number) {
    if (!this.startTime) this.startTime = timestamp;
    const runtime = timestamp - this.startTime;
    this.canvas.setCameraHeight(-runtime * speedRate);
  }

  private getObstacles() {
    const obstacles = [...this.road.borders];
    this.traffic.forEach((car) => obstacles.push(...car.polygon));
    return obstacles;
  }

  private updateCars(obstacles: Line[]) {
    this.traffic.forEach((car) => car.update());
    this.AICars.forEach((car) => car.update(obstacles));
    this.keyboardCar?.update(obstacles);
  }

  private renderRoad() {
    this.canvas.configureContext();
    this.canvas.renderLines(this.road.borders);
    this.canvas.configureContext({ lineDash: [50, 50] });
    this.canvas.renderLines(this.road.lines);
  }

  private renderCars() {
    this.traffic.forEach((car) => this.renderCar(car));
    this.AICars.forEach((car) => this.renderCar(car, { globalAlpha: 0.5 }));
    if (this.keyboardCar) this.renderCar(this.keyboardCar);
  }

  private renderCar(
    car: Car,
    config: Partial<CtxConfig> = {},
    shouldSensorRender = false
  ) {
    this.canvas.configureContext({
      color: car.color,
      lineWidth: 1,
      ...config,
    });
    this.canvas.renderPolygon(car.polygon);
    if (hasSensor(car) && shouldSensorRender) {
      this.renderSensor(car.sensor);
    }
  }

  private renderSensor(
    sensor: Sensor,
    config: Partial<CtxConfig> = {},
    renderRaysBehindObstacles = true
  ) {
    this.canvas.configureContext({
      color: Color.Yellow,
      lineWidth: 3,
      ...config,
    });
    this.canvas.renderLines(sensor.rays);

    if (!renderRaysBehindObstacles) return;

    this.canvas.configureContext({
      color: Color.Black,
      lineWidth: 3,
      ...config,
    });
    this.canvas.renderLines(sensor.raysBehindObstacles);
  }
}
