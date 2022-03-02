export default {
  data: () => ({
    diagNormMag: ""
  }),
  methods: {
    buildTimeseriesCharts(dataR) {
      this.chartDataDiagMain = this.getTimeseriesChart(dataR["diagMain"]);

      this.diagNormTitle = "DiagNorm";
      if (dataR.statusNorm != "00") {
        this.chartDataDiagNorm = this.getDiagNormChart(dataR["diagNorm"]);
      }

      this.diagACFTitle = "DiagACF";
      if (dataR.statusACF != "00") {
        this.chartDataDiagACF = this.getDiagACFChart(dataR["diagACF"]);
      }
    },
    getTimeseriesChart(data) {
      var chartData = {};
      chartData.datasets = [];
      if (data) {
        this.labels = data["date"];
        chartData.labels = data["date"];
        var mag = this.getMagnitude(data["series"]);
        chartData.datasets.push({
          label:
            "Yearly variation series (in " + this.getMagnitudeLabel(mag) + ")",
          fill: false,
          backgroundColor: function(context) {
            var index = context.dataIndex;
            var value = context.dataset.data[index];
            if (value) {
              if (value.x > 0) {
                return "rgba(255,128,0,0.6)";
              } else {
                return "rgba(46, 184, 92, 0.2)";
              }
            }
          },
          borderColor: "rgba(46, 184, 92,1)",
          data: this.getCoordinates(data["series"], mag),
          showLine: true,
          lineTension: 0,
          pointRadius: 2,
          borderDash: [0, 0]
        });
      }
      return chartData;
    },
    getDiagNormChart(diag) {
      var chartData = {};
      chartData.datasets = [];
      if (diag) {
        var mag = this.getMagnitude(diag["pnt_y"]);
        this.diagNormMag = this.getMagnitudeLabel(mag);
        chartData.datasets.push({
          label: "(pnt_x, pnt_y)",
          fill: false,
          backgroundColor: "rgba(46, 184, 92, 0.2)",
          borderColor: "rgba(46, 184, 92, 1)",
          data: this.getCoordinatesNorm(diag["pnt_x"], diag["pnt_y"], mag),
          showLine: false,
          lineTension: 0,
          pointRadius: 12,
          borderDash: [0, 0]
        });
        mag = this.getMagnitude(diag["lne_y"]);
        chartData.datasets.push({
          label: "(line_x, line_y)",
          fill: false,
          backgroundColor: "red",
          borderColor: "red",
          data: this.getCoordinatesNorm(diag["lne_x"], diag["lne_y"], mag),
          showLine: true,
          lineTension: 0,
          pointRadius: 2,
          borderDash: [0, 0]
        });
      }
      return chartData;
    },
    getDiagACFChart(diag) {
      var chartData = {};
      var maxDsh = "";
      var n = 0;
      chartData.datasets = [];
      chartData.labels = diag["lne_x"];
      if (diag) {
        for (var chartType in diag) {
          switch (chartType) {
            case "dsh_y_pos":
              maxDsh = diag[chartType].length - 1;
              chartData.datasets.push({
                label: "pos",
                fill: false,
                backgroundColor: "red",
                borderColor: "red",
                data: [
                  {
                    x: 0,
                    y: diag[chartType][0]
                  },
                  {
                    x: maxDsh,
                    y: diag[chartType][maxDsh]
                  }
                ],
                showLine: true,
                lineTension: 0,
                pointRadius: 0,
                borderDash: [5, 5]
              });
              break;
            case "dsh_y_neg":
              maxDsh = diag[chartType].length - 1;
              chartData.datasets.push({
                label: "pos",
                fill: false,
                backgroundColor: "red",
                borderColor: "red",
                data: [
                  {
                    x: 0,
                    y: diag[chartType][0]
                  },
                  {
                    x: maxDsh,
                    y: diag[chartType][maxDsh]
                  }
                ],
                showLine: true,
                lineTension: 0,
                pointRadius: 0,
                borderDash: [5, 5]
              });
              break;
            case "lne_y":
              diag[chartType].forEach((element, index) => {
                chartData.datasets.push({
                  label: n++,
                  fill: false,
                  backgroundColor: "blue",
                  borderColor: "blue",
                  data: [
                    {
                      x: index,
                      y: 0
                    },
                    {
                      x: index,
                      y: element
                    }
                  ],
                  showLine: true,
                  lineTension: 0,
                  pointRadius: 1,
                  borderDash: [0, 0]
                });
              });
          }
        }
      }
      return chartData;
    },
    getCoordinates(dataArray, mag) {
      const dataMap = [];
      dataArray.forEach((element, index) => {
        dataMap.push({
          x: index,
          y: Math.round((element / mag) * 100) / 100
        });
      });
      return dataMap;
    },
    getCoordinatesNorm(n, m, mag) {
      const dataMap = [];
      n.forEach((num1, index) => {
        const num2 = m[index];
        const obj = {
          x: num1,
          y: Math.round((num2 / mag) * 100) / 100
        };
        dataMap.push(obj);
      });
      return dataMap;
    },
    getMagnitude(data) {
      var max = Math.max(...data.map(a => Math.abs(a)));
      var order = Math.floor(Math.log(max) / Math.LN10 + 0.000000001); // because float math sucks like that
      return Math.pow(10, order);
    },
    getMagnitudeLabel(mag) {
      if (mag >= Math.pow(10, 9)) return "bilions";
      else if (mag >= Math.pow(10, 6)) return "milions";
      else return "thousands";
    }
  }
};
