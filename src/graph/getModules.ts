import { fetchData } from "../utils/dataFetcher";

export async function getModules(inpuType: string) {
  const inputData = await fetchData();
  const data: any = { ...inputData };

  if (inpuType === "internal") {
    let newLink = [];
    let newNode = [];
    const visitedLink = [];

    for (let el of data.links) {
      if (el.linkType === inpuType) {
        newLink.push(el);
      }
    }

    for (let el of newLink) {
      const sId = el.source.id || el.source;
      const tId = el.target.id || el.target;

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

    const result = { nodes: newNode, links: newLink, warning: data.warning };

    return result;
  } else if (inpuType === "external") {
    let newLink = [];
    let newNode = [];
    const visitedLink = [];
    for (let el of data.links) {
      if (el.linkType === inpuType) {
        newLink.push(el);
      }
    }
    for (let el of newLink) {
      const sId = el.source.id || el.source;
      const tId = el.target.id || el.target;
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

    const result = { nodes: newNode, links: newLink, warning: data.warning };
    return result;
  } else {
    return data;
  }
}
