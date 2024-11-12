import { fetchData } from "../utils/dataFetcher";

export async function getModules(inpuType: string) {
  const data = await fetchData();
  let newLink = [];
  let newNode = [];
  const visitedLink = [];

  if (inpuType === "internal") {
    for (let el of data.links) {
      if (el.linkType === inpuType) {
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
  } else if (inpuType === "external") {
    for (let el of data.links) {
      if (el.linkType === inpuType) {
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
