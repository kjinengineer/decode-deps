import * as d3 from "d3";

const sourceDir = "./test";
const rootModule = "test/moduleA.ts";

async function fetchTreeData() {
  const response = await fetch(
    `http://localhost:4000/track?sourceDir=${sourceDir}&rootModule=${rootModule}`
  );
  const data = await response.json();
  const svg = d3.select("svg");

  const { nodes, links } = data;

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d) => d.id)
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
      d3
        .drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded)
    );

  // Add node labels
  svg
    .append("g")
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .text((d) => d.id)
    .attr("x", (d) => d.x)
    .attr("y", (d) => d.y)
    .style("font-size", "12px");

  // Update positions on each simulation tick
  simulation.on("tick", () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

    svg
      .selectAll("text")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y);
  });

  // Drag event functions
  function dragStarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragEnded(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}

fetchTreeData();
