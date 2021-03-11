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
          <CDataTable :items="tableData" :fields="tableFileds" hover />
        </CCardBody>
      </CCard>
      <CCard>
        <CCardBody>
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
            label="name"
            :options="countries"
            placeholder="Country"
            v-model="countrySelected"
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
      <CCard>
        <CCardHeader>
          Chart filter
        </CCardHeader>
        <CCardBody>
          <label for="country" class="card-label">Mobility type:</label>
          <v-select
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

export default {
  name: "Mobility",
  components: {
    LineChart
  },
  mixins: [mobilityMixin, chartMixin],
  data: () => ({
    //Form fields
    report: "",
    countrySelected: { name: "Italy" },
    mobilitySelected: {
      id: 1,
      name: "Retail",
      descr: "Retail"
    },
    chartData: null,
    //Table fields product
    tableFileds: [
      { key: "row", label: "" },
      { key: "Retail", label: "Retail" },
      { key: "Grocery_Pharmacy", label: "Grocery Pharmacy" },
      { key: "Parks", label: "Parks" },
      { key: "Transit_Station", label: "Transit Station" },
      { key: "Workplaces", label: "Workplaces" },
      { key: "Residential", label: "Residential" }
    ],
    tableData: []
  }),
  computed: {
    ...mapGetters("classification", ["countries", "timeNext", "mobilityTypes"]),
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
          this.report = "";
          this.$store
            .dispatch("mobility/findByName", {
              region: this.countrySelected.name,
              subregion: this.countrySelected.name
            })
            .then(() => {
              this.tableData = this.mobilities;
            });
          this.$store
            .dispatch("mobility/chartsByName", {
              region: this.countrySelected.name,
              subregion: this.countrySelected.name
            })
            .then(() => {
              this.chartData = this.getChart(
                this.mobilityCharts,
                this.mobilitySelected
              );
            });
        } else {
          this.report = " - PCAResult";
          this.$store
            .dispatch("policyIndicator/findByName", {
              region: this.countrySelected.name,
              subregion: this.countrySelected.name
            })
            .then(() => {
              this.tableData = this.getPIData(
                this.policyIndicators,
                this.mobilitySelected
              );
            });

          this.$store
            .dispatch("policyIndicator/chartsByName", {
              region: this.countrySelected.name,
              subregion: this.countrySelected.name
            })

            .then(() => {
              this.chartData = this.getPIChart(
                this.policyIndicatorCharts,
                this.mobilitySelected
              );
            });
        }
        this.countryName = this.countrySelected.name;
      }
    },
    handleSelectChart() {
      if (this.mobilitySelected) {
        if (this.mobilitySelected.id == 7) {
          this.chartData = this.getPIChart(
            this.policyIndicatorCharts,
            this.mobilitySelected
          );
        } else {
          this.chartData = this.getChart(
            this.mobilityCharts,
            this.mobilitySelected
          );
        }
      }
    },
    getChart(mobilityCharts, chartType) {
      var chartData = {};
      chartData.datasets = [];
      chartData.labels = mobilityCharts[chartType.name].Date;
      chartData.datasets.push({
        type: "bar",
        label: chartType.descr,
        fill: false,
        backgroundColor: "#06188a",
        borderColor: "#06188a",
        data: mobilityCharts[chartType.name].Values,
        showLine: false,
        pointRadius: 3
      });
      chartData.datasets.push({
        type: "line",
        label: chartType.descr + " smooth",
        fill: false,
        backgroundColor: "red", //color.background,
        borderColor: "red", //color.border,
        data: mobilityCharts[chartType.name].Smooth,
        showLine: true,
        pointRadius: 3
      });
      return chartData;
    },
    getPIData(policyIndicators) {
      var tableData = [];
      var keys = policyIndicators.row;
      for (var product in policyIndicators) {
        var rowObject = {};
        if (product != "row" && product != "_row") {
          rowObject["row"] = product;
          policyIndicators[product].forEach(function(item, index) {
            rowObject[keys[index]] = item;
          });
          tableData.push(rowObject);
        }
      }
      return tableData;
    },
    getPIChart(policyIndicatorCharts, chartType) {
      var chartData = {};
      chartData.datasets = [];
      chartData.labels = policyIndicatorCharts.Date;
      chartData.datasets.push({
        type: "bar",
        label: chartType.descr,
        fill: false,
        backgroundColor: "#06188a",
        borderColor: "#06188a",
        data: policyIndicatorCharts.PolInd,
        showLine: false,
        pointRadius: 3
      });
      chartData.datasets.push({
        type: "line",
        label: chartType.descr + " smooth",
        fill: false,
        backgroundColor: "red", //color.background,
        borderColor: "red", //color.border,
        data: policyIndicatorCharts.smooth,
        showLine: true,
        pointRadius: 3
      });
      return chartData;
    }
  },
  created() {
    this.$store.dispatch("coreui/setContext", Context.Mobility);
    this.$store.dispatch("classification/getCountries");
    this.$store
      .dispatch("mobility/findByName", {
        region: "Italy",
        subregion: "Italy"
      })
      .then(() => {
        this.tableData = this.mobilities;
      });
    this.$store
      .dispatch("mobility/chartsByName", {
        region: "Italy",
        subregion: "Italy"
      })
      .then(() => {
        this.chartData = this.getChart(
          this.mobilityCharts,
          this.mobilitySelected
        );
      });
  }
};
</script>
