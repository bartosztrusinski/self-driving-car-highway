class Road {
  private left: number;
  private right: number;
  private top: number;
  private bottom: number;
  public borders: Line[] = [];
  public lines: Line[] = [];

  constructor(
    horizontalCenter: number,
    private width: number,
    private laneCount: number
  ) {
    const infinity = 1000000;
    this.top = -infinity;
    this.bottom = infinity;
    this.left = horizontalCenter - width / 2;
    this.right = horizontalCenter + width / 2;
    this.laneCount = laneCount;

    this.setBorders();
    this.setLines();
  }

  public getLaneCount() {
    return this.laneCount;
  }

  public getLaneCenter(laneIndex: number) {
    laneIndex = clamp(laneIndex, 0, this.laneCount - 1);

    const laneWidth = this.width / this.laneCount;
    return (
      linearInterpolation(this.left, this.right, laneIndex / this.laneCount) +
      laneWidth / 2
    );
  }

  private setBorders() {
    const leftBorder: Line = {
      start: { x: this.left, y: this.top },
      end: { x: this.left, y: this.bottom },
    };
    const bottomBorder: Line = {
      start: { x: this.right, y: this.top },
      end: { x: this.right, y: this.bottom },
    };

    this.borders = [leftBorder, bottomBorder];
  }

  private setLines() {
    this.lines = [];
    for (let i = 1; i < this.laneCount; i++) {
      const x = linearInterpolation(this.left, this.right, i / this.laneCount);
      this.lines.push({
        start: { x, y: this.bottom },
        end: { x, y: this.top },
      });
    }
  }
}
