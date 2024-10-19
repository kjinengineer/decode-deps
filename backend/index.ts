// import express from "express";
// import cors from "cors";
// import { buildTree, extractNodesAndLinks, getDependencies } from "./getTree";

// const app = express();
// const port = 4000;

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     optionsSuccessStatus: 200,
//   })
// );

// app.get("/", (req, res) => {
//   res.send("hello world");
// });

// app.get("/track", (req, res) => {
//   const sourceDir = (req.query.sourceDir as string) || null;
//   const rootModule = (req.query.rootModule as string) || null;

//   if (!sourceDir || !rootModule) {
//     res.send("no data");
//   }
//   const dependencies = getDependencies(sourceDir);
//   const dependencyTree = buildTree(dependencies, rootModule);
//   const result = extractNodesAndLinks(dependencyTree);

//   res.json(result);
// });

// app.listen(port, () => {
//   console.log("Server is running on http://localhost:4000");
// });

import express from "express";
import cors from "cors";
import { buildTree, extractNodesAndLinks, getDependencies } from "./getTree";
import open from "open";
import fs from "fs";

import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 4000;

app.use(
  cors({
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200,
  })
);

let resultData: any = null;

app.use(express.static(path.join(__dirname, "../dist/frontend/public")));
app.use(express.static(path.join(__dirname, "../dist/frontend/src")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/frontend/public/index.html"));
});

app.get("/track", (req, res) => {
  const sourceDir = (req.query.sourceDir as string) || null;
  const rootModule = (req.query.rootModule as string) || null;

  const dependencies = getDependencies(sourceDir);
  const dependencyTree = buildTree(dependencies, rootModule);
  resultData = extractNodesAndLinks(dependencyTree);

  fs.writeFileSync(
    path.join(__dirname, "analysisResult.json"),
    JSON.stringify(resultData, null, 2)
  );

  res.json(resultData);
});

app.get("/result", (req, res) => {
  const filePath = path.join(__dirname, "analysisResult.json");

  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, "utf-8");
    res.json(JSON.parse(data));
  } else {
    res.status(404).json({ error: "No data available" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
