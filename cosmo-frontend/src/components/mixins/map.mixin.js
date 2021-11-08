import { latLng } from "leaflet";
import * as scaleChromatic from "d3-scale-chromatic";


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
    scale(d) {
      const min = 1;
      const factor = 5;
      const zoomFactor = this.zoom >= 5 ? 1 : this.zoom / 10; // adjust divisor for best optics
      return Math.floor(Math.log(d) * factor * zoomFactor) + min;
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
    getColor(perc,max,min) {
      console.log(max & min);
      //return this.perc2color(perc,min,max)
      //return this.percentageToColor(perc)
      
      return scaleChromatic.interpolateRdYlGn(perc);
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
      return (useEndAsStart
        ? (colorEnd - (i * intervalSize))
        : (colorStart + (i * intervalSize)));
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
    },
    percentageToColor(percentage, maxHue = 120, minHue = 0) {
      const hue = percentage * (maxHue - minHue) + minHue;
      return `hsl(${hue}, 100%, 50%)`;
    },
    perc2color(perc,min,max) {
      var base = (max - min);
  
      if (base == 0) { perc = 100; }
      else {
          perc = (perc - min) / base * 100; 
      }
      var r, g, b = 0;
      if (perc < 50) {
          r = 255;
          g = Math.round(5.1 * perc);
      }
      else {
          g = 255;
          r = Math.round(510 - 5.10 * perc);
      }
      var h = r * 0x10000 + g * 0x100 + b * 0x1;
      return '#' + ('000000' + h.toString(16)).slice(-6);
  }
  }

};
