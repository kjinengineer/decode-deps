import * as fs from "fs";
import * as path from "path";
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
export const extractNodesAndLinks = (tree) => {
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
export const getDependencies = (dir) => {
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
export const buildTree = (deps, root) => {
    const node = {
        name: root,
        children: [],
        size: getFileSize(root),
    };
    if (deps[root]) {
        deps[root].forEach((child) => {
            node.children.push(buildTree(deps, child));
        });
    }
    return node;
};
