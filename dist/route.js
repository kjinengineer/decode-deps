import express from "express";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import {
  buildTree,
  detectCircularDeps,
  extractNodesAndLinks,
  removeCircularDeps,
  removeDuplicateCircularDeps,
} from "./utils/depUtils.js";
import { getDependencies } from "./utils/fileUtils.js";
import { portNumber } from "./constant.js";
// var cors = require("cors");
export default function startDecodeDeps(sourceDir) {
  var _filename = fileURLToPath(import.meta.url);
  var _dirname = dirname(_filename);
  var app = express();
  //   app.use(cors());
  // app.use(express.static(path.join(_dirname, "static"))); // dev
  app.use(express.static(path.join(_dirname, "/")));
  app.use(express.static(path.join(_dirname, "utils"))); // for publish
  app.get("/", function (req, res) {
    res.sendFile(path.join(_dirname, "/", "index.html"));
    // res.sendFile(path.join(_dirname, "/", "index.html")); // for publish
  });
  app.get("/track", function (req, res) {
    var dependencies = getDependencies(sourceDir);
    var dependencyTree = buildTree(dependencies);
    var resultData = extractNodesAndLinks(dependencyTree);
    var circularNodes = detectCircularDeps(resultData.links);
    var uniqueCircularNodes = removeDuplicateCircularDeps(circularNodes);
    if (uniqueCircularNodes.length > 0) {
      for (
        var _i = 0, uniqueCircularNodes_1 = uniqueCircularNodes;
        _i < uniqueCircularNodes_1.length;
        _i++
      ) {
        var el = uniqueCircularNodes_1[_i];
        resultData.warning.push(el);
      }
    }
    var safeResultData = removeCircularDeps(resultData);
    res.json(safeResultData);
  });
  app.listen(portNumber, function () {
    console.log(
      "Module Dependency Graph Ready at http://localhost:".concat(portNumber)
    );
  });
}
