#!/usr/bin/env node
import fetch from "node-fetch";

const sourceDir = process.argv[2] || "./test";
const rootModule = process.argv[3] || "test/moduleA.ts";

if (sourceDir && rootModule) {
  const url = `http://localhost:4000/track?sourceDir=${sourceDir}&rootModule=${rootModule}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => console.log("Analysis Result:", data))
    .catch((err) => console.error("Error:", err));
} else {
  console.log("Please provide both sourceDir and rootModule.");
}
