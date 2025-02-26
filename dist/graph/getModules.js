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
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g = Object.create(
        (typeof Iterator === "function" ? Iterator : Object).prototype
      );
    return (
      (g.next = verb(0)),
      (g["throw"] = verb(1)),
      (g["return"] = verb(2)),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
import { fetchData } from "../utils/dataFetcher.js";
export function getModules(inpuType) {
  return __awaiter(this, void 0, void 0, function () {
    var inputData,
      data,
      newLink,
      newNode,
      visitedLink,
      _i,
      _a,
      el,
      _b,
      newLink_1,
      el,
      sId,
      tId,
      _c,
      _d,
      el,
      result,
      newLink,
      newNode,
      visitedLink,
      _e,
      _f,
      el,
      _g,
      newLink_2,
      el,
      sId,
      tId,
      _h,
      _j,
      el,
      result;
    return __generator(this, function (_k) {
      switch (_k.label) {
        case 0:
          return [4 /*yield*/, fetchData()];
        case 1:
          inputData = _k.sent();
          data = __assign({}, inputData);
          if (inpuType === "internal") {
            newLink = [];
            newNode = [];
            visitedLink = [];
            for (_i = 0, _a = data.links; _i < _a.length; _i++) {
              el = _a[_i];
              if (el.linkType === inpuType) {
                newLink.push(el);
              }
            }
            for (_b = 0, newLink_1 = newLink; _b < newLink_1.length; _b++) {
              el = newLink_1[_b];
              sId = el.source.id || el.source;
              tId = el.target.id || el.target;
              if (!visitedLink.includes(sId)) {
                visitedLink.push(sId);
              }
              if (!visitedLink.includes(tId)) {
                visitedLink.push(tId);
              }
            }
            for (_c = 0, _d = data.nodes; _c < _d.length; _c++) {
              el = _d[_c];
              if (visitedLink.includes(el.id)) {
                newNode.push(el);
              }
            }
            addColor(inpuType);
            remoeColor("external");
            remoeColor("all");
            result = { nodes: newNode, links: newLink, warning: data.warning };
            return [2 /*return*/, result];
          } else if (inpuType === "external") {
            newLink = [];
            newNode = [];
            visitedLink = [];
            for (_e = 0, _f = data.links; _e < _f.length; _e++) {
              el = _f[_e];
              if (el.linkType === inpuType) {
                newLink.push(el);
              }
            }
            for (_g = 0, newLink_2 = newLink; _g < newLink_2.length; _g++) {
              el = newLink_2[_g];
              sId = el.source.id || el.source;
              tId = el.target.id || el.target;
              if (!visitedLink.includes(sId)) {
                visitedLink.push(sId);
              }
              if (!visitedLink.includes(tId)) {
                visitedLink.push(tId);
              }
            }
            for (_h = 0, _j = data.nodes; _h < _j.length; _h++) {
              el = _j[_h];
              if (visitedLink.includes(el.id)) {
                newNode.push(el);
              }
            }
            addColor(inpuType);
            remoeColor("internal");
            remoeColor("all");
            result = { nodes: newNode, links: newLink, warning: data.warning };
            return [2 /*return*/, result];
          } else {
            addColor("all");
            remoeColor("external");
            remoeColor("internal");
            return [2 /*return*/, data];
          }
          return [2 /*return*/];
      }
    });
  });
}
function addColor(type) {
  if (type === "internal") {
    var buttonbox = document.querySelector("#showInternal");
    buttonbox.style.borderColor = "#f59e0b";
    buttonbox.style.color = "#f59e0b";
  } else if (type === "external") {
    var buttonbox = document.querySelector("#showExternal");
    buttonbox.style.borderColor = "#f59e0b";
    buttonbox.style.color = "#f59e0b";
  } else {
    var buttonbox = document.querySelector("#showAll");
    buttonbox.style.borderColor = "#f59e0b";
    buttonbox.style.color = "#f59e0b";
  }
}
function remoeColor(type) {
  if (type === "internal") {
    var buttonbox = document.querySelector("#showInternal");
    buttonbox.style.borderColor = "white";
    buttonbox.style.color = "white";
  } else if (type === "external") {
    var buttonbox = document.querySelector("#showExternal");
    buttonbox.style.borderColor = "white";
    buttonbox.style.color = "white";
  } else {
    var buttonbox = document.querySelector("#showAll");
    buttonbox.style.borderColor = "white";
    buttonbox.style.color = "white";
  }
}
