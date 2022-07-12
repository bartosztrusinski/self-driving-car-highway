import { linearInterpolation } from "./utility";

export default class NeuralNetwork {
  public outputs: number[] = [];
  private levels: Level[] = [];

  constructor(neuronCounts: number[]) {
    for (let i = 0; i < neuronCounts.length - 1; i++) {
      this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
    }
  }

  public static feedForward(network: NeuralNetwork, inputs: number[]) {
    network.outputs = Level.feedForward(inputs, network.levels[0]);
    for (let i = 1; i < network.levels.length; i++) {
      network.outputs = Level.feedForward(network.outputs, network.levels[i]);
    }
  }

  public static mutate(network: NeuralNetwork, mutationRate: number) {
    for (let level of network.levels) {
      Level.mutate(level, mutationRate);
    }
  }
}

class Level {
  private inputs: number[];
  private weights: number[][];
  private biases: number[];
  private outputs: number[];

  constructor(inputsCount: number, outputsCount: number) {
    this.inputs = new Array(inputsCount);
    this.weights = new Array(inputsCount)
      .fill(0)
      .map(() => new Array(outputsCount));
    this.biases = new Array(outputsCount);
    this.outputs = new Array(outputsCount);

    this.setWeights();
    this.setBiases();
  }

  public static feedForward(inputs: number[], level: Level) {
    level.inputs = inputs;
    Level.setOutputs(level);
    return level.outputs;
  }

  private static setOutputs(level: Level) {
    for (let i = 0; i < level.outputs.length; i++) {
      let inputsSum = 0;
      for (let j = 0; j < level.inputs.length; j++) {
        inputsSum += level.inputs[j] * level.weights[j][i];
      }

      level.outputs[i] = inputsSum > level.biases[i] ? 1 : 0;
    }
  }

  public static mutate(level: Level, mutationRate: number) {
    Level.mutateWeights(level, mutationRate);
    Level.mutateBiases(level, mutationRate);
  }

  private static mutateWeights(level: Level, mutationRate: number) {
    for (let i = 0; i < level.weights.length; i++) {
      for (let j = 0; j < level.weights[i].length; j++) {
        level.weights[i][j] = linearInterpolation(
          level.weights[i][j],
          linearInterpolation(-1, 1, Math.random()),
          mutationRate
        );
      }
    }
  }

  private static mutateBiases(level: Level, mutationRate: number) {
    for (let i = 0; i < level.biases.length; i++) {
      level.biases[i] = linearInterpolation(
        level.biases[i],
        linearInterpolation(-1, 1, Math.random()),
        mutationRate
      );
    }
  }

  private setWeights() {
    for (let i = 0; i < this.weights.length; i++) {
      for (let j = 0; j < this.outputs.length; j++) {
        this.weights[i][j] = linearInterpolation(-1, 1, Math.random());
      }
    }
  }

  private setBiases() {
    for (let i = 0; i < this.outputs.length; i++) {
      this.biases[i] = linearInterpolation(-1, 1, Math.random());
    }
  }
}
