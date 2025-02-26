import { getModules } from "./getModules.js";
import { getGraph } from "./getGraph.js";
var savedNodeSize = 20;
var savedLinkDistance = 125;
var savedFontSize = 12;
function createReactiveState(initialValue, callback) {
  return new Proxy(
    { value: initialValue },
    {
      set: function (target, property, newValue) {
        if (property === "value" && target[property] !== newValue) {
          target[property] = newValue;
          callback(newValue);
        }
        return true;
      },
    }
  );
}
getModules("all").then(function (data) {
  getGraph(data, savedNodeSize, savedLinkDistance, savedFontSize);
});
var state = createReactiveState(null, function (newValue) {
  getModules(newValue || "all").then(function (data) {
    getGraph(data, savedNodeSize, savedLinkDistance, savedFontSize);
  });
});
window.onload = function () {
  savedNodeSize = Number(localStorage.getItem("nodeSize")) || 20;
  savedLinkDistance = Number(localStorage.getItem("linkDistance")) || 125;
  savedFontSize = Number(localStorage.getItem("fontSize")) || 12;
  document.getElementById("nodeSize").value = savedNodeSize.toString();
  document.getElementById("linkDistance").value = savedLinkDistance.toString();
  document.getElementById("fontSize").value = savedFontSize.toString();
};
var AllButton = document.getElementById("showAll");
var internalButton = document.getElementById("showInternal");
var externalButton = document.getElementById("showExternal");
if (AllButton) {
  AllButton.addEventListener("click", function () {
    return (state.value = "all");
  });
}
if (internalButton) {
  internalButton.addEventListener("click", function () {
    return (state.value = "internal");
  });
}
if (externalButton) {
  externalButton.addEventListener("click", function () {
    return (state.value = "external");
  });
}
