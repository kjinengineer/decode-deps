export interface TreeNode {
  id: string;
  children: TreeNode[];
  size: number;
}

export interface NodeType {
  id: string;
  children?: TreeNode[];
  size: number;
}

export interface LinkType {
  source: string;
  target: string;
}
