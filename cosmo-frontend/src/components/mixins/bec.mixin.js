export default {
  data: () => ({   
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ]
  }),
  methods: {    
    getBecSlider() {
      var period = [];
      this.policyPeriod.forEach(element => {
        period.push(element);
      });
      return period;
    },
    getBecSliderVal(value) {
      var obj = this.policyPeriod.find(element => {
        return element.id == value;
      });
      return obj ? obj.val : null;
    },
    getCoordinates(dataArray) {
      const dataMap = [];
      dataArray.forEach((element, index) => {
        dataMap.push({
          x: index,
          y: element
        });
      });
      return dataMap;    
    },
    buildBecCharts(dataR) {  
      
      this.timeLapse = [];
      this.covidEstimationDataTable = [];
      this.modelDataTable = [];      
      var covidEstimation = [];
      var model = [];
      var diagRes = [];

      for (var name in dataR) {
        switch (name) {
          case "Covid_Estimation":
            covidEstimation.push(dataR[name]);
            break;
          case "Model":
            model.push(dataR[name]);
            break;
          case "DIAG_RES":
              diagRes.push(dataR[name]);
              break;    
          default:            
            this.timeLapse.push(dataR[name]);        
        }
      }
      //
      this.maxTimeStep = this.timeLapse.length-1;   
      //
      this.covidEstimationDataTable = this.getBecTable(covidEstimation[0]);
      //
      this.modelDataTable =  this.getBecTable(model[0]);      
    },
    buildBecSlider() {       
      this.policyPeriod = [];    
      var indexStart = 0;
      var indexEnd = 0;           
      var v = 0;      
      indexStart = this.timeLapse[0].date.length - 1;
      indexEnd = this.timeLapse[this.maxTimeStep].date.length - 1;
      this.policyPeriodValue = this.timeLapse[this.maxTimeStep].date[indexStart];
      for (var i = indexStart; i<= indexEnd; i++){        
        var tmp = this.timeLapse[this.maxTimeStep].date[i];
        var year = tmp.substr(2,2);        
        var iMonth = parseInt(tmp.substr(5, 2)) - 1;
        var month = this.months[iMonth];
        month = month.substr(0, 3);   
        var labelSlider = month + "-" + year;
        this.policyPeriod.push({"id": this.timeLapse[this.maxTimeStep].date[i],  "name" : labelSlider, "val": v });                
        v++;
      }      
      this.maxBec = Math.max.apply(null, this.timeLapse[this.maxTimeStep].tend);
      this.minBec = Math.min.apply(null, this.timeLapse[this.maxTimeStep].tend);
    },    
    getBecChart(time) {
      var chartData = {};
      chartData.datasets = [];  
      if (this.timeLapse) {
        for (var chartType  in this.timeLapse[time]) {          
          var chartObj = {};
          switch (chartType) {
            case "date":
              chartData.labels = this.timeLapse[time][chartType];
              break;
            case "tend":
              chartObj = {
                label: "Yearly variation series",
                fill: false,
                backgroundColor: "rgba(46, 184, 92, 0.2)",
                borderColor: "rgba(46, 184, 92, 1)",
                data: this.getCoordinates(this.timeLapse[time][chartType]),
                showLine: false,
                pointRadius: 12
              };
              break;
            case "pred_tp":
              chartObj = {
                label: "Model estimation",
                fill: false,
                backgroundColor: "red", //color.background,
                borderColor: "red", // color.border,
                data: this.getCoordinates(this.timeLapse[time][chartType]),
                showLine: true,
                lineTension: 0,
                pointRadius: 0
              };
              break;
            case "pred_tp_c":
              chartObj = {
                label: "Counterfactual",
                fill: false,
                backgroundColor: "red", //color.background,
                borderColor: "red", // color.border,
                data: this.getCoordinates(this.timeLapse[time][chartType]),
                showLine: true,
                lineTension: 0,
                pointRadius: 0,
                borderDash: [5, 5]
              };
              break;
            default:
              chartObj = {
                label: chartType,
                fill: false,
                backgroundColor: "red", //color.background,
                borderColor: "red", // color.border,
                data: this.getCoordinates(this.timeLapse[time][chartType]),
                showLine: true,
                lineTension: 0,
                pointRadius: 0
              };
          }
          if (chartType!="date"){
            chartData.datasets.push(chartObj);
          }
        }
        chartObj = {
          label: "Covid Start",
          fill: false,
          backgroundColor: "blue", //color.background,
          borderColor: "blue", // color.border,
          data: [
            { x: 122, y: this.maxBec },
            { x: 122, y: this.minBec }],
          showLine: true,
          lineTension: 0,
          pointRadius: 0,
          borderDash: [5, 5]
        };
        chartData.datasets.push(chartObj);

      }
      return chartData;   
    },
    _getBecTable(objects) {
      var tableData = [];
      var keys = objects.row;
      for (var dat in objects) {
        var rowObject = {};
        if (dat != "row" && dat != "_row") {
          rowObject["row"] = dat;
          objects[dat].forEach(function(item, index) {
            rowObject[keys[index]] = item;
          });
          tableData.push(rowObject);
        }
      }
      console.log(tableData);
      return tableData;
    },
    getBecTable(objects) {
      var tableData = [];
      var keys = objects.row;
      keys.forEach(function(item, index) {
        var rowObject = {};
        for (var dat in objects) {
          if (dat != "_row") {
            rowObject[dat] = dat;
            rowObject[dat] = objects[dat][index];
          }           
        }
        tableData.push(rowObject);
    });
    console.log(tableData);
    return tableData;
    }
  }
};