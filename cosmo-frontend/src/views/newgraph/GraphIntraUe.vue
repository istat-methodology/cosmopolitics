<template>
  <div class="row">    
    <div class="col-9">
      
      <cosmo-graph
        :nodes="nodes"
        :edges="edges"
        :displayTransport="false"
        :metrics="metrics"
        :spinner="spinner"
        @showinfo="showMainModal"
      >
        <cosmo-slider
          :interval="timePeriod"
          :currentTime="selectedPeriod"
          @change="handlePeriodChange"
        />
      </cosmo-graph>
    </div>
    <div class="col-3">
      <cosmo-graph-form
        :graphPeriod="timePeriod"
        :currentTime="selectedPeriod"
        :products="productsIntra"
        :flows="flows"
        :displayRadio="true"
        :displayTransport="false"
        @submit="handleSubmit"
        @updatePeriod="handlePeriodChange"
        @updateRadio="handleRadioChange"
        @showinfo="showInfoModal"
      />
    </div>
    <CModal
      :title="
        isMainModal
          ? $t('graph.modal.main.title')
          : $t('graph.modal.filter.title')
      "
      :show.sync="isHelpModal"
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
          @click="isHelpModal = false"
          >Close</CButton
        >
      </template>
    </CModal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { Context, Status } from "@/common";
import Slider from "@/components/Slider";
import GraphVis from "@/views/newgraph/GraphVis";
import GraphForm from "@/views/newgraph/GraphForm";

export default {
  name: "GraphIntraUe",
  components: {
    "cosmo-slider": Slider,
    "cosmo-graph": GraphVis,
    "cosmo-graph-form": GraphForm
  },
  data: () => ({
    isTrimester: false,
    selectedPeriod: { id: "202003", selectName: "Mar 20" },
    //Spinner
    spinner: false,
    //Modal
    isHelpModal: false,
    isMainModal: false
  }),
  computed: {
    ...mapGetters("metadata", ["graphPeriod", "graphTrimesterPeriod"]),
    ...mapGetters("graphIntra", ["nodes", "edges", "metrics", "status"]),
    ...mapGetters("classification", ["productsIntra", "flows"]),
    timePeriod() {
      return this.isTrimester ? this.graphTrimesterPeriod : this.graphPeriod;
    }
  },
  methods: {
    handleRadioChange(newValue) {
      this.isTrimester = newValue == "Monthly" ? false : true;
      this.selectedPeriod = this.isTrimester
        ? { id: "202001", selectName: "1Q 20" }
        : { id: "202003", selectName: "Mar 20" };
    },
    showMainModal() {
      this.isMainModal = true;
      this.isHelpModal = true;
    },
    showInfoModal() {
      this.isMainModal = false;
      this.isHelpModal = true;
    },
    spinnerStart(bool) {
      this.spinner = bool;
    },
    handlePeriodChange(period) {
      this.selectedPeriod = period;
      if (this.graphForm) {
        this.graphForm.tg_period = this.selectedPeriod.id;
        this.requestToServer();
      }
    },
    handleSubmit(formFields) {
      this.graphForm = {
        tg_period: this.selectedPeriod.id,
        tg_perc: formFields.percentage,
        product: formFields.product,
        flow: formFields.flow,
        weight_flag: true,
        pos: "None",
        selezioneMezziEdges: "None"
      };
      this.requestToServer();
    },
    requestToServer() {
      this.spinnerStart(true);
      this.$store
        .dispatch("graphIntra/postGraphIntra", {
          form: this.graphForm,
          trimester: this.isTrimester
        })
        .then(() => {
          if (this.status == Status.wide) {
            this.$store.dispatch(
              "message/error",
              "Warning N.05: Graph is too wide  \n Decrease the treshold or change means of transport"
            );
          } else if (this.status == Status.empty) {
            this.$store.dispatch(
              "message/error",
              "Warning N.06 Graph empty \n Increase the treshold or change means of transport"
            );
          }
          this.spinnerStart(false);
        });
    }
  },
  created() {
    this.$store.dispatch("coreui/setContext", Context.GraphIntra);
    this.$store.dispatch("graphIntra/clear");
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
