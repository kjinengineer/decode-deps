import express from "express";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import {
  buildTree,
  detectCircularReferences,
  extractNodesAndLinks,
  getDependencies,
  removeCircularReferences,
} from "./utils";

export default function startDepTrack(sourceDir: string[]) {
  const port = 5001;
  const _filename = fileURLToPath(import.meta.url);
  const _dirname = dirname(_filename);

  const app = express();
  app.use(express.static(path.join(_dirname, "/"))); // for publish
  // app.use(express.static(path.join(_dirname, "../public"))); // dev
  app.get("/", (req, res) => {
    // res.sendFile(path.join(_dirname, "public", "index.html")); // dev
    res.sendFile(path.join(_dirname, "/", "index.html")); // for publish
  });

  app.get("/track", (req, res) => {
    const dependencies = getDependencies(sourceDir);
    const dependencyTree = buildTree(dependencies);
    const resultData = extractNodesAndLinks(dependencyTree);

    const circularNodes = detectCircularReferences(resultData.links);
    if (circularNodes.length > 0) {
      console.warn("Circular dependency detected in nodes:", circularNodes);
    }

    const safeResultData = removeCircularReferences(resultData);
    res.json(safeResultData);
    // res.json(resultData);
  });

  app.listen(port, () => {
    console.log(`Module Dependency Graph Ready at http://localhost:${port}`);
  });
}
