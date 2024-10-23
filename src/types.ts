export interface TreeNode {
  name: string;
  children: TreeNode[];
  size: number;
}

export interface MyNode {
  id: string;
  size: number;
}

export interface Link {
  source: string;
  target: string;
}
