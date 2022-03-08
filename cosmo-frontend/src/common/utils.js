import * as d3 from "d3";
//import * as scale from "d3-scale";

export function loadImage(img) {
  let image = "";
  try {
    image = require("@/assets/flags/w40/" + img.toLowerCase() + ".png");
  } catch (e) {
    image = require("@/assets/flags/w40/notfound.png");
  }
  return image;
}

export function getEdgeColor(value, data) {
  const colorScale = d3.interpolateRdYlGn;
  const colorRangeInfo = {
    colorStart: 0,
    colorEnd: 1,
    useEndAsStart: false
  };
  const dataLength = data.length;
  var colors = interpolateColors(
    dataLength,
    colorScale,
    colorRangeInfo
  );

  var max, min;
  max = d3.max(data, function (d) {
    return d.weight;
  });
  min = d3.min(data, function (d) {
    return d.weight;
  });

  var colorsLength = 0;
  colorsLength = colors.length - 1;

  var s = d3
    .scaleLinear()
    .domain([min, max])
    .range([0, colorsLength]);
  let sPoint = s(value);
  let point = Math.round(sPoint);
  return colors[point];

}
function calculatePoint(i, intervalSize, colorRangeInfo) {
    var {
      colorStart,
      colorEnd,
      useEndAsStart
    } = colorRangeInfo;
    return useEndAsStart ?
      colorEnd - i * intervalSize :
      colorStart + i * intervalSize;
  }
  /* Must use an interpolated color scale, which has a range of [0, 1] */
function interpolateColors(dataLength, colorScale, colorRangeInfo) {
    var {
      colorStart,
      colorEnd
    } = colorRangeInfo;
    var colorRange = colorEnd - colorStart;
    var intervalSize = colorRange / dataLength;
    var i, colorPoint;
    var colorArray = [];
    for (i = 0; i < dataLength; i++) {
      colorPoint = calculatePoint(i, intervalSize, colorRangeInfo);
      colorArray.push(colorScale(colorPoint));
    }
    return colorArray;
  }