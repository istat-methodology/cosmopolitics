export default {
  data: () => ({
    mobilityTableFileds: [
      { key: "row", label: "" },
      { key: "Retail", label: "Retail", _classes: "align-right" },
      {
        key: "Grocery_Pharmacy",
        label: "Grocery Pharmacy",
        _classes: "align-right"
      },
      { key: "Parks", label: "Parks", _classes: "align-right" },
      {
        key: "Transit_Station",
        label: "Transit Station",
        _classes: "align-right"
      },
      { key: "Workplaces", label: "Workplaces", _classes: "align-right" },
      { key: "Residential", label: "Residential", _classes: "align-right" }
    ],
    mobilityTypes: [
      { id: 1, name: "Retail", descr: "Retail" },
      { id: 2, name: "Grocery_Pharmacy", descr: "Grocery Pharmacy" },
      { id: 3, name: "Parks", descr: "Parks" },
      { id: 4, name: "Transit_Station", descr: "Transit Station" },
      { id: 5, name: "Workplaces", descr: "Workplaces" },
      { id: 6, name: "Residential", descr: "Residential" },
      { id: 7, name: "Policy Indicator", descr: "Policy Indicator" }
    ]
  }),
  methods: {
    getMobility() {
      this.report = "";
      this.$store.dispatch("mobility/reset");
      this.$store
        .dispatch("mobility/findByName", {
          region: this.countrySelected.name,
          subregion: this.countrySelected.name
        })
        .then(() => {
          if (this.mobilities) {
            this.tableData = this.mobilities;
          }
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
    getPolicyIndicator() {
      this.report = " - PCAResult";
      this.$store.dispatch("policyIndicator/reset");
      this.$store
        .dispatch("policyIndicator/findByName", {
          region: this.countrySelected.name,
          subregion: this.countrySelected.name
        })
        .then(() => {
          if (this.policyIndicators) {
            this.tableData = this.getPolicyIndicatorTable(
              this.policyIndicators.PCAresult,
              this.mobilitySelected
            );
            this.chartData = this.getPolicyIndicatorChart(
              this.policyIndicators.DPM_Index,
              this.mobilitySelected
            );
          }
        });
    },
    getPolicyIndicatorTable(policyIndicators) {
      var tableData = [];
      if (policyIndicators) {
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
      }
      return tableData;
    },
    buildObject(
      type,
      label,
      fill,
      backgroundColor,
      borderColor,
      data,
      showLine,
      lineTension,
      pointRadius,
      borderDash
    ) {
      var chartObj = {};
      chartObj = {
        type: type,
        label: label,
        fill: fill,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        data: data,
        showLine: showLine,
        lineTension: lineTension,
        pointRadius: pointRadius,
        borderDash: [borderDash, borderDash]
      };
      return chartObj;
    },
    getMobilityChart(mobilityCharts, chartType) {
      var chartData = {};
      var dataXY = [];
      var chartObj = {};
      if (mobilityCharts != null) {
        chartData.datasets = [];
        chartData.labels = [];
        chartData.labels = mobilityCharts[chartType.name].Date;
        dataXY = mobilityCharts[chartType.name].Values;
        chartObj = this.buildObject(
          "bar",
          chartType.descr,
          false,
          "#06188a",
          "#06188a",
          dataXY,
          false,
          0,
          3,
          0
        );
        chartData.datasets.push(chartObj);
        dataXY = mobilityCharts[chartType.name].Smooth;
        chartObj = this.buildObject(
          "line",
          chartType.descr + " smooth",
          false,
          "red",
          "red",
          dataXY,
          true,
          0,
          3,
          0
        );
        chartData.datasets.push(chartObj);
      }
      return chartData;
    },
    getPolicyIndicatorChart(policyIndicatorCharts, chartType) {
      var chartData = {};
      var dataXY = [];
      var chartObj = {};
      if (policyIndicatorCharts != null) {
        chartData.datasets = [];
        chartData.labels = [];
        chartData.labels = policyIndicatorCharts.Date;
        dataXY = policyIndicatorCharts.PolInd;
        chartObj = this.buildObject(
          "bar",
          chartType.descr + " smooth",
          false,
          "#06188a",
          "#06188a",
          dataXY,
          false,
          0,
          3,
          0
        );
        chartData.datasets.push(chartObj);
        dataXY = policyIndicatorCharts.smooth;
        chartObj = this.buildObject(
          "line",
          chartType.descr + " smooth",
          false,
          "red",
          "red",
          dataXY,
          true,
          0,
          3,
          0
        );
        chartData.datasets.push(chartObj);
      }
      return chartData;
    }
  }
};
