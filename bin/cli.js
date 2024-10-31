#!/usr/bin/env node

import startDepTrack from "../dist/route.js";

const input = process.argv[2];

if (!input) {
  console.error("배열 형식의 입력값이 필요합니다!");
  process.exit(1);
}

let inputArray;

try {
  inputArray = JSON.parse(input);
  if (!Array.isArray(inputArray)) {
    throw new Error("입력값이 배열 형식이 아닙니다!");
  }
} catch (error) {
  console.error(
    '배열 형식의 입력값을 JSON 형태로 전달해주세요. 예: \'["value1", "value2"]\''
  );
  process.exit(1);
}

startDepTrack(["./src"]);
