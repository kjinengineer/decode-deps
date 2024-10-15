import * as fs from "fs";
import * as path from "path";
import buildTree from "./buildTree.js";
import extractImports from "./extractImports.js";

// CLI로 경로 받기
const sourceDir = process.argv[2] || "./test";
const rootModule = process.argv[3] || "/test/moduleA.ts";

const getDependencies = (dir: string): { [key: string]: string[] } => {
  const files = fs.readdirSync(dir);
  const dependencies: { [key: string]: string[] } = {};

  files.forEach((file: any) => {
    const filePath = path.join(dir, file);
    if (
      fs.statSync(filePath).isFile() &&
      (file.endsWith(".ts") || file.endsWith(".js"))
    ) {
      dependencies[filePath] = extractImports(filePath);
    }
  });

  return dependencies;
};

const dependencies = getDependencies(sourceDir);
const dependencyTree = buildTree(dependencies, rootModule);

export default dependencyTree;
