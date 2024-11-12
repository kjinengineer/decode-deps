import { getModules } from "./getModules";
import { getGraph } from "./getGraph";

let savedNodeSize = 20;
let savedLinkDistance = 125;
let savedFontSize = 12;

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

  renderGraph("all");
};

function renderGraph(type: string) {
  getModules(type).then((data) =>
    getGraph(data, savedNodeSize, savedLinkDistance, savedFontSize)
  );
}
const AllButton = document.getElementById("showAll") as HTMLDivElement;
const internalButton = document.getElementById(
  "showInternal"
) as HTMLDivElement;
const externalButton = document.getElementById(
  "showExternal"
) as HTMLDivElement;

if (AllButton) {
  AllButton.addEventListener("click", () => renderGraph("all"));
}

if (internalButton) {
  internalButton.addEventListener("click", () => renderGraph("internal"));
}

if (externalButton) {
  externalButton.addEventListener("click", () => renderGraph("external"));
}
