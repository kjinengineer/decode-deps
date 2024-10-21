"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const depTrack = (rootFolder, rootFile) => {
    const folder = rootFolder || "src";
    const file = rootFile || "App.tsx";
    console.log(folder, file);
};
exports.default = depTrack;
