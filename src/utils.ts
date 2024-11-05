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
  const requireRegex = /require\(['"](.*?)['"]\)/g;
  const imports: string[] = [];

  let match: RegExpExecArray | null;

  while ((match = importRegex.exec(content)) !== null) {
    let importPath = match[1];
    if (!importPath.startsWith(".") && !importPath.startsWith("/")) {
      imports.push(importPath);
    } else {
      if (
        !importPath.endsWith(".ts") &&
        !importPath.endsWith(".js") &&
        !importPath.endsWith(".tsx") &&
        !importPath.endsWith(".jsx")
      ) {
        const resolvedPath = path.resolve(path.dirname(filePath), importPath);

        if (fs.existsSync(resolvedPath + ".ts")) {
          importPath += ".ts";
        } else if (fs.existsSync(resolvedPath + ".js")) {
          importPath += ".js";
        } else if (fs.existsSync(resolvedPath + ".tsx")) {
          importPath += ".tsx";
        } else if (fs.existsSync(resolvedPath + ".jsx")) {
          importPath += ".jsx";
        }
      }

      if (!importPath.endsWith(".d.ts") && !importPath.endsWith(".d.tsx")) {
        imports.push(path.join(path.dirname(filePath), importPath));
      }
    }
  }

  while ((match = requireRegex.exec(content)) !== null) {
    let importPath = match[1];
    if (!importPath.startsWith(".") && !importPath.startsWith("/")) {
      imports.push(importPath);
    } else {
      if (
        !importPath.endsWith(".ts") &&
        !importPath.endsWith(".js") &&
        !importPath.endsWith(".tsx") &&
        !importPath.endsWith(".jsx")
      ) {
        const resolvedPath = path.resolve(path.dirname(filePath), importPath);

        if (fs.existsSync(resolvedPath + ".ts")) {
          importPath += ".ts";
        } else if (fs.existsSync(resolvedPath + ".js")) {
          importPath += ".js";
        } else if (fs.existsSync(resolvedPath + ".tsx")) {
          importPath += ".tsx";
        } else if (fs.existsSync(resolvedPath + ".jsx")) {
          importPath += ".jsx";
        }
      }

      if (!importPath.endsWith(".d.ts") && !importPath.endsWith(".d.tsx")) {
        imports.push(path.join(path.dirname(filePath), importPath));
      }
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
      } else if (!file.endsWith(".d.ts") && !file.endsWith(".d.tsx")) {
        if (
          stats.isFile() &&
          (file.endsWith(".ts") ||
            file.endsWith(".js") ||
            file.endsWith(".tsx") ||
            file.endsWith(".jsx"))
        )
          dependencies[filePath] = extractImports(filePath);
      }
    });
  }

  dirs.forEach((dir) => {
    traverseDirectory(dir);
  });

  return dependencies;
};

export const buildTree = (deps: { [key: string]: string[] }): TreeNode[] => {
  const nodesMap: { [key: string]: TreeNode } = {};

  const getNode = (id: string): TreeNode => {
    if (!nodesMap[id]) {
      nodesMap[id] = { id, children: [], size: getFileSize(id) };
    }
    return nodesMap[id];
  };

  for (const file in deps) {
    const parentNode = getNode(file);
    deps[file].forEach((dependency) => {
      const childNode = getNode(dependency);
      if (!parentNode.children.includes(childNode)) {
        parentNode.children.push(childNode);
      }
    });
  }

  return Object.values(nodesMap).filter((node) => node.id in deps);
};

export const extractNodesAndLinks = (
  trees: TreeNode[]
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

  trees.forEach((tree) => getNodes(tree));

  return { nodes, links };
};

export function detectCircularReferences(links: LinkType[]): string[] {
  const visited = new Set<string>();
  const stack = new Set<string>();
  const circularNodes: string[] = [];

  function visit(node: string): boolean {
    if (stack.has(node)) {
      circularNodes.push(node);
      return true;
    }
    if (visited.has(node)) return false;

    visited.add(node);
    stack.add(node);

    for (const link of links) {
      if (link.source === node) {
        if (visit(link.target)) {
          return true;
        }
      }
    }

    stack.delete(node);
    return false;
  }

  for (const link of links) {
    if (!visited.has(link.source)) {
      visit(link.source);
    }
  }

  return circularNodes;
}

// 2. 순환 참조 제거 함수 (직렬화용)
export function removeCircularReferences(obj: any) {
  const seen = new WeakSet();

  function recurse(value: any): any {
    if (typeof value !== "object" || value === null) return value;
    if (seen.has(value)) return "[Circular]";

    seen.add(value);
    if (Array.isArray(value)) {
      return value.map(recurse);
    } else {
      const newObj: any = {};
      for (const key in value) {
        newObj[key] = recurse(value[key]);
      }
      return newObj;
    }
  }

  return recurse(obj);
}
