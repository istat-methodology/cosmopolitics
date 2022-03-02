export default {
  data: () => ({
    timeLapse: null,
    diagNormMag:"",
    cast: {
      indexStart: 0
    }
  }),
  methods: {
    getCoordinates(dataArray,mag) {
      const dataMap = [];
      dataArray.forEach((element, index) => {
        dataMap.push({
          x: index,
          y: Math.round(element/mag * 100) / 100
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
          y: Math.round(num2/mag * 100) / 100
        };
        dataMap.push(obj);
      });
      return dataMap;
    },
    buildTimeseriesCharts(dataR) {
      this.timeLapse = [];
      this.diagNormTitle = "DiagNorm";
   
      if (dataR.statusNorm != "00"){
        this.chartDataDiagNorm = this.getDiagNormChart(dataR["diagNorm"]);
      }
    
      this.diagACFTitle = "DiagACF";
       
      if (dataR.statusACF != "00") {
        this.chartDataDiagACF = this.getDiagACFChart(dataR["diagACF"]);
      }
      
      this.chartDataDiagMain = this.getTimeseriesChart(dataR["diagMain"]);

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
        backgroundColor: function(context) {
          var index = context.dataIndex;
          var value = context.dataset.data[index];
          if (value) {
            //console.log(highlightIndex);
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
    getTimeseriesChart(Main) {
      var chartData = {};
      var dataXY = [];
      var chartObj = {};
      chartData.datasets = [];
      if (Main) {
        this.labels = Main["date"];
        chartData.labels = Main["date"];
        //dataXY = this.getCoordinates(this.timeLapse[0]["tend"]);
        var mag=this.getMagnitude(Main["series"]);
        dataXY = this.getCoordinates(Main["series"], mag);
        var highlightIndex = parseInt(this.cast.indexStart);
        chartObj = this.buildObjectWithContext(
          highlightIndex,
          "Yearly variation series (in "+this.getMagnitudeLabel(mag)+")",
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
        var mag=this.getMagnitude(diag["pnt_y"]);
        this.diagNormMag=this.getMagnitudeLabel(mag);
        dataXY = this.getCoordinatesNorm(diag["pnt_x"], diag["pnt_y"], mag);
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
        mag=this.getMagnitude(diag["lne_y"]);
        dataXY = this.getCoordinatesNorm(diag["lne_x"], diag["lne_y"],mag);
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
              dataXY = [
                {
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
              dataXY = [
                {
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
                dataXY = [
                  {
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
    },
   getMagnitude(data){
      var max= Math.max(...data.map(a => Math.abs(a)))
      var order = Math.floor(Math.log(max) / Math.LN10 + 0.000000001); // because float math sucks like that
      return Math.pow(10,order);
    },
    getMagnitudeLabel(mag){
      if(mag>= Math.pow(10,9)) return "bilions";
      else if(mag>= Math.pow(10,6)) return "milions";
        else   return "thousands";
    }
  }
};
