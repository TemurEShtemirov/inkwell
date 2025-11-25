import fs from "fs";
import cliProgress from "cli-progress";
import { tokenize } from "./tokenize.js";

export function train(textData) {
  const tokens = tokenize(textData);
  const markov = {};
  const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

  console.log(`Starting training on ${tokens.length} tokens...`);
  bar.start(tokens.length, 0);

  for (let i = 0; i < tokens.length - 1; i++) {
    const key = tokens[i];
    const next = tokens[i + 1];

    if (!markov[key]) markov[key] = [];
    markov[key].push(next);

    bar.update(i + 1);
  }

  bar.stop();
  fs.writeFileSync("tokens.json", JSON.stringify(tokens));
  fs.writeFileSync("markov.json", JSON.stringify(markov));
  console.log("✅ Training complete, tokens and Markov table saved!");
}
