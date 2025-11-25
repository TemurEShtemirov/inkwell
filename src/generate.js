import fs from "fs";

export function generate() {
  const tokens = JSON.parse(fs.readFileSync("tokens.json", "utf-8"));
  const sample = tokens.slice(0, 50).join(" "); // just a simple generation
  console.log("Generated text:", sample);
}
