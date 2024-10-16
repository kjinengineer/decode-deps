#!/usr/bin/env node
import { argv } from "process";
import open from "open";

const sourceDir = argv[2];
const rootModule = argv[3];

const serverUrl = `http://localhost:4000/analyze?sourceDir=${sourceDir}&rootModule=${rootModule}`;

open(serverUrl);
