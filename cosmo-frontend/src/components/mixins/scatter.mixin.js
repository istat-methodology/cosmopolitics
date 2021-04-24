export default {  
  data: () => ({
    options: {
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
              min: 60,             
              stepSize: 12,                                 
              callback: function(value, index) {                                                
                  var year = 2015 + index;
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
    }
   
  })

};
