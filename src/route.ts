import express from "express";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import {
  buildTree,
  detectCircularDeps,
  extractNodesAndLinks,
  removeCircularDeps,
  removeDuplicateCircularDeps,
} from "./utils/depUtils";
import { getDependencies } from "./utils/fileUtils";
import { port } from "./constant";

export default function startDepTrack(sourceDir: string[]) {
  const _filename = fileURLToPath(import.meta.url);
  const _dirname = dirname(_filename);

  const app = express();
  // app.use(express.static(path.join(_dirname, "/"))); // for publish
  app.use(express.static(path.join(_dirname, "../public"))); // dev
  app.get("/", (req, res) => {
    res.sendFile(path.join(_dirname, "public", "index.html")); // dev
    // res.sendFile(path.join(_dirname, "/", "index.html")); // for publish
  });

  app.get("/track", (req, res) => {
    const dependencies = getDependencies(sourceDir);
    const dependencyTree = buildTree(dependencies);
    const resultData = extractNodesAndLinks(dependencyTree);

    const circularNodes = detectCircularDeps(resultData.links);
    const uniqueCircularNodes = removeDuplicateCircularDeps(circularNodes);

    if (uniqueCircularNodes.length > 0) {
      for (let el of uniqueCircularNodes) {
        resultData.warning.push(el);
      }
    }
    const safeResultData = removeCircularDeps(resultData);
    res.json(safeResultData);
  });

  app.listen(port, () => {
    console.log(`Module Dependency Graph Ready at http://localhost:${port}`);
  });
}
