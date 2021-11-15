import { latLng } from "leaflet";
//import * as d3 from "d3";
import * as scaleChromatic from "d3-scale-chromatic";
import * as d3 from "d3";


export default {
  data: () => ({
    enableTooltip: true,
    zoom: 4,
    center: [45.861347, 57.405578],
    fillColor: "#e4ce7f",
    marker: latLng(41.89277044, 12.48366722),
    legend: {
      title: null,
      subTitle: null,
      series: [
        {
          color: "",
          fromNumber: "",
          toNumber: ""
        }
      ]
    },
    info: {},
    strokeColor: "fff",
    currentStrokeColor: "4d4d4d",
    strokeWidth: 2,
    currentStrokeWidth: 3,
    optionCircle: {
      color: "",
      radius: "10"
    },
    attribution:
      '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  }),
  methods: {
    getRadius(marker,min,max,data) {
      const minimum = 15;
      const factor = 5;
      const zoomFactor = this.zoom >= 5 ? 1 : this.zoom / 10; // adjust divisor for best optics      
      const d = Math.abs(marker);
      let radius = Math.floor(Math.log(d) * factor * zoomFactor) + minimum;
    //let sqrtScale = d3.scaleSqrt().domain([0, data.length - 1]).range([min,max]);
    //let radius = Math.floor(sqrtScale(d) * factor * zoomFactor) + minimum;
      console.log("getcolor marker:" & marker);            
      console.log(data);
      return radius
    },
    mouseover({ target }) {
      target.setStyle({
        weight: this.currentStrokeWidth,
        color: `#${this.currentStrokeColor}`,
        dashArray: ""
      });
      this.info = this.buildInfo(target.feature);
    },
    mouseout({ target }) {
      target.setStyle({
        weight: this.strokeWidth,
        color: `#${this.strokeColor}`,
        dashArray: ""
      });
      this.info = this.buildInfo("");
    },
    callGraph(props) {
      var div = props
        ? "State of " + "<b>" + props.properties.display_name + "</b><br/>"
        : "Hover over a state";
      return div;
    },
    getColor(marker, iMin, iMax, data) {


      iMin = -60;
      iMax = 60;
      console.log("getcolor marker:" & marker);                  
      console.log("getcolor max:" & iMax);
      console.log("getcolor min:" & iMin);
      console.log("getcolor marker:" &data);
      
      //var colors = [];
      //colors = this.markerColors;
      
      let dataScale = d3.scaleLinear().domain([iMin, iMax]).range([0, 1]);
      
      const point = dataScale(marker);      
      const colorScale = d3.interpolateRdYlGn;      
      
      console.log(dataScale.domain());
      console.log(dataScale.range());
      console.log(colorScale(point));
      console.log(this.markerColors);      
      console.log("point:" & point);      

      return colorScale(point);
      
    },

    buildLegend() {
      this.legend.title = "Trade Variation (%)";
      this.legend.subTitle = "(Base=Nov 2019)";
      var grades = [
          18,
          16,
          14,
          12,
          10,
          8,
          6,
          4,
          2,
          0,
          -2,
          -4,
          -6,
          -8,
          -10,
          -12,
          -14,
          -16,
          -18
        ],
        from,
        to;
      for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        //to = grades[i + 1];
        let color = from;
        this.legend.series.push({
          color: scaleChromatic.interpolateRdYlGn(color),
          fromNumber: from,
          toNumber: to
        });
      }
    },
    calculatePoint(i, intervalSize, colorRangeInfo) {
      var { colorStart, colorEnd, useEndAsStart } = colorRangeInfo;
      return useEndAsStart
        ? colorEnd - i * intervalSize
        : colorStart + i * intervalSize;
    },
    /* Must use an interpolated color scale, which has a range of [0, 1] */
    interpolateColors(dataLength, colorScale, colorRangeInfo) {
      var { colorStart, colorEnd } = colorRangeInfo;
      var colorRange = colorEnd - colorStart;
      var intervalSize = colorRange / dataLength;
      var i, colorPoint;
      var colorArray = [];
      for (i = 0; i < dataLength; i++) {
        colorPoint = this.calculatePoint(i, intervalSize, colorRangeInfo);
        colorArray.push(colorScale(colorPoint));
      }
      return colorArray;
    }
  }
};
