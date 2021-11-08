<template>
  <div class="row">
    <div class="col-9">
      <CCard>
        <CCardHeader>
          <span v-if="graphDensity > 0">
            <span class="text-primary">Graph density: </span>{{ graphDensity }}</span>
            <span v-else>Graph metrics</span>
          <span class="pl-2" v-if="nodeMetric">
            <span class="text-primary">, node centrality: </span>{{ nodeMetric.centrality }}
            <span class="text-primary">, vulnerability: </span>{{ nodeMetric.vulnerability }}
            <span class="text-primary">, hubness:</span>{{ nodeMetric.hubness }}
          </span>

          <exporter typeDownload='jpeg' filename="_graphAnalysis.jpeg" :items="getCanvas()"> </exporter>
          <exporter typeDownload='png' filename="_graphAnalysis.png" :items="getCanvas()"> </exporter>
          <exporter typeDownload='pdf' filename="_graphAnalysis.pdf" :items="getCanvas()"> </exporter>
          <exporter typeDownload='json' filename="_graphAnalysis.json" :items="getJson()"> </exporter>

          <div v-show="error">
            {{ error }}
          </div>


        </CCardHeader>
        <CCardBody class="card-no-border">
          <circle-spin v-if="this.spinner" class="circle-spin"></circle-spin>          
          <network           
            id="graph"
            class="network"
            ref="network"
            :nodes="network.nodes"
            :edges="network.edges"
            :options="network.options"
            v-on:after-drawing="spinnerSettings(false, 'after-drawing');"
            @select-edge="handleSelectEdge"
            @hover-node="handleOverNode"
          />
          <vue-slider
            :adsorb="true"
            :tooltip="'none'"
            v-model="sliderValue"
            :data="timePeriod"
            :data-value="'id'"
            :data-label="'name'"
            @change="handleSliderChange"
          />
        </CCardBody>
      </CCard>
    </div>
    <div class="col-3">
      <CCard>
        <CCardHeader>
          Graph filters
        </CCardHeader>
        <CCardBody>
          <label class="card-label">Period</label>
          <v-select
            label="name"
            :options="timePeriod"
            placeholder="Select period"
            v-model="selectedPeriod"
            :class="{
              'is-invalid': $v.selectedPeriod.$error
            }"
            @input="updateSlider"
          />
          <CInput
            label="Percentage"
            placeholder="Set percentage"
            class="card-label mt-2"
            v-model="percentage"
            :class="{
              'is-invalid': $v.percentage.$error
            }"
          />
          <label class="card-label mt-2">Transport</label>
          <v-select
            label="descr"
            multiple
            :options="transports"
            placeholder="Select transport"
            v-model="transport"
            :class="{
              'is-invalid': $v.transport.$error
            }"
          />
          <label class="card-label mt-2">Product</label>
          <v-select
            label="descr"
            :options="products"
            placeholder="Select a product"
            v-model="product"
            :class="{
              'is-invalid': $v.product.$error
            }"
          />
          <label class="card-label mt-2">Flows</label>
          <v-select
            label="descr"
            :options="flows"
            placeholder="Select a flow"
            v-model="flow"
            :class="{
              'is-invalid': $v.flow.$error
            }"
          />
          <label class="card-label mt-2">Weights</label>
          <v-select
            label="descr"
            :options="weights"
            placeholder="Weights"
            v-model="weight"
            :class="{
              'is-invalid': $v.weight.$error
            }"
          />
          <CButton
            color="primary"
            shape="square"
            size="sm"
            @click="handleSubmit"
            class="mt-3"
            >Go!</CButton
          >
        </CCardBody>
      </CCard>
    </div>
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
        :options="transports"
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
import { mapGetters } from "vuex";
import { Context } from "@/common";
import visMixin from "@/components/mixins/vis.mixin";
import sliderMixin from "@/components/mixins/slider.mixin";
import VueSlider from "vue-slider-component";
import { required ,numeric } from "vuelidate/lib/validators";
import spinnerMixin from "@/components/mixins/spinner.mixin";
import exporter from "@/components/Exporter";

