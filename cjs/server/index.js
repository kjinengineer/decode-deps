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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const url_1 = require("url");
const path_1 = __importStar(require("path"));
const getTree_1 = require("./getTree");
// const __filename = fileURLToPath(import.meta.url);
const _filename = (0, url_1.fileURLToPath)(require("url").pathToFileURL(__filename).toString());
const __dirname = (0, path_1.dirname)(_filename);
const app = (0, express_1.default)();
const port = 4000;
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200,
}));
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
app.get("/", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "public", "index.html"));
});
app.get("/track", (req, res) => {
    const sourceDir = req.query.sourceDir || null;
    const rootModule = req.query.rootModule || null;
    const dependencies = (0, getTree_1.getDependencies)(sourceDir);
    const dependencyTree = (0, getTree_1.buildTree)(dependencies, rootModule);
    const resultData = (0, getTree_1.extractNodesAndLinks)(dependencyTree);
    fs_1.default.writeFileSync(path_1.default.join(__dirname, "analysisResult.json"), JSON.stringify(resultData, null, 2));
    res.json(resultData);
});
app.get("/result", (req, res) => {
    const filePath = path_1.default.join(__dirname, "analysisResult.json");
    if (fs_1.default.existsSync(filePath)) {
        const data = fs_1.default.readFileSync(filePath, "utf-8");
        res.json(JSON.parse(data));
    }
    else {
        res.status(404).json({ error: "No data available" });
    }
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
