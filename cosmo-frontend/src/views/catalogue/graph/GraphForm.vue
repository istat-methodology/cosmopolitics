<template>
  <div class="row">
    <div class="col-9">
      <CCard>
        <CCardHeader>
          <span v-if="graphDensity > 0">
            <span class="text-primary">Graph density: </span
            >{{ graphDensity }}</span
          >
          <span v-else><b>Graph metrics</b></span>
          <span class="pl-2" v-if="nodeMetric">
            <span class="text-primary">, node centrality: </span
            >{{ nodeMetric.centrality }}
            <span class="text-primary">, vulnerability: </span
            >{{ nodeMetric.vulnerability }}
            <span class="text-primary">, hubness:</span>{{ nodeMetric.hubness }}
          </span>

          <span class="float-right">
            <span class="float-right">
              <button
                class="btn mr-2 float-right btn-sm btn-square"
                title="Info"
                role="button"
                @click="helpOn(true, 'main')"
              >
                i
              </button>
            </span>
            <span class="float-right">
              <exporter
                filename="cosmopolitics_graph_analysis"
                :data="getData()"
                :options="['jpeg', 'png', 'pdf', 'json']"
              >
              </exporter>
            </span>
          </span>

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
            v-on:after-drawing="spinnerSettings(false, 'after-drawing')"
            @select-edge="handleSelectEdge"
            @hover-node="handleOverNode"
          />
          <vue-slider
            v-if="timePeriod"
            :adsorb="true"
            :tooltip="'none'"
            v-model="periodValue"
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
          <div class="row">
            <div class="col-10">
              <span class="float-left"
                ><b><h6>Graph filter</h6></b></span
              >
            </div>
            <div class="col-2">
              <span class="float-right">
                <button
                  class="btn sm-2 btn-sm btn-square"
                  title="Info"
                  role="button"
                  @click="helpOn(true,'filter')"
                >
                  i
                </button>
              </span>
            </div>
          </div>
        </CCardHeader>
        <CCardBody>
          <label class="card-label" :title="this.periodFilter">Period:</label>
          <v-select
            v-if="timePeriod"
            label="name"
            :options="timePeriod"
            placeholder="Select period"
            v-model="selectedPeriod"
            :class="{
              'is-invalid': $v.selectedPeriod.$error,
            }"
            @input="updateSlider"
          />
          <label class="card-label mt-2" :title="this.percentageFilter"
            >Percentage:</label
          >
          <CInput
            title="this.percentageFilter"
            placeholder="Set percentage"
            v-model="percentage"
            :class="{
              'is-invalid': $v.percentage.$error,
            }"
          />
          <label class="card-label mt-2" :title="this.transportFilter"
            >Transport:</label
          >
          <v-select
            label="descr"
            multiple
            :options="transports"
            placeholder="Select transport"
            v-model="transport"
            :class="{
              'is-invalid': $v.transport.$error,
            }"
          />
          <label class="card-label mt-2" :title="this.productFilter"
            >Product:</label
          >
          <v-select
            label="descr"
            :options="products"
            placeholder="Select a product"
            v-model="product"
            :class="{
              'is-invalid': $v.product.$error,
            }"
          />
          <label class="card-label mt-2" :title="this.flowFilter">Flows:</label>
          <v-select
            label="descr"
            :options="flows"
            placeholder="Select a flow"
            v-model="flow"
            :class="{
              'is-invalid': $v.flow.$error,
            }"
          />
          <label class="card-label mt-2" :title="this.weightFilter"
            >Weights:</label
          >
          <v-select
            label="descr"
            :options="weights"
            placeholder="Weights"
            v-model="weight"
            :class="{
              'is-invalid': $v.weight.$error,
            }"
          />
          <CButton
            color="primary"
            shape="square"
            size="sm"
            @click="handleSubmit"
            class="mt-2"
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

    <CModal
      title="International Trade Relations"
      :show.sync="isModalHelp"
      size="lg"
    >
      <p>
        {{ paragraph[0] }}
      </p>
      <p class="mt-2">
        {{ paragraph[1] }}
      </p>
      <template #footer>
        <CButton color="outline-primary" square size="sm" @click="helpOn(false, null)"
          >Close</CButton
        >
      </template>
    </CModal>
  </div>
</template>

<script>
import { Network } from "vue-visjs";
import { mapGetters } from "vuex";
import { required, numeric } from "vuelidate/lib/validators";
import VueSlider from "vue-slider-component";
import { Context } from "@/common";
import { Help } from "@/common";
import visMixin from "@/components/mixins/vis.mixin";
import sliderMixin from "@/components/mixins/slider.mixin";
import spinnerMixin from "@/components/mixins/spinner.mixin";
import exporter from "@/components/Exporter";

