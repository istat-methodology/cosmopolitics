<template>
  <div class="row">
    <div class="col-9">
      <CCard>
        <CCardBody class="card-no-border">
          <network
            class="network"
            ref="network"
            :nodes="network.nodes"
            :edges="network.edges"
            :options="network.options"
            @select-node="handleSelectNode"
            @select-edge="handleSelectEdge"
          />
          <vue-slider
            :adsorb="true"
            :tooltip="'none'"
            v-model="sliderValue"
            :data="sliderData"
            :data-value="'id'"
            :data-label="'name'"
            @change="handleCounterChange"
          />
        </CCardBody>
      </CCard>
    </div>
    <div class="col-3">
      <CCard>
        <CCardHeader>
          Graph - properties
        </CCardHeader>
        <CCardBody>
          <label for="smooth" class="card-label">Edges</label>
          <v-select
            label="text"
            :options="smoothTypeOptions"
            placeholder="Edges type"
            v-model="smoothTypeSelected"
            @input="smoothTypeChange"
          />
          <label for="smooth" class="card-label mt-3">Physics</label>
          <CInputCheckbox
            label="Physics"
            :checked.sync="options.physics.enabled"
            @update:checked="toggleFixed"
          />
          <v-select
            v-if="options.physics.enabled"
            label="text"
            class="mt-2"
            :options="solverOptions"
            placeholder="Solver"
            v-model="sliderValue"
            @input="solverChange"
          />
        </CCardBody>
      </CCard>
      <CCard>
        <CCardHeader>
          Graph - filters
        </CCardHeader>
        <CCardBody>
          <label for="smooth" class="card-label">Transport</label>
          <br />
          <label for="smooth" class="card-label mt-3">Product</label>
        </CCardBody>
      </CCard>
    </div>
    <!-- Edge modal -->
    <CModal title="Edge modal" :show.sync="edgeModal">
      <span
        >Are you sure you want to remove trade relation betweew
        {{ sourceNode.label }} - {{ destinationNode.label }}?</span
      >
      <template #footer>
        <CButton color="outline-primary" square size="sm" @click="deleteEdge"
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
import { mapGetters } from "vuex";
import visMixin from "@/components/mixins/vis.mixin";
import VueSlider from "vue-slider-component";

export default {
  name: "GraphVisjs",
  components: { Network, VueSlider },
  mixins: [visMixin],
  data: () => ({
    sliderValue: "201910",
    sliderData: [
      { id: "201910", name: "Oct 19" },
      { id: "201911", name: "Nov 19" },
      { id: "201912", name: "Dec 19" },
      { id: "202001", name: "Jan 20" },
      { id: "202002", name: "Feb 20" },
      { id: "202003", name: "Mar 20" },
      { id: "202004", name: "Apr 20" },
      { id: "202005", name: "May 20" },
      { id: "202006", name: "Jun 20" },
      { id: "202007", name: "Jul 20" },
      { id: "202008", name: "Aug 20" },
      { id: "202009", name: "Sep 20" },
      { id: "202010", name: "Oct 20" },
      { id: "202011", name: "Nov 20" }
    ],
    edgeModal: false,
    sourceNode: {},
    destinationNode: {}
  }),
  computed: {
    ...mapGetters("graphVisjs", ["nodes", "edges"]),
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
    }
  },
  methods: {
    handleSelectNode(selectedGraph) {
      const selectedId = selectedGraph.nodes[0];
      this.getNode(this.network, selectedId);
    },
    handleSelectEdge(selectedGraph) {
      const selectedId = selectedGraph.edges[0];
      const selectedEdge = this.getEdge(this.network, selectedId);
      this.sourceNode = this.getNode(this.network, selectedEdge.from);
      this.destinationNode = this.getNode(this.network, selectedEdge.to);
      this.edgeModal = true;
    },
    deleteEdge() {
      //Send data to the server
      console.log(
        "I am asking the server to delete connection " +
          this.sourceNode.label +
          " - " +
          this.destinationNode.label
      );
      this.closeModal();
    },
    closeModal() {
      this.edgeModal = false;
    },
    drawNetwork(id) {
      this.$store.dispatch("graphVisjs/findById", id);
    },
    solverChange() {
      if (this.solverSelected) {
        this.options.physics.solver = this.solverSelected.value;
      }
    },
    toggleFixed() {
      this.options.nodes.fixed.x = !this.options.physics.enabled;
      this.options.nodes.fixed.y = !this.options.physics.enabled;
    },
    smoothTypeChange() {
      if (this.smoothTypeSelected)
        this.options.edges.smooth.type = this.smoothTypeSelected.value;
    },
    handleCounterChange(val) {
      console.log("Slider value: " + val);
      this.drawNetwork(val);
    }
  },
  created() {
    this.drawNetwork("201910");
  }
};
</script>

<style scoped>
.network {
  text-align: center;
  height: 550px;
  margin: 5px 0;
}
.card-no-border {
  padding: 0;
  border: none;
}
.card-label {
  color: #321fdb;
  font-size: 0.9em;
}
.vue-slider {
  margin: 2.5rem 1.5rem;
}
</style>
