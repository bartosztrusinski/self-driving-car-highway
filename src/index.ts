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

const car = new Car(100, 300, 30, 50);

animate();

function animate() {
  canvas.height = window.innerHeight;
  car.updatePosition();
  car.draw(ctx);
  requestAnimationFrame(animate);
}
