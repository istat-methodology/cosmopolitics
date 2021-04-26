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
    ],

    treatX: 0,
    minTreatY: 0,
    maxTreatY: 0,

    timeLapse: null,
    timePeriod: null,
    
    maxTimeStep: 0,

    covidEstimationTableTitle: null,
    covidEstimationTableFileds: null,
    covidEstimationDataTable: null,
        
    modelTableTitle: null,
    modelTableFileds: null,
    modelDataTable: null,    
    
    cast:{
      isCast: false,
      indexCast: 0,
      indexStartCast: 0
    }  

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
    getXY(arrX, arrY) {      
      console.log("=>START");     
      const dataMap = [];
      arrX.forEach((num1, index) => {
        const num2 = arrY[index];
        const obj = {
          x: num1,
          y: num2        
        };        
        console.log(obj);
        dataMap.push(obj);
      });
      console.log("=>END");     
      return dataMap;
    },
    getCoordinatesACF(dataArray) {
      const dataMap = [];
      dataArray.forEach((element, index) => {
        dataMap.push({ x: index, y: index },{ x: index, y: element });
      });
      return dataMap;
    },    
    getCoordinatesNorm(n, m) {      
      console.log("=>START");     
      const dataMap = [];
      n.forEach((num1, index) => {
        const num2 = m[index];
        const obj = {
          x: num1,
          y: num2        
        };        
        console.log(obj);
        dataMap.push(obj);
      });
      console.log("=>END");     
      return dataMap;
    },

    buildBecCharts(dataR) {
      this.timeLapse = [];
      this.covidEstimationDataTable = [];
      this.modelDataTable = [];
      var covidEstimation = [];
      var model = [];
      var diagNorm = [];
      var diagACF = [];
      var diagRes = [];
      
      var indexT = 0;
      this.cast.isCast = false;              
      this.cast.indexCast = 0;

      for (var name in dataR) {
        switch (name) {
          case "Covid_Estimation":
          
            covidEstimation.push(dataR[name]);          
            this.covidEstimationTableTitle = "Covid Estimation";
            this.covidEstimationTableFileds = this.getHeaderTable(dataR[name]);
            break;
          
          case "Model":
            
            model.push(dataR[name]);            
            this.modelTableTitle = "Model";
            this.modelTableFileds =this.getHeaderTable(dataR[name]);            
            break;

          case "DIAG_NORM":
            diagNorm.push(dataR[name]);
            this.diagNormTitle = "DiagNorm";
            break;
          case "DIAG_ACF":
            diagACF.push(dataR[name]);
            this.diagACFTitle = "DiagACF";
            break;
          case "DIAG_RES":
            diagRes.push(dataR[name]);
            this.diagResTitle = "DiagRes";
            break;
          case "Treat_number":
            this.treatX = dataR[name];
            break;  
          default:
            
            if (name.substr(0,1) == "T") {             
              console.log("Nothing found");
            }
            if (name.substr(0,1) == "F") {
              console.log("Forcasting found: " + indexT );
              if (!this.cast.isCast){
                this.cast.isCast = true;              
                this.cast.indexCast = indexT;              
                this.cast.indexStartCast = dataR[name]["date"].length - 1;
              }
            }    
            if (name.substr(0,1) == "N") {
              console.log("Nowcasting found: " + indexT );
              if (!this.cast.isCast){
                this.cast.isCast = true;              
                this.cast.indexCast = indexT;
                this.cast.indexStartCast = dataR[name]["date"].length - 1;
              }              
            }
            this.timeLapse.push(dataR[name]);
            indexT = indexT + 1;
        }
      }

      console.log(this.timeLapse);      

      console.log(this.cast);
      //
      this.maxTimeStep = this.timeLapse.length - 1;
      //
      this.buildBecSlider();
      //
      this.covidEstimationDataTable = this.getTable(covidEstimation[0]);
      //
      this.modelDataTable = this.getTable(model[0]);      
      //
      this.chartDataDiagNorm = this.getDiagNormChart(diagNorm[0]);      
      this.chartDataDiagRes = this.getDiagResChart(diagRes[0]);
      this.chartDataDiagACF = this.getDiagACFChart(diagACF[0]);
      

    },
    buildBecSlider() {
      this.policyPeriod = [];
      this.headerTablePeriod = [];
      var indexStart = 0;
      var indexEnd = 0;
      var v = 0;      
      this.timePeriod = [];
      indexStart = this.timeLapse[0].date.length - 1;
      indexEnd = this.timeLapse[this.maxTimeStep].date.length - 1;
      this.policyPeriodValue = this.timeLapse[this.maxTimeStep].date[indexStart];
      for (var i = indexStart; i <= indexEnd; i++) {
        var tmp = this.timeLapse[this.maxTimeStep].date[i];
        var year = tmp.substr(2, 2);
        var iMonth = parseInt(tmp.substr(5, 2)) - 1;
        var month = this.months[iMonth];
        month = month.substr(0, 3);
        var label = month + "-" + year;
        
        this.policyPeriod.push({
          id: this.timeLapse[this.maxTimeStep].date[i],
          name: label,
          val: v          
        });
        
        this.timePeriod.push({ 
          key: "T" + (v + 1), 
          label: label 
        });
        v++;
      }

      console.log(this.policyPeriod);
      console.log(this.timePeriod);
      this.maxTreatY = Math.max.apply(null, this.timeLapse[this.maxTimeStep].tend);
      this.minTreatY = Math.min.apply(null, this.timeLapse[this.maxTimeStep].tend);

      var yearSeries = 0;
      tmp = 0;
      for (var s = 0; s <= this.timeLapse[this.maxTimeStep].date[s].lenght - 1 ; s++) {
        tmp = this.timeLapse[this.maxTimeStep].date[s];
        if (tmp.substr(2, 4) != yearSeries){          
          this.startSeries.push({
            year: yearSeries,
            min: s
          });  
        }
      }
    },   

    getBecChart(time) {
       
      var chartData = {};
      chartData.datasets = [];

      //if (this.cast.isCast == true){
        //if (this.cast.indexCast == time){          
          //var isCast = this.cast.isCast;
          //var iStartCast = this.cast.indexStartCast;
          //console.log(isCast + "....." + iStartCast); 
       //}
      //}

      if (this.timeLapse) {
        for (var chartType in this.timeLapse[time]) {       
          
          var data = this.timeLapse[time][chartType];
          var dataXY = this.getCoordinates(data);
          var chartObj = {};
          this.labels = this.timeLapse[time]["date"]; 

          switch (chartType) {
            case "date":             
              chartData.labels = data;
              break;
            case "tend":
            
              chartObj = {
                label: "Yearly variation series",
                fill: true,
                borderColor: "rgba(46, 184, 92, 1)",
                data: dataXY,                
                showLine: false,
                pointRadius: 12,
                pointBackgroundColor:function(context){
                  var index = context.dataIndex;
                  var value = context.dataset.data[index];                  
                  if (value){ 
                    if (value.x > 131) {
                    //if (value.x > this.getStartCast()) {
                        return "rgba(255,128,0,0.6)";
                    } else {
                        return "rgba(46, 184, 92, 0.2)";
                    }
                  }
                }
              };
              break;
            case "pred_tp":              
              chartObj = {
                label: "Model estimation",
                fill: false,
                backgroundColor: "red", //color.background,
                borderColor: "red", // color.border,
                data: dataXY,
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
                data: dataXY,
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
                data: dataXY,
                showLine: true,
                lineTension: 0,
                pointRadius: 0
              };              
          }
          if (chartType != "date") {
            chartData.datasets.push(chartObj);
          }
        }
        chartObj = {
          label: "Covid Start",
          fill: false,
          backgroundColor: "blue", //color.background,
          borderColor: "blue", // color.border,
          data: [
            { x: this.treatX, y: this.maxTreatY },
            { x: this.treatX, y: this.minTreatY }
          ],
          showLine: true,
          lineTension: 0,
          pointRadius: 0,
          borderDash: [5, 5]
        };
        chartData.datasets.push(chartObj);
      }
      return chartData;
    },
    getDiagResChart(diag) {

      var chartData = {};      
      chartData.datasets = [];

      if (diag) {
        for (var chartType in diag) {        
                    
          var data = diag[chartType];
          var dataXY = this.getCoordinates(data);
          var chartObj = {};
    
          switch (chartType) {
            case "date":
              chartData.labels = data;
              break;
            case "pnt_y":
                chartObj = {
                  label: "pnt_y",
                  fill: false,
                  backgroundColor: "rgba(46, 184, 92, 0.2)",
                  borderColor: "rgba(46, 184, 92, 1)",
                  data: dataXY,
                  showLine: false,
                  pointRadius: 12
                };
                chartData.datasets.push(chartObj);
                break;  
            case "lne_y":
                chartObj = {
                  label: "lne_y",
                  fill: false,
                  backgroundColor: "red", //color.background,
                  borderColor: "red", // color.border,
                  data: dataXY,
                  showLine: true,
                  lineTension: 0,
                  pointRadius: 0
                };
                chartData.datasets.push(chartObj);
                break;  
          }          
        }
      }
      return chartData;
    },
    
    getDiagNormChart(diag) {
      
      var chartData = {};
      chartData.datasets = [];
      var chartObj = {};
      
      if (diag) {
        var pointXY = this.getCoordinatesNorm(diag["pnt_x"],diag["pnt_y"]);
        var lineXY = this.getCoordinatesNorm(diag["lne_x"],diag["lne_y"]);
        chartObj = {};  
        chartObj = {
          label: "(pnt_x,pnt_y)",
          fill: false,
          backgroundColor: "rgba(46, 184, 92, 0.2)",
          borderColor: "rgba(46, 184, 92, 1)",
          data: pointXY,
          showLine: false,
          pointRadius: 12
        };
        chartData.datasets.push(chartObj);
        //"pnt_y"
        
        chartObj = {};  
        chartObj = {
          label: "(lne_x, lne_y)",
          fill: false,
          backgroundColor: "red", //color.background,
          borderColor: "red", // color.border,
          data: lineXY,
          showLine: true,
          lineTension: 0,
          pointRadius: 2
        };
        chartData.datasets.push(chartObj);          
      }
      return chartData;
    },

    getDiagACFChart(diag) {
      var chartData = {};
      chartData.datasets = [];
      chartData.labels = diag["lne_x"];
      var maxDsh = "";
      var data = [];                

      if (diag) {
        for (var chartType in diag) {
          var chartObj = {};
          switch (chartType) {
           case "dsh_y_pos":                
                maxDsh = diag[chartType].length - 1;
                data = [{ x: 0, y: diag[chartType][0] },{ x: maxDsh, y: diag[chartType][maxDsh] }];                
                chartObj = {
                  type: "line",
                  label: "pos",
                  fill: false,
                  backgroundColor: "red", //color.background,
                  borderColor: "red", // color.border,
                  data: data,
                  showLine: true,
                  lineTension: 0,
                  pointRadius: 0,
                  borderDash: [5, 5]
                };
                chartData.datasets.push(chartObj);
            break;
          case "dsh_y_neg":              
            maxDsh = diag[chartType].length - 1;
            data = [{ x: 0, y: diag[chartType][0] },{ x: maxDsh, y: diag[chartType][maxDsh] }];                
            chartObj = {
              type: "line",
              label: "neg",
              fill: false,
              backgroundColor: "red", //color.background,
              borderColor: "red", // color.border,
              data: data,
              showLine: true,
              lineTension: 0,
              pointRadius: 0,
              borderDash: [5, 5]
            };
            chartData.datasets.push(chartObj);
            break;
          case "lne_y":
            var n = 0;
            diag[chartType].forEach((element, index) => {
              var data = [{ x: index, y: 0 },{ x: index, y: element }];
              console.log(data);
              chartObj = {
                    type: "line",
                    label: n++,
                    fill: false,
                    backgroundColor: "#06188a",
                    borderColor: "#06188a",
                    data: data,
                    showLine: true,
                    lineTension: 0,
                    pointRadius: 1                 
                };
                chartData.datasets.push(chartObj);
            });
          }
        }
      }
      console.log(chartData);
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
    
    getTable(objects) {
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
      console.log(keys);
      return tableData;
    },
    getHeaderTable(objects) {      
      var tableFields = [];
      tableFields.push({ key: "row", label: "" });
      for (var dat in objects) {
        if (dat != "row" && dat != "_row") {
          tableFields.push({ key: dat, label: dat  });
        }
      }
      return tableFields;
    }
  },
  
};
