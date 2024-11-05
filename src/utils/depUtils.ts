import { LinkType, NodeType, TreeNode } from "../types/types";
import { getFileSize } from "./fileUtils";

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
  warning: [string, string][];
} => {
  const nodes: NodeType[] = [];
  const links: LinkType[] = [];
  const warning: [string, string][] = [];
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

  return { nodes, links, warning };
};

export function detectCircularDeps(links: LinkType[]): [string, string][] {
  const visited = new Set<string>();
  const stack = new Set<string>();
  const circularDependencies: [string, string][] = [];

  function visit(node: string): boolean {
    if (stack.has(node)) {
      const circularPath = Array.from(stack).concat(node);
      for (let i = 0; i < circularPath.length - 1; i++) {
        circularDependencies.push([circularPath[i], circularPath[i + 1]]);
      }
      return true;
    }

    if (visited.has(node)) return false;

    visited.add(node);
    stack.add(node);

    for (const link of links) {
      if (link.source === node) {
        visit(link.target);
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
  dependencies: [string, string][]
): [string, string][] {
  const uniqueDeps = new Set<string>();
  const result: [string, string][] = [];

  dependencies.forEach((pair) => {
    // 각 쌍을 정렬하여 중복 체크 가능하게 만듦
    const sortedPair = pair.slice().sort();
    const key = `${sortedPair[0]}-${sortedPair[1]}`;

    // 이미 존재하지 않는 경우에만 추가
    if (!uniqueDeps.has(key)) {
      uniqueDeps.add(key);
      result.push(pair);
    }
  });

  return result;
}
