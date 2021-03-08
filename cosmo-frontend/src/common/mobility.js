export const timeStep = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9"];
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
            { x: 122, y: 100 },
            { x: 122, y: -100 }
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
    forecastDataArray.push({
      dataName: "covid",
      data: [
        { x: 122, y: 100 },
        { x: 122, y: -100 }
      ]
    });
    timeLapse.push({
      time: "Forecast",
      charts: forecastDataArray
    });
  }
  return timeLapse;
}

export function getChart(mobilityCharts, chartType) {
  var chartData = {};
  chartData.datasets = [];
  chartData.labels = mobilityCharts[chartType].Date;
  chartData.datasets.push({
    type: "bar",
    label: "Grocery Pharmacy",
    fill: false,
    backgroundColor: "#06188a",
    borderColor: "#06188a",
    data: mobilityCharts[chartType].Values,
    showLine: false,
    pointRadius: 3
  });
  chartData.datasets.push({
    type: "line",
    label: "Grocery Pharmacy",
    fill: false,
    backgroundColor: "red", //color.background,
    borderColor: "red", //color.border,
    data: mobilityCharts[chartType].Smooth,
    showLine: true,
    pointRadius: 0
  });
  return chartData;
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
            label: chart.dataName,
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
            label: chart.dataName,
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
            label: chart.dataName,
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
            label: chart.dataName,
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
