import fs from "fs";
import { tokenize } from "./tokenize.js"; //tokenize function
import cliProgress from "cli-progress";

// Simple Markov chain trainer
export function train(textData) {
  const tokens = tokenize(textData); // ["experienced", "software", "engineer", ...]
  const markov = {};

  console.log(`Starting training on ${tokens.length} tokens...`);

  const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  bar.start(tokens.length - 1, 0);

  // Build Markov table
  for (let i = 0; i < tokens.length - 1; i++) {
    const token = tokens[i];
    const nextToken = tokens[i + 1];

    if (!markov[token]) markov[token] = [];
    markov[token].push(nextToken);

    bar.update(i + 1);
  }

  bar.stop();

  fs.writeFileSync("tokens.json", JSON.stringify(tokens, null, 2));
  fs.writeFileSync("markov.json", JSON.stringify(markov, null, 2));

  console.log("Training done, tokens and Markov table saved!");
}