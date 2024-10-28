import express from "express";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

import { buildTree, extractNodesAndLinks, getDependencies } from "./utils";

interface InputProps {
  sourceDir: string[];
  rootModule: string;
}

const port = 5500;

export default function depTrack({ sourceDir, rootModule }: InputProps) {
  const _filename = fileURLToPath(
    require("url").pathToFileURL(__filename).toString()
  );
  const _dirname = dirname(_filename);

  const app = express();
  app.use(express.static(path.join(_dirname, "../public")));

  app.get("/", async (req, res) => {
    res.sendFile(path.join(_dirname, "public", "index.html"));
  });

  app.get("/track", (req, res) => {
    const dependencies = getDependencies(sourceDir);
    const dependencyTree = buildTree(dependencies, rootModule);
    const resultData = extractNodesAndLinks(dependencyTree);

    res.json(resultData);
  });

  app.listen(port, () => {
    console.log(`Module Dependency Graph Ready at http://localhost:${port}`);
  });
}
