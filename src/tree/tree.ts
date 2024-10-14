import fs from "fs";
import path from "path";
import { extractImports } from "./extractImports";
import { buildTree } from "./buildTree";

const getDependencies = (dir: string): { [key: string]: string[] } => {
  const files = fs.readdirSync(dir);
  const dependencies: { [key: string]: string[] } = {};

  files.forEach((file) => {
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

// CLI로 경로 받기
const sourceDir = process.argv[2] || "./src/test";
const rootModule = process.argv[3] || "src/test/moduleA.ts";

const dependencies = getDependencies(sourceDir);
export const tree = JSON.stringify(
  buildTree(dependencies, rootModule),
  null,
  2
);
