interface Controls {
  isUpPressed(): boolean;
  isDownPressed(): boolean;
  isLeftPressed(): boolean;
  isRightPressed(): boolean;
}

class KeyboardControls implements Controls {
  private keyboard: { [key: string]: boolean } = {};

  constructor() {
    this.enableKeyboard();
  }

  private enableKeyboard() {
    document.addEventListener("keydown", (e) => {
      this.keyboard[e.key] = true;
    });
    document.addEventListener("keyup", (e) => {
      this.keyboard[e.key] = false;
    });
  }

  public isUpPressed() {
    return this.keyboard["w"] || this.keyboard["ArrowUp"];
  }

  public isDownPressed() {
    return this.keyboard["s"] || this.keyboard["ArrowDown"];
  }

  public isLeftPressed() {
    return this.keyboard["a"] || this.keyboard["ArrowLeft"];
  }

  public isRightPressed() {
    return this.keyboard["d"] || this.keyboard["ArrowRight"];
  }
}
