export default {
  data: () => ({
    optionsMobility: {
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
              labelString: ""
            }
          }
        ],
        yAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
              labelString: ""
            }
          }
        ]
      }
    }
  })
};
