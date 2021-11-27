import { latLng } from "leaflet";
import * as d3 from "d3";
import * as scale from "d3-scale";
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
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
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
    getColor(marker, min, max) {
      min = -60, max = 60;
      var colors = [];
      var colorsLength = 0;
      colors = this.markerColors;
      colorsLength = colors.length -1;
      var s = d3.scaleLinear().domain([min, max]).range([0, colorsLength]);
      let sPoint = s(marker);
      let point = Math.round(sPoint);
      return colors[point];
    },
    setLegend(min, max, iData) {    
      min = -60, max = 60;
      var colors = [];
      const colorScale = d3.interpolateRdYlGn;
      const colorRangeInfo = {
        colorStart: 0,
        colorEnd: 1,
        useEndAsStart: false,
      };
      const dataLength = iData.length;
      colors = this.interpolateColors(dataLength, colorScale, colorRangeInfo);     
      this.markerColors = colors;      
      //console.log(colors);      
      var linearScale = scale.scaleLinear()
        .domain([min, max])
        .range(colors);      
      d3.select("#Legend").selectAll("*").remove();      
      this.colorlegend("#Legend", linearScale, "linear", {
        //title: "Trade Variation (%) - (Base=Nov 2019)",
        title: "Monthly change in Export (%) - (Base=Nov 2019)",
        boxHeight: 15,
        axis:true
      });
    },     
    colorlegend(target, scale, type, options) {
      var opts = options || {},
        boxWidth = opts.boxWidth || 20, // width of each box (int)
        boxHeight = opts.boxHeight || 20, // height of each box (int)
        title = opts.title || null, // draw title (string)
        htmlElement = document.getElementById(
          target.substring(0, 1) === "#"
            ? target.substring(1, target.length)
            : target
        ), // target container element - strip the prefix #
        w = htmlElement.offsetWidth, // width of container element
        h = htmlElement.offsetHeight, // height of container element
        colors = [],
        padding = [6, 4, 10, 4], // top, right, bottom, left
        boxSpacing = 0, // spacing between boxes
        titlePadding = title ? 32 : 0,
        domain = scale.domain(),
        range = scale.range(),
        isAxis = opts.axis || false,
        pointOnLegend,
        scaleAxis = null,
        axis = null,
        scalePointer = null;
      
      colors = range;
      // check the width and height and adjust if necessary to fit in the element use the range
      if ( w < (boxWidth + boxSpacing) * colors.length + padding[1] + padding[3]) { 
          boxWidth =  (w - padding[1] - padding[3] - boxSpacing * colors.length) / colors.length; 
      }
      if (h < boxHeight + padding[0] + padding[2] + titlePadding) { 
          boxHeight = h - padding[0] - padding[2] - titlePadding;
      }

      scaleAxis = d3.scaleLinear().domain(domain).range([0, boxWidth * colors.length]),
      axis = d3.axisBottom(scaleAxis),
      scalePointer = d3.scaleLinear().domain([0,350]).range([-60,60]);

      // set up the legend graphics context
      var legend = d3
        .select(target)
        .append("svg")
        .attr("width", w + 5)
        .attr("height", h)
        .append("g")
        .attr("class", "colorlegend")
        .attr("transform", "translate(" + padding[0]  + "," + padding[0] + ")")
        .style("font-size", "11px")
        .style("fill", "#666");
    
      var legendBoxes = legend
        .selectAll("g.legend")
        .data(colors)
        .enter()
        .append("g")        
        .on('click', function(e,rgbColor){
            var pos = d3.pointer(e);
	          var xPos = pos[0];
	          var value = xPos;
            alert("Value: " + Math.round(scalePointer(value))+ ", color: " + rgbColor);            
        });
        
      console.log(pointOnLegend);

      legendBoxes
        .append("text")
		    .attr("stroke", "#fff")
        .attr("class", "colorlegend-labels")
        .attr("dy", ".71em")          
        .attr("x", function(d, i) {
          return ( i * (boxWidth + boxSpacing ) );
        })
        .attr("y", function() {  return boxHeight; })
        .style("text-anchor", function() {
          return "middle";
        })
        .style("pointer-events", "none");

      // the colors, each color is drawn as a rectangle
      legendBoxes
        .append("rect")       
        
        .attr("x", function(d, i) {
          return i * (boxWidth + boxSpacing);
        })        
        .attr("width", boxWidth)
        .attr("height", boxHeight)          
        .style("fill", function(d, i) {
          return colors[i];
        });
       
      if (isAxis) {
        axis.ticks(13);        
        //axis.ticks(25);
        var legendAxis = legend
          .append("g")
          .attr("class", "colorlegend-title")
          .style("text-anchor", "middle")
          .style("pointer-events", "none")          
          .call(axis);
        
        var axisTop = boxHeight + 1;
            legendAxis
            .attr("transform", "translate(" + 0  + "," + axisTop + ")");
      }
      // title in center of legend (bottom)
      if (title) {
        var legendTitle = legend
          .append("text")
          .attr("class", "colorlegend-title")
          .style("text-anchor", "middle")
          .style("pointer-events", "none")
          .text(title);        
        legendTitle
          .attr("dy", ".71em")
          .attr("x", colors.length * (boxWidth / 2))
          .attr("y", boxHeight + titlePadding);
      }
      return this;
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
