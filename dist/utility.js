"use strict";
function linearInterpolation(start, end, t) {
    return start + (end - start) * t;
}
function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}
