import express from "express";
import cors from "cors";
import { buildTree, extractNodesAndLinks, getDependencies } from "./getTree";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 4000;

let analysisResult: any = null;
let isAnalyzing = false;

app.use(
  cors({
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200,
  })
);

// app.get("/track", (req, res) => {
//   const sourceDir = (req.query.sourceDir as string) || "./test";
//   const rootModule = (req.query.rootModule as string) || "test/moduleA.ts";

//   new Promise((resolve, reject) => {
//     try {
//       const dependencies = getDependencies(sourceDir);
//       const dependencyTree = buildTree(dependencies, rootModule);
//       const result = extractNodesAndLinks(dependencyTree);
//       resolve(result);
//     } catch (error) {
//       reject(error);
//     }
//   })
//     .then((result) => {
//       analysisResult = result;
//       isAnalyzing = false;
//       console.log(result);
//       res.json(result);
//     })
//     .catch((error) => {
//       isAnalyzing = false;
//       res.status(500).json({ error: "Analysis failed" });
//     });
// });

// app.use(express.static("public"));

// app.get("/result", (req, res) => {
//   const filePath = path.join(__dirname, "public", "index.html");
//   fs.readFile(filePath, "utf-8", (err, data) => {
//     if (err) {
//       return res.status(500).send("Error loading HTML file");
//     }
//     res.send(data);
//   });
// });

app.listen(port, () => {
  console.log("Server is running on http://localhost:4000");
});
