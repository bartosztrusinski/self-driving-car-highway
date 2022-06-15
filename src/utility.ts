interface Point {
  x: number;
  y: number;
}

interface Line {
  start: Point;
  end: Point;
}

function linearInterpolation(start: number, end: number, t: number) {
  return start + (end - start) * t;
}

function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}

function getIntersection(A: Point, B: Point, C: Point, D: Point) {
  const numeratorT = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const numeratorU = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const denominator = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  if (denominator === 0) return null;

  const t = numeratorT / denominator;
  const u = numeratorU / denominator;

  if (t < 0 || t > 1 || u < 0 || u > 1) return null;

  return {
    x: linearInterpolation(A.x, B.x, t),
    y: linearInterpolation(A.y, B.y, t),
    offset: t,
  };
}

function polysIntersect(poly1: Line[], poly2: Line[]) {
  for (let A of poly1) {
    for (let B of poly2) {
      if (getIntersection(A.start, A.end, B.start, B.end)) {
        return true;
      }
    }
  }
  return false;
}
