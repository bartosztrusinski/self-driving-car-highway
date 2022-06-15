"use strict";
class Controls {
    constructor() {
        this.keyboard = {};
        this.enableKeyboard();
    }
    enableKeyboard() {
        document.addEventListener("keydown", (e) => {
            this.keyboard[e.key] = true;
        });
        document.addEventListener("keyup", (e) => {
            this.keyboard[e.key] = false;
        });
    }
    isUpPressed() {
        return this.keyboard["w"] || this.keyboard["ArrowUp"];
    }
    isDownPressed() {
        return this.keyboard["s"] || this.keyboard["ArrowDown"];
    }
    isLeftPressed() {
        return this.keyboard["a"] || this.keyboard["ArrowLeft"];
    }
    isRightPressed() {
        return this.keyboard["d"] || this.keyboard["ArrowRight"];
    }
}
