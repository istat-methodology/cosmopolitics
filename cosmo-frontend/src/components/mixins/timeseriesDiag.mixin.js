export default {
  data: () => ({
    optionsNorm: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      title: {
        display: true,
        text: "QQ-Norm Plot",
        fontColor: "#404040",
        fontSize: 16,
        fontWeight: "bold",
        verticalAlign: "top",
        horizontalAlign: "center",
        padding: 0,
        fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif"
      },
      scales: {
        xAxes: [
          {
            scaleLabel: {
              display: true,
              fontSize: 16,
              fontWeight: "bold",
              fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif",
              labelString: "THEORETICAL QUANTILES"
            },
            ticks: {
              stepSize: 1
            }
          }
        ],
        yAxes: [
          {
            scaleLabel: {
              display: true,
              fontSize: 16,
              fontWeight: "bold",
              fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif",
              labelString: "SAMPLE QUANTILIES"
            },
            ticks: {
              stepSize: 1
            }
          }
        ]
      }
    },
    optionsRes: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      title: {
        display: true,
        text: "REGRESSION RESIDUALS",
        fontColor: "#404040",
        fontSize: 16,
        fontWeight: "bold",
        verticalAlign: "top",
        horizontalAlign: "center",
        padding: 0,
        fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif"
      },
      scales: {
        xAxes: [
          {
            scaleLabel: {
              display: true,
              fontSize: 16,
              fontWeight: "bold",
              fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif",
              labelString: "OBSERVATIONS"
            },
            ticks: {
              stepSize: 5
            }
          }
        ],
        yAxes: [
          {
            scaleLabel: {
              display: true,
              fontSize: 16,
              fontWeight: "bold",
              fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif",
              labelString: "RESIDUALS"
            },
            ticks: {
              stepSize: 1
            }
          }
        ]
      }
    },
    optionsACF: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      title: {
        display: true,
        text: "AUTOCORRELATION",
        fontColor: "#404040",
        fontSize: 16,
        fontWeight: "bold",
        verticalAlign: "top",
        horizontalAlign: "center",
        padding: 0,
        fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif"
      },
      scales: {
        xAxes: [
          {
            scaleLabel: {
              display: true,
              fontSize: 16,
              fontWeight: "bold",
              fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif",
              labelString: "Lag"
            },
            ticks: {
              stepSize: 0.1
            }
          }
        ],
        yAxes: [
          {
            scaleLabel: {
              display: true,
              fontSize: 16,
              fontWeight: "bold",
              fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif",
              labelString: "ACF"
            },
            ticks: {
              stepSize: 0.1
            }
          }
        ]
      }
    },
    //min 0 = first month on series
    startSeries: {
      min: 0,
      year: 2018
    }
  }),
  methods: {
    getOptions(startMin, startYear, isLegend) {
      return {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: isLegend
        },
        tooltips: {
          //mode: "index",
          intersect: true
        },
        hover: {
          mode: "nearest",
          intersect: true
        },
        scales: {
          yAxes: [
            {
              display: true,
              gridLines: {
                display: true
              },
              scaleLabel: {
                display: true,
                labelString: ""
              },
              ticks: {
                beginAtZero: true
              }
            }
          ],
          xAxes: [
            {
              display: true,
              gridLines: {
                display: true
              },
              scaleLabel: {
                display: true,
                labelString: ""
              },
              ticks: {
                stepSize: 4
              }
            }
          ]
        }
      };
    }
  }
};
