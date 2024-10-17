import express from "express";
import { buildTree, extractNodesAndLinks, getDependencies } from "./getTree";
import cors from "cors";
import open from "open";

const app = express();
const port = 4000;

app.use(
  cors({
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200,
  })
);

app.get("/track", (req, res) => {
  const sourceDir = (req.query.sourceDir as string) || "./test";
  const rootModule = (req.query.rootModule as string) || "test/moduleA.ts";

  const dependencies = getDependencies(sourceDir);
  const dependencyTree = buildTree(dependencies, rootModule);

  const result = extractNodesAndLinks(dependencyTree);

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Module Analysis</title>
        <script>
          window.onload = function() {
            const data = ${JSON.stringify(result)};
            console.log(data);
          };
        </script>
      </head>
      <body>
        <h1>hello world!</h1>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log("Server is running on http://localhost:4000");
  open(`http://localhost:${port}/track`);
});
