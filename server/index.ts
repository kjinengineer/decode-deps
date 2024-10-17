import express from "express";
import { buildTree, extractNodesAndLinks, getDependencies } from "./getTree";
import cors from "cors";

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

  res.json(result);
});

app.listen(port, () => {
  console.log("Server is running on http://localhost:4000");
});
