"use strict";
function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
function linearInterpolation(start, end, t) {
    return start + (end - start) * t;
}
function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}
function getIntersection(A, B) {
    const numeratorT = (B.end.x - B.start.x) * (A.start.y - B.start.y) -
        (B.end.y - B.start.y) * (A.start.x - B.start.x);
    const numeratorU = (B.start.y - A.start.y) * (A.start.x - A.end.x) -
        (B.start.x - A.start.x) * (A.start.y - A.end.y);
    const denominator = (B.end.y - B.start.y) * (A.end.x - A.start.x) -
        (B.end.x - B.start.x) * (A.end.y - A.start.y);
    if (denominator === 0)
        return null;
    const t = numeratorT / denominator;
    const u = numeratorU / denominator;
    if (t < 0 || t > 1 || u < 0 || u > 1)
        return null;
    return {
        x: linearInterpolation(A.start.x, A.end.x, t),
        y: linearInterpolation(A.start.y, A.end.y, t),
        offset: t,
    };
}
function polysIntersect(polyA, polyB) {
    for (let lineA of polyA) {
        for (let lineB of polyB) {
            if (getIntersection(lineA, lineB))
                return true;
        }
    }
    return false;
}
