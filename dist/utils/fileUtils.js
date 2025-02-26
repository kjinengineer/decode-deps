import * as fs from "fs";
import * as path from "path";
var extractImports = function (filePath) {
  var content = fs.readFileSync(filePath, "utf-8");
  var importRegex = /import\s.*?from\s['"](.*?)['"]/g;
  var requireRegex = /require\(['"](.*?)['"]\)/g;
  var imports = [];
  var match;
  while ((match = importRegex.exec(content)) !== null) {
    var importPath = match[1];
    if (!importPath.startsWith(".") && !importPath.startsWith("/")) {
      imports.push(importPath);
    } else {
      if (
        !importPath.endsWith(".ts") &&
        !importPath.endsWith(".js") &&
        !importPath.endsWith(".tsx") &&
        !importPath.endsWith(".jsx")
      ) {
        var resolvedPath = path.resolve(path.dirname(filePath), importPath);
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
    var importPath = match[1];
    if (!importPath.startsWith(".") && !importPath.startsWith("/")) {
      imports.push(importPath);
    } else {
      if (
        !importPath.endsWith(".ts") &&
        !importPath.endsWith(".js") &&
        !importPath.endsWith(".tsx") &&
        !importPath.endsWith(".jsx")
      ) {
        var resolvedPath = path.resolve(path.dirname(filePath), importPath);
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
export var getFileSize = function (filePath) {
  try {
    var stats = fs.statSync(filePath);
    return parseFloat((stats.size / 1024).toFixed(2));
  } catch (error) {
    return 0;
  }
};
export var getDependencies = function (dirs) {
  var dependencies = {};
  function traverseDirectory(currentDir) {
    var files = fs.readdirSync(currentDir);
    files.forEach(function (file) {
      var filePath = path.join(currentDir, file);
      var stats = fs.statSync(filePath);
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
  dirs.forEach(function (dir) {
    traverseDirectory(dir);
  });
  return dependencies;
};
