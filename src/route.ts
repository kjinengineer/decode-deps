import express from "express";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { buildTree, extractNodesAndLinks, getDependencies } from "./utils";

export default function startDepTrack(sourceDir: string[]) {
  const port = 5001;
  const _filename = fileURLToPath(import.meta.url);
  const _dirname = dirname(_filename);

  const app = express();
  app.use(express.static(path.join(_dirname, "../public")));

  app.get("/", (req, res) => {
    res.sendFile(path.join(_dirname, "public", "index.html"));
  });

  app.get("/track", (req, res) => {
    const dependencies = getDependencies(sourceDir);
    const dependencyTree = buildTree(dependencies);
    const resultData = extractNodesAndLinks(dependencyTree);

    res.json(resultData);
  });

  app.listen(port, () => {
    console.log(`Module Dependency Graph Ready at http://localhost:${port}`);
  });
}
