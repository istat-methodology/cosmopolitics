export const Map = {
  Attribution:
    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  Url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
};
export function scale(d) {
  const min = 1;
  const factor = 5;
  const zoomFactor = this.zoom >= 5 ? 1 : this.zoom / 10; // adjust divisor for best optics
  return Math.floor(Math.log(d) * factor * zoomFactor) + min;
}
export function mouseover({ target }) {
  target.setStyle({
    weight: this.currentStrokeWidth,
    color: `#${this.currentStrokeColor}`,
    dashArray: ""
  });
  this.info = this.buildInfo(target.feature);
}
export function mouseout({ target }) {
  target.setStyle({
    weight: this.strokeWidth,
    color: `#${this.strokeColor}`,
    dashArray: ""
  });
  this.info = this.buildInfo("");
}
export function buildInfo(props) {
  var div = props
    ? "State of " + "<b>" + props.properties.display_name + "</b><br/>"
    : "Hover over a state";
  return div;
}
export function callGraph(props) {
  var div = props
    ? "State of " + "<b>" + props.properties.display_name + "</b><br/>"
    : "Hover over a state";
  return div;
}
export function getColor(d) {
  return d > 10000000
    ? "#800026"
    : d > 500000
    ? "#BD0026"
    : d > 200000
    ? "#E31A1C"
    : d > 100000
    ? "#FC4E2A"
    : d > 50000
    ? "#FD8D3C"
    : d > 20000
    ? "#FEB24C"
    : d > 10000
    ? "#FED976"
    : "#FFEDA0";
}
export function buildLegend() {
  this.legend.title = "State";
  var grades = [10000, 20000, 50000, 100000, 200000, 500000, 1000000],
    from,
    to;

  for (var i = 0; i < grades.length; i++) {
    from = grades[i];
    to = grades[i + 1];
    this.legend.series.push({
      color: this.getColor(from + 1),
      fromNumber: from,
      toNumber: to
    });
  }
}
