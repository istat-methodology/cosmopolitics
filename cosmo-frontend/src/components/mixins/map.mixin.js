import * as d3 from "d3"
import * as scale from "d3-scale"

export default {
  data: () => ({
    selectedCountry: {
      name: "",
      code: ""
    },
    colors: [],
    dataLegend: []
  }),
  methods: {
    getRadius(marker) {
      const minimum = 15
      const factor = 5
      const zoomFactor = this.zoom >= 5 ? 1 : this.zoom / 10 // adjust divisor for best optics
      let radius = 0
      if (marker != undefined && !isNaN(marker)) {
        radius =
          Math.floor(Math.log(Math.abs(marker)) * factor * zoomFactor) + minimum
      }
      //console.log(radius);
      return radius
    },
    getColor(marker, min, max) {
      if (marker != undefined) {
        if (marker > max) {
          marker = max
        }
        if (marker < min) {
          marker = min
        }
      } else {
        marker = 0
      }
      var colorsLength = 0
      colorsLength = this.colors.length - 1
      var s = d3.scaleLinear().domain([min, max]).range([0, colorsLength])
      let sPoint = s(marker)
      let point = Math.round(sPoint)
      return this.colors[point]
    },
    setLegend(min, max, data) {
      const colorScale = d3.interpolateRdYlGn
      const colorRangeInfo = {
        colorStart: 0,
        colorEnd: 1,
        useEndAsStart: false
      }
      const dataLength = data.length
      this.colors = this.interpolateColors(
        dataLength,
        colorScale,
        colorRangeInfo
      )
      var linearScale = scale
        .scaleLinear()
        .domain([min, max])
        .range(this.colors)
      d3.select("#Legend").selectAll("*").remove()
      this.colorlegend("#Legend", linearScale, min, max, {
        boxWidth: 12,
        boxHeight: 12,
        axis: true
      })
    },
    colorlegend(target, scale, min, max, options) {
      var opts = options || {},
        boxWidth = opts.boxWidth || 20, // width of each box (int)
        boxHeight = opts.boxHeight || 20, // height of each box (int)
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
        domain = scale.domain(),
        range = scale.range(),
        isAxis = opts.axis || false,
        scaleAxis = null,
        axis = null,
        scalePointer = null

      colors = range
      // check the width and height and adjust if necessary to fit in the element use the range
      if (
        w <
        (boxWidth + boxSpacing) * colors.length + padding[1] + padding[3]
      ) {
        boxWidth =
          (w - padding[1] - padding[3] - boxSpacing * colors.length) /
          colors.length
      }
      if (h < boxHeight + padding[0] + padding[2]) {
        boxHeight = h - padding[0] - padding[2]
      }
      ;(scaleAxis = d3
        .scaleLinear()
        .domain(domain)
        .range([0, boxWidth * colors.length])),
        (axis = d3.axisBottom(scaleAxis)),
        (scalePointer = d3.scaleLinear().domain([0, 350]).range([min, max]))
      // set up the legend graphics context
      var legend = d3
        .select(target)
        .append("svg")
        .attr("width", w + 5)
        .attr("height", h)
        .append("g")
        .attr("class", "colorlegend")
        .attr("transform", "translate(" + padding[0] + "," + padding[0] + ")")
        .style("font-size", "11px")
        .style("fill", "#666")

      var legendBoxes = legend
        .selectAll("g.legend")
        .data(colors)
        .enter()
        .append("g")
        .on("click", function (e, rgbColor) {
          var pos = d3.pointer(e)
          var xPos = pos[0]
          var value = xPos
          alert(
            "Value: " + Math.round(scalePointer(value)) + ", color: " + rgbColor
          )
        })

      legendBoxes
        .append("text")
        .attr("stroke", "#fff")
        .attr("class", "colorlegend-labels")
        .attr("dy", ".71em")
        .attr("x", function (d, i) {
          return i * (boxWidth + boxSpacing)
        })
        .attr("y", function () {
          return boxHeight
        })
        .style("text-anchor", function () {
          return "middle"
        })
        .style("pointer-events", "none")

      // the colors, each color is drawn as a rectangle
      legendBoxes
        .append("rect")

        .attr("x", function (d, i) {
          return i * (boxWidth + boxSpacing)
        })
        .attr("width", boxWidth)
        .attr("height", boxHeight)
        .style("fill", function (d, i) {
          return colors[i]
        })

      if (isAxis) {
        axis.ticks(13)
        //axis.ticks(25);
        var legendAxis = legend
          .append("g")
          .attr("class", "colorlegend-title")
          .style("text-anchor", "middle")
          .style("pointer-events", "none")
          .call(axis)

        var axisTop = boxHeight + 1
        legendAxis.attr("transform", "translate(" + 0 + "," + axisTop + ")")
      }
      return this
    },
    calculatePoint(i, intervalSize, colorRangeInfo) {
      var { colorStart, colorEnd, useEndAsStart } = colorRangeInfo
      return useEndAsStart
        ? colorEnd - i * intervalSize
        : colorStart + i * intervalSize
    },
    /* Must use an interpolated color scale, which has a range of [0, 1] */
    interpolateColors(dataLength, colorScale, colorRangeInfo) {
      var { colorStart, colorEnd } = colorRangeInfo
      var colorRange = colorEnd - colorStart
      var intervalSize = colorRange / dataLength
      var i, colorPoint
      var colorArray = []
      for (i = 0; i < dataLength; i++) {
        colorPoint = this.calculatePoint(i, intervalSize, colorRangeInfo)
        colorArray.push(colorScale(colorPoint))
      }
      return colorArray
    }
  }
}
