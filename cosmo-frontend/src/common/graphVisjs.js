export function decorateNode(node) {
  return {
    ...node,
    x: node.x * 314,
    y: node.y * 314,
    shape: "image",
    image:
      "https://flagpedia.net/data/flags/mini/" +
      node.label.toLowerCase() +
      ".png",
    size: 15
  };
}
