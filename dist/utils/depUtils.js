var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
import { getFileSize } from "./fileUtils.js";
import path from "path";
import * as fs from "fs";
var packageJsonPath = path.resolve(process.cwd(), "package.json");
var packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
var allDependencies = __assign(
  __assign({}, packageJson.dependencies),
  packageJson.devDependencies
);
var allDependenciesName = Object.keys(allDependencies);
export var buildTree = function (deps) {
  var nodesMap = {};
  var getNode = function (id) {
    var fileRoot = id.split("/");
    var fileName = fileRoot[fileRoot.length - 1].split(".")[0];
    if (!nodesMap[id]) {
      nodesMap[id] = {
        id: id,
        children: [],
        size: getFileSize(id),
        linkType: allDependenciesName.includes(fileName)
          ? "external"
          : "internal",
      };
    }
    return nodesMap[id];
  };
  var _loop_1 = function (file) {
    var parentNode = getNode(file);
    deps[file].forEach(function (dependency) {
      var childNode = getNode(dependency);
      if (!parentNode.children.includes(childNode)) {
        parentNode.children.push(childNode);
      }
    });
  };
  for (var file in deps) {
    _loop_1(file);
  }
  return Object.values(nodesMap).filter(function (node) {
    return node.id in deps;
  });
};
export var extractNodesAndLinks = function (trees) {
  var nodes = [];
  var links = [];
  var warning = [];
  var visited = new Set();
  function getNodes(node) {
    var fileRoot = node.id.split("/");
    var fileName = fileRoot[fileRoot.length - 1].split(".")[0];
    var newNode = {
      id: node.id,
      size: node.size,
      linkType: allDependenciesName.includes(fileName)
        ? "external"
        : "internal",
    };
    if (!visited.has(newNode.id)) {
      visited.add(newNode.id);
      nodes.push(newNode);
      if (node.children) {
        node.children.forEach(function (child) {
          links.push({
            source: node.id,
            target: child.id,
            linkType:
              allDependenciesName.includes(node.id) ||
              allDependenciesName.includes(child.id)
                ? "external"
                : "internal",
          });
          getNodes(child);
        });
      }
    }
  }
  trees.forEach(function (tree) {
    getNodes(tree);
  });
  return { nodes: nodes, links: links, warning: warning };
};
export function detectCircularDeps(links) {
  var visited = new Set();
  var circularDependencies = [];
  function visit(node, path) {
    if (path.includes(node)) {
      var cycleStartIndex = path.indexOf(node);
      var circularPath = path.slice(cycleStartIndex, cycleStartIndex + 2);
      circularDependencies.push({ circular: circularPath });
      return true;
    }
    if (visited.has(node)) return false;
    visited.add(node);
    path.push(node);
    for (var _i = 0, links_2 = links; _i < links_2.length; _i++) {
      var link = links_2[_i];
      if (link.source === node) {
        visit(link.target, path);
      }
    }
    path.pop();
    return false;
  }
  for (var _i = 0, links_1 = links; _i < links_1.length; _i++) {
    var link = links_1[_i];
    if (!visited.has(link.source)) {
      visit(link.source, []);
    }
  }
  return circularDependencies;
}
export function removeCircularDeps(obj) {
  var seen = new WeakSet();
  function recurse(value) {
    if (typeof value !== "object" || value === null) return value;
    if (seen.has(value)) return "[Circular]";
    seen.add(value);
    if (Array.isArray(value)) {
      return value.map(recurse);
    } else {
      var newObj = {};
      for (var key in value) {
        newObj[key] = recurse(value[key]);
      }
      return newObj;
    }
  }
  return recurse(obj);
}
export function removeDuplicateCircularDeps(dependencies) {
  var uniqueDeps = new Set();
  var result = [];
  dependencies.forEach(function (dep) {
    var sortedDep = dep.circular.slice().sort();
    var key = sortedDep.join("-");
    if (!uniqueDeps.has(key)) {
      uniqueDeps.add(key);
      result.push(dep);
    }
  });
  return result;
}
