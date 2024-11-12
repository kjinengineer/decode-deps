import { fetchData } from "../utils/dataFetcher";

export async function getModules(type: string) {
  const data = await fetchData();

  if (type === "internal") {
    return {
      nodes: data.nodes.filter((node) => node.linkType === type),
      links: data.links,
      warning: data.warning,
    };
  } else if (type === "external") {
    let newLink = [];
    let newNode = [];
    const visitedLink = [];

    for (let el of data.links) {
      if (el.linkType === "external") {
        newLink.push(el);
      }
    }

    for (let el of newLink) {
      const sId = el.source;
      const tId = el.target;
      if (!visitedLink.includes(sId)) {
        visitedLink.push(sId);
      }
      if (!visitedLink.includes(tId)) {
        visitedLink.push(tId);
      }
    }

    for (let el of data.nodes) {
      if (visitedLink.includes(el.id)) {
        newNode.push(el);
      }
    }

    return {
      nodes: newNode,
      links: newLink,
      warning: data.warning,
    };
  } else {
    return data;
  }
}
