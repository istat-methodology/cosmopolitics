<template>
  <div class="row">
    <div class="col-9">
      <CCard>
        <CCardHeader>
          <span> {{ $t("graph.card.title") }} Extra UE</span>
          <span v-if="graphDensity > 0">
            <span class="text-primary"> {{ $t("graph.stats.density") }} </span
            >{{ graphDensity }}</span
          >
          <span class="pl-2" v-if="nodeMetric">
            <!--span class="text-primary">, {{ $t("graph.stats.centrality") }} </span>{{ nodeMetric.centrality }} -->
            <span class="text-primary"
              >, {{ $t("graph.stats.exportationstrength") }} </span
            >{{ nodeMetric.exportationstrength }}
            <span class="text-primary"
              >, {{ $t("graph.stats.vulnerability") }}</span
            >
            {{ nodeMetric.vulnerability }}
            <span class="text-primary">, {{ $t("graph.stats.hubness") }} </span
            >{{ nodeMetric.hubness }}</span
          >

          <span class="float-right">
            <button
              class="btn mr-2 float-right btn-sm btn-square"
              title="Info"
              role="button"
              @click="helpOn(true, true)"
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

          <div v-show="error">
            {{ error }}
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
            v-on:after-drawing="spinnerSettings(false, 'after-drawing')"
            @select-edge="handleSelectEdge"
            @hover-node="handleOverNode"
          />
        </CCardBody>
        <vue-slider
          v-if="graphPeriod && !isTrimester"
          :adsorb="true"
          :tooltip="'none'"
          v-model="periodValue"
          :data="graphPeriod"
          :data-value="'id'"
          :data-label="'name'"
          @change="handleSliderChange"
        />
        <!--vue-slider
          v-if="graphTrimesterPeriod && isTrimester"
          :adsorb="true"
          :tooltip="'none'"
          v-model="trimesterPeriodValue"
          :data="graphTrimesterPeriod"
          :data-value="'id'"
          :data-label="'name'"
          @change="handleSliderChange"
        /-->
      </CCard>
    </div>
    <div class="col-3">
      <CCard>
        <CCardHeader>
          <span class="float-left">{{ $t("graph.form.title") }}</span>
          <span class="float-right">
            <button
              class="btn sm-2 btn-sm btn-square"
              role="button"
              @click="helpOn(true, false)"
            >
              i
            </button>
          </span>
        </CCardHeader>
        <CCardBody>
          <label class="card-label"
            >{{ $t("graph.form.fields.period") }}*</label
          >
          <!--div>
            <RadioButton
              name="options"
              dat="Montly"
              :label="$t('graph.form.fields.montly')"              
              :value="selectedRadioValue"
              @change="changeValue"
            />
            <RadioButton
              name="options"
              dat="Trimester"
              :label="$t('graph.form.fields.trimester')"
              :value="selectedRadioValue"
              @change="changeValue"
            />
          </div-->
          <v-select
            v-if="graphPeriod && !isTrimester"
            label="name"
            :options="graphPeriod"
            :placeholder="$t('graph.form.fields.period_placeholder')"
            v-model="selectedPeriod"
            :class="{
              'is-invalid': $v.selectedPeriod.$error
            }"
            @input="updateSlider"
          />
          <!--v-select
            v-if="graphTrimesterPeriod && isTrimester"
            label="name"
            :options="graphTrimesterPeriod"
            :placeholder="$t('graph.form.fields.period_placeholder')"
            v-model="selectedTrimesterPeriod"
            :class="{
              'is-invalid': $v.selectedPeriod.$error,
            }"
            @input="updateSlider"
          /-->
          <label class="card-label mt-2"
            >{{ $t("graph.form.fields.percentage") }}*</label
          >
          <CInput
            title="this.percentageFilter"
            :placeholder="$t('graph.form.fields.percentage_placeholder')"
            v-model="percentage"
            :class="{
              'is-invalid': $v.percentage.$error
            }"
          />
          <label class="card-label mt-2"
            >{{ $t("graph.form.fields.transport") }}*</label
          >
          <v-select
            label="descr"
            multiple
            :options="transports"
            :placeholder="$t('graph.form.fields.transport_placeholder')"
            v-model="transport"
            :class="{
              'is-invalid': $v.transport.$error
            }"
          />
          <label class="card-label mt-2"
            >{{ $t("graph.form.fields.product") }}*</label
          >
          <v-select
            label="descr"
            :options="productsExtra"
            :placeholder="$t('graph.form.fields.product_placeholder')"
            v-model="product"
            :class="{
              'is-invalid': $v.product.$error
            }"
          />
          <label class="card-label mt-2"
            >{{ $t("graph.form.fields.flow") }}*</label
          >
          <v-select
            label="descr"
            :options="flows"
            :placeholder="$t('graph.form.fields.flow_placeholder')"
            v-model="flow"
            :class="{
              'is-invalid': $v.flow.$error
            }"
          />
          <label class="card-label mt-2"
            >{{ $t("graph.form.fields.weight") }}*</label
          >
          <v-select
            label="descr"
            :options="weights"
            :placeholder="$t('graph.form.fields.weight_placeholder')"
            v-model="weight"
            :class="{
              'is-invalid': $v.weight.$error
            }"
          />
          <p class="card-label mt-3">*{{ $t("common.mandatory") }}</p>
          <CButton
            color="primary"
            shape="square"
            size="sm"
            @click="handleSubmit"
            class="mt-2"
            >{{ $t("common.submit") }}</CButton
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
      :title="
        isMainModal
          ? $t('graph.modal.main.title')
          : $t('graph.modal.filter.title')
      "
      :show.sync="isModalHelp"
      size="lg"
    >
      <p
        v-html="
          isMainModal
            ? $t('graph.modal.main.subtitle') +
              $t('graph.modal.main.body') +
              $t('graph.modal.metrics.subtitle') +
              $t('graph.modal.metrics.body') +
              $t('graph.modal.metrics.keywords')
            : $t('graph.modal.filter.body') + $t('graph.modal.filter.keywords')
        "
      ></p>

      <template #footer>
        <CButton
          color="outline-primary"
          square
          size="sm"
          @click="isModalHelp = false"
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
import { Context, Status } from "@/common";
import visMixin from "@/components/mixins/vis.mixin";
import sliderMixin from "@/components/mixins/slider.mixin";
import spinnerMixin from "@/components/mixins/spinner.mixin";
import exporter from "@/components/Exporter";
//import RadioButton from "@/components/RadioButton";

