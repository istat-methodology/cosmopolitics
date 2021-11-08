<template>
  <div class="row">
    <div class="col-sm-12 col-md-12">
      <div class="card">
        <CCardBody>
          <l-map
            ref="map"
            :zoom="zoom"
            :center="center"
            style="height: 650px; width: 100%"
            @ready="setShooter()"
          >
            <l-tile-layer :url="url" :attribution="attribution" />
            <!-- Circle markers -->
            <l-circle-marker
              v-for="(marker, i) in markerTimeSeries"
              v-bind:key="i"
              :lat-lng="[
                marker.coordinates.latitude,
                marker.coordinates.longitude
              ]"
              :fillOpacity="0.65"
              :radius="scale(Math.abs(marker.export) * 500)"
              :color="getColor(marker.export / markerMax, markerMax, markerMin)"
              :fillColor="
                getColor(marker.export / markerMax, markerMax, markerMin)
              "
              @click="openModal(marker.export)"
            >
              <l-tooltip :options="{ interactive: true, permanent: false }">
                <span class="tooltip-span"
                  >{{ marker.name }} {{ marker.export }}
                </span>
              </l-tooltip>
            </l-circle-marker>

            <!-- Legend -->
            <l-control position="topright">
              <div id="Legend" class="legend"></div>
              <!--app-legend :legend="legend" /-->
            </l-control>
            <l-control position="bottomleft">
              <CButton
                color="primary"
                shape="square"
                size="sm"
                class="mr-2"
                @click="play"
                :disabled="disablePlay"
                >Play</CButton
              >
              <CButton
                color="danger"
                shape="square"
                size="sm"
                class="mr-2"
                @click="stop"
                >Stop</CButton
              >
            </l-control>
          </l-map>
        </CCardBody>
        <CCardFooter>
          <vue-slider
            :adsorb="true"
            :tooltip="'none'"
            v-model="periodValue"
            :data="timePeriod"
            :data-value="'id'"
            :data-label="'name'"
            @change="handleCounterChange"
          />
        </CCardFooter>
      </div>
    </div>
    <!-- Marker modal -->
    <CModal :title="modalTitle" :show.sync="markerModal" size="lg">
      <CTabs variant="tabs" :active-tab="0">
        <CTab title="Main">
          <CDataTable
            :items="micro"
            :fields="mainFields"
            hover
            v-if="markerData"
          />
        </CTab>
        <CTab title="Import partners">
          <CDataTable :items="importDataItems" :fields="importFields" hover />
        </CTab>
        <CTab title="Export partners">
          <CDataTable :items="exportDataItems" :fields="exportFields" hover />
        </CTab>
        <CTab title="Import goods">
          <CDataTable :items="importGoods" :fields="importGoodsFields" hover />
        </CTab>
        <CTab title="Export goods">
          <CDataTable :items="exportGoods" :fields="exportGoodsFields" hover />
        </CTab>
      </CTabs>
      <template #footer>
        <CButton color="outline-primary" square size="sm" @click="closeModal"
          >Close</CButton
        >
      </template>
    </CModal>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { Context } from "@/common";
import {
  LMap,
  LTileLayer,
  LControl,
  LTooltip,
  LCircleMarker
} from "vue2-leaflet";
//import MapLegend from "@/components/MapLegend";
import mapMixin from "@/components/mixins/map.mixin";
import SimpleMapScreenshoter from "leaflet-simple-map-screenshoter";
import sliderMixin from "@/components/mixins/slider.mixin";
import VueSlider from "vue-slider-component";
/*
import * as colorLegend from "d3-color-legend";
import * as selection  from "d3-selection";
*/
import * as scaleChromatic from "d3-scale-chromatic";
import * as scale from "d3-scale";
import * as d3 from "d3";

