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
    timeNothing:-1,
    maxTimeStep: 0,

    covidEstimationTableTitle: null,
    covidEstimationTableFileds: null,
    covidEstimationDataTable: null,
        
    modelTableTitle: null,
    modelTableFileds: null,
    modelDataTable: null,    
    
    cast:{    
      indexStart: 0
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
    
    getCoordinatesTreat() {      
      this.maxTreatY = Math.max.apply(null, this.timeLapse[this.maxTimeStep].tend);
      this.minTreatY = Math.min.apply(null, this.timeLapse[this.maxTimeStep].tend); 
      var data = [{ x: this.treatX, y: this.maxTreatY },{ x: this.treatX, y: this.minTreatY } ];
      return data;
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
    
      this.buildNothingTimePeriod(dataR);

      for (var name in dataR) {
        switch (name) {
          case "Covid_Estimation":          
            covidEstimation.push(dataR[name]);          
            this.covidEstimationTableTitle = "Covid Estimation";
            this.covidEstimationTableFileds = this.timePeriod; //this.getHeaderTable(dataR[name]);   
            this.covidEstimationDataTable = this.getTable(covidEstimation[0]);         
            break;          
          case "Model":            
            model.push(dataR[name]);            
            this.modelTableTitle = "Model";
            this.modelTableFileds = this.getHeaderTable(dataR[name]);    
            this.modelDataTable = this.getTable(model[0]);        
            break;
          case "DIAG_NORM":
            diagNorm.push(dataR[name]);
            this.diagNormTitle = "DiagNorm";
            this.chartDataDiagNorm = this.getDiagNormChart(diagNorm[0]);   
            break;
          case "DIAG_ACF":
            diagACF.push(dataR[name]);
            this.diagACFTitle = "DiagACF";
            this.chartDataDiagACF = this.getDiagACFChart(diagACF[0]);  
            break;
          case "DIAG_RES":
            diagRes.push(dataR[name]);
            this.diagResTitle = "DiagRes";
            this.chartDataDiagRes = this.getDiagResChart(diagRes[0]);
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
            }    
            if (name.substr(0,1) == "N") {
              console.log("Nowcasting found: " + indexT );
            }
            this.timeLapse.push(dataR[name]);
            indexT = indexT + 1;
        }
      }
      this.maxTimeStep = this.timeLapse.length - 1;
      this.buildBecSlider();        
    },  

    buildBecSlider() {
      this.policyPeriod = [];      
      var indexStart = 0;
      var indexEnd = 0;
      var v = 0;      
      var tmp;
      var year;
      var iMonth;
      var month;
      var label;
      var yearSeries;

      indexStart = this.timeLapse[0].date.length - 1;
      indexEnd = this.timeLapse[this.maxTimeStep].date.length - 1;      
      this.policyPeriodValue = this.timeLapse[this.maxTimeStep].date[indexStart];
      for (var i = indexStart; i <= indexEnd; i++) {
        tmp = this.timeLapse[this.maxTimeStep].date[i];
        year = tmp.substr(2, 2);
        iMonth = parseInt(tmp.substr(5, 2)) - 1;
        month = this.months[iMonth];
        month = month.substr(0, 3);
        label = month + "-" + year;    
        this.policyPeriod.push({
          id: this.timeLapse[this.maxTimeStep].date[i],
          name: label,
          val: v          
        });             
        v++;       
      }
             
      yearSeries = 0;
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

    buildObject(label, fill, backgroundColor, borderColor, data, showLine, lineTension, pointRadius,borderDash){
      var chartObj = {}
      chartObj = {
          label: label,
          fill: fill,
          backgroundColor: backgroundColor,
          borderColor:borderColor,
          data: data,
          showLine: showLine,
          lineTension:lineTension,
          pointRadius: pointRadius,
          borderDash: [borderDash,borderDash]
      };
      return chartObj;
    },
    buildObjectWithContext(highlightIndex,label, fill, backgroundColor, highlightColor, borderColor, data, showLine, lineTension, pointRadius,borderDash){
      var chartObj = {}
      chartObj = {
          label: label,
          fill: fill,
          backgroundColor:function(context){
            var index = context.dataIndex;
            var value = context.dataset.data[index];                  
            if (value){
              console.log(highlightIndex);
              if (value.x > highlightIndex) {            
                  return highlightColor;
              } else {
                  return backgroundColor;
              }
            }
          },
          borderColor:borderColor,
          data: data,
          showLine: showLine,
          lineTension:lineTension,
          pointRadius: pointRadius,
          borderDash: [borderDash,borderDash]
      };
      return chartObj;
    },

    getBecChart(time) {
       
      var chartData = {};
      var borderDash = 0;      
      var data=[];
      var dataXY=[];      
      var chartObj= {};

      chartData.datasets = [];

      if (this.timeLapse) {        
        for (var chartType in this.timeLapse[time]) { 
          data = this.timeLapse[time][chartType];
          dataXY = this.getCoordinates(data);
          chartObj = {};
          
          this.labels = this.timeLapse[time]["date"]; 
          switch (chartType) {
            case "date":             
              chartData.labels = data;
              break;
            case "tend":
              var highlightIndex = parseInt(this.cast.indexStart);
              chartObj = this.buildObjectWithContext( highlightIndex,"Yearly variation series",true,"rgba(46, 184, 92, 0.2)","rgba(255,128,0,0.6)","rgba(46, 184, 92,1)", dataXY, false,0,12,0); 
              break;
            case "pred_tp":              
              chartObj = this.buildObject("Model estimation",false,"red","red",dataXY,true,0,0,0);
              break;
            case "pred_tp_c":
              borderDash = "5";    
              chartObj = this.buildObject("Counterfactual",false,"red","red", dataXY, true,0,0,borderDash);
              break;
            default:
              chartObj = this.buildObject(chartType,false,"red","red", dataXY, true,0,0,0);          }
          if (chartType != "date") {
            chartData.datasets.push(chartObj);
          }
        }
        dataXY = this.getCoordinatesTreat();
        borderDash = "5";
        chartObj = this.buildObject("Covid Start",false,"blue","blue", dataXY, true,0,0,borderDash);
        chartData.datasets.push(chartObj);
      }
      return chartData;
    },
    getDiagResChart(diag) {
      var chartData = {};      
      var data=[];
      var dataXY = [];
      var chartObj = {};
      chartData.datasets = [];

      if (diag) {
        for (var chartType in diag) {      
          data = diag[chartType];
          dataXY = this.getCoordinates(data);
          chartObj = {};    
          switch (chartType) {
            case "date":
              chartData.labels = data;
              break;            
            case "pnt_y":
              chartObj = this.buildObject("pnt_y",false,"rgba(46, 184, 92, 0.2)","rgba(46, 184, 92, 1)", dataXY, false,0,12,0);
              chartData.datasets.push(chartObj);
              break;  
            case "lne_y":
              chartObj = this.buildObject("lny_y",false,"red","red", dataXY, true,0,0,0);
              chartData.datasets.push(chartObj);
              break;  
          }          
        }
      }
      return chartData;
    },    
    getDiagNormChart(diag) {      
      var chartData = {};
      var dataXY= [];
      var chartObj = {};      
      chartData.datasets = [];
      if (diag) {
        dataXY = this.getCoordinatesNorm(diag["pnt_x"],diag["pnt_y"]);        
        chartObj = this.buildObject("(pnt_x, pnt_y)",false,"rgba(46, 184, 92, 0.2)","rgba(46, 184, 92, 1)", dataXY, false, 0, 12, 0);  
        chartData.datasets.push(chartObj);

        chartObj = {};
        dataXY = this.getCoordinatesNorm(diag["lne_x"],diag["lne_y"]);       
        chartObj = this.buildObject("(lne_x, lne_y)",false,"red","red", dataXY, true,0,2,0);  
        chartData.datasets.push(chartObj);          
      }
      return chartData;
    },
    getDiagACFChart(diag) {
      var chartData = {};
      var maxDsh = "";
      var dataXY = [];       
      var borderDash = 0;
      var n = 0;
      chartData.datasets = [];
      chartData.labels = diag["lne_x"];
      if (diag) {
        for (var chartType in diag) {
          var chartObj = {};
          switch (chartType) {
           case "dsh_y_pos":                
                borderDash = 5;
                maxDsh = diag[chartType].length - 1;
                dataXY = [{ x: 0, y: diag[chartType][0] },{ x: maxDsh, y: diag[chartType][maxDsh] }];                
                chartObj = this.buildObject("pos",false,"red","red", dataXY, true,0,0,borderDash);
                chartData.datasets.push(chartObj);
            break;
          case "dsh_y_neg":              
                borderDash = 5,
                maxDsh = diag[chartType].length - 1;
                dataXY = [{ x: 0, y: diag[chartType][0] },{ x: maxDsh, y: diag[chartType][maxDsh] }];                
                chartObj = this.buildObject("pos",false,"red","red", dataXY, true,0,0,borderDash);
                chartData.datasets.push(chartObj);
                break;
          case "lne_y":              
                diag[chartType].forEach((element, index) => {
                dataXY = [{ x: index, y: 0 },{ x: index, y: element }];
                chartObj = this.buildObject( n++, false,"blue","blue", dataXY, true,0,1,0);
                chartData.datasets.push(chartObj);
            });
          }
          
        }
      }    
      return chartData;
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
          tableFields.push({ key: dat, label: dat , _classes: 'align-right' });
        }
      }
      return tableFields;
    },
    buildNothingTimePeriod(dataR) {
      
      var maxTimeStep;      
      var indexStart;      
      var indexEnd;
      var tmp;
      var year;
      var iMonth;
      var month;
      var label;
      var v = 0;     

      this.timePeriod = [];
      this.timePeriod.push({ key: "row", label: "" });             
      for (var name in dataR) {
          if (name.substr(0,1) == "T") {
            if (name!="Treat_number"){             
            console.log("Nothing found");
            maxTimeStep = name;        
          }
        }
      }
      indexStart = dataR["Treat_number"];
      indexEnd = dataR[maxTimeStep].date.length - 1;
      this.cast.indexStart = indexEnd;      
      for (var i = indexStart; i <= indexEnd; i++) {
        tmp = dataR[maxTimeStep].date[i];
        year = tmp.substr(2, 2);
        iMonth = parseInt(tmp.substr(5, 2)) - 1;
        month = this.months[iMonth];
        month = month.substr(0, 3);
        label = month + "-" + year;       

        this.timePeriod.push({ 
          key: "T" + (v + 1), 
          label: label, 
          _classes: 'align-right'
        });
        v++;       
      }
    }
  }  
};
