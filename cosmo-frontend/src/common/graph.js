import { loadImage } from "@/common"

export const options = {
  nodes: {
    borderWidth: 1,
    borderWidthSelected: 2,
    brokenImage: undefined,
    chosen: true,
    color: {
      border: "#ebedef",
      background: "#97C2FC",
      highlight: {
        border: "#768192",
        background: "#D2E5FF"
      },
      hover: {
        border: "#768192",
        background: "#D2E5FF"
      }
    },
    opacity: 1,
    fixed: {
      x: true,
      y: true
    },
    font: {
      color: "#343434",
      size: 14, // px
      face: "arial",
      background: "none",
      strokeWidth: 0, // px
      strokeColor: "#ffffff",
      align: "center",
      multi: false,
      vadjust: 0,
      bold: {
        color: "#343434",
        size: 14, // px
        face: "arial",
        vadjust: 0,
        mod: "bold"
      }
    },
    heightConstraint: false,
    hidden: false,
    imagePadding: {
      left: 0,
      top: 0,
      bottom: 0,
      right: 0
    },
    label: undefined,
    labelHighlightBold: true,
    level: undefined,
    mass: 1,
    scaling: {
      min: 10,
      max: 30,
      label: {
        enabled: false,
        min: 14,
        max: 30,
        maxVisible: 30,
        drawThreshold: 5
      },
      customScalingFunction: function (min, max, total, value) {
        if (max === min) {
          return 0.5
        } else {
          let scale = 1 / (max - min)
          return Math.max(0, (value - min) * scale)
        }
      }
    },
    shadow: {
      enabled: false,
      color: "rgba(0,0,0,0.5)",
      size: 10,
      x: 5,
      y: 5
    },
    shapeProperties: {
      borderDashes: false, // only for borders
      borderRadius: 6, // only for box shape
      interpolation: false, // only for image and circularImage shapes
      useImageSize: false, // only for image and circularImage shapes
      useBorderWithImage: true, // only for image shape
      coordinateOrigin: "center" // only for image and circularImage shapes
    },
    size: 30,
    title: undefined,
    value: undefined,
    widthConstraint: false
  },
  edges: {
    arrows: {
      to: {
        enabled: true,
        scaleFactor: 1,
        type: "triangle"
      }
    },
    endPointOffset: {
      from: 0,
      to: 0
    },
    arrowStrikethrough: true,
    chosen: true,
    color: {
      color: "#b1b7c1",
      highlight: "#768192",
      hover: "#FE0000", //"#768192",
      inherit: "from",
      opacity: 1.0
    },
    dashes: false,
    font: {
      color: "#343434",
      size: 14, // px
      face: "arial",
      background: "none",
      strokeWidth: 2, // px
      strokeColor: "#ffffff",
      align: "horizontal",
      multi: false,
      vadjust: 0,
      bold: {
        color: "#343434",
        size: 14, // px
        face: "arial",
        vadjust: 0,
        mod: "bold"
      },
      ital: {
        color: "#343434",
        size: 14, // px
        face: "arial",
        vadjust: 0,
        mod: "italic"
      },
      boldital: {
        color: "#343434",
        size: 14, // px
        face: "arial",
        vadjust: 0,
        mod: "bold italic"
      },
      mono: {
        color: "#343434",
        size: 15, // px
        face: "courier new",
        vadjust: 2,
        mod: ""
      }
    },
    hidden: false,
    hoverWidth: 1.5,
    label: undefined,
    labelHighlightBold: true,
    length: undefined,
    scaling: {
      min: 1,
      max: 15,
      label: {
        enabled: true,
        min: 14,
        max: 30,
        maxVisible: 30,
        drawThreshold: 5
      },
      customScalingFunction: function (min, max, total, value) {
        if (max === min) {
          return 0.5
        } else {
          var scale = 1 / (max - min)
          return Math.max(0, (value - min) * scale)
        }
      }
    },
    selectionWidth: 1,
    selfReference: {
      size: 20,
      angle: Math.PI / 4,
      renderBehindTheNode: true
    },
    shadow: {
      enabled: false,
      color: "rgba(0,0,0,0.5)",
      size: 10,
      x: 5,
      y: 5
    },
    smooth: {
      enabled: true,
      type: "dynamic",
      roundness: 0.5
    },
    title: undefined,
    value: undefined,
    width: 1,
    widthConstraint: false
  },
  physics: {
    enabled: false,
    barnesHut: {
      theta: 0.5,
      gravitationalConstant: -2000,
      centralGravity: 0.3,
      springLength: 95,
      springConstant: 0.04,
      damping: 0.09,
      avoidOverlap: 0
    },
    forceAtlas2Based: {
      theta: 0.5,
      gravitationalConstant: -50,
      centralGravity: 0.01,
      springConstant: 0.08,
      springLength: 100,
      damping: 0.4,
      avoidOverlap: 0
    },
    repulsion: {
      centralGravity: 0.2,
      springLength: 200,
      springConstant: 0.05,
      nodeDistance: 100,
      damping: 0.09
    },
    hierarchicalRepulsion: {
      centralGravity: 0.0,
      springLength: 100,
      springConstant: 0.01,
      nodeDistance: 120,
      damping: 0.09,
      avoidOverlap: 0
    },
    maxVelocity: 50,
    minVelocity: 0.1,
    solver: "forceAtlas2Based",
    stabilization: {
      enabled: true,
      iterations: 1000,
      updateInterval: 100,
      onlyDynamicEdges: false,
      fit: true
    },
    timestep: 0.5,
    adaptiveTimestep: true,
    wind: {
      x: 0,
      y: 0
    }
  },
  interaction: {
    hideEdgesOnDrag: false,
    hideEdgesOnZoom: false,
    hideNodesOnDrag: false,
    hover: true,
    multiselect: false,
    navigationButtons: true,
    tooltipDelay: 200,
    zoomSpeed: 1.4
  }
}

