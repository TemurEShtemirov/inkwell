import fs from "fs";

export function generate(length = 100) {
  const tokens = JSON.parse(fs.readFileSync("tokens.json", "utf-8"));
  const markov = JSON.parse(fs.readFileSync("markov.json", "utf-8"));

  let output = [];
  let word = tokens[Math.floor(Math.random() * tokens.length)];

  for (let i = 0; i < length; i++) {
    output.push(word);
    const nextWords = markov[word];
    if (!nextWords) break; // stop if no continuation
    word = nextWords[Math.floor(Math.random() * nextWords.length)];
  }

  console.log("📝 Generated text:\n", output.join(" "));
}
