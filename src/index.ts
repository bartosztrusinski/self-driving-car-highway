import Simulation from '../src/Simulation';
import Road from '../src/Road';
import Sensor from './Sensor';
import { Rectangle } from './Shape';
import { Color } from './types';

const canvas = document.querySelector('#canvas') as HTMLCanvasElement;
const saveBtn = document.querySelector('#save') as HTMLButtonElement;
const discardBtn = document.querySelector('#discard') as HTMLButtonElement;
canvas.width = 400;

const simulation = new Simulation(
  canvas,
  saveBtn,
  discardBtn,
  new Road(canvas.width / 2, canvas.width * 0.9, 3)
);

simulation.createTraffic(15, 300);

simulation.carConfig = {
  x: simulation.getRoadLaneCenter(1),
  color: Color.Orange,
  sensor: new Sensor(Math.PI / 2, 7, 300),
};
simulation.parallelizeAICars(200);

simulation.carConfig = {
  x: simulation.getRoadLaneCenter(2),
  color: Color.RebeccaPurple,
  shape: new Rectangle(60, 120),
};
simulation.createKeyboardControlledCar();

simulation.init();
