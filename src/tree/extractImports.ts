import * as fs from "fs";
import * as path from "path";

const extractImports = (filePath: string) => {
  const content = fs.readFileSync(filePath, "utf-8");
  const importRegex = /import\s.*?from\s['"](.*?)['"]/g;
  const imports = [];

  let match;
  while ((match = importRegex.exec(content)) !== null) {
    let importPath = match[1];

    if (!importPath.endsWith(".ts") && !importPath.endsWith(".js")) {
      if (
        fs.existsSync(path.resolve(path.dirname(filePath), importPath + ".ts"))
      ) {
        importPath += ".ts";
      } else if (
        fs.existsSync(path.resolve(path.dirname(filePath), importPath + ".js"))
      ) {
        importPath += ".js";
      }
    }

    imports.push(path.join(path.dirname(filePath), importPath));
  }

  return imports;
};

export default extractImports;
