import { Polygon, Line, Intersection } from "./types";

export function getRandomNumber(min: number, max: number) {
  return Math.floor(linearInterpolation(min, max + 1, Math.random()));
}

export function getRandomElement<T>(arr: T[]) {
  return arr.length ? arr[getRandomNumber(0, arr.length - 1)] : undefined;
}

export function getRandomEnum<T>(someEnum: T) {
  const enumValues = Object.keys(someEnum)
    .map((n) => Number.parseInt(n))
    .filter((n) => !Number.isNaN(n)) as unknown as T[keyof T][];
  return getRandomElement(enumValues);
}

export function linearInterpolation(start: number, end: number, t: number) {
  return start + (end - start) * t;
}

export function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}

export function getIntersection(A: Line, B: Line): Intersection | null {
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

export function polysIntersect(polyA: Polygon, polyB: Polygon) {
  for (let lineA of polyA) {
    for (let lineB of polyB) {
      if (getIntersection(lineA, lineB)) return true;
    }
  }
  return false;
}
