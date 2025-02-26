export interface TreeNode {
    id: string;
    children: TreeNode[];
    size: number;
    linkType?: "internal" | "external";
}
export interface NodeType {
    id: string;
    size: number;
    linkType: "internal" | "external";
}
export interface LinkType {
    source: string;
    target: string;
    linkType: "internal" | "external";
}
