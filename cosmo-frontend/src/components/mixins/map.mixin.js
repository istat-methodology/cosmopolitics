import { latLng } from "leaflet";

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
    getColor(d) {
      return d > 18
        ? "#06188a"
        : d > 16
        ? "#4260aa"
        : d > 14
        ? "#8999cc"
        : d > 12
        ? "#94c4f5"
        : d > 10
        ? "	#726dff"
        : d > 8
        ? "#48baff"
        : d > 6
        ? "#558bff"
        : d > 4
        ? "#35b9e0"
        : d > 2
        ? "#1ce2ff"
        : d > 1
        ? "#c1e7ff"
        : d < -18
        ? "#fa0404"
        : d < -16
        ? "#820101"
        : d < -14
        ? "#BD0026"
        : d < -12
        ? "#FC4E2A"
        : d < -10
        ? "#FD8D3C"
        : d < -8
        ? "#FEB24C"
        : d < -6
        ? "#ff10c5"
        : d < -4
        ? "#bb379b"
        : d < -2
        ? "	#d462bd"
        : d < -1
        ? "#f9b2e7"
        : // zero
        d < 1
        ? "#f9b2e7"
        : d > -0.99999999999999999999999999999
        ? "#43BE4F"
        : d < 0.99999999999999999999999999999
        ? "#43BE4F"
        : "#43BE4F";
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
        this.legend.series.push({
          color: this.getColor(from + 1),
          fromNumber: from,
          toNumber: to
        });
      }
    }
  }
};
