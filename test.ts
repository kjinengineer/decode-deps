import {
  buildTree,
  detectCircularDeps,
  extractNodesAndLinks,
  removeCircularDeps,
  removeDuplicateCircularDeps,
} from "./src/utils/depUtils";
import { getDependencies } from "./src/utils/fileUtils";

const dependencies = getDependencies(["debug/test"]);
const dependencyTree = buildTree(dependencies);
const resultData = extractNodesAndLinks(dependencyTree);

const circularNodes = detectCircularDeps(resultData.links);
const uniqueCircularNodes = removeDuplicateCircularDeps(circularNodes);

if (uniqueCircularNodes.length > 0) {
  for (let el of uniqueCircularNodes) {
    resultData.warning.push(el);
  }
}
const safeResultData = removeCircularDeps(resultData);

console.log(safeResultData.warning);
