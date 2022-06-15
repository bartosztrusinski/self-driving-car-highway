class Road {
  private left: number;
  private right: number;
  private top: number;
  private bottom: number;
  private borders: Line[];

  constructor(
    horizontalCenter: number,
    private width: number,
    private laneCount = 3
  ) {
    const infinity = 1000000;
    this.top = -infinity;
    this.bottom = infinity;
    this.left = horizontalCenter - width / 2;
    this.right = horizontalCenter + width / 2;
    this.laneCount = laneCount;

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

  public getLaneCenter(laneIndex: number) {
    laneIndex = clamp(laneIndex, 0, this.laneCount - 1);

    const laneWidth = this.width / this.laneCount;
    return (
      linearInterpolation(this.left, this.right, laneIndex / this.laneCount) +
      laneWidth / 2
    );
  }

  public getBorders() {
    return this.borders;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = 4;
    ctx.strokeStyle = "white";

    ctx.setLineDash([40, 40]);
    for (let i = 1; i < this.laneCount; i++) {
      const linePosition = linearInterpolation(
        this.left,
        this.right,
        i / this.laneCount
      );
      ctx.beginPath();
      ctx.moveTo(linePosition, this.bottom);
      ctx.lineTo(linePosition, this.top);
      ctx.stroke();
    }

    ctx.setLineDash([]);
    this.borders.forEach((border) => {
      ctx.beginPath();
      ctx.moveTo(border.start.x, border.start.y);
      ctx.lineTo(border.end.x, border.end.y);
      ctx.stroke();
    });
  }
}
