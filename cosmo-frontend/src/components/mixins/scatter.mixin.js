export default {
   data: () => ({    
    startSeries: {
      min:60,
      year:2015
    } 
  }), 
  methods:{
    getOptions (startMin, startYear){
      return  {
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
      }
    }
  }
};
