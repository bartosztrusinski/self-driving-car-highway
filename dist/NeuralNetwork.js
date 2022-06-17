"use strict";
class NeuralNetwork {
    constructor(neuronCounts) {
        this.levels = [];
        this.outputs = [];
        for (let i = 0; i < neuronCounts.length - 1; i++) {
            this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
        }
    }
    static feedForward(inputs, network) {
        network.outputs = Level.feedForward(inputs, network.levels[0]);
        for (let i = 1; i < network.levels.length; i++) {
            network.outputs = Level.feedForward(network.outputs, network.levels[i]);
        }
    }
    static mutate(network, mutationRate) {
        for (let level of network.levels) {
            for (let i = 0; i < level.weights.length; i++) {
                for (let j = 0; j < level.weights[i].length; j++) {
                    level.weights[i][j] = linearInterpolation(level.weights[i][j], Math.random() * 2 - 1, mutationRate);
                }
            }
            for (let i = 0; i < level.biases.length; i++) {
                level.biases[i] = linearInterpolation(level.biases[i], Math.random() * 2 - 1, mutationRate);
            }
        }
    }
}
class Level {
    constructor(inputsCount, outputsCount) {
        this.inputs = [];
        this.outputs = [];
        this.inputs = new Array(inputsCount).fill(0);
        this.outputs = new Array(outputsCount).fill(0);
        this.weights = new Array(inputsCount)
            .fill(0)
            .map(() => new Array(outputsCount).fill(0));
        this.biases = new Array(outputsCount).fill(0);
        this.setWeights();
        this.setBiases();
    }
    setWeights() {
        for (let i = 0; i < this.weights.length; i++) {
            for (let j = 0; j < this.outputs.length; j++) {
                this.weights[i][j] = Math.random() * 2 - 1;
            }
        }
    }
    setBiases() {
        for (let i = 0; i < this.outputs.length; i++) {
            this.biases[i] = Math.random() * 2 - 1;
        }
    }
    static feedForward(inputs, level) {
        // level.setInputs(inputs);
        level.inputs = inputs;
        // level.setOutputs();
        for (let i = 0; i < level.outputs.length; i++) {
            let sum = 0;
            for (let j = 0; j < level.inputs.length; j++) {
                sum += level.inputs[j] * level.weights[j][i];
            }
            if (sum > level.biases[i]) {
                level.outputs[i] = 1;
            }
            else {
                level.outputs[i] = 0;
            }
        }
        return level.outputs;
    }
}
