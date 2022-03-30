<template>
  <div>
    <CCard>
      <CCardHeader>
        <div>
          <span class="float-right">
            <button
              class="btn mr-2 float-right btn-sm btn-square"
              title="Info"
              role="button"
              @click="showInfo"
            >
              i
            </button>
          </span>
          <span class="float-right">
            <exporter
              filename="cosmopolitics_graph_analysis"
              :data="getData('graph', this.$refs.graph)"
              :options="['jpeg', 'png', 'pdf', 'json']"
              :source="['graph']"
            >
            </exporter>
          </span>
        </div>
        <div class="graph-info">
          <span v-if="graphDensity > 0">
            <span class="text-primary"> {{ $t("graph.stats.density") }} </span
            >{{ graphDensity }}</span
          >
          <span class="pl-2" v-if="nodeMetric">
            <span class="text-primary">{{ $t("graph.stats.country") }}</span
            >: {{ nodeMetric.country }}
            <span class="text-primary"
              >, {{ $t("graph.stats.exportationstrength") }}</span
            >: {{ nodeMetric.exportationstrength }}
            <span class="text-primary"
              >, {{ $t("graph.stats.vulnerability") }}</span
            >
            : {{ nodeMetric.vulnerability }}
            <span class="text-primary">, {{ $t("graph.stats.hubness") }} </span
            >: {{ nodeMetric.hubness }}</span
          >
        </div>
      </CCardHeader>
      <CCardBody class="card-no-border">
        <circle-spin v-if="this.spinner" class="circle-spin"></circle-spin>
        <network
          id="graph"
          class="network"
          ref="graph"
          :nodes="nodes"
          :edges="edges"
          :options="options"
          @select-edge="handleSelectEdge"
          @hover-node="handleOverNode"
        />
      </CCardBody>
      <slot>
        <!-- Slider -->
      </slot>
    </CCard>
    <cosmo-scenario
      :showModal="scenarioModal"
      :data="selectedNodesTable"
      :fields="scenarioFields"
      :displayTransport="displayTransport"
      :selectedTransports="localTransports"
      :selectedScenarioTransports="scenarioTransports"
      @closeModal="closeModal"
      @updateTransports="handleUpdateTransports"
      @updateScenarioTransports="handleScenarioTransports"
      @applyConstraints="applyConstraints"
    />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { Network } from "vue-visjs";
import {
  options,
  getNode,
  getEdge,
  getCentrality,
  getTransportDifference,
  scenarioFieldsIt,
  scenarioFieldsEn
} from "@/common";
import spinnerMixin from "@/components/mixins/spinner.mixin";
import exporter from "@/components/Exporter";
import GraphScenario from "@/views/graph/GraphScenario";

export default {
  name: "GraphVis",
  components: { Network, exporter, "cosmo-scenario": GraphScenario },
  mixins: [spinnerMixin],
  data: () => ({
    options: { ...options },
    nodeMetric: null,
    selectedEdges: [],
    selectedNodesTable: [],
    //Make a local copy of transports for cosmo-scenario
    localTransports: [],
    scenarioTransports: [],
    //Scenario modal
    scenarioFieldsIt: [...scenarioFieldsIt],
    scenarioFieldsEn: [...scenarioFieldsEn],
    scenarioModal: false,
    //Metrics table
    sorterValue: { column: "percentage", asc: false }
  }),
  computed: {
    ...mapGetters("coreui", ["isItalian"]),
    scenarioFields() {
      return this.isItalian ? this.scenarioFieldsIt : this.scenarioFieldsEn;
    },
    graphDensity() {
      return this.metrics ? this.metrics.density.toPrecision(4) : 0;
    }
  },
  props: {
    nodes: {
      type: Array,
      default: () => []
    },
    edges: {
      type: Array,
      default: () => []
    },
    metrics: {
      type: Object,
      default: () => null
    },
    displayTransport: {
      type: Boolean,
      default: true
    },
    transports: {
      type: Array,
      default: () => null
    },
    spinner: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleUpdateTransports(trs) {
      this.localTransports = trs;
    },
    handleScenarioTransports(trs) {
      this.scenarioTransports = trs;
    },
    handleSelectEdge(selectedGraph) {
      this.selectedEdges = [];
      this.selectedNodesTable = [];

      //Compute total weight
      var sumOfSelectedEdge = 0;
      selectedGraph.edges.forEach(edgeId => {
        const selectedEdge = getEdge(this.edges, edgeId);
        sumOfSelectedEdge = sumOfSelectedEdge + selectedEdge.weight;
      });

      selectedGraph.edges.forEach(edgeId => {
        const selectedEdge = getEdge(this.edges, edgeId);
        const sourceNode = getNode(this.nodes, selectedEdge.from);
        const destinationNode = getNode(this.nodes, selectedEdge.to);

        this.selectedEdges.push(selectedEdge);

        var percentageFormatted =
          (selectedEdge.weight / sumOfSelectedEdge) * 100;
        var weightFormatted = selectedEdge.weight;

        this.selectedNodesTable.push({
          source: sourceNode.name,
          destination: destinationNode.name,
          total: weightFormatted.toLocaleString("en-US"),
          percentage: percentageFormatted.toFixed(2) + "%"
        });
      });
      //Local copy of selected transports
      this.localTransports = [...this.transports];
      this.scenarioModal = true;
    },
    handleOverNode(event) {
      const nodeId = event.node;
      this.nodeMetric = getCentrality(this.nodes, nodeId, this.metrics);
    },
    applyConstraints() {
      const constraints = [];
      this.selectedEdges.forEach(edge => {
        constraints.push({
          from: getNode(this.nodes, edge.from).label,
          to: getNode(this.nodes, edge.to).label,
          exclude: this.displayTransport
            ? getTransportDifference(this.transports, this.scenarioTransports)
            : "-99"
        });
      });
      this.$emit("applyConstraints", constraints);
      this.closeModal();
    },
    showInfo() {
      this.$emit("showinfo");
    },
    closeModal() {
      //Clear selected scenario transports
      this.scenarioTransports = [];
      this.scenarioModal = false;
    },
    getData(id) {
      var nodes = [];
      var edges = [];
      for (var edgeId in this.edges) {
        edges.push({
          from: this.edges[edgeId].from,
          to: this.edges[edgeId].to
        });
      }
      for (var nodeId in this.nodes) {
        nodes.push({
          id: this.nodes[nodeId].id,
          label: this.nodes[nodeId].label,
          x: this.nodes[nodeId].x,
          y: this.nodes[nodeId].y
        });
      }
      let jsonData = JSON.stringify({ nodes, edges });
      return [jsonData, id];
    }
  }
};
</script>
<style scoped>
.network {
  text-align: center;
  height: 580px;
  margin: 0 0;
}
.graph-info {
  margin-top: 0.4em;
  font-size: small;
}
.circle-spin {
  position: absolute;
  top: 20%;
  left: 50%;
}
</style>
