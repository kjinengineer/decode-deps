export interface TreeNode {
  name: string;
  children: TreeNode[];
  size: number;
}

export interface MyNode {
  id: string;
}

export interface Link {
  source: string;
  target: string;
}
