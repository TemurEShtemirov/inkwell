import { train } from "./train.js";
import { generate } from "./generate.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ES module __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// dataset path
const dataPath = path.join(__dirname, "data", "dataset.json");
const data = fs.readFileSync(dataPath, "utf-8");

// call training
train(data);

// call generation
generate();
