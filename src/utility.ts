interface Coords {
  x: number;
  y: number;
}

function linearInterpolation(start: number, end: number, t: number) {
  return start + (end - start) * t;
}

function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}
