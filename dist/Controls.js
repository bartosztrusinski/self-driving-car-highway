"use strict";
var Controls = /** @class */ (function () {
    function Controls() {
        this.keyboard = {};
        this.enableKeyboard();
    }
    Controls.prototype.enableKeyboard = function () {
        var _this = this;
        document.addEventListener("keydown", function (e) {
            _this.keyboard[e.key] = true;
        });
        document.addEventListener("keyup", function (e) {
            _this.keyboard[e.key] = false;
        });
    };
    Controls.prototype.isUpPressed = function () {
        return this.keyboard["w"] || this.keyboard["ArrowUp"];
    };
    Controls.prototype.isDownPressed = function () {
        return this.keyboard["s"] || this.keyboard["ArrowDown"];
    };
    Controls.prototype.isLeftPressed = function () {
        return this.keyboard["a"] || this.keyboard["ArrowLeft"];
    };
    Controls.prototype.isRightPressed = function () {
        return this.keyboard["d"] || this.keyboard["ArrowRight"];
    };
    return Controls;
}());