export default {
  name: "GraphExtraUe",
  //components: { Network, VueSlider, exporter, RadioButton },
  components: { Network, VueSlider, exporter },
  mixins: [visMixin, sliderMixin, spinnerMixin],
  data: () => ({
    //selectbox
    selectedPeriod: { id: "202003", name: "Mar 20" },
    //selectedTrimesterPeriod: { id: "20201", name: "1Q 20" },
    //Slider
    periodValue: "202003",
    //trimesterPeriodValue: "20201",
    //Form fields
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
      heightPx: 1086
    },
    working: false,
    url: "",
    base64: "",
    error: "",
    dataUrl: "",

    modalTitle: " About on ",
    modalBody: " About on ",

    isTrimester: false,
    isModalHelp: false,
    isMainModal: false,
    isFilterModal: false,

    paragraph: [],
    main: [],
    filter: []
  }),
  computed: {
    //...mapGetters("metadata", ["graphPeriod", "graphTrimesterPeriod"]),
    ...mapGetters("metadata", ["graphPeriod"]),
    ...mapGetters("graphExtra", ["nodes", "edges", "metrics", "status"]),
    ...mapGetters("classification", [
      "transports",
      "productsExtra",
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
    percentage: {
      required,
      numeric
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
    changeValue(newValue) {
      this.selectedRadioValue = newValue;
      this.isTrimester = this.selectedRadioValue == "Montly" ? false : true;
    },
    helpOn(showModal, mainModal) {
      this.isMainModal = mainModal;
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
      //console.log(this.edgeFromTo);

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
        weight_flag: this.weight.descr,
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
    closeModal() {
      this.edgeModal = false;
    },
    updateSlider() {
      this.periodValue = this.selectedPeriod.id;
    },
    // ---------------------------------------
    // @TODO Change the name of the form keys
    // ---------------------------------------
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
      this.requestToServer(form);
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
        // ---------------------------------------
        // @TODO Change the name of the form keys
        // ---------------------------------------
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
        this.requestToServer(form);
        this.transportConstraintSelected = {};
      }
    },
    requestToServer(form) {
      this.spinnerStart(true);
      this.$store.dispatch("graphExtra/postGraphExtra", form).then(() => {
        if (this.status == Status.success) {
          //this.$store.dispatch("message/success", "data matched!");
          this.spinnerStart(false);
        } else {
          if (this.status == Status.wide) {
            this.$store.dispatch(
              "message/error",
              "Warning N.05: Graph is too wide  \n Decrease the treshold or change means of transport"
            );
          }
          if (this.status == Status.empty) {
            this.$store.dispatch(
              "message/error",
              "Warning N.06 Graph empty \n Increase the treshold or change means of transport"
            );
          }
          this.spinnerStart(false);
        }
      });
    },
    getIds(selectedTransports) {
      var ids = [];
      selectedTransports.forEach(element => {
        ids.push(element.id);
      });
      return ids;
    },

    getData(id, ref) {
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
      console.log(this.$refs[ref]);
      return [jsonData, id];
    }
  },
  created() {
    this.$store.dispatch("coreui/setContext", Context.Graph);
    this.$store.dispatch("graphExtra/clear");
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
.card-header {
  padding: 1rem 1.25rem 0.7rem 1.25rem;
}
.card-header span {
  font-size: 0.875rem;
  font-weight: 500;
}
</style>
