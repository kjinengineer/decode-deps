// Import necessary modules
import fs from "fs";
import path from "path";

// Dummy extractImports function (replace with your actual implementation)
const extractImports = (filePath: string) => {
  const content = fs.readFileSync(filePath, "utf-8");
  const importRegex = /import\s.*?from\s['"](.*?)['"]/g;
  const imports = [];

  let match;
  while ((match = importRegex.exec(content)) !== null) {
    let importPath = match[1];

    // 경로가 .ts 또는 .js 확장자가 없는 경우 처리
    if (!importPath.endsWith(".ts") && !importPath.endsWith(".js")) {
      if (
        fs.existsSync(path.resolve(path.dirname(filePath), importPath + ".ts"))
      ) {
        importPath += ".ts";
      } else if (
        fs.existsSync(path.resolve(path.dirname(filePath), importPath + ".js"))
      ) {
        importPath += ".js";
      }
    }

    // 파일의 상대 경로로 저장
    imports.push(path.join(path.dirname(filePath), importPath));
  }

  return imports;
};
// Function to recursively build the dependency tree
interface TreeNode {
  name: string;
  children: TreeNode[];
}

function buildTree(deps: { [key: string]: string[] }, root: string): TreeNode {
  const node: TreeNode = { name: root, children: [] };

  if (deps[root]) {
    node.children = deps[root].map((child) => buildTree(deps, child));
  }

  return node;
}

// Function to dynamically create the dependencies object by scanning all files
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

// Main logic: dynamically build the dependencies and construct the tree
const dependencies = getDependencies("./src/test");
const tree = buildTree(dependencies, "src/test/moduleA.ts");
console.log(JSON.stringify(tree, null, 2));
