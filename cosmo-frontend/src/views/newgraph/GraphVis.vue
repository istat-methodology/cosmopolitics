<template>
  <div>
    <CCard>
      <CCardHeader>
        <div>
          <span> {{ $t("graph.card.title") }} Extra UE</span>
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
          :nodes="network.nodes"
          :edges="network.edges"
          :options="network.options"
          @select-edge="handleSelectEdge"
          @hover-node="handleOverNode"
        />
      </CCardBody>
      <slot>
        <!-- Slider -->
      </slot>
    </CCard>
    <!-- Edge modal -->
    <CModal
      title="Change graph constraints?"
      :show.sync="edgeModal"
      :closeOnBackdrop="false"
    >
      <label class="card-label mt-2">Edges</label>
      <CListGroup>
        <CListGroupItem
          color="light"
          href="#"
          v-for="(node, index) in selectedNodes"
          :key="index"
        >
          {{ node.source.label }} - {{ node.destination.label }}
        </CListGroupItem>
      </CListGroup>
      <label class="card-label mt-3">Transport</label>
      <v-select
        label="descr"
        multiple
        :options="transportConstraintStart"
        placeholder="Select transport"
        v-model="transportConstraint"
      />
      <template #footer>
        <CButton
          color="outline-primary"
          square
          size="sm"
          @click="applyConstraints"
          >Yes</CButton
        >
        <CButton color="outline-primary" square size="sm" @click="closeModal"
          >No</CButton
        >
      </template>
    </CModal>
  </div>
</template>
<script>
import { Network } from "vue-visjs";
import visMixin from "@/components/mixins/graph.mixin";
import spinnerMixin from "@/components/mixins/spinner.mixin";
import exporter from "@/components/Exporter";

export default {
  name: "GraphVis",
  components: { Network, exporter },
  mixins: [visMixin, spinnerMixin],
  data: () => ({
    nodeMetric: null,
    //Edge modal
    edgeModal: false,
    selectedEdges: [],
    selectedNodes: [],
    transportConstraint: [],
    transportConstraintStart: [],
    transportConstraintSelected: {},
    edgeFromTo: null
  }),
  props: {
    nodes: {
      type: Array,
      default: () => null
    },
    edges: {
      type: Array,
      default: () => null
    },
    metrics: {
      type: Object,
      default: () => null
    },
    spinner: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    network() {
      return this.nodes && this.edges
        ? {
            nodes: this.nodes,
            edges: this.edges,
            options: this.options
          }
        : {
            nodes: [],
            edges: [],
            options: null
          };
    },
    graphDensity() {
      return this.metrics ? this.metrics.density.toPrecision(4) : 0;
    }
  },
  methods: {
    showInfo() {
      this.$emit("showinfo");
    },
    closeModal() {
      this.edgeModal = false;
    },
    handleSelectEdge(selectedGraph) {
      this.transportConstraint = [];
      //console.log(selectedGraph);
      this.selectedEdges = [];
      this.selectedNodes = [];
      selectedGraph.edges.forEach(edgeId => {
        const selectedEdge = this.getEdge(this.network, edgeId);
        const sourceNode = this.getNode(this.network, selectedEdge.from);
        const destinationNode = this.getNode(this.network, selectedEdge.to);

        if (selectedGraph.edges.length > 1) {
          this.edgeFromTo = this.edgeFromTo + "-" + destinationNode.label;
        } else {
          this.edgeFromTo = sourceNode.label + "-" + destinationNode.label;
        }

        this.selectedEdges.push(selectedEdge);
        this.selectedNodes.push({
          source: sourceNode,
          destination: destinationNode
        });
      });

      if (selectedGraph.edges.length > 1) {
        this.transportConstraintStart = this.transport;
      } else {
        this.transportConstraintStart = this.transportConstraintSelected[
          this.edgeFromTo
        ]
          ? this.transportConstraintSelected[this.edgeFromTo]
          : this.transport;
      }
      this.edgeModal = true;
    },
    handleOverNode(event) {
      const nodeId = event.node;
      this.nodeMetric = this.getCentrality(this.network, nodeId, this.metrics);
    },
    applyConstraints() {
      const constraints = [];
      this.selectedEdges.forEach(edge => {
        this.setTransportConstraintStart();
        constraints.push({
          from: this.getNode(this.network, edge.from).label,
          to: this.getNode(this.network, edge.to).label,
          exclude: this.getIds(this.transportConstraint)
        });
      });
      // ---------------------------------------
      // @TODO Change the name of the form keys
      // ---------------------------------------
      const form = {
        tg_period: this.selectedPeriod.id,
        tg_perc: this.percentage,
        listaMezzi: this.getIds(this.transport),
        product: this.product.id,
        flow: this.flow.id,
        weight_flag: true,
        pos: { nodes: this.nodes },
        selezioneMezziEdges: constraints
      };
      this.requestToServer(form);
      this.closeModal();
    },
    setTransportConstraintStart() {
      let transport = this.transportConstraintStart.filter(
        o => !this.transportConstraint.find(o2 => o.id === o2.id)
      );
      this.transportConstraintSelected[this.edgeFromTo] = transport;
    },
    getData(id) {
      var nodes = [];
      var edges = [];
      for (var edgeId in this.network.edges) {
        edges.push({
          from: this.network.edges[edgeId].from,
          to: this.network.edges[edgeId].to
        });
      }
      for (var nodeId in this.network.nodes) {
        nodes.push({
          id: this.network.nodes[nodeId].id,
          label: this.network.nodes[nodeId].label,
          x: this.network.nodes[nodeId].x,
          y: this.network.nodes[nodeId].y
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
  height: 650px;
  margin: 0 0;
}
.graph-info {
  margin-top: 1em;
  font-size: small;
}
.circle-spin {
  position: absolute;
  top: 20%;
  left: 50%;
}
</style>
