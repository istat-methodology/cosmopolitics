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

    timePeriod: [],
    
    covidEstimationTableTitle: null,
    covidEstimationTableFileds: null,
    covidEstimationDataTable: null,
        
    modelTableTitle: null,
    modelTableFileds: null,
    modelDataTable: null
    
    
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
    getCoordinatesACF(dataArray) {
      const dataMap = [];
      dataArray.forEach((element, index) => {
        dataMap.push({
          x: index,
          y: index
        },{
          x: index,
          y: element
        });
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
        }        
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
            this.timeLapse.push(dataR[name]);
        }
      }
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
      this.chartDataDiagRes = this.getDiagResChart(diagRes[0])
      this.chartDataDiagACF = this.getDiagACFChart(diagACF[0])
      

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
      this.policyPeriodValue = this.timeLapse[this.maxTimeStep].date[
        indexStart
      ];
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
      this.maxTreatY = Math.max.apply(null, this.timeLapse[this.maxTimeStep].tend);
      this.minTreatY = Math.min.apply(null, this.timeLapse[this.maxTimeStep].tend);
    },
    getBecChart(time) {
      var chartData = {};
      chartData.datasets = [];
      if (this.timeLapse) {
        for (var chartType in this.timeLapse[time]) {
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
          var chartObj = {};
          switch (chartType) {
            case "date":
              chartData.labels = diag[chartType];
              break;
            case "pnt_y":
                chartObj = {
                  label: "pnt_y",
                  fill: false,
                  backgroundColor: "rgba(46, 184, 92, 0.2)",
                  borderColor: "rgba(46, 184, 92, 1)",
                  data: this.getCoordinates(diag[chartType]),
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
                  data: this.getCoordinates(diag[chartType]),
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
        //"lne_y"
        chartObj = {};  
        chartObj = {
          label: "(pnt_x,pnt_y)",
          fill: false,
          backgroundColor: "rgba(46, 184, 92, 0.2)",
          borderColor: "rgba(46, 184, 92, 1)",
          data: this.getCoordinatesNorm(diag["pnt_x"],diag["pnt_y"]),
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
          data: this.getCoordinatesNorm(diag["lne_x"],diag["lne_y"]),
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
  }
};
