interface NeuralNetworkInterface {}

class NeuralNetwork {
  levels: Level[] = [];
  outputs: number[] = [];

  constructor(neuronCounts: number[]) {
    for (let i = 0; i < neuronCounts.length - 1; i++) {
      this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
    }
  }

  static feedForward(inputs: number[], network: NeuralNetwork) {
    network.outputs = Level.feedForward(inputs, network.levels[0]);
    for (let i = 1; i < network.levels.length; i++) {
      network.outputs = Level.feedForward(network.outputs, network.levels[i]);
    }
  }

  static mutate(network: NeuralNetwork, mutationRate: number) {
    for (let level of network.levels) {
      for (let i = 0; i < level.weights.length; i++) {
        for (let j = 0; j < level.weights[i].length; j++) {
          level.weights[i][j] = linearInterpolation(
            level.weights[i][j],
            Math.random() * 2 - 1,
            mutationRate
          );
        }
      }

      for (let i = 0; i < level.biases.length; i++) {
        level.biases[i] = linearInterpolation(
          level.biases[i],
          Math.random() * 2 - 1,
          mutationRate
        );
      }
    }
  }
}

class Level {
  private inputs: number[] = [];
  private outputs: number[] = [];
  weights: number[][];
  biases: number[];

  constructor(inputsCount: number, outputsCount: number) {
    this.inputs = new Array(inputsCount);
    this.outputs = new Array(outputsCount);
    this.weights = new Array(inputsCount)
      .fill(0)
      .map(() => new Array(outputsCount));
    this.biases = new Array(outputsCount);

    this.setWeights();
    this.setBiases();
  }

  private setWeights() {
    for (let i = 0; i < this.weights.length; i++) {
      for (let j = 0; j < this.outputs.length; j++) {
        this.weights[i][j] = Math.random() * 2 - 1;
      }
    }
  }

  private setBiases() {
    for (let i = 0; i < this.outputs.length; i++) {
      this.biases[i] = Math.random() * 2 - 1;
    }
  }

  private static setOutputs(level: Level) {
    for (let i = 0; i < level.outputs.length; i++) {
      let sum = 0;
      for (let j = 0; j < level.inputs.length; j++) {
        sum += level.inputs[j] * level.weights[j][i];
      }

      level.outputs[i] = sum > level.biases[i] ? 1 : 0;
    }
  }

  static feedForward(inputs: number[], level: Level) {
    level.inputs = inputs;
    Level.setOutputs(level);
    return level.outputs;
  }
}
