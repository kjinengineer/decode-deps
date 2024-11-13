import { LinkType, NodeType, TreeNode } from "../types/types";
import { getFileSize } from "./fileUtils";
import path from "path";
import * as fs from "fs";

const packageJsonPath = path.resolve(process.cwd(), "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
const allDependencies = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
};
const allDependenciesName = Object.keys(allDependencies);

export const buildTree = (deps: { [key: string]: string[] }): TreeNode[] => {
  const nodesMap: { [key: string]: TreeNode } = {};
  const getNode = (id: string): TreeNode => {
    const fileRoot = id.split("/");
    const fileName = fileRoot[fileRoot.length - 1].split(".")[0];

    if (!nodesMap[id]) {
      nodesMap[id] = {
        id,
        children: [],
        size: getFileSize(id),
        linkType: allDependenciesName.includes(fileName)
          ? "external"
          : "internal",
      };
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
  warning: { circular: string[] }[];
} => {
  const nodes: NodeType[] = [];
  const links: LinkType[] = [];
  const warning: { circular: string[] }[] = [];
  const visited = new Set<string>();

  function getNodes(node: TreeNode) {
    const fileRoot = node.id.split("/");
    const fileName = fileRoot[fileRoot.length - 1].split(".")[0];

    const newNode: NodeType = {
      id: node.id,
      size: node.size,
      linkType: allDependenciesName.includes(fileName)
        ? "external"
        : "internal",
    };

    if (!visited.has(newNode.id)) {
      visited.add(newNode.id);
      nodes.push(newNode);
      if (node.children) {
        node.children.forEach((child) => {
          links.push({
            source: node.id,
            target: child.id,

            linkType:
              allDependenciesName.includes(node.id) ||
              allDependenciesName.includes(child.id)
                ? "external"
                : "internal",
          });
          getNodes(child);
        });
      }
    }
  }

  trees.forEach((tree) => {
    getNodes(tree);
  });

  return { nodes, links, warning };
};

export function detectCircularDeps(
  links: LinkType[]
): { circular: string[] }[] {
  const visited = new Set<string>();
  const circularDependencies: { circular: string[] }[] = [];

  function visit(node: string, path: string[]): boolean {
    if (path.includes(node)) {
      const cycleStartIndex = path.indexOf(node);
      const circularPath = path.slice(cycleStartIndex, cycleStartIndex + 2);
      circularDependencies.push({ circular: circularPath });
      return true;
    }

    if (visited.has(node)) return false;

    visited.add(node);
    path.push(node);

    for (const link of links) {
      if (link.source === node) {
        visit(link.target, path);
      }
    }

    path.pop();
    return false;
  }

  for (const link of links) {
    if (!visited.has(link.source)) {
      visit(link.source, []);
    }
  }

  return circularDependencies;
}

export function removeCircularDeps(obj: any) {
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

export function removeDuplicateCircularDeps(
  dependencies: { circular: string[] }[]
): { circular: string[] }[] {
  const uniqueDeps = new Set<string>();
  const result: { circular: string[] }[] = [];

  dependencies.forEach((dep) => {
    const sortedDep = dep.circular.slice().sort();
    const key = sortedDep.join("-");

    if (!uniqueDeps.has(key)) {
      uniqueDeps.add(key);
      result.push(dep);
    }
  });

  return result;
}
