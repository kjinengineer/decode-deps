import * as fs from "fs";
import * as path from "path";

interface TreeNode {
  id: string;
  children: TreeNode[];
  size: number;
}

interface NodeType {
  id: string;
  children?: TreeNode[];
  size: number;
}

interface LinkType {
  source: string;
  target: string;
}

const extractImports = (filePath: string) => {
  const content = fs.readFileSync(filePath, "utf-8");
  const importRegex = /import\s.*?from\s['"](.*?)['"]/g;
  const imports: string[] = [];

  let match: RegExpExecArray;
  while ((match = importRegex.exec(content)) !== null) {
    let importPath = match[1];

    if (!importPath.startsWith(".") && !importPath.startsWith("/")) {
      imports.push(importPath);
    } else {
      if (!importPath.endsWith(".ts") && !importPath.endsWith(".js")) {
        if (
          fs.existsSync(
            path.resolve(path.dirname(filePath), importPath + ".ts")
          )
        ) {
          importPath += ".ts";
        } else if (
          fs.existsSync(
            path.resolve(path.dirname(filePath), importPath + ".js")
          )
        ) {
          importPath += ".js";
        }
      }
      imports.push(path.join(path.dirname(filePath), importPath));
    }
  }

  return imports;
};

const getFileSize = (filePath: string): number => {
  try {
    const stats = fs.statSync(filePath);
    return parseFloat((stats.size / 1024).toFixed(2));
  } catch (error) {
    return 0;
  }
};

export const extractNodesAndLinks = (
  tree: TreeNode
): {
  nodes: NodeType[];
  links: LinkType[];
} => {
  const nodes: NodeType[] = [];
  const links: LinkType[] = [];

  const visited = [];

  function getNodes(node: TreeNode) {
    const newNode: NodeType = {
      id: node.id,
      size: node.size,
      children: node.children,
    };

    if (!visited.includes(newNode.id)) {
      visited.push(newNode.id);
      nodes.push(newNode);
      if (node.children) {
        node.children.forEach((child) => {
          links.push({ source: node.id, target: child.id });
          getNodes(child);
        });
      }
    }
  }

  getNodes(tree);

  return { nodes, links };
};

export const getDependencies = (
  dirs: string[]
): { [key: string]: string[] } => {
  const dependencies: { [key: string]: string[] } = {};

  function traverseDirectory(currentDir: string) {
    const files = fs.readdirSync(currentDir);

    files.forEach((file) => {
      const filePath = path.join(currentDir, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        traverseDirectory(filePath);
      } else if (
        stats.isFile() &&
        (file.endsWith(".ts") || file.endsWith(".js"))
      ) {
        dependencies[filePath] = extractImports(filePath);
      }
    });
  }

  dirs.forEach((dir) => {
    traverseDirectory(dir);
  });

  return dependencies;
};

export const buildTree = (
  deps: { [key: string]: string[] },
  root: string
): TreeNode => {
  const node: TreeNode = {
    id: root,
    children: [],
    size: getFileSize(root),
  };

  if (deps[root]) {
    deps[root].forEach((child) => {
      node.children.push(buildTree(deps, child));
    });
  }

  return node;
};
