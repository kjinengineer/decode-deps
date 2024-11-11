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
import { portNumber } from "./constant";

const cors = require("cors");

export default function startDecodeDeps(sourceDir: string[]) {
  const _filename = fileURLToPath(import.meta.url);
  const _dirname = dirname(_filename);

  const app = express();
  app.use(cors());

  // app.use(express.static(path.join(_dirname, "static"))); // dev
  app.use(express.static(path.join(_dirname, "/"))); // for publish
  console.log(path.join(_dirname, "index.html"));
  app.get("/", (req, res) => {
    res.sendFile(path.join(_dirname, "index.html"));

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

  app.listen(portNumber, () => {
    console.log(
      `Module Dependency Graph Ready at http://localhost:${portNumber}`
    );
  });
}
