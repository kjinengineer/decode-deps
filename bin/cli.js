#!/usr/bin/env node
import startDepTrack from "../dist/route.js";

const input = process.argv[2];

if (!input) {
  console.error("Input must be in ARRAY FORMAT!");
  process.exit(1);
}

let inputArray;

try {
  inputArray = JSON.parse(input);
  if (!Array.isArray(inputArray)) {
    throw new Error("The input is not in ARRAY FORMAT!");
  }
} catch (error) {
  console.error(
    'Please provide the input in JSON ARRAY FORMAT. Example: \'["value1", "value2"]\''
  );
  process.exit(1);
}

startDepTrack(inputArray);
