import { getModules } from "./getModules";
import { getGraph } from "./getGraph";
import { fetchData } from "../utils/dataFetcher";

let savedNodeSize = 20;
let savedLinkDistance = 125;
let savedFontSize = 12;

let type = "external";
let data = null;

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

  getModules(type).then((initialData) => {
    getGraph(initialData, savedNodeSize, savedLinkDistance, savedFontSize);
  });
};

const AllButton = document.getElementById("showAll") as HTMLDivElement;
const internalButton = document.getElementById(
  "showInternal"
) as HTMLDivElement;
const externalButton = document.getElementById(
  "showExternal"
) as HTMLDivElement;

if (AllButton) {
  // AllButton.addEventListener("click", () => setType("all"));
}

if (internalButton) {
  // internalButton.addEventListener("click", () => console.log(1));
}

if (externalButton) {
  externalButton.addEventListener("click", () => getModules(type));
}
