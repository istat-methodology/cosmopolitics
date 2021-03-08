export default {
  data: () => ({
    options: {
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
          customScalingFunction: function(min, max, total, value) {
            if (max === min) {
              return 0.5;
            } else {
              let scale = 1 / (max - min);
              return Math.max(0, (value - min) * scale);
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
            type: "arrow"
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
          customScalingFunction: function(min, max, total, value) {
            if (max === min) {
              return 0.5;
            } else {
              var scale = 1 / (max - min);
              return Math.max(0, (value - min) * scale);
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
        wind: { x: 0, y: 0 }
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
    },
    solverSelected: "forceAtlas2Based",
    solverOptions: [
      { text: "barnesHut", value: "barnesHut" },
      { text: "forceAtlas2Based", value: "forceAtlas2Based" },
      { text: "repulsion", value: "repulsion" },
      { text: "hierarchicalRepulsion", value: "hierarchicalRepulsion" }
    ],
    smoothTypeSelected: "continuous",
    smoothTypeOptions: [
      { text: "dynamic", value: "dynamic" },
      { text: "continuous", value: "continuous" },
      { text: "discrete", value: "discrete" },
      { text: "diagonalCross", value: "diagonalCross" },
      { text: "straightCross", value: "straightCross" },
      { text: "horizontal", value: "horizontal" },
      { text: "vertical", value: "vertical" },
      { text: "curvedCW", value: "curvedCW" },
      { text: "curvedCCW", value: "curvedCCW" },
      { text: "cubicBezier", value: "cubicBezier" }
    ]
  }),
  methods: {
    getNode(network, nodeId) {
      const selectedNode = network.nodes.find(node => {
        return node.id == nodeId;
      });
      console.log("Selected node: " + selectedNode.label);
      return selectedNode ? selectedNode : null;
    },
    getEdge(network, edgeId) {
      const selectedEdge = network.edges.find(edge => {
        return edge.id == edgeId;
      });
      console.log("From: " + selectedEdge.from + ", To: " + selectedEdge.to);
      return selectedEdge ? selectedEdge : null;
    },
    getCentrality(network, nodeId, metrics) {
      var nodeMetric = null;
      const selectedNode = this.getNode(network, nodeId);
      if (selectedNode) {
        nodeMetric = {
          centrality: metrics.degree_centrality[selectedNode.label].toPrecision(
            4
          ),
          vulnerability: metrics.vulnerability[selectedNode.label].toPrecision(
            4
          ),
          hubness: metrics.hubness[selectedNode.label].toPrecision(4)
        };
      }
      return nodeMetric;
    }
  }
};
