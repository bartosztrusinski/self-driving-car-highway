export default interface Controls {
  isUpPressed(): boolean;
  isDownPressed(): boolean;
  isLeftPressed(): boolean;
  isRightPressed(): boolean;
}

export class KeyboardControls implements Controls {
  private keyboard: { [key: string]: boolean } = {};

  constructor() {
    this.enableKeyboard();
  }

  public isUpPressed() {
    return this.isKeyPressed("w") || this.isKeyPressed("ArrowUp");
  }

  public isDownPressed() {
    return this.isKeyPressed("s") || this.isKeyPressed("ArrowDown");
  }

  public isLeftPressed() {
    return this.isKeyPressed("a") || this.isKeyPressed("ArrowLeft");
  }

  public isRightPressed() {
    return this.isKeyPressed("d") || this.isKeyPressed("ArrowRight");
  }

  private isKeyPressed(key: string) {
    return this.keyboard[key];
  }

  private enableKeyboard() {
    document.addEventListener("keydown", (e) => {
      this.keyboard[e.key] = true;
    });
    document.addEventListener("keyup", (e) => {
      this.keyboard[e.key] = false;
    });
  }
}