export default {
  name: "GraphVisjs",
  components: { Network, VueSlider, exporter },
  mixins: [visMixin, sliderMixin, spinnerMixin],
  data: () => ({
    blank: "",
    //Form fields

    //selectbox
    selectedPeriod: { id: "202003", name: "Mar 20" },
    //Slider
    periodValue: "202003",

    percentage: 90,
    transport: null,
    product: null,
    flow: null,
    weight: null,
    //Graph modal
    edgeModal: false,
    selectedEdges: [],
    selectedNodes: [],
    transportConstraint: [],
    transportConstraintStart: [],
    transportConstraintSelected: {},
    edgeFromTo: null,
    //Metrics
    nodeMetric: null,
    //Spinner
    networkEvents: "",
    spinner: false,
    scale: 1,
    dark: false,
    size: {
      widthScreenCm: 56.82,
      widthPaperCm: 17.99,
      widthPx: 2159,
      heightScreenCm: 28.58,
      heightPaperCm: 9.05,
      heightPx: 1086,
    },
    working: false,
    url: "",
    base64: "",
    error: "",
    dataUrl: "",
    modalHelpTitle: " About on ",
    isModalHelp: false,

    // help on filter as title
    periodFilter: "digit Period",
    percentageFilter: "digit Percetage",
    transportFilter: "digit Transport",
    productFilter: "digit Product",
    flowFilter: "digit flow",
    weightFilter: "digit weights",    
    
    paragraph: [],
    main:[],
    filter:[]
    
  }),
  computed: {
    ...mapGetters("graphVisjs", ["nodes", "edges", "metrics"]),
    ...mapGetters("classification", [
      "transports",
      "products",
      "flows",
      "weights",
    ]),
    ...mapGetters("period", ["timePeriod"]),
    network() {
      return this.nodes && this.edges
        ? {
            nodes: this.nodes,
            edges: this.edges,
            options: this.options,
          }
        : {
            nodes: [],
            edges: [],
            options: null,
          };
    },
    graphDensity() {
      return this.metrics ? this.metrics.density.toPrecision(4) : 0;
    },
  },
  validations: {
    selectedPeriod: {
      required,
    },
    percentage: {
      required,
      numeric,
    },
    transport: {
      required,
    },
    product: {
      required,
    },
    flow: {
      required,
    },
    weight: {
      required,
    },
  },
  methods: {
    helpOn(showModal, type) {
      if (type=='main'){
        this.paragraph[0]=this.main[0];
        this.paragraph[1]=this.main[1];
      }
      else if (type=='filter'){
        this.paragraph[0]=this.filter[0];
        this.paragraph[1]=this.filter[1];

      }
      this.isModalHelp = showModal;      
    },
    spinnerStart(bool) {
      this.spinner = bool;
    },
    spinnerSettings(bool, eventName) {
      //this.networkEvents += `${eventName}, `;
      console.log(eventName);
      this.spinner = bool;
    },
    handleSelectEdge(selectedGraph) {
      this.transportConstraint = [];
      console.log(selectedGraph);
      this.selectedEdges = [];
      this.selectedNodes = [];
      selectedGraph.edges.forEach((edgeId) => {
        
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
          destination: destinationNode,
        });
      });
      console.log(this.edgeFromTo);
      
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
      this.selectedEdges.forEach((edge) => {
        this.setTransportConstraintStart();
        constraints.push({
          from: this.getNode(this.network, edge.from).label,
          to: this.getNode(this.network, edge.to).label,
          exclude: this.getIds(this.transportConstraint),
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
        selezioneMezziEdges: constraints,
      };
      this.$store.dispatch("graphVisjs/postGraph", form);
      this.closeModal();
      this.spinnerStart(true);
    },

    setTransportConstraintStart() {
      let transport = this.transportConstraintStart.filter(
        (o) => !this.transportConstraint.find((o2) => o.id === o2.id)
      );
      this.transportConstraintSelected[this.edgeFromTo] = transport;
    },
    closeModal() {
      this.edgeModal = false;
    },
    updateSlider() {
      this.periodValue = this.selectedPeriod.id;
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
        selezioneMezziEdges: "None",
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
          selezioneMezziEdges: "None",
        };
        this.$store.dispatch("graphVisjs/postGraph", form);
        this.transportConstraintSelected = {};
      }
    },
    getIds(selectedTransports) {
      var ids = [];
      selectedTransports.forEach((element) => {
        ids.push(element.id);
      });
      return ids;
    },

    getData() {
      var nodes = [];
      var edges = [];
      for (var edgeId in this.network.edges) {
        edges.push({
          from: this.network.edges[edgeId].from,
          to: this.network.edges[edgeId].to,
        });
      }
      for (var nodeId in this.network.nodes) {
        nodes.push({
          id: this.network.nodes[nodeId].id,
          label: this.network.nodes[nodeId].label,
          x: this.network.nodes[nodeId].x,
          y: this.network.nodes[nodeId].y,
        });
      }
      let jsonData = JSON.stringify({ nodes, edges });
      let canvas = document.querySelector("canvas");

      var arr = [];
      arr[0] = jsonData;
      arr[1] = canvas;

      return arr;
    },
  },
  created() {
    
    this.main[0] = Help.Graph.Main[0];
    this.main[1] = Help.Graph.Main[1];
    this.filter[0] = Help.Graph.Filter[0];
    this.filter[1] = Help.Graph.Filter[1];
    

    this.$store.dispatch("period/findByName", "graph");
    this.$store.dispatch("coreui/setContext", Context.Graph);
    this.$store.dispatch("classification/getTransports");
    this.$store.dispatch("classification/getProducts");
  },
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