export const metricsFieldsIt = [
  { key: "label", label: "Codice", _style: "width:10%" },
  { key: "name", label: "Nome", _style: "width:30%" },
  { key: "vulnerability", label: "Vulnerabilità", _style: "width:15%" },
  { key: "hubness", label: "Hubness", _style: "width:15%" },
  {
    key: "exportStrenght",
    label: "Forza di esportazione",
    _style: "width:15%"
  }
]

export const metricsFieldsEn = [
  { key: "label", label: "Code", _style: "width:15%" },
  { key: "name", label: "Name", _style: "width:25%" },
  { key: "vulnerability", label: "Vulnerability", _style: "width:15%" },
  { key: "hubness", label: "Hubness", _style: "width:15%" },
  { key: "exportStrenght", label: "Export Strenght", _style: "width:15%" }
]

export const scenarioFieldsIt = [
  { key: "source", label: "Origine", _style: "width:25%" },
  { key: "destination", label: "Destinazione", _style: "width:25%" },
  { key: "percentage", label: "Percentuale", _style: "width:25%" },
  { key: "flow", label: "Flussi", _style: "width:24%" },
  {
    key: "show_delete",
    label: "",
    sorter: false,
    filter: false,
    _style: "width:1%"
  }
]

export const scenarioFieldsEn = [
  { key: "source", label: "Source", _style: "width:25%" },
  { key: "destination", label: "Destination", _style: "width:25%" },
  { key: "percentage", label: "Percentage", _style: "width:25%" },
  { key: "flow", label: "Flow", _style: "width:25%" },
  {
    key: "show_delete",
    label: "",
    sorter: false,
    filter: false,
    _style: "width:1%"
  }
]

export function getNode(nodes, nodeId) {
  const selectedNode = nodes.find((node) => node.id == nodeId)
  return selectedNode ? selectedNode : null
}

export function getEdge(edges, edgeId) {
  const selectedEdge = edges.find((edge) => edge.id == edgeId)
  return selectedEdge ? selectedEdge : null
}

export function getUInodes(nodes, countries) {
  var uiNodes = []
  if (nodes)
    nodes.forEach((node) => {
      uiNodes.push({
        id: node.id,
        label: node.label,
        name: getCountryName(countries, node.label),
        x: node.x * 314,
        y: node.y * 314,
        shape: "image",
        image: loadImage(node.label),
        size: 15
      })
    })
  return uiNodes
}

export function getScenarioNodes(nodes) {
  var lightNodes = []
  if (nodes)
    nodes.forEach((node) => {
      lightNodes.push({
        id: node.id,
        label: node.label,
        x: node.x,
        y: node.y
      })
    })
  return lightNodes
}

export function getCentrality(nodes, nodeId, metrics) {
  var nodeMetric = null
  const selectedNode = getNode(nodes, nodeId)
  if (selectedNode) {
    nodeMetric = {
      country: selectedNode.label,
      centrality: metrics.degree_centrality[selectedNode.label].toPrecision(4),
      vulnerability: metrics.vulnerability[selectedNode.label].toPrecision(4),
      hubness: metrics.hubness[selectedNode.label].toPrecision(4),
      exportationstrength:
        metrics["exportation strenght"][selectedNode.label].toPrecision(4)
    }
  }
  return nodeMetric
}

export function buildMetrics(data, countries) {
  var metrics = []
  if (data && data.nodes)
    data.nodes.forEach((node) => {
      metrics.push({
        label: node.label,
        name: getCountryName(countries, node.label),
        centrality: data.metriche.degree_centrality[node.label].toPrecision(2),
        vulnerability: data.metriche.vulnerability[node.label].toPrecision(2),
        hubness: data.metriche.hubness[node.label].toPrecision(2),
        exportStrenght:
          data.metriche["exportation strenght"][node.label].toPrecision(2)
      })
    })
  return metrics
}

export function getCountryName(countries, id) {
  var cntr = countries.find((country) => country.id == id)
  return cntr ? cntr.descr : ""
}

export function getTransportIds(transports) {
  var ids = []
  if (transports) transports.forEach((tr) => ids.push(tr.id))
  return ids
}

export function getTransportDifference(transports, scenarioTransports) {
  return getTransportIds(
    transports.filter(
      (tr) => !scenarioTransports.find((str) => str.id == tr.id)
    )
  )
}

export function replaceAllProdId(products) {
  var prods = []
  if (products) {
    prods = products.filter((pr) => pr.id != "TOT")
    prods.unshift({ id: "000", descr: "All Products" })
  }
  return prods
}

export function restoreAllProdId(product) {
  var id = ""
  if (product) id = product.id == "000" ? "TOT" : product.id
  return id
}
