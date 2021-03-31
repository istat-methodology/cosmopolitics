export default {
  data: () => ({
    timeStep: [],
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
      var t=0;
      for (var name in dataR) {
        if (name != "Covid_Estimation" && name != "Forecast" && name != "Model") {
          this.timeStep.push({ id: "202003", time: "T" & t , val:t});
          t++;
          this.timeLapse.push(dataR[name]);
        }
      }
      
      /*
      this.timeStep.forEach(step => {
        const rawData = dataR[step];
        var chartDataArray = [];
        this.chartType.forEach(type => {
          if (type == "covid") {
            chartDataArray.push({
              dataName: type,
              data: [
                { x: 122, y: 100 },
                { x: 122, y: -100 }
              ]
            });
          } else {
            chartDataArray.push({
              dataName: type,
              data: this.getCoordinates(rawData[type])
            });
          }
        });
        this.timeLapse.push({
          time: step,
          charts: chartDataArray
        });
      });
      if (dataR["Forecast"]) {
        var forecastRaw = dataR["Forecast"];
        var forecastDataArray = [];
        this.forecastType.forEach(type => {
          forecastDataArray.push({
            dataName: type,
            data: this.getCoordinates(forecastRaw[type])
          });
        });
        this.timeLapse.push({
          time: "Forecast",
          charts: forecastDataArray
        });
      }
      var rawCharts = this.timeLapse.find(element => {
        return element.time == "T9";
      });
      
      var chartDataArray = rawCharts ? rawCharts.charts : [];
      var index = chartDataArray[0].data.length;
      
      //Nowcasting
      if (dataR["Forecast"]) {
        this.nowCast.forEach(step => {
          this.timeLapse.push({
            time: step,
            charts: this.pushForecastData(
              chartDataArray,
              forecastDataArray,
              index
            )
          });
          index++;
        });
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
      
      
      /*
      var chartData = {};
      chartData.datasets = [];      
      var rawCharts = timeLapse.find(element => {
        return element.time == timeStep;
      });
      if (rawCharts) {
        rawCharts.charts.forEach(chart => {
          var chartObj = {};
          switch (chart.dataName) {
            case "tend":
              chartObj = {
                label: "Yearly variation series",
                fill: false,
                backgroundColor: "rgba(46, 184, 92, 0.2)",
                borderColor: "rgba(46, 184, 92, 1)",
                data: chart.data,
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
                data: chart.data,
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
                data: chart.data,
                showLine: true,
                lineTension: 0,
                pointRadius: 0,
                borderDash: [5, 5]
              };
              break;
            case "covid":
              chartObj = {
                label: "Covid Start",
                fill: false,
                backgroundColor: "blue", //color.background,
                borderColor: "blue", // color.border,
                data: chart.data,
                showLine: true,
                lineTension: 0,
                pointRadius: 0,
                borderDash: [5, 5]
              };
              break;
            default:
              chartObj = {
                label: chart.dataName,
                fill: false,
                backgroundColor: "red", //color.background,
                borderColor: "red", // color.border,
                data: chart.data,
                showLine: true,
                lineTension: 0,
                pointRadius: 0
              };
          }
          chartData.datasets.push(chartObj);
        });
      }
      return chartData;
      */
    },
    pushForecastData(chartDataArray, forecastDataArray, index) {
      console.log(index);
      if (forecastDataArray) {
        chartDataArray[2].data.push(forecastDataArray[0].data[index]);
      }
      return chartDataArray;
    } 
  }
};