import { fetchData } from "../utils/dataFetcher";

async function getData() {
  const data = await fetchData();
  return data;
}

function getInternalModules() {
  getData().then((res) => console.log(res));
  //   return {
  //     nodes: allData.nodes.filter((node) => node.type === "internal"),
  //     links: allData.links.filter((link) => link.linkType === "internal"),
  //   };
}
function getExternalModules() {
  getData().then((res) => console.log(res));
  //   return {
  //     nodes: allData.nodes.filter((node) => node.type === "external"),
  //     links: allData.links.filter((link) => link.linkType === "external"),
  //   };
}

function getAllModules(allData) {
  return allData;
}

const internalButton = document.getElementById(
  "showInternal"
) as HTMLDivElement;
const externalButton = document.getElementById(
  "showExternal"
) as HTMLDivElement;

if (internalButton) {
  internalButton.addEventListener("click", getInternalModules);
}

if (externalButton) {
  externalButton.addEventListener("click", getExternalModules);
}
