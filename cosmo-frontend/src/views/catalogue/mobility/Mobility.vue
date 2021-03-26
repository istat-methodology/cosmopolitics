<template>
  <div class="row">
    <div class="col-9">
      <CCard>
        <CCardHeader>
          <b
            >{{ this.countrySelected.name }} <span>{{ this.report }} </span></b
          >
        </CCardHeader>
        <CCardBody>
          <circle-spin
            v-bind:loading="isLoading"
            class="circle-spin"
          ></circle-spin>
          <CDataTable :items="tableData" :fields="mobilityTableFileds" hover />
        </CCardBody>
      </CCard>
      <CCard>
        <CCardBody>
          <circle-spin
            v-bind:loading="this.isLoading"
            class="circle-spin"
          ></circle-spin>
          <line-chart :chartData="chartData" :options="options" />
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
          <label for="mobility-types" class="card-label">Mobility type:</label>
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
import LineChart from "@/components/charts/LineChart";
import chartMixin from "@/components/mixins/chart.mixin";
import spinnerMixin from "@/components/mixins/spinner.mixin";

export default {
  name: "Mobility",
  components: {
    LineChart
  },
  mixins: [mobilityMixin, chartMixin, spinnerMixin],
  data: () => ({
    report: "",
    countrySelected: { name: "Italy" },
    mobilitySelected: {
      id: 1,
      name: "Retail",
      descr: "Retail"
    },
    chartData: null,
    tableData: null
  }),
  computed: {
    ...mapGetters("coreui", ["isLoading"]),
    ...mapGetters("classification", ["countries"]),
    ...mapGetters("mobility", ["mobilities", "mobilityCharts"]),
    ...mapGetters("policyIndicator", [
      "policyIndicators",
      "policyIndicatorCharts"
    ])
  },
  methods: {
    handleSubmit() {
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
    this.getMobility();
  }
};
</script>
<style scoped>
.circle-spin {
  position: absolute;
  top: 20%;
  left: 50%;
}</style>