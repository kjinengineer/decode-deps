// import * as d3 from "d3";
import {
  applyInitialCharge,
  dragEnded,
  dragged,
  dragStarted,
} from "./getGraphForce.js";
import { maxNodes } from "../constant.js";
var width = window.innerWidth;
var height = window.innerHeight;
export function getGraph(
  data,
  savedNodeSize,
  savedLinkDistance,
  savedFontSize
) {
  var _a, _b, _c;
  var nodes = data.nodes,
    links = data.links;
  if (nodes.length > maxNodes) {
    alert(
      "The current node count is "
        .concat(nodes.length, ", which exceeds the maximum of ")
        .concat(
          maxNodes,
          " nodes.\nPlease further subdivide your folders for better visualization."
        )
    );
    return;
  }
  d3.select("#canvas").select("svg").remove();
  var sizeArray = nodes.map(function (d) {
    return d.size;
  });
  var _d = d3.extent(sizeArray),
    minModuleSize = _d[0],
    maxModuleSize = _d[1];
  var svg = d3.select("#canvas").append("svg");
  var g = svg.append("g");
  var zoom = d3
    .zoom()
    .scaleExtent([0.3, 25])
    .translateExtent([
      [-100, -100],
      [width + 90, height + 100],
    ])
    .on("zoom", function (event) {
      g.attr("transform", event.transform);
    });
  svg.call(zoom);
  var tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("visibility", "hidden");
  var colorScale = d3
    .scaleLinear()
    .domain([minModuleSize, maxModuleSize])
    .range(["#fde68a", "#f59e0b"]);
  var link = g
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .style("stroke", "#a1a1aa");
  var node = g
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .style("stroke", "#a1a1aa")
    .attr("r", savedNodeSize)
    .attr("fill", function (d) {
      return colorScale(d.size);
    })
    .attr("stroke-width", 1)
    .on("mouseover", function (event, d) {
      tooltip.style("visibility", "visible").html(function () {
        var words = "<strong>".concat(d.id, "</strong>");
        var size = d.size;
        return "".concat(words, "<br>").concat(size, " bytes");
      });
    })
    .on("mousemove", function (event) {
      tooltip
        .style("top", "".concat(event.pageY + 10, "px"))
        .style("left", "".concat(event.pageX + 10, "px"));
    })
    .on("mouseout", function () {
      tooltip.style("visibility", "hidden");
    })
    .call(
      d3
        .drag()
        .on("start", function (event, d) {
          return dragStarted(event, d, simulation);
        })
        .on("drag", function (event, d) {
          return dragged(event, d);
        })
        .on("end", function (event, d) {
          return dragEnded(event, d, simulation);
        })
    );
  var text = g
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .text(function (d) {
      var words = d.id.split("/");
      return words[words.length - 1];
    })
    .attr("x", function (d) {
      return d.x;
    })
    .attr("y", function (d) {
      return d.y;
    })
    .attr("class", "node-text")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .style("font-size", savedFontSize);
  var simulation = d3
    .forceSimulation(nodes)
    .force(
      "collide",
      d3.forceCollide().radius(function (d) {
        return d.size + 25;
      })
    )
    .force("center", d3.forceCenter(width / 2, height / 2))
    .alphaDecay(0.02);
  simulation.force(
    "link",
    d3
      .forceLink(links)
      .id(function (d) {
        return d.id;
      })
      .distance(savedLinkDistance)
  );
  simulation.on("tick", function () {
    link
      .attr("x1", function (d) {
        return d.source.x;
      })
      .attr("y1", function (d) {
        return d.source.y;
      })
      .attr("x2", function (d) {
        return d.target.x;
      })
      .attr("y2", function (d) {
        return d.target.y;
      });
    node
      .attr("cx", function (d) {
        return d.x;
      })
      .attr("cy", function (d) {
        return d.y;
      });
    text
      .attr("x", function (d) {
        return d.x;
      })
      .attr("y", function (d) {
        return d.y;
      });
  });
  (_a = document.getElementById("nodeSize")) === null || _a === void 0
    ? void 0
    : _a.addEventListener("input", function (event) {
        var newSize = +event.target.value;
        localStorage.setItem("nodeSize", String(newSize));
        node.attr("r", newSize);
        simulation.alpha(1).restart();
      });
  (_b = document.getElementById("linkDistance")) === null || _b === void 0
    ? void 0
    : _b.addEventListener("input", function (event) {
        var newDistance = +event.target.value;
        localStorage.setItem("linkDistance", String(newDistance));
        simulation.force(
          "link",
          d3
            .forceLink(links)
            .id(function (d) {
              return d.id;
            })
            .distance(newDistance)
        );
        simulation.alpha(1).restart();
      });
  (_c = document.getElementById("fontSize")) === null || _c === void 0
    ? void 0
    : _c.addEventListener("input", function (event) {
        var newFontSize = +event.target.value;
        localStorage.setItem("fontSize", String(newFontSize));
        d3.selectAll(".node-text").style(
          "font-size",
          "".concat(newFontSize, "px")
        );
        simulation.alpha(1).restart();
      });
  applyInitialCharge(d3, simulation);
}
