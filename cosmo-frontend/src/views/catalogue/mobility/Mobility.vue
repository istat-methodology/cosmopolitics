<template>
  <div class="row">
    <div class="col-9">
      <CCard>
        <CCardHeader>
          <span>Mobility analytics: </span>
          <b
            >{{ this.countrySelected.name }} <span>{{ this.report }} </span></b
          >
        </CCardHeader>
        <CCardBody>
          <circle-spin v-if="!this.tableData" class="circle-spin"></circle-spin>
          <CDataTable :items="tableData" :fields="mobilityTableFileds" hover />
        </CCardBody>
      </CCard>
      <CCard>
        <CCardBody>
          <circle-spin v-if="!this.chartData" class="circle-spin"></circle-spin>
          <line-chart
            v-if="chartData"
            :chartData="chartData"
            :options="optionsMobility"
          />
        </CCardBody>
      </CCard>
    </div>
    <div class="col-3">
      <CCard>
        <CCardHeader>
          Mobility filter
        </CCardHeader>
        <CCardBody>
          <label for="country" class="card-label">Country:</label>
          <v-select
            id="country"
            label="name"
            :options="countries"
            placeholder="Country"
            v-model="countrySelected"
          />
          <label for="mobility-types" class="card-label mt-3"
            >Mobility type:</label
          >
          <v-select
            id="mobility-types"
            label="descr"
            :options="mobilityTypes"
            placeholder="Mobility type"
            v-model="mobilitySelected"
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
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { Context } from "@/common";
import mobilityMixin from "@/components/mixins/mobility.mixin";
import mobilityDiagMixin from "@/components/mixins/mobilityDiag.mixin";
import LineChart from "@/components/charts/LineChart";
import spinnerMixin from "@/components/mixins/spinner.mixin";

export default {
  name: "Mobility",
  components: {
    LineChart
  },
  mixins: [mobilityMixin, mobilityDiagMixin, spinnerMixin],
  data: () => ({
    report: "",
    countrySelected: {
      country: "IT",
      name: "Italy"
    },
    mobilitySelected: {
      id: 1,
      name: "Retail",
      descr: "Retail"
    },
    chartData: null,
    tableData: null
  }),
  computed: {
    ...mapGetters("classification", ["countries"]),
    ...mapGetters("mobility", ["mobilities", "mobilityCharts"]),
    ...mapGetters("policyIndicator", ["policyIndicators"])
  },
  methods: {
    handleSubmit() {
      this.chartData = null;
      this.tableData = null;
      if (this.countrySelected) {
        if (this.mobilitySelected.id != 7) {
          this.getMobility();
        } else {
          this.getPolicyIndicator();
        }
      }
    }
  },
  created() {
    this.$store.dispatch("coreui/setContext", Context.Mobility);
    this.$store.dispatch("classification/getCountries");
    this.handleSubmit();
  }
};
</script>
<style>
.circle-spin {
  position: absolute;
  top: 20%;
  left: 50%;
}
.align-right {
  text-align: right;
}
</style>
