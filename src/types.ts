export interface TreeNode {
  id: string;
  children: TreeNode[];
  size: number;
}

export interface MyNode {
  id: string;
  children?: TreeNode[];
  size: number;
}

export interface Link {
  source: string;
  target: string;
}
