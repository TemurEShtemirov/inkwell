import * as tf from "@tensorflow/tfjs-node";
import fs from "fs";

const { char2idx, idx2char } = JSON.parse(fs.readFileSync("./mapping.json"));
const vocabSize = Object.keys(char2idx).length;

const seqLen = 100;

function sample(preds, temperature = 0.8) {
  preds = preds.map((v) => Math.log(v) / temperature);
  const exp = preds.map(Math.exp);
  const sum = exp.reduce((a, b) => a + b);
  const probs = exp.map((v) => v / sum);

  let r = Math.random();
  let acc = 0;

  for (let i = 0; i < probs.length; i++) {
    acc += probs[i];
    if (r < acc) return i;
  }
}

(async () => {
  const model = await tf.loadLayersModel("file://./saved-model/model.json");

  let seed = "experienced backend engineer skilled in";
  let generated = seed;

  let input = seed.padStart(seqLen).slice(-seqLen);
  let inputIdx = Array.from(input).map((c) => char2idx[c] || 0);

  for (let i = 0; i < 400; i++) {
    const x = tf.tensor2d([inputIdx], [1, seqLen]);
    let preds = await model.predict(x).data();
    const nextIndex = sample(preds);
    const nextChar = idx2char[nextIndex];

    generated += nextChar;

    inputIdx.push(nextIndex);
    inputIdx = inputIdx.slice(0, seqLen);
  }

  console.log("\nGenerated CV Text:\n");
  console.log(generated);
})();
