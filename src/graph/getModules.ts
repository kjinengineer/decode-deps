import { fetchData } from "../utils/dataFetcher";

export async function getModules(type: string) {
  const data = await fetchData();
  if (type === "all") {
    console.log("all");
    return data;
  } else if (type === "internal") {
    console.log("in");
    return {
      nodes: data.nodes.filter((node) => node.type === "internal"),
      links: data.links.filter((link) => link.linkType === "internal"),
    };
  } else if (type === "external") {
    console.log("ex");
    return {
      nodes: data.nodes.filter((node) => node.type === "external"),
      links: data.links.filter((link) => link.linkType === "external"),
    };
  }
}
