import { loadImage } from "@/common";

export function getUInodes(nodes) {
  var uiNodes = [];
  if (nodes)
    nodes.forEach(node => {
      uiNodes.push({
        id: node.id,
        label: node.label,
        x: node.x * 314,
        y: node.y * 314,
        shape: "image",
        image: loadImage(node.label),
        size: 15
      });
    });
  return uiNodes;
}

export function buildMetrics(data) {
  var metrics = [];
  if (data && data.nodes)
    data.nodes.forEach(node => {
      metrics.push({
        label: node.label,
        centrality: data.metriche.degree_centrality[node.label].toPrecision(2),
        vulnerability: data.metriche.vulnerability[node.label].toPrecision(2),
        hubness: data.metriche.hubness[node.label].toPrecision(2),
        exportStrenght: data.metriche["exportation strenght"][
          node.label
        ].toPrecision(2)
      });
    });
  return metrics;
}
