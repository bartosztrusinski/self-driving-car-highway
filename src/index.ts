class CanvasSimulation {
  saveBtn = document.querySelector("#save") as HTMLButtonElement;
  discardBtn = document.querySelector("#discard") as HTMLButtonElement;

  canvas = document.querySelector("#canvas") as HTMLCanvasElement;
  ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

  road!: Road;
  traffic: TrafficCar[] = [];
  aiCars: AICar[] = [];
  bestCar: AICar | null = null;
  keyboardCar: KeyboardCar | null = null;
  obstacles: Line[] = [];
  levelHeight = 400;
  trafficColors = [
    "cornsilk",
    "cadetblue",
    "coral",
    "rebeccapurple",
    "steelblue",
    "mediumaquamarine",
    "paleturquoise",
  ];
  roadRenderer = new RoadRenderer(this.ctx);
  carRenderer = new CarRenderer(this.ctx);
  sensorRenderer = new SensorRenderer(this.ctx);

  constructor() {
    this.canvas.height = window.innerHeight;
    this.canvas.width = 400;
    this.enableStorageButtons();
  }

  public createRoad(widthPercentage: number, lanes: number) {
    this.road = new Road(
      this.canvas.width / 2,
      this.canvas.width * widthPercentage,
      lanes
    );
  }

  public createKeyboardCar(lane: number, shape: Shape, color: string) {
    this.keyboardCar = new KeyboardCar(
      this.road.getLaneCenter(lane),
      0,
      color,
      shape
    );
  }

  public createTraffic(levelsCount: number, shape: Shape) {
    this.traffic = [];

    for (let i = 1; i <= levelsCount; i++) {
      const laneToKeepOpen = Math.floor(
        Math.random() * this.road.getLaneCount()
      );
      for (
        let laneIndex = 0;
        laneIndex < this.road.getLaneCount();
        laneIndex++
      ) {
        if (laneIndex === laneToKeepOpen) continue;
        this.traffic.push(
          new TrafficCar(
            this.road.getLaneCenter(laneIndex),
            -i * this.levelHeight,
            getRandomElement(this.trafficColors),
            shape
          )
        );
      }
    }
  }

  public parallelizeAICars(
    carsCount: number,
    lane: number,
    shape: Shape,
    color: string,
    rayCount: number
  ) {
    this.aiCars = [];
    for (let i = 0; i < carsCount; i++) {
      this.aiCars.push(
        new AICar(this.road.getLaneCenter(lane), 0, color, shape, rayCount)
      );
    }
    this.bestCar = this.aiCars[0];

    this.applyBestBrainWithMutation();
  }

  private applyBestBrainWithMutation() {
    const savedBrain = this.getBestBrain();
    if (!savedBrain) return;
    for (let i = 0; i < this.aiCars.length; i++) {
      this.aiCars[i].brain = JSON.parse(savedBrain);
      if (i > 0) NeuralNetwork.mutate(this.aiCars[i].brain, 0.1);
    }
  }

  public animate = () => {
    this.setCameraOnBestCar();
    this.getObstacles();
    this.renderRoad();
    this.renderCarsUponUpdating();
    requestAnimationFrame(this.animate);
  };

  private setCameraOnBestCar() {
    this.findBestCar();
    if (!this.bestCar) return;

    this.canvas.height = window.innerHeight;
    this.ctx.translate(0, -this.bestCar.y + this.canvas.height * 0.7);
  }

  private findBestCar() {
    if (!this.aiCars.length) return;

    this.bestCar = this.aiCars.find(
      (car) => car.y === Math.min(...this.aiCars.map((car) => car.y))
    )!;
  }

  private getObstacles() {
    this.obstacles = [...this.road.borders];

    if (!this.traffic.length) return;
    for (let car of this.traffic) {
      this.obstacles.push(...car.polygon);
    }
  }

  private renderRoad() {
    this.roadRenderer.render(this.road);
  }

  private renderCarsUponUpdating() {
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

  private enableStorageButtons() {
    this.saveBtn.addEventListener("click", () => {
      this.saveBestBrain();
    });

    this.discardBtn.addEventListener("click", () => {
      this.discardBestBrain();
    });
  }

  private saveBestBrain() {
    if (!this.bestCar) return;
    localStorage.setItem("bestBrain", JSON.stringify(this.bestCar.brain));
  }

  private discardBestBrain() {
    localStorage.removeItem("bestBrain");
  }

  private getBestBrain() {
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
