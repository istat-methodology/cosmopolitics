export default {
  data: () => ({
    options: {
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: false,
        text: ""
      },
      tooltips: {
        mode: "index",
        intersect: true
      },
      hover: {
        mode: "nearest",
        intersect: true
      },
      scales: {
        xAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Time"
            }
          }
        ],
        yAxes: [
          {
            /*ticks: {
              min: -100,
              max: 100
            },
            */
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Value"
            }
          }
        ]
      }
    }
  })
};
