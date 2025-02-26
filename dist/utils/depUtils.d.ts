import { LinkType, NodeType, TreeNode } from "../types/types";
export declare const buildTree: (deps: {
    [key: string]: string[];
}) => TreeNode[];
export declare const extractNodesAndLinks: (trees: TreeNode[]) => {
    nodes: NodeType[];
    links: LinkType[];
    warning: {
        circular: string[];
    }[];
};
export declare function detectCircularDeps(links: LinkType[]): {
    circular: string[];
}[];
export declare function removeCircularDeps(obj: any): any;
export declare function removeDuplicateCircularDeps(dependencies: {
    circular: string[];
}[]): {
    circular: string[];
}[];
