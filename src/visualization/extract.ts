interface TreeNode {
  name: string;
  children: TreeNode[];
}

interface MyNode {
  id: string;
}

interface Link {
  source: string;
  target: string;
}

export default function extractNodesAndLinks(tree: TreeNode): {
  nodes: MyNode[];
  links: Link[];
} {
  const nodes: MyNode[] = [];
  const links: Link[] = [];

  function traverse(node: TreeNode) {
    const newNode: MyNode = { id: node.name };

    if (node.children) {
      node.children.forEach((child) => {
        links.push({ source: node.name, target: child.name });
        traverse(child);
      });
    }
  }

  traverse(tree);

  return { nodes, links };
}
