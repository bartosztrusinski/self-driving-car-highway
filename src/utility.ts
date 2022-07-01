interface Point {
  x: number;
  y: number;
}

interface Line {
  start: Point;
  end: Point;
}

interface Animated {
  update(arg: any): void;
}

type Polygon = Line[];

function getRandomElement(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function linearInterpolation(start: number, end: number, t: number) {
  return start + (end - start) * t;
}

function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}

function getIntersection(A: Line, B: Line) {
  const numeratorT =
    (B.end.x - B.start.x) * (A.start.y - B.start.y) -
    (B.end.y - B.start.y) * (A.start.x - B.start.x);
  const numeratorU =
    (B.start.y - A.start.y) * (A.start.x - A.end.x) -
    (B.start.x - A.start.x) * (A.start.y - A.end.y);
  const denominator =
    (B.end.y - B.start.y) * (A.end.x - A.start.x) -
    (B.end.x - B.start.x) * (A.end.y - A.start.y);

  if (denominator === 0) return null;

  const t = numeratorT / denominator;
  const u = numeratorU / denominator;

  if (t < 0 || t > 1 || u < 0 || u > 1) return null;

  return {
    x: linearInterpolation(A.start.x, A.end.x, t),
    y: linearInterpolation(A.start.y, A.end.y, t),
    offset: t,
  };
}

function polysIntersect(polyA: Polygon, polyB: Polygon) {
  for (let lineA of polyA) {
    for (let lineB of polyB) {
      if (getIntersection(lineA, lineB)) return true;
    }
  }
  return false;
}
