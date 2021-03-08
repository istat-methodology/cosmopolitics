export default {
  data: () => ({
    options: {
      scales: {
        /*yAxes: [
            {
              ticks: {
                beginAtZero: true
              },
              gridLines: {
                display: true
              }
            }
          ],
          */
        xAxes: [
          {
            ticks: {
              beginAtZero: true
            },
            gridLines: {
              display: false
            },
            type: "linear",
            position: "bottom"
          }
        ]
      },
      legend: {
        display: true
      },
      responsive: true,
      maintainAspectRatio: false
    }
  })
};
