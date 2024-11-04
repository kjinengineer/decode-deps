import { maxNodes, port, width, height } from "./graphConstant.js";
import {
  applyInitialCharge,
  dragEnded,
  dragged,
  dragStarted,
  ticked,
} from "./graphUtil.js";

let savedNodeSize = 30;
let savedLinkDistance = 125;

window.onload = () => {
  savedNodeSize = Number(localStorage.getItem("nodeSize")) || 30;
  savedLinkDistance = Number(localStorage.getItem("linkDistance")) || 125;

  document.getElementById("nodeSize").value = savedNodeSize.toString();
  document.getElementById("linkDistance").value = savedLinkDistance.toString();
  getNodeTree();
};

async function getNodeTree() {
  const response = await fetch(`http://localhost:${port}/track`);
  const data = await response.json();
  const { nodes, links } = data;

  if (nodes.length > maxNodes) {
    alert(
      `The current node count is ${nodes.length}, which exceeds the maximum of ${maxNodes} nodes.\nPlease further subdivide your folders for better visualization.`
    );
    return;
  }

  const sizeArray = nodes.map((d) => d.size);
  const [minModuleSize, maxModuleSize] = d3.extent(sizeArray);

  const svg = d3.select("svg");

  const zoom = d3
    .zoom()
    .scaleExtent([1, 40])
    .translateExtent([
      [-100, -100],
      [width + 90, height + 100],
    ])
    .on("zoom", zoomed);

  const g = svg.append("g");

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
    .append("g")
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .style("stroke", "#a1a1aa");

  const node = g
    .append("g")
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("r", savedNodeSize)
    .attr("fill", (d) => colorScale(d.size))
    .attr("stroke-width", 1)
    .style("stroke", "#a1a1aa")
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

  g.selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .append("tspan")
    .text((d) => {
      const words = d.id.split("/");
      return words[words.length - 1];
    })
    .attr("x", (d) => d.x)
    .attr("y", (d) => d.y)
    .attr("class", "node-text")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle");

  function zoomed(event) {
    g.attr("transform", event.transform);
  }

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d) => d.id)
        .distance(savedLinkDistance)
    )
    .force(
      "collide",
      d3.forceCollide().radius((d) => d.size + 5)
    )
    .force("center", d3.forceCenter(width / 2, height / 2))
    .on("tick", ticked);

  simulation.on("tick", () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);
    node
      .attr("cx", (d) => {
        if (d.x < 0 || d.x > width) {
          d.vx *= -1;
          d.x = Math.max(0, Math.min(width, d.x));
        }
        return d.x;
      })
      .attr("cy", (d) => {
        if (d.y < 0 || d.y > height) {
          d.vy *= -1;
          d.y = Math.max(0, Math.min(height, d.y));
        }
        return d.y;
      });
    svg
      .selectAll("text")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y);
  });

  document.getElementById("nodeSize")?.addEventListener("input", (event) => {
    const newSize = +event.target.value;
    localStorage.setItem("nodeSize", String(newSize));
    node.attr("r", newSize);
    simulation.alpha(1).restart();
  });

  document
    .getElementById("linkDistance")
    ?.addEventListener("input", (event) => {
      const newDistance = +event.target.value;
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

  applyInitialCharge(d3, simulation);
}
