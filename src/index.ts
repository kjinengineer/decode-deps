import * as d3 from "d3";
import extractNodesAndLinks from "../server/extract";
import { tree } from "d3";

const { nodes, links } = extractNodesAndLinks(tree);
const svg = d3.select("svg");

const simulation = d3
  .forceSimulation(nodes)
  .force(
    "link",
    d3
      .forceLink(links)
      .id((d: any) => d.id)
      .distance(100)
  )
  .force("charge", d3.forceManyBody().strength(-300))
  .force("center", d3.forceCenter(window.innerWidth / 2, 300));

// Draw links (lines between nodes)
const link = svg
  .append("g")
  .selectAll("line")
  .data(links)
  .enter()
  .append("line")
  .style("stroke", "#aaa");

// Draw nodes (circles)
const node = svg
  .append("g")
  .selectAll("circle")
  .data(nodes)
  .enter()
  .append("circle")
  .attr("r", 20)
  .attr("fill", "orange")
  .call(
    d3.drag().on("start", dragStarted).on("drag", dragged).on("end", dragEnded)
  );

// Add node labels
svg
  .append("g")
  .selectAll("text")
  .data(nodes)
  .enter()
  .append("text")
  .text((d: any) => d.id)
  .attr("x", (d: any) => d.x)
  .attr("y", (d: any) => d.y)
  .style("font-size", "12px");

// Update positions on each simulation tick
simulation.on("tick", () => {
  link
    .attr("x1", (d: any) => d.source.x)
    .attr("y1", (d: any) => d.source.y)
    .attr("x2", (d: any) => d.target.x)
    .attr("y2", (d: any) => d.target.y);

  node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);

  svg
    .selectAll("text")
    .attr("x", (d: any) => d.x)
    .attr("y", (d: any) => d.y);
});

// Drag event functions
function dragStarted(event: any, d: any) {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(event: any, d: any) {
  d.fx = event.x;
  d.fy = event.y;
}

function dragEnded(event: any, d: any) {
  if (!event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}
