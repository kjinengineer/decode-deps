const width = window.innerWidth;
const height = window.innerHeight;

export function applyInitialCharge(d3, simulation) {
  simulation
    .force("charge", d3.forceManyBody().strength(-100))
    .alpha(1)
    .restart();

  setTimeout(() => {
    simulation.force("charge", null);
    simulation.alphaTarget(0);
  }, 2000);
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
