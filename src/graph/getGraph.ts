import * as d3 from "d3";
import {
  applyInitialCharge,
  dragEnded,
  dragged,
  dragStarted,
} from "./getGraphForce";
import { maxNodes } from "../constant";

const width = window.innerWidth;
const height = window.innerHeight;

export function getGraph(
  data,
  savedNodeSize,
  savedLinkDistance,
  savedFontSize
) {
  const { nodes, links } = data;

  if (nodes.length > maxNodes) {
    alert(
      `The current node count is ${nodes.length}, which exceeds the maximum of ${maxNodes} nodes.\nPlease further subdivide your folders for better visualization.`
    );
    return;
  }

  d3.select("#canvas").select("svg").remove();
  const sizeArray = nodes.map((d) => d.size);
  const [minModuleSize, maxModuleSize] = d3.extent(sizeArray);
  const svg = d3.select("#canvas").append("svg");
  const g = svg.append("g");

  const zoom = d3
    .zoom()
    .scaleExtent([0.3, 25])
    .translateExtent([
      [-100, -100],
      [width + 90, height + 100],
    ])
    .on("zoom", (event) => {
      g.attr("transform", event.transform);
    });

  svg.call(zoom);

  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("visibility", "hidden");

  const colorScale = d3
    .scaleLinear()
    .domain([minModuleSize, maxModuleSize])
    .range(["#fde68a", "#f59e0b"]);

  const link = g
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .style("stroke", "#a1a1aa");

  const node = g
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .style("stroke", "#a1a1aa")
    .attr("r", savedNodeSize)
    .attr("fill", (d) => {
      return colorScale(d.size);
    })
    .attr("stroke-width", 1)
    .on("mouseover", function (event, d) {
      tooltip.style("visibility", "visible").html(() => {
        const words = `<strong>${d.id}</strong>`;
        const size = d.size;
        return `${words}<br>${size} bytes`;
      });
    })
    .on("mousemove", function (event) {
      tooltip
        .style("top", `${event.pageY + 10}px`)
        .style("left", `${event.pageX + 10}px`);
    })
    .on("mouseout", function () {
      tooltip.style("visibility", "hidden");
    })
    .call(
      d3
        .drag()
        .on("start", (event, d) => dragStarted(event, d, simulation))
        .on("drag", (event, d) => dragged(event, d))
        .on("end", (event, d) => dragEnded(event, d, simulation))
    );

  const text = g
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .text((d) => {
      const words = d.id.split("/");
      return words[words.length - 1];
    })
    .attr("x", (d) => d.x)
    .attr("y", (d) => d.y)
    .attr("class", "node-text")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .style("font-size", savedFontSize);

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "collide",
      d3.forceCollide().radius((d) => d.size + 25)
    )
    .force("center", d3.forceCenter(width / 2, height / 2))
    .alphaDecay(0.02);

  simulation.force(
    "link",
    d3
      .forceLink(links)
      .id((d) => {
        return d.id;
      })
      .distance(savedLinkDistance)
  );

  simulation.on("tick", () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

    text.attr("x", (d) => d.x).attr("y", (d) => d.y);
  });

  document.getElementById("nodeSize")?.addEventListener("input", (event) => {
    const newSize = +(event.target as HTMLInputElement).value;
    localStorage.setItem("nodeSize", String(newSize));
    node.attr("r", newSize);
    simulation.alpha(1).restart();
  });

  document
    .getElementById("linkDistance")
    ?.addEventListener("input", (event) => {
      const newDistance = +(event.target as HTMLInputElement).value;
      localStorage.setItem("linkDistance", String(newDistance));
      simulation.force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance(newDistance)
      );
      simulation.alpha(1).restart();
    });

  document.getElementById("fontSize")?.addEventListener("input", (event) => {
    const newFontSize = +(event.target as HTMLInputElement).value;
    localStorage.setItem("fontSize", String(newFontSize));

    d3.selectAll(".node-text").style("font-size", `${newFontSize}px`);
    simulation.alpha(1).restart();
  });

  applyInitialCharge(d3, simulation);
}
