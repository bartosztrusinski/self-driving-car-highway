const canvas: HTMLCanvasElement | null = document.querySelector("#canvas");

if (!canvas) {
  throw new Error("Canvas not found");
}

canvas.width = 400;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

if (!ctx) {
  throw new Error("Canvas context not found");
}

const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 0, "red", "controls");
const traffic = [
  new Car(road.getLaneCenter(0), -400, "blue", "traffic"),
  new Car(road.getLaneCenter(1), -400, "blue", "traffic"),
  new Car(road.getLaneCenter(1), -800, "blue", "traffic"),
  new Car(road.getLaneCenter(2), -800, "blue", "traffic"),
  new Car(road.getLaneCenter(0), -1200, "blue", "traffic"),
  new Car(road.getLaneCenter(2), -1200, "blue", "traffic"),
];

const animate = () => {
  canvas.height = window.innerHeight;
  ctx.translate(0, -car.getCoords().y + canvas.height * 0.7);

  const obstacles = [...road.getBorders()];
  for (let trafficCar of traffic) obstacles.push(...trafficCar.getPolygon());

  road.draw(ctx);

  car.update(obstacles);
  car.draw(ctx, obstacles);

  for (let trafficCar of traffic) {
    trafficCar.update([]);
    trafficCar.draw(ctx, []);
  }

  requestAnimationFrame(animate);
};

animate();