export default {
  name: "GeoMap",
  components: {
    LMap,
    LTileLayer,
    LControl,
    LCircleMarker,
    LTooltip,
    VueSlider
  },
  mixins: [mapMixin, sliderMixin],
  data: () => ({
    center: [51.16423, 10.45412],
    zoom: 4,
    markerTimeSeries: [],
    markerModal: false,
    markerMax: 1,
    markerMin: -1,
    dataLegend: [],
    modalTitle: "",
    mainFields: [
      { key: "Year", label: "" },
      { key: "2019", label: "2019" },
      { key: "2020", label: "2020" }
    ],
    importFields: [
      { key: "main_p_2019", label: "Main partner 2019" },
      { key: "tot_imp_2019", label: "Total import 2019" },
      { key: "main_p_2020", label: "Main partner 2020" },
      { key: "tot_imp_2020", label: "Total import 2020" }
    ],
    exportFields: [
      { key: "main_p_2019", label: "Main partner 2019" },
      { key: "tot_exp_2019", label: "Total export 2019" },
      { key: "main_p_2020", label: "Main partner 2020" },
      { key: "tot_exp_2020", label: "Total export 2020" }
    ],
    importGoodsFields: [
      { key: "main_g_2019", label: "Main goods 2019" },
      { key: "tot_imp_2019", label: "Total import 2019" },
      { key: "main_g_2020", label: "Main goods 2020" },
      { key: "tot_imp_2020", label: "Total import 2020" }
    ],
    exportGoodsFields: [
      { key: "main_g_2019", label: "Main goods 2019" },
      { key: "tot_exp_2019", label: "Total export 2019" },
      { key: "main_g_2020", label: "Main goods 2020" },
      { key: "tot_exp_2020", label: "Total export 2020" }
    ],

    //Player
    delta: 2000,
    disablePlay: false
  }),
  computed: {
    ...mapGetters("geomap", {
      markers: "geomap",
      markerData: "markerData",
      exportData: "exportData"
    }),
    micro() {
      return this.markerData ? this.markerData[0].MI : [];
    },
    importDataItems() {
      return this.markerData ? this.markerData[0].ImpP : [];
    },
    exportDataItems() {
      return this.markerData ? this.markerData[0].ExpP : [];
    },
    importGoods() {
      return this.markerData ? this.markerData[0].ImpG : [];
    },
    exportGoods() {
      return this.markerData ? this.markerData[0].ExpG : [];
    }
  },
  methods: {
    openModal(marker) {
      this.$store.dispatch("geomap/getMarker", marker.country).then(() => {
        this.markerModal = true;
        this.modalTitle = marker.name;
      });
    },
    closeModal() {
      this.markerModal = false;
    },

    handleCounterChange(val) {
      this.periodValue = val;
      this.buildTimeSeries();
    },

    getExport(marker, exportData, periodValue) {
      const localExp = exportData.find(exp => {
        return exp.country == marker.country;
      });
      if (periodValue === "201912") {
        return 1;
      } else {
        return localExp ? localExp[periodValue] : 1;
      }
    },
    buildTimeSeries() {
      this.markerTimeSeries = this.markers.map(marker => {
        return {
          ...marker,
          export: this.getExport(marker, this.exportData, this.periodValue)
        };
      });
      this.dataLegend = this.getDataLegend(this.exportData, this.periodValue);
      this.markerMax = this.getMax(this.exportData);
      this.markerMin = this.getMin(this.exportData);
      this.setLegend(this.markerMin, this.markerMax);
    },
    play() {
      this.counter = 0;
      this.timer = setInterval(() => {
        if (this.counter < this.timePeriod.length) {
          //do something
          this.periodValue = this.timePeriod[this.counter].id;
          this.buildTimeSeries();
          this.counter++;
        } else {
          this.stop();
        }
      }, this.delta);
      this.disablePlay = true;
    },
    stop() {
      clearInterval(this.timer);
      this.disablePlay = false;
    },
    setShooter() {
      new SimpleMapScreenshoter().addTo(this.$refs.map.mapObject);
    },
    getDataLegend(exportData, periodValue) {
      var data = [];
      exportData.forEach(obj => {
        for (const key in obj) {
          if (key == periodValue) {
            console.log(key);
            data.push(obj[key]);
          }
        }
      });
      console.log(" getdatalegend: period  =>" + periodValue);
      console.log(" getdatalegend data: =>" + data);

      return data;
    },
    setLegend(iMin, iMax) {
      var rMin = Math.round(iMin);
      var rMax = Math.round(iMax);

      console.log(iMin & "...." & iMax);
      console.log(rMin & "...." & rMax);

      var min = d3.min(this.dataLegend);
      var mean = d3.sum(this.dataLegend) / this.dataLegend.length;
      var max = d3.max(this.dataLegend);

      console.log(min);
      console.log(max);
      console.log(mean);

      console.log(min & "...." & max);

      // quantile scale
      //
      var colors = [];

      //var intColors = ["#3e7a2a","#00876c","#3e9c73","#64b17a","#89c581","#afd989","#d6ec93","#ffff9f","#fde475","#fdc84d","#fea828","#ff8502","#ff5b00","#ff0009","#e30008"]

      colors = scaleChromatic.schemeRdYlGn[10]; //redBlueScale; //d3.interpolateRdBu;

      var qScale = scale
        .scaleLinear()
        .domain([min, 0, max])
        .range(colors);

      console.log(qScale.domain());
      console.log(qScale.range());
      d3.select("#Legend")
        .selectAll("*")
        .remove();

      this.colorlegend("#Legend", qScale, "quantile", {
        title: "Trade Variation (%) - (Base=Nov 2019)",
        boxHeight: 15,
        boxWidth: 30
      });

      /*  
      var extent = d3.extent(this.dataLegend);
      var linearScale = d3.scaleLinear()
      .domain(extent)
      .range([0, 100]);
      var axis = d3.axisBottom(linearScale);
      d3.select("#Legend")
        .append("svg")
        .attr("width", 350)
        .append("g")
        .attr('class', 'colorlegend-labels')
        .attr('dy', '.71em')
        .attr('x', '10')
        .attr("transform", "translate(0,50)")   
        .call(axis);
      */
    },

    getMax(exportData) {
      var max = 1;
      exportData.forEach(obj => {
        for (const key in obj) {
          if (key != "country") {
            if (max < obj[key]) {
              max = obj[key];
            }
          }
        }
      });
      //console.log(max);
      return max;
    },
    getMin(exportData) {
      var min = -1;
      exportData.forEach(obj => {
        for (const key in obj) {
          if (key != "country") {
            //console.log(obj[key]);
            if (min > obj[key]) {
              min = obj[key];
            }
          }
        }
      });
      //console.log(min);
      return min;
    },
    colorlegend(target, scale, type, options) {
      var scaleTypes = ["linear", "quantile", "ordinal"],
        found = false,
        opts = options || {},
        boxWidth = opts.boxWidth || 20, // width of each box (int)
        boxHeight = opts.boxHeight || 20, // height of each box (int)
        title = opts.title || null, // draw title (string)
        fill = opts.fill || false, // fill the element (boolean)
        linearBoxes = opts.linearBoxes || 9, // number of boxes for linear scales (int)
        htmlElement = document.getElementById(
          target.substring(0, 1) === "#"
            ? target.substring(1, target.length)
            : target
        ), // target container element - strip the prefix #
        w = htmlElement.offsetWidth, // width of container element
        h = htmlElement.offsetHeight, // height of container element
        colors = [],
        padding = [2, 4, 10, 4], // top, right, bottom, left
        boxSpacing = type === "ordinal" ? 3 : 0, // spacing between boxes
        titlePadding = title ? 12 : 0,
        domain = scale.domain(),
        range = scale.range(),
        i = 0,
        isVertical = opts.vertical || false;

      // check for valid input - 'quantize' not included
      for (i = 0; i < scaleTypes.length; i++) {
        if (scaleTypes[i] === type) {
          found = true;
          break;
        }
      }

      if (!found) throw new Error("Scale type, " + type + ", is not suported.");

      // setup the colors to use
      if (type === "quantile") {
        colors = range;
      } else if (type === "ordinal") {
        for (i = 0; i < domain.length; i++) {
          colors[i] = range[i];
        }
      } else if (type === "linear") {
        var min = domain[0];
        var max = domain[domain.length - 1];
        for (i = 0; i < linearBoxes; i++) {
          colors[i] = scale(min + i * ((max - min) / linearBoxes));
        }
      }
      // check the width and height and adjust if necessary to fit in the element use the range if quantile
      if (!isVertical) {
        if (
          fill ||
          w < (boxWidth + boxSpacing) * colors.length + padding[1] + padding[3]
        ) {
          boxWidth =
            (w - padding[1] - padding[3] - boxSpacing * colors.length) /
            colors.length;
        }
        if (fill || h < boxHeight + padding[0] + padding[2] + titlePadding) {
          boxHeight = h - padding[0] - padding[2] - titlePadding;
        }
      }

      // set up the legend graphics context
      var legend = d3
        .select(target)
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .append("g")
        .attr("class", "colorlegend")
        .attr("transform", "translate(" + padding[0] + "," + padding[0] + ")")
        .style("font-size", "11px")
        .style("fill", "#666");

      var legendBoxes = legend
        .selectAll("g.legend")
        .data(colors)
        .enter()
        .append("g");

      // value labels
      var valueLabels;
      if (!isVertical) {
        valueLabels = legendBoxes
          .append("text")
          .attr("class", "colorlegend-labels")
          .attr("dy", ".71em")
          .attr("x", function(d, i) {
            return (
              i * (boxWidth + boxSpacing) +
              (type !== "ordinal" ? boxWidth / 2 : 0)
            );
          })
          .attr("y", function() {
            return boxHeight + 2;
          });
      }
      valueLabels
        .style("text-anchor", function() {
          return type === "ordinal" ? "start" : "middle";
        })
        .style("pointer-events", "none")
        .text(function(d, i) {
          // show label for all ordinal values
          if (type === "ordinal") {
            return domain[i];
          }
          // show only the first and last for others
          else {
            if (i === 0) return domain[0];
            if (i === colors.length - 1) return domain[domain.length - 1];
          }
        });

      // the colors, each color is drawn as a rectangle
      if (!isVertical) {
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
      }

      // show a title in center of legend (bottom)
      if (title) {
        var legendText = legend
          .append("text")
          .attr("class", "colorlegend-title")
          .style("text-anchor", "middle")
          .style("pointer-events", "none")
          .text(title);

        if (!isVertical) {
          legendText
            .attr("dy", ".71em")
            .attr("x", colors.length * (boxWidth / 2))
            .attr("y", boxHeight + titlePadding);
        }
      }

      return this;
    }
  },
  created() {
    this.$store.dispatch("coreui/setContext", Context.Map);
    this.$store.dispatch("geomap/findAll").then(() => {
      this.$store.dispatch("geomap/getExportTimeSeries").then(() => {
        this.buildTimeSeries();
      });
    });
  }
};
</script>
<style scoped>
@import "~leaflet/dist/leaflet.css";
.card-body {
  padding: 0;
}
.card-footer {
  background-color: #ebedef;
}
/* Modal */
@media (min-width: 576px) {
  .modal-dialog {
    margin: 5rem auto;
  }
}
.modal-footer {
  padding: 0.4rem 0.75rem;
}
.modal-header {
  padding: 0.75rem 1rem;
}
.btn-primary.disabled,
.btn-primary:disabled {
  color: #fff;
  background-color: #8f85ed;
  border-color: #321fdb;
}
.legend {
  background-color: transparent;
  width: 300px;
  height: 60px;
  /*border: 1px solid #bbb;*/
  margin: 10px;
}
#Legend .colorlegend-labels {
  font-size: 11px;
  fill: black;
}
</style>
