import * as tf from "@tensorflow/tfjs-node";
import fs from "fs";
import path from "path";

//NOTE LOAD DATASET
const dataDir = "./dataset";
let text = "";

const files = fs.readdirSync(dataDir);
files.forEach((file) => {
  text += fs.readFileSync(path.join(dataDir, file), "utf8") + "\n\n";
});

console.log("Dataset characters:", text.length);

//NOTE  CHARACTER MAPPING
const chars = Array.from(new Set(text));
const vocabSize = chars.length;

const char2idx = {};
const idx2char = {};

chars.forEach((c, i) => {
  char2idx[c] = i;
  idx2char[i] = c;
});

// Encode whole dataset
const encoded = Array.from(text).map((c) => char2idx[c]);

//NOTE SEQUENCE GENERATION
const seqLen = 100;
let xs = [];
let ys = [];

for (let i = 0; i < encoded.length - seqLen; i++) {
  const inputSeq = encoded.slice(i, i + seqLen);
  const outputChar = encoded[i + seqLen];
  xs.push(inputSeq);
  ys.push(outputChar);
}

const X = tf.tensor2d(xs, [xs.length, seqLen]);
const Y = tf.oneHot(tf.tensor1d(ys, "int32"), vocabSize);

//NOTE MODEL BUILD
const model = tf.sequential();

model.add(
  tf.layers.embedding({
    inputDim: vocabSize,
    outputDim: 64,
    inputLength: seqLen,
  })
);

model.add(
  tf.layers.lstm({
    units: 128,
    returnSequences: false,
  })
);

model.add(
  tf.layers.dense({
    units: vocabSize,
    activation: "softmax",
  })
);

model.compile({
  loss: "categoricalCrossentropy",
  optimizer: tf.train.adam(0.002),
});

model.summary();

//NOTE TRAIN
(async () => {
  await model.fit(X, Y, {
    epochs: 25,
    batchSize: 64,
    callbacks: {
      onEpochEnd: (e, logs) => console.log(`Epoch ${e}: loss=${logs.loss}`),
    },
  });

  await model.save("file://./saved-model");
  fs.writeFileSync("./mapping.json", JSON.stringify({ char2idx, idx2char }));

  console.log("Model saved.");
})();
