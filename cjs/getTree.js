"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTree = exports.getDependencies = exports.extractNodesAndLinks = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const extractImports = (filePath) => {
    const content = fs.readFileSync(filePath, "utf-8");
    const importRegex = /import\s.*?from\s['"](.*?)['"]/g;
    const imports = [];
    let match;
    while ((match = importRegex.exec(content)) !== null) {
        let importPath = match[1];
        if (!importPath.endsWith(".ts") && !importPath.endsWith(".js")) {
            if (fs.existsSync(path.resolve(path.dirname(filePath), importPath + ".ts"))) {
                importPath += ".ts";
            }
            else if (fs.existsSync(path.resolve(path.dirname(filePath), importPath + ".js"))) {
                importPath += ".js";
            }
        }
        imports.push(path.join(path.dirname(filePath), importPath));
    }
    return imports;
};
const getFileSize = (filePath) => {
    const stats = fs.statSync(filePath);
    return stats.size;
};
const extractNodesAndLinks = (tree) => {
    const nodes = [];
    const links = [];
    function traverse(node) {
        const newNode = { id: node.name };
        nodes.push(newNode);
        if (node.children) {
            node.children.forEach((child) => {
                links.push({ source: node.name, target: child.name });
                traverse(child);
            });
        }
    }
    traverse(tree);
    return { nodes, links };
};
exports.extractNodesAndLinks = extractNodesAndLinks;
const getDependencies = (dir) => {
    const files = fs.readdirSync(dir);
    const dependencies = {};
    files.forEach((file) => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isFile() &&
            (file.endsWith(".ts") || file.endsWith(".js"))) {
            dependencies[filePath] = extractImports(filePath);
        }
    });
    return dependencies;
};
exports.getDependencies = getDependencies;
const buildTree = (deps, root) => {
    const node = {
        name: root,
        children: [],
        size: getFileSize(root),
    };
    if (deps[root]) {
        deps[root].forEach((child) => {
            node.children.push((0, exports.buildTree)(deps, child));
        });
    }
    return node;
};
exports.buildTree = buildTree;
