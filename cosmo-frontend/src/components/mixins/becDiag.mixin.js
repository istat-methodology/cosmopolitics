export default {
  data: () => ({
    optionsNorm:{
      responsive: true,
      maintainAspectRatio: false,
      legend:{
          display:false
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
          xAxes: [{
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
        yAxes: [{       
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
       ],       
     }
   },
   optionsRes:{
      responsive: true,
      maintainAspectRatio: false,
      legend:{
          display:false
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
          xAxes: [{
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
        yAxes: [{       
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
       ],       
     }
   },
   optionsACF:{
      responsive: true,
      maintainAspectRatio: false,
      legend:{
          display:false
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
          xAxes: [{
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
        yAxes: [{       
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
       ],       
     }
   }
    
  })
};
