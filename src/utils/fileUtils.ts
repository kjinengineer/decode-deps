import * as fs from "fs";
import * as path from "path";

interface TreeNode {
  id: string;
  children: TreeNode[];
  size: number;
}

interface LinkType {
  source: string;
  target: string;
}

const extractImports = (filePath: string) => {
  const content = fs.readFileSync(filePath, "utf-8");
  const importRegex = /import\s.*?from\s['"](.*?)['"]/g;
  const requireRegex = /require\(['"](.*?)['"]\)/g;
  const imports: string[] = [];

  let match: RegExpExecArray | null;

  while ((match = importRegex.exec(content)) !== null) {
    let importPath = match[1];
    if (!importPath.startsWith(".") && !importPath.startsWith("/")) {
      imports.push(importPath);
    } else {
      if (
        !importPath.endsWith(".ts") &&
        !importPath.endsWith(".js") &&
        !importPath.endsWith(".tsx") &&
        !importPath.endsWith(".jsx")
      ) {
        const resolvedPath = path.resolve(path.dirname(filePath), importPath);

        if (fs.existsSync(resolvedPath + ".ts")) {
          importPath += ".ts";
        } else if (fs.existsSync(resolvedPath + ".js")) {
          importPath += ".js";
        } else if (fs.existsSync(resolvedPath + ".tsx")) {
          importPath += ".tsx";
        } else if (fs.existsSync(resolvedPath + ".jsx")) {
          importPath += ".jsx";
        }
      }

      if (!importPath.endsWith(".d.ts") && !importPath.endsWith(".d.tsx")) {
        imports.push(path.join(path.dirname(filePath), importPath));
      }
    }
  }

  while ((match = requireRegex.exec(content)) !== null) {
    let importPath = match[1];
    if (!importPath.startsWith(".") && !importPath.startsWith("/")) {
      imports.push(importPath);
    } else {
      if (
        !importPath.endsWith(".ts") &&
        !importPath.endsWith(".js") &&
        !importPath.endsWith(".tsx") &&
        !importPath.endsWith(".jsx")
      ) {
        const resolvedPath = path.resolve(path.dirname(filePath), importPath);

        if (fs.existsSync(resolvedPath + ".ts")) {
          importPath += ".ts";
        } else if (fs.existsSync(resolvedPath + ".js")) {
          importPath += ".js";
        } else if (fs.existsSync(resolvedPath + ".tsx")) {
          importPath += ".tsx";
        } else if (fs.existsSync(resolvedPath + ".jsx")) {
          importPath += ".jsx";
        }
      }

      if (!importPath.endsWith(".d.ts") && !importPath.endsWith(".d.tsx")) {
        imports.push(path.join(path.dirname(filePath), importPath));
      }
    }
  }

  return imports;
};

export const getFileSize = (filePath: string): number => {
  try {
    const stats = fs.statSync(filePath);
    return parseFloat((stats.size / 1024).toFixed(2));
  } catch (error) {
    return 0;
  }
};

export const getDependencies = (
  dirs: string[]
): { [key: string]: string[] } => {
  const dependencies: { [key: string]: string[] } = {};

  function traverseDirectory(currentDir: string) {
    const files = fs.readdirSync(currentDir);

    files.forEach((file) => {
      const filePath = path.join(currentDir, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        traverseDirectory(filePath);
      } else if (!file.endsWith(".d.ts") && !file.endsWith(".d.tsx")) {
        if (
          stats.isFile() &&
          (file.endsWith(".ts") ||
            file.endsWith(".js") ||
            file.endsWith(".tsx") ||
            file.endsWith(".jsx"))
        )
          dependencies[filePath] = extractImports(filePath);
      }
    });
  }

  dirs.forEach((dir) => {
    traverseDirectory(dir);
  });

  return dependencies;
};
