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
    addColor(inpuType);
    remoeColor("external");
    remoeColor("all");

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
    addColor(inpuType);
    remoeColor("internal");
    remoeColor("all");
    const result = { nodes: newNode, links: newLink, warning: data.warning };
    return result;
  } else {
    addColor("all");
    remoeColor("external");
    remoeColor("internal");
    return data;
  }
}

function addColor(type: string) {
  if (type === "internal") {
    const buttonbox = document.querySelector("#showInternal") as HTMLElement;
    buttonbox.style.borderColor = "#f59e0b";
    buttonbox.style.color = "#f59e0b";
  } else if (type === "external") {
    const buttonbox = document.querySelector("#showExternal") as HTMLElement;
    buttonbox.style.borderColor = "#f59e0b";
    buttonbox.style.color = "#f59e0b";
  } else {
    const buttonbox = document.querySelector("#showAll") as HTMLElement;
    buttonbox.style.borderColor = "#f59e0b";
    buttonbox.style.color = "#f59e0b";
  }
}

function remoeColor(type: string) {
  if (type === "internal") {
    const buttonbox = document.querySelector("#showInternal") as HTMLElement;
    buttonbox.style.borderColor = "white";
    buttonbox.style.color = "white";
  } else if (type === "external") {
    const buttonbox = document.querySelector("#showExternal") as HTMLElement;
    buttonbox.style.borderColor = "white";
    buttonbox.style.color = "white";
  } else {
    const buttonbox = document.querySelector("#showAll") as HTMLElement;
    buttonbox.style.borderColor = "white";
    buttonbox.style.color = "white";
  }
}