export default {
  name: "GraphVisjs",
  components: { Network, VueSlider, exporter },
  mixins: [visMixin, sliderMixin, spinnerMixin],
  data: () => ({
    blank: "",
    //Form fields
    selectedPeriod: { id: "202003", name: "Mar 20" },
    percentage: 90,
    transport: null,
    product: null,
    flow: null,
    weight: null,

    //Graph modal
    edgeModal: false,
    selectedEdges: [],
    selectedNodes: [],
    transportConstraint: null,

    //Metrics
    nodeMetric: null,

    //Slider
    sliderValue: "202003",
    //Spinner 
    networkEvents: "",
    spinner:false,
    scale: 1,
    dark: false,
    size: {
      widthScreenCm: 56.82,
      widthPaperCm: 17.99,
      widthPx: 2159,
      heightScreenCm: 28.58,
      heightPaperCm: 9.05,
      heightPx: 1086
    },
    working: false,
    url: '',
    base64: '',
    error: '',
    dataUrl: '',

  }),
  computed: {
    ...mapGetters("graphVisjs", ["nodes", "edges", "metrics"]),
    ...mapGetters("classification", [
      "transports",
      "products",
      "flows",
      "weights"
    ]),
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
  validations: {
    selectedPeriod: {
      required
    },
    percentage:{
      required, numeric 
    },
    transport: {
      required
    },
    product: {
      required
    },
    flow: {
      required
    },
    weight: {
      required
    }
  },
  methods: {
    spinnerStart(bool){
        this.spinner = bool;
    },     
    spinnerSettings(bool,eventName){
      //this.networkEvents += `${eventName}, `;
      console.log(eventName)
      this.spinner = bool; 
    },
    handleSelectEdge(selectedGraph) {
      this.selectedEdges = [];
      this.selectedNodes = [];
      selectedGraph.edges.forEach(edgeId => {
        const selectedEdge = this.getEdge(this.network, edgeId);
        const sourceNode = this.getNode(this.network, selectedEdge.from);
        const destinationNode = this.getNode(this.network, selectedEdge.to);
        this.selectedEdges.push(selectedEdge);
        this.selectedNodes.push({
          source: sourceNode,
          destination: destinationNode
        });
      });
      this.edgeModal = true;
    },
    handleOverNode(event) {
      const nodeId = event.node;
      this.nodeMetric = this.getCentrality(this.network, nodeId, this.metrics);
    },
    applyConstraints() {
      const constraints = [];
      this.selectedEdges.forEach(edge => {
        constraints.push({
          from: this.getNode(this.network, edge.from).label,
          to: this.getNode(this.network, edge.to).label,
          exclude: this.getIds(this.transportConstraint)
        });
      });
      const form = {
        tg_period: this.selectedPeriod.id,
        tg_perc: this.percentage,
        listaMezzi: this.getIds(this.transport),
        product: this.product.id,
        flow: this.flow.id,
        weight_flag: this.weight.descr,
        pos: { nodes: this.nodes },
        selezioneMezziEdges: constraints
      };      
      this.$store.dispatch("graphVisjs/postGraph", form);
      this.closeModal();
      this.spinnerStart(true);
    },
    closeModal() {
      this.edgeModal = false;
    },
    updateSlider() {
      this.sliderValue = this.selectedPeriod.id;
    },
    handleSliderChange(val) {
      const form = {
        tg_period: val,
        tg_perc: this.percentage,
        listaMezzi: this.getIds(this.transport),
        product: this.product.id,
        flow: this.flow.id,
        weight_flag: this.weight.descr,
        pos: "None",
        selezioneMezziEdges: "None"
      };
      this.spinnerStart(true);
      this.$store.dispatch("graphVisjs/postGraph", form);
    },
    handleSubmit() {
      this.$v.$touch(); //validate form data

      if (
        !this.$v.percentage.$invalid &&
        !this.$v.transport.$invalid &&
        !this.$v.product.$invalid &&
        !this.$v.flow.$invalid &&
        !this.$v.weight.$invalid
      ) {
        this.spinnerStart(true);
        const form = {
          tg_period: this.selectedPeriod.id,
          tg_perc: this.percentage,
          listaMezzi: this.getIds(this.transport),
          product: this.product.id,
          flow: this.flow.id,
          weight_flag: this.weight.descr,
          pos: "None",
          selezioneMezziEdges: "None"
        };
        this.$store.dispatch("graphVisjs/postGraph", form);
      }
    },
    getIds(selectedTransports) {
      var ids = [];
      selectedTransports.forEach(element => {
        ids.push(element.id);
      });
      return ids;
    },
    getJson(){
      var nodes = [];
      var edges = [];              
      for(var edgeId in this.network.edges){
          edges.push({
            from: this.network.edges[edgeId].from, to: this.network.edges[edgeId].to 
          });
      }    
      for(var nodeId in this.network.nodes) {
          nodes.push({
              id: this.network.nodes[nodeId].id,
              label: this.network.nodes[nodeId].label,
              x: this.network.nodes[nodeId].x, 
              y: this.network.nodes[nodeId].y
          });
      }
      let data = JSON.stringify({ nodes, edges });
      return data;
    },
    getCanvas(){
      let canvas = document.querySelector("canvas");
      return canvas;
    },  
  },
  created() {
    this.$store.dispatch("coreui/setContext", Context.Graph);
    this.$store.dispatch("classification/getTransports");
    this.$store.dispatch("classification/getProducts");
  }
};
</script> 

<style scoped>
.network {
  text-align: center;
  height: 650px;
  margin: 0 0;
}
.card-label {
  color: #321fdb;
  font-size: 0.9em;
}
.list-group-item {
  padding: 0.5rem 1rem;
}
.vue-slider {
  margin: 2rem;
}

.circle-spin {
  position: absolute;
  top: 20%;
  left: 50%;
}
.align-right {
  text-align: right;
}
</style>

