export default {
  data: () => ({
    timeStep: null,
    maxTimeStep:0
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
    buildCharts(dataR) {         
      for (var name in dataR) {
        if (name != "Covid_Estimation" && name != "Forecast" && name != "Model") {   
         this.timeLapse.push(dataR[name]);
        }
      }
      this.maxTimeStep = this.timeLapse.length;
      /*
      var indexStart = this.timeLapse[0].date.length - 2;
      var indexEnd = this.timeLapse[this.maxTimeStep].date.length - 1;
      
      var periodSlider = [];
      var v = 0;
      for (var i = indexStart; i<= indexEnd; i++){        
        periodSlider.push({"id": this.timeLapse[this.maxTimeStep].date[i], "val": v });
        v++;
      }
      */
      return this.timeLapse;

    },    
    getBecChart(timeLapse, time) {
      var chartData = {};
      chartData.datasets = [];  
      if (timeLapse) {
        for (var chartType  in timeLapse[time]) {          
          var chartObj = {};
          switch (chartType) {
            case "date":
              chartData.labels = timeLapse[time][chartType];
              break;
            case "tend":
              chartObj = {
                label: "Yearly variation series",
                fill: false,
                backgroundColor: "rgba(46, 184, 92, 0.2)",
                borderColor: "rgba(46, 184, 92, 1)",
                data: this.getCoordinates(timeLapse[time][chartType]),
                showLine: false,
                pointRadius: 12
              };
              break;
            case "pred_tp":
              chartObj = {
                label: "Model estimation",
                fill: false,
                backgroundColor: "red", //color.background,
                borderColor: "red", // color.border,
                data: this.getCoordinates(timeLapse[time][chartType]),
                showLine: true,
                lineTension: 0,
                pointRadius: 0
              };
              break;
            case "pred_tp_c":
              chartObj = {
                label: "Counterfactual",
                fill: false,
                backgroundColor: "red", //color.background,
                borderColor: "red", // color.border,
                data: this.getCoordinates(timeLapse[time][chartType]),
                showLine: true,
                lineTension: 0,
                pointRadius: 0,
                borderDash: [5, 5]
              };
              break;
            default:
              chartObj = {
                label: chartType,
                fill: false,
                backgroundColor: "red", //color.background,
                borderColor: "red", // color.border,
                data: this.getCoordinates(timeLapse[time][chartType]),
                showLine: true,
                lineTension: 0,
                pointRadius: 0
              };
          }
          if (chartType!="date"){
            chartData.datasets.push(chartObj);
          }
        }
        chartObj = {
          label: "Covid Start",
          fill: false,
          backgroundColor: "blue", //color.background,
          borderColor: "blue", // color.border,
          data: [
            { x: 122, y: 100 },
            { x: 122, y: -100 }],
          showLine: true,
          lineTension: 0,
          pointRadius: 0,
          borderDash: [5, 5]
        };
        chartData.datasets.push(chartObj);

      }
      return chartData;   
    }
  }
};