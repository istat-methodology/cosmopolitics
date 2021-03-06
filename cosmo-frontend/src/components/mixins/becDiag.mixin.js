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
    startSeries: {
      min: 60,
      year: 2015
    }
  }),
  methods: {
    getOptions(startMin, startYear) {
      return {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: true
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              },
              gridLines: {
                display: true
              }
            }
          ],
          xAxes: [
            {
              ticks: {
                min: startMin,
                stepSize: 12,
                callback: function(value, index) {
                  var year = startYear + index;
                  return year;
                }
              },
              gridLines: {
                display: true
              },
              type: "linear",
              position: "bottom"
            }
          ]
        }
      };
    }
  }
};
/*
  plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: 'xy'
        },
      zoom: {
        enabled: true,
        mode: 'xy',
      }
    }
  },
*/
