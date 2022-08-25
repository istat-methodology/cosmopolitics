import * as d3 from "d3"
export default {
  data: () => ({
    diagNormMag: ""
  }),
  methods: {
    buildTimeseriesCharts(data, dataType, statusMain, statusNorm, statusACF) {
      if (statusMain != "00") {
        this.mean = this.getTimeseriesMean(data["diagMain"])
        this.std = this.getTimeseriesSTD(data["diagMain"])
        this.chartDataDiagMain = this.getTimeseriesChart(
          data["diagMain"],
          dataType,
          this.mean
        )
      } else {
        this.chartDataDiagMain = null
        this.mean = null
        this.std = null
      }
      this.diagNormTitle = "NQQ-Norm Plot"
      if (statusNorm != "00") {
        this.chartDataDiagNorm = this.getDiagNormChart(data["diagNorm"])
      } else {
        this.chartDataDiagNorm = null
      }
      this.diagACFTitle = "AUTOCORRELATION"
      if (statusACF != "00") {
        this.chartDataDiagACF = this.getDiagACFChart(data["diagACF"])
      } else {
        this.chartDataDiagACF = null
      }
    },

    getTimeseriesChart(data, dataType, mean) {
      var chartData = {}
      chartData.datasets = []
      if (data) {
        var dateLabels = this.getDate(data["date"])
        this.labels = dateLabels
        chartData.labels = dateLabels
        chartData.datasets.push({
          label: dataType,
          fill: false,
          backgroundColor: function (context) {
            var index = context.dataIndex
            var value = context.dataset.data[index]
            if (value) {
              if (value.x > 0) {
                return "rgba(255,128,0,0.6)"
              } else {
                return "rgba(46, 184, 92, 0.2)"
              }
            }
          },
          borderColor: "rgba(46, 184, 92,1)",
          data: data["series"],
          showLine: true,
          lineTension: 0,
          pointRadius: 2,
          borderDash: [0, 0]
        })
        //Mean line
        chartData.datasets.push({
          label: "Mean",
          fill: false,
          borderColor: "rgba(249, 177, 21,0.4)",
          data: Array(data["series"].length).fill(mean),
          showLine: true,
          lineTension: 0.1,
          pointRadius: 0,
          borderDash: [0, 0]
        })
      }

      return chartData
    },
    getTimeseriesMean(data) {
      var m = null
      if (this.isArrayNull(data["series"]) == false) {
        let tmp = 0
        tmp = d3.mean(data["series"])
        if (d3.mean(data["series"]) != undefined) {
          m = tmp.toFixed(2)
        }
      }
      return m
    },
    getTimeseriesSTD(data) {
      var v = null
      if (this.isArrayNull(data["series"]) == false) {
        let tmp = 0
        tmp = d3.deviation(data["series"])
        if (tmp != undefined) {
          v = tmp.toFixed(2)
        }
      }
      return v
    },
    isArrayNull(arr) {
      return arr.every((element) => element === null)
    },
    getDate(data) {
      var arr = []
      data.forEach((element) => {
        var dt = new Date(element)
        var longYear = dt.toLocaleDateString("en", {
          year: "numeric"
        })
        var shortMonth = dt.toLocaleString("en-US", {
          month: "short"
        })
        arr.push(shortMonth + "-" + longYear)
      })
      return arr
    },
    getDiagNormChart(diag) {
      var chartData = {}
      chartData.datasets = []
      if (diag) {
        var mag = this.getMagnitude(diag["pnt_y"])
        this.diagNormMag = this.getMagnitudeLabel(mag)
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
        })
        mag = this.getMagnitude(diag["lne_y"])
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
        })
      }
      return chartData
    },
    emptyChart() {
      var chartData = {}
      chartData.labels = ""
      chartData.datasets = [
        {
          label: "",
          backgroundColor: "",
          borderColor: "",
          data: []
        }
      ]
      chartData.options = {
        legend: {
          display: false
        }
      }
      return chartData
    },
    getDiagACFChart(diag) {
      var chartData = {}
      var maxDsh = ""
      var n = 0
      chartData.datasets = []
      chartData.labels = diag["lne_x"]
      if (diag) {
        for (var chartType in diag) {
          switch (chartType) {
            case "dsh_y_pos":
              maxDsh = diag[chartType].length - 1
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
              })
              break
            case "dsh_y_neg":
              maxDsh = diag[chartType].length - 1
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
              })
              break
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
                })
              })
          }
        }
      }
      return chartData
    },
    getCoordinates(dataArray, mag) {
      const dataMap = []
      dataArray.forEach((element, index) => {
        dataMap.push({
          x: index,
          y: Math.round((element / mag) * 100) / 100
        })
      })
      return dataMap
    },
    getCoordinatesNorm(n, m, mag) {
      const dataMap = []
      n.forEach((num1, index) => {
        const num2 = m[index]
        const obj = {
          x: num1,
          y: Math.round((num2 / mag) * 100) / 100
        }
        dataMap.push(obj)
      })
      return dataMap
    },
    getMagnitude(data) {
      var max = Math.max(...data.map((a) => Math.abs(a)))
      var order = Math.floor(Math.log(max) / Math.LN10 + 0.000000001) // because float math sucks like that
      return Math.pow(10, order)
    },
    getMagnitudeLabel(mag) {
      if (mag >= Math.pow(10, 9)) return "bilions"
      else if (mag >= Math.pow(10, 6)) return "milions"
      else return "thousands"
    }
  }
}
