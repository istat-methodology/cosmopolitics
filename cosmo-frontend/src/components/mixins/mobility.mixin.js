export default {
  data: () => ({
    options: {
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: false,
        text: ""
      },
      tooltips: {
        mode: "index",
        intersect: true
      },
      hover: {
        mode: "nearest",
        intersect: true
      },
      scales: {
        xAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Time"
            }
          }
        ],
        yAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Value"
            }
          }
        ]
      }
    },
    mobilityTableFileds: [
      { key: "row", label: "" },
      { key: "Retail", label: "Retail" },
      { key: "Grocery_Pharmacy", label: "Grocery Pharmacy" },
      { key: "Parks", label: "Parks" },
      { key: "Transit_Station", label: "Transit Station" },
      { key: "Workplaces", label: "Workplaces" },
      { key: "Residential", label: "Residential" }
    ],
    mobilityTypes: [
      { id: 1, name: "Retail", descr: "Retail" },
      { id: 2, name: "Grocery_Pharmacy", descr: "Grocery pharmacy" },
      { id: 3, name: "Parks", descr: "Parks" },
      { id: 4, name: "Transit_Station", descr: "Station" },
      { id: 5, name: "Workplaces", descr: "Workplaces" },
      { id: 6, name: "Residential", descr: "Residential" },
      { id: 7, name: "Policy Indicator", descr: "Policy Indicator" }
    ]
  }),
  methods: {    
    getMobility(){
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
          this.chartData = this.getMobilityChart(
            this.mobilityCharts,
            this.mobilitySelected
        );
      });
    },
    getMobilityChart(mobilityCharts, chartType) {
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
    getPolicyIndicator(){
      this.report = " - PCAResult";
      this.$store
        .dispatch("policyIndicator/findByName", {
          region: this.countrySelected.name,
          subregion: this.countrySelected.name
      })
      .then(() => {
        this.tableData = this.getPolicyIndicatorTable(
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
          this.chartData = this.getPolicyIndicatorChart(
            this.policyIndicatorCharts,
            this.mobilitySelected
          );
      });
    },
    getPolicyIndicatorTable(policyIndicators) {
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
    getPolicyIndicatorChart(policyIndicatorCharts, chartType) {
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
};
