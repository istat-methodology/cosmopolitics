<template>
  <div>
    <div class="row">
      <div class="col-9">
        <CTabs variant="tabs" :active-tab="0">
          <CTab :title="$t('graph.card.title')">
            <cosmo-graph
              :nodes="nodes"
              :edges="edges"
              :metrics="metrics"
              :spinner="spinner"
              :displayTransport="!isIntra"
              :transports="selectedTransports"
              @applyConstraints="handleApplyConstraints"
              @showinfo="showMainModal">
              <cosmo-slider
                :interval="timePeriod"
                :currentTime="selectedPeriod"
                @change="handlePeriodChange" />
            </cosmo-graph>
          </CTab>
          <CTab :title="$t('graph.table.title')">
            <CCard>
              <CCardHeader>
                <span class="float-right">
                  <exporter
                    filename="cosmopolitics_metrics"
                    :data="getData(csvFields, 'table')"
                    :options="['csv']"
                    :filter="graphFilter"
                    source="table"
                    :header="csvHeader">
                  </exporter>
                </span>
              </CCardHeader>
              <CCardBody>
                <cosmo-table
                  :data="metricsTable"
                  :fields="metricsFields"
                  :sorterValue="sorterValue" />
              </CCardBody>
            </CCard>
          </CTab>
        </CTabs>
      </div>
      <div class="col-3 padding-tab">
        <cosmo-form
          :graphPeriod="timePeriod"
          :currentTime="selectedPeriod"
          :currentRadio="selectedRadio"
          :transports="transports"
          :products="products"
          :flows="flows"
          :displayTransport="!isIntra"
          @updateFilter="handleUpdateFilter"
          @submit="handleSubmit"
          @updatePeriod="handlePeriodChange"
          @updateRadio="handleRadioChange"
          @showinfo="showInfoModal" />
      </div>
    </div>
    <cosmo-info-modal
      :isHelp="isHelpModal"
      :isMain="isMainModal"
      @showInfo="showInfoModal"
      @showMain="showMainModal"
      @closeModal="closeModal" />
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import {
  Context,
  Status,
  getScenarioNodes,
  metricsFieldsIt,
  metricsFieldsEn
} from "@/common"
import Slider from "@/components/Slider"
import GraphVis from "@/views/graph/GraphVis"
import GraphForm from "@/views/graph/GraphForm"
import GraphTable from "@/views/graph/GraphTable"
import GraphInfoModal from "@/views/graph/GraphInfoModal"
import exporter from "@/components/Exporter"

export default {
  name: "Graph",
  components: {
    "cosmo-slider": Slider,
    "cosmo-graph": GraphVis,
    "cosmo-form": GraphForm,
    "cosmo-table": GraphTable,
    "cosmo-info-modal": GraphInfoModal,
    exporter
  },
  props: {
    isIntra: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    //Default state
    selectedPeriod: { id: "202003", selectName: "Mar 20" },
    selectedRadio: "Monthly",
    selectedTransports: [],
    graphForm: null,
    graphFilter: null,
    //Metrics table
    metricsFieldsIt: [...metricsFieldsIt],
    metricsFieldsEn: [...metricsFieldsEn],
    sorterValue: { column: "vulnerability", asc: false },
    //Spinner
    spinner: false,
    //Modal
    isHelpModal: false,
    isMainModal: false
  }),
  computed: {
    ...mapGetters("metadata", ["graphPeriod", "graphTrimesterPeriod"]),
    ...mapGetters("coreui", ["isItalian"]),
    ...mapGetters("graph", ["nodes", "edges", "metrics", "metricsTable"]),
    ...mapGetters("classification", [
      "transports",
      "productsIntra",
      "productsExtra",
      "flows"
    ]),
    isTrimester() {
      return this.selectedRadio == "Monthly" ? false : true
    },
    timePeriod() {
      return this.isTrimester ? this.graphTrimesterPeriod : this.graphPeriod
    },
    products() {
      return this.isIntra ? this.productsIntra : this.productsExtra
    },
    metricsFields() {
      return this.isItalian ? this.metricsFieldsIt : this.metricsFieldsEn
    },
    csvFields() {
      return this.metricsTable.map((field) => {
        return {
          label: field.label,
          name: field.name,
          vulnerability: field.vulnerability,
          hubness: field.hubness,
          exportStrenght: field.exportStrenght
        }
      })
    },
    csvHeader() {
      return this.metricsFields.map((field) => field.label)
    }
  },
  methods: {
    handleUpdateFilter(filter) {
      this.graphFilter = filter
    },
    handleRadioChange(radioValue) {
      this.selectedRadio = radioValue
      this.selectedPeriod = this.isTrimester
        ? { id: "202001", selectName: "T1 2020" }
        : { id: "202003", selectName: "Mar 2020" }
    },
    handlePeriodChange(period) {
      this.selectedPeriod = period
      if (this.graphForm) {
        this.graphForm.tg_period = this.selectedPeriod.id
        this.graphForm.pos = { nodes: this.nodes }
        this.requestToServer()
      }
    },
    handleApplyConstraints(constraints) {
      //console.log(constraints);
      this.$store.dispatch("message/info", this.$t("graph.message.scenario"))
      if (this.graphForm) {
        this.graphForm.pos = { nodes: getScenarioNodes(this.nodes) }
        this.graphForm.selezioneMezziEdges = constraints
        this.requestToServer()
      }
    },
    handleSubmit(form) {
      //Save selected transports for scenario analysis
      this.selectedTransports = form.transports

      this.graphForm = {
        tg_period: this.selectedPeriod.id,
        tg_perc: form.percentage,
        listaMezzi: form.transportIds,
        product: form.product,
        flow: form.flow,
        weight_flag: true,
        pos: "None",
        selezioneMezziEdges: "None"
      }
      this.requestToServer()
    },
    requestToServer() {
      this.spinnerStart(true)
      this.$store
        .dispatch(
          this.isIntra ? "graph/postGraphIntra" : "graph/postGraphExtra",
          {
            form: this.graphForm,
            trimester: this.isTrimester
          }
        )
        .then((status) => {
          if (status == Status.wide) {
            this.$store.dispatch(
              "message/error",
              this.$t("graph.message.graph_wide")
            )
          } else if (status == Status.empty) {
            this.$store.dispatch(
              "message/error",
              this.$t("graph.message.graph_empty")
            )
          }
          this.spinnerStart(false)
        })
    },
    showMainModal() {
      this.isMainModal = true
      this.isHelpModal = true
    },
    showInfoModal() {
      this.isMainModal = false
      this.isHelpModal = true
    },
    closeModal() {
      this.isMainModal = false
      this.isHelpModal = false
    },
    spinnerStart(bool) {
      this.spinner = bool
    },
    getData(data, id) {
      if (data != null) {
        return [data, id]
      }
      return null
    }
  },
  created() {
    this.$store.dispatch(
      "coreui/setContext",
      this.isIntra ? Context.GraphIntra : Context.Graph
    )
    this.$store.dispatch("graph/clear")
  }
}
</script>

<style scoped>
.card-label {
  color: #321fdb;
  font-size: 0.9em;
}
.card-header {
  padding: 1rem 1.25rem 0.7rem 1.25rem;
}
.card-header span {
  font-size: 0.875rem;
  font-weight: 500;
}
.padding-tab {
  padding-top: 45px;
}
</style>
