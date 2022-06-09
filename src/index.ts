const canvas: HTMLCanvasElement | null = document.querySelector("#canvas");

if (!canvas) {
  throw new Error("Canvas not found");
}

canvas.width = 200;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

if (!ctx) {
  throw new Error("Canvas context not found");
}

const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 300, 30, 50);

animate();

function animate() {
  ctx?.save();

  canvas.height = window.innerHeight;
  ctx?.translate(0, -car.getCoords().y + canvas.height * 0.7);
  car.updatePosition();
  road.draw(ctx);
  car.draw(ctx);

  ctx?.restore();

  requestAnimationFrame(animate);
}
