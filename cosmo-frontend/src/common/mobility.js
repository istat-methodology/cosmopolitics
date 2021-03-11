export const timeStep = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9"];
export const nowCast = ["T10", "T11", "T12"];
export const chartType = ["tend", "pred_tp", "pred_tp_c", "covid"];
export const forecastType = ["tend", "nowcast"];

export function getCoordinates(dataArray) {
  const dataMap = [];
  dataArray.forEach((element, index) => {
    dataMap.push({
      x: index,
      y: element
    });
  });
  return dataMap;
}
export function buildCharts(dataR) {
  var timeLapse = [];
  timeStep.forEach(step => {
    const rawData = dataR[step];
    var chartDataArray = [];
    chartType.forEach(type => {
      if (type == "covid") {
        chartDataArray.push({
          dataName: type,
          data: [
            { x: 122, y: 3000 },
            { x: 122, y: -4000 }
          ]
        });
      } else {
        chartDataArray.push({
          dataName: type,
          data: getCoordinates(rawData[type])
        });
      }
    });
    timeLapse.push({
      time: step,
      charts: chartDataArray
    });
  });
  if (dataR["Forecast"]) {
    var forecastRaw = dataR["Forecast"];
    var forecastDataArray = [];
    forecastType.forEach(type => {
      forecastDataArray.push({
        dataName: type,
        data: getCoordinates(forecastRaw[type])
      });
    });
    timeLapse.push({
      time: "Forecast",
      charts: forecastDataArray
    });
  }

  var rawCharts = timeLapse.find(element => {
    return element.time == "T9";
  });
  var chartDataArray = rawCharts ? rawCharts.charts : [];
  var index = chartDataArray[0].data.length;
  //Nowcasting
  nowCast.forEach(step => {
    timeLapse.push({
      time: step,
      charts: pushForecastData(chartDataArray, forecastDataArray, index)
    });
    index++;
  });

  return timeLapse;
}

export function getBecChart(timeLapse, timeStep) {
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
}

export function pushForecastData(chartDataArray, forecastDataArray, index) {
  console.log(index);
  chartDataArray[2].data.push(forecastDataArray[0].data[index]);
  return chartDataArray;
}
