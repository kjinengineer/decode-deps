import { getFileSize } from "./fileUtils";

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

export function detectCircularDeps(links: LinkType[]): string[] {
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
