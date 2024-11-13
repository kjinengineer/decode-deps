import { getModules } from "./getModules";
import { getGraph } from "./getGraph";

let savedNodeSize = 20;
let savedLinkDistance = 125;
let savedFontSize = 12;

function createReactiveState(initialValue, callback) {
  return new Proxy(
    { value: initialValue },
    {
      set(target, property, newValue) {
        if (property === "value" && target[property] !== newValue) {
          target[property] = newValue;
          callback(newValue);
        }
        return true;
      },
    }
  );
}

getModules("all").then((data) => {
  getGraph(data, savedNodeSize, savedLinkDistance, savedFontSize);
});

const state = createReactiveState(null, (newValue) => {
  getModules(newValue || "all").then((data) => {
    getGraph(data, savedNodeSize, savedLinkDistance, savedFontSize);
  });
});

window.onload = () => {
  savedNodeSize = Number(localStorage.getItem("nodeSize")) || 20;
  savedLinkDistance = Number(localStorage.getItem("linkDistance")) || 125;
  savedFontSize = Number(localStorage.getItem("fontSize")) || 12;

  (document.getElementById("nodeSize") as HTMLInputElement).value =
    savedNodeSize.toString();
  (document.getElementById("linkDistance") as HTMLInputElement).value =
    savedLinkDistance.toString();
  (document.getElementById("fontSize") as HTMLInputElement).value =
    savedFontSize.toString();
};

const AllButton = document.getElementById("showAll") as HTMLDivElement;
const internalButton = document.getElementById(
  "showInternal"
) as HTMLDivElement;
const externalButton = document.getElementById(
  "showExternal"
) as HTMLDivElement;

if (AllButton) {
  AllButton.addEventListener("click", () => (state.value = "all"));
}

if (internalButton) {
  internalButton.addEventListener("click", () => (state.value = "internal"));
}

if (externalButton) {
  externalButton.addEventListener("click", () => (state.value = "external"));
}
