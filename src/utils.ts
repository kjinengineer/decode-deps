import * as fs from "fs";
import * as path from "path";

interface TreeNode {
  id: string;
  children: TreeNode[];
  size: number;
}

interface NodeType {
  id: string;
  children?: TreeNode[];
  size: number;
}

interface LinkType {
  source: string;
  target: string;
}

const extractImports = (filePath: string) => {
  const content = fs.readFileSync(filePath, "utf-8");
  const importRegex = /import\s.*?from\s['"](.*?)['"]/g;
  const requireRegex = /require\(['"](.*?)['"]\)/g;
  const imports: string[] = [];

  let match: RegExpExecArray;

  // import
  while ((match = importRegex.exec(content)) !== null) {
    let importPath = match[1];
    if (!importPath.startsWith(".") && !importPath.startsWith("/")) {
      imports.push(importPath);
    } else {
      if (!importPath.endsWith(".ts") && !importPath.endsWith(".js")) {
        if (
          fs.existsSync(
            path.resolve(path.dirname(filePath), importPath + ".ts")
          )
        ) {
          importPath += ".ts";
        } else if (
          fs.existsSync(
            path.resolve(path.dirname(filePath), importPath + ".js")
          )
        ) {
          importPath += ".js";
        }
      }
      imports.push(path.join(path.dirname(filePath), importPath));
    }
  }

  // require
  while ((match = requireRegex.exec(content)) !== null) {
    let importPath = match[1];
    if (!importPath.startsWith(".") && !importPath.startsWith("/")) {
      imports.push(importPath);
    } else {
      if (!importPath.endsWith(".ts") && !importPath.endsWith(".js")) {
        if (
          fs.existsSync(
            path.resolve(path.dirname(filePath), importPath + ".ts")
          )
        ) {
          importPath += ".ts";
        } else if (
          fs.existsSync(
            path.resolve(path.dirname(filePath), importPath + ".js")
          )
        ) {
          importPath += ".js";
        }
      }
      imports.push(path.join(path.dirname(filePath), importPath));
    }
  }

  return imports;
};

const getFileSize = (filePath: string): number => {
  try {
    const stats = fs.statSync(filePath);
    return parseFloat((stats.size / 1024).toFixed(2));
  } catch (error) {
    return 0;
  }
};

export const extractNodesAndLinks = (
  tree: TreeNode
): {
  nodes: NodeType[];
  links: LinkType[];
} => {
  const nodes: NodeType[] = [];
  const links: LinkType[] = [];

  const visited = [];

  function getNodes(node: TreeNode) {
    const newNode: NodeType = {
      id: node.id,
      size: node.size,
      children: node.children,
    };

    if (!visited.includes(newNode.id)) {
      visited.push(newNode.id);
      nodes.push(newNode);
      if (node.children) {
        node.children.forEach((child) => {
          links.push({ source: node.id, target: child.id });
          getNodes(child);
        });
      }
    }
  }

  getNodes(tree);

  return { nodes, links };
};

export const getDependencies = (
  dirs: string[]
): { [key: string]: string[] } => {
  const dependencies: { [key: string]: string[] } = {};

  function traverseDirectory(currentDir: string) {
    const files = fs.readdirSync(currentDir);

    files.forEach((file) => {
      const filePath = path.join(currentDir, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        traverseDirectory(filePath);
      } else if (
        stats.isFile() &&
        (file.endsWith(".ts") || file.endsWith(".js"))
      ) {
        dependencies[filePath] = extractImports(filePath);
      }
    });
  }

  dirs.forEach((dir) => {
    traverseDirectory(dir);
  });

  return dependencies;
};

export const buildTree = (
  deps: { [key: string]: string[] },
  root: string
): TreeNode => {
  const node: TreeNode = {
    id: root,
    children: [],
    size: getFileSize(root),
  };

  if (deps[root]) {
    deps[root].forEach((child) => {
      node.children.push(buildTree(deps, child));
    });
  }

  return node;
};

export const makeNodeTree = async (
  d3,
  port,
  savedNodeSize,
  savedLinkDistance
) => {
  const response = await fetch(`http://localhost:${port}/track`);
  const data = await response.json();
  const { nodes, links } = data;

  const width = window.innerWidth;
  const height = window.innerHeight;

  const sizeArray = nodes.map((d) => d.size);
  const [minModuleSize, maxModuleSize] = d3.extent(sizeArray);

  const svg = d3.select("svg");

  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("visibility", "hidden");

  const colorScale = d3
    .scaleLinear()
    .domain([minModuleSize, maxModuleSize])
    .range(["#fde68a", "#f59e0b"]);

  const link = svg
    .append("g")
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .style("stroke", "#d1d5db");

  const node = svg
    .append("g")
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("r", savedNodeSize)
    .attr("fill", (d) => colorScale(d.size))
    .attr("stroke-width", 1)
    .on("mouseover", function (event, d) {
      tooltip.style("visibility", "visible").text(`${d.size} bytes`);
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
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded)
    );

  svg
    .append("g")
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .text((d) => d.id)
    .attr("x", (d) => d.x)
    .attr("y", (d) => d.y)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .style("font-size", "12px");

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d) => d.id)
        .distance(savedLinkDistance)
    )
    .force("charge", d3.forceManyBody().strength(-200))
    .force("center", d3.forceCenter(width / 2, height / 2));

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

  function dragStarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.2).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  function dragged(event, d) {
    d.fx = Math.max(20, Math.min(window.innerWidth - 100, event.x));
    d.fy = Math.max(20, Math.min(window.innerHeight - 100, event.y));
  }
  function dragEnded(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  document.getElementById("nodeSize").addEventListener("input", (event) => {
    const newSize = +(event.target as HTMLInputElement).value;
    localStorage.setItem("nodeSize", String(newSize));
    node.attr("r", newSize);
    simulation.alpha(1).restart();
  });

  document.getElementById("linkDistance").addEventListener("input", (event) => {
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
};
