import { latLng } from "leaflet";
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
    //console.log("getRadius marker:" + marker);            
    //console.log("getRadius radius:" + radius);
      console.log("m- " + min + " m+ " + max + " r " + radius);
      console.log(data);
      return radius;
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
    getColor(marker, min, max, data) {
      min = -60, max = 60;
      console.log("data:" + data);
      var colors = [];
      var colorsLength = 0;
      colors = this.markerColors;
      colorsLength = colors.length -1;
      var s = d3.scaleLinear().domain([min, max]).range([0, colorsLength]);
      let sPoint = s(marker);
      let point = Math.round(sPoint);
      return colors[point];
    }
  }
};
