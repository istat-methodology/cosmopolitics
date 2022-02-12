export default {
  data: () => ({
    //treatX: 0,
    //minTreatY: 0,
    //maxTreatY: 0,
    timeLapse: null,
    //timePeriod: null,
    //timeNothing: -1,
    //maxTimeStep: 0,
    cast: {
      indexStart: 0
    }
  }),
  methods: {
    getCoordinates(dataArray) {
      const dataMap = [];
      dataArray.forEach((element, index) => {
        dataMap.push({
          x: index,
          y: element
        });
      });
      return dataMap;
    },
    /*
    getXY(arrX, arrY) {
      const dataMap = [];
      arrX.forEach((num1, index) => {
        const num2 = arrY[index];
        const obj = {
          x: num1,
          y: num2
        };
        dataMap.push(obj);
      });
      return dataMap;
    },
    */
    getCoordinatesACF(dataArray) {
      const dataMap = [];
      dataArray.forEach((element, index) => {
        dataMap.push({
          x: index,
          y: index
        }, {
          x: index,
          y: element
        });
      });
      return dataMap;
    },
    getCoordinatesNorm(n, m) {
      const dataMap = [];
      n.forEach((num1, index) => {
        const num2 = m[index];
        const obj = {
          x: num1,
          y: num2
        };
        dataMap.push(obj);
      });
      return dataMap;
    },
    buildTimeseriesCharts(dataR) {
      this.timeLapse = [];
      this.diagNormTitle = "DiagNorm";
      this.chartDataDiagNorm = this.getDiagNormChart(dataR["DIAG_NORM"]);
      this.diagACFTitle = "DiagACF";
      this.chartDataDiagACF = this.getDiagACFChart(dataR["DIAG_ACF"]);
      this.timeLapse.push(dataR["T1"]);
      this.maxTimeStep = this.timeLapse.length - 1;
    },
    buildObject(
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
    buildObjectWithContext(
      highlightIndex,
      label,
      fill,
      backgroundColor,
      highlightColor,
      borderColor,
      data,
      showLine,
      lineTension,
      pointRadius,
      borderDash
    ) {
      var chartObj = {};
      chartObj = {
        label: label,
        fill: fill,
        backgroundColor: function (context) {
          var index = context.dataIndex;
          var value = context.dataset.data[index];
          if (value) {
            console.log(highlightIndex);
            if (value.x > highlightIndex) {
              return highlightColor;
            } else {
              return backgroundColor;
            }
          }
        },
        borderColor: borderColor,
        data: data,
        showLine: showLine,
        lineTension: lineTension,
        pointRadius: pointRadius,
        borderDash: [borderDash, borderDash]
      };
      return chartObj;
    },
    getTimeseriesChart() {
      var chartData = {};
      var dataXY = [];
      var chartObj = {};
      chartData.datasets = [];
      if (this.timeLapse) {
        this.labels = this.timeLapse[0]["date"];
        chartData.labels = this.timeLapse[0]["date"];
        dataXY = this.getCoordinates(this.timeLapse[0]["tend"]);
        var highlightIndex = parseInt(this.cast.indexStart);
        chartObj = this.buildObjectWithContext(
          highlightIndex,
          "Yearly variation series",
          false,
          "rgba(46, 184, 92, 0.2)",
          "rgba(255,128,0,0.6)",
          "rgba(46, 184, 92,1)",
          dataXY,
          true,
          0,
          2,
          0
        );
        chartData.datasets.push(chartObj);
      }
      return chartData;
    },
    getDiagNormChart(diag) {
      var chartData = {};
      var dataXY = [];
      var chartObj = {};
      chartData.datasets = [];
      if (diag) {
        dataXY = this.getCoordinatesNorm(diag["pnt_x"], diag["pnt_y"]);
        chartObj = this.buildObject(
          "(pnt_x, pnt_y)",
          false,
          "rgba(46, 184, 92, 0.2)",
          "rgba(46, 184, 92, 1)",
          dataXY,
          false,
          0,
          12,
          0
        );
        chartData.datasets.push(chartObj);
        chartObj = {};
        dataXY = this.getCoordinatesNorm(diag["lne_x"], diag["lne_y"]);
        chartObj = this.buildObject(
          "(lne_x, lne_y)",
          false,
          "red",
          "red",
          dataXY,
          true,
          0,
          2,
          0
        );
        chartData.datasets.push(chartObj);
      }
      return chartData;
    },
    getDiagACFChart(diag) {
      var chartData = {};
      var maxDsh = "";
      var dataXY = [];
      var borderDash = 0;
      var n = 0;
      chartData.datasets = [];
      chartData.labels = diag["lne_x"];
      if (diag) {
        for (var chartType in diag) {
          var chartObj = {};
          switch (chartType) {
            case "dsh_y_pos":
              borderDash = 5;
              maxDsh = diag[chartType].length - 1;
              dataXY = [{
                  x: 0,
                  y: diag[chartType][0]
                },
                {
                  x: maxDsh,
                  y: diag[chartType][maxDsh]
                }
              ];
              chartObj = this.buildObject(
                "pos",
                false,
                "red",
                "red",
                dataXY,
                true,
                0,
                0,
                borderDash
              );
              chartData.datasets.push(chartObj);
              break;
            case "dsh_y_neg":
              (borderDash = 5), (maxDsh = diag[chartType].length - 1);
              dataXY = [{
                  x: 0,
                  y: diag[chartType][0]
                },
                {
                  x: maxDsh,
                  y: diag[chartType][maxDsh]
                }
              ];
              chartObj = this.buildObject(
                "pos",
                false,
                "red",
                "red",
                dataXY,
                true,
                0,
                0,
                borderDash
              );
              chartData.datasets.push(chartObj);
              break;
            case "lne_y":
              diag[chartType].forEach((element, index) => {
                dataXY = [{
                    x: index,
                    y: 0
                  },
                  {
                    x: index,
                    y: element
                  }
                ];
                chartObj = this.buildObject(
                  n++,
                  false,
                  "blue",
                  "blue",
                  dataXY,
                  true,
                  0,
                  1,
                  0
                );
                chartData.datasets.push(chartObj);
              });
          }
        }
      }
      return chartData;
    }
  }
};