import { Line } from './types';
import { clamp, linearInterpolation } from './utility';

const ROAD_LENGTH = 2000000;

export default class Road {
  private top = -ROAD_LENGTH / 2;
  private bottom = ROAD_LENGTH / 2;
  private left: number;
  private right: number;
  private _borders: Line[] = [];
  private _lines: Line[] = [];

  constructor(
    horizontalCenter: number,
    private width: number,
    private _laneCount: number
  ) {
    this.left = horizontalCenter - width / 2;
    this.right = horizontalCenter + width / 2;
    this.initBorders();
    this.initLines();
  }

  public get borders() {
    return [...this._borders];
  }

  public get lines() {
    return [...this._lines];
  }

  public get laneCount() {
    return this._laneCount;
  }

  public getLaneCenter(laneIndex: number) {
    const laneWidth = this.width / this.laneCount;
    laneIndex = clamp(laneIndex, 0, this.laneCount - 1);
    return (
      linearInterpolation(this.left, this.right, laneIndex / this.laneCount) +
      laneWidth / 2
    );
  }

  public getMiddleLaneCenter() {
    return this.getLaneCenter(Math.floor(this.laneCount / 2));
  }

  private initBorders() {
    const leftBorder: Line = {
      start: { x: this.left, y: this.top },
      end: { x: this.left, y: this.bottom },
    };
    const rightBorder: Line = {
      start: { x: this.right, y: this.top },
      end: { x: this.right, y: this.bottom },
    };
    this._borders = [leftBorder, rightBorder];
  }

  private initLines() {
    for (let i = 1; i < this.laneCount; i++) {
      const x = linearInterpolation(this.left, this.right, i / this.laneCount);
      this._lines.push({
        start: { x, y: this.bottom },
        end: { x, y: this.top },
      });
    }
  }
}
