export default {
  methods: {
    getMobility() {
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
    getPolicyIndicator() {
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
    buildObject(type, label, fill, backgroundColor, borderColor, data, showLine, lineTension, pointRadius, borderDash){
      var chartObj = {}
      chartObj = {
          type: type,
          label: label,
          fill: fill,
          backgroundColor: backgroundColor,
          borderColor:borderColor,
          data: data,
          showLine: showLine,
          lineTension:lineTension,
          pointRadius: pointRadius,
          borderDash: [borderDash,borderDash]
      };
      return chartObj;
    },
    getMobilityChart(mobilityCharts, chartType) {
      var chartData = {};
      var dataXY=[];      
      var chartObj= {};
      chartData.datasets = [];
      chartData.labels = mobilityCharts[chartType.name].Date;
      dataXY = mobilityCharts[chartType.name].Values;
      chartObj = this.buildObject("bar", chartType.descr + " smooth", false,"#06188a","#06188a", dataXY,false,0,3,0);
      chartData.datasets.push(chartObj);
      dataXY = mobilityCharts[chartType.name].Smooth;
      chartObj = this.buildObject("line", chartType.descr + " smooth", false,"red","red", dataXY,true,0,3,0);
      chartData.datasets.push(chartObj);
      return chartData;
    },
    getPolicyIndicatorChart(policyIndicatorCharts, chartType) {
      var chartData = {};
      var dataXY  = [];      
      var chartObj = {};
      chartData.datasets = [];
      chartData.labels = policyIndicatorCharts.Date;
      dataXY = policyIndicatorCharts.PolInd;
      chartObj = this.buildObject("bar", chartType.descr + " smooth", false,"#06188a","#06188a", dataXY,false,0,3,0);
      chartData.datasets.push(chartObj);      
      dataXY = policyIndicatorCharts.smooth;
      chartObj = this.buildObject("line", chartType.descr + " smooth", false,"red","red", dataXY,true,0,3,0);
      chartData.datasets.push(chartObj);
      return chartData;
    }
  }
};
