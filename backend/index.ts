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

  res.json(resultData);
});

app.get("/result", (req, res) => {
  res.send(`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Module Analysis</title>
        <script src="https://d3js.org/d3.v7.min.js"></script>
      </head>
      <body>
        <h1>Dependency Analysis Result</h1>
        <div id="chart"></div>
        <script>
          const data = ${JSON.stringify(resultData)};
          console.log(data)
        </script>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
