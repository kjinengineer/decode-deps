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

export interface Link {
  source: string;
  target: string;
}

export interface InputProps {
  sourceDir: string[];
  rootModule: string;
  port: number;
}
