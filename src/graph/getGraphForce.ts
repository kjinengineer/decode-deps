const width = window.innerWidth;
const height = window.innerHeight;

export function applyInitialCharge(d3, simulation) {
  simulation
    .force("charge", d3.forceManyBody().strength(-200))
    .alpha(1)
    .restart();

  setTimeout(() => {
    simulation.force("charge", null);
    simulation.alphaTarget(0);
  }, 2000);
}

export function ticked(link, node) {
  link
    .attr("x1", (d) => d.source.x)
    .attr("y1", (d) => d.source.y)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y);

  node
    .attr("cx", (d) => {
      if (d.x - d.size < 0 || d.x + d.size > width) {
        d.vx = -d.vx * 0.5;
      }
      return d.x;
    })
    .attr("cy", (d) => {
      if (d.y - d.size < 0 || d.y + d.size > height) {
        d.vy = -d.vy * 0.5;
      }
      return d.y;
    });
}

export function dragStarted(event, d, simulation) {
  if (!event.active) simulation.alphaTarget(0.5).restart();
  d.fx = d.x;
  d.fy = d.y;
}

export function dragged(event, d) {
  d.fx = Math.max(0, Math.min(width - 100, event.x));
  d.fy = Math.max(30, Math.min(height - 30, event.y));
}

export function dragEnded(event, d, simulation) {
  if (!event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}
