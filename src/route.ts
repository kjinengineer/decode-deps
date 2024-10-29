import express from "express";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { buildTree, extractNodesAndLinks, getDependencies } from "./utils";

interface InputProps {
  sourceDir: string[];
  rootModule: string;
}

export default function depTrack({ sourceDir, rootModule }: InputProps) {
  const port = 5001;
  const _filename = fileURLToPath(
    require("url").pathToFileURL(__filename).toString()
  );
  const _dirname = dirname(_filename);

  const app = express();
  app.use(express.static(path.join(_dirname, "../../public")));
  app.use(express.static(path.join(__dirname, "dist")));

  app.get("/", (req, res) => {
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
