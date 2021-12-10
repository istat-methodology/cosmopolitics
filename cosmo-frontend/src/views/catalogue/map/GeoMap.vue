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
            <l-geo-json
              v-if="geojson"
              :visible="isFeature"
              :geojson="geojson"
              :options="options"
              :options-style="styleFunction"
              @click="openModalOnFeature"
            ></l-geo-json>
            <!-- Circle markers -->
            <l-circle-marker
              v-for="(marker, i) in markerTimeSeries"
              v-bind:key="i"
              :lat-lng="[
                marker.coordinates.latitude,
                marker.coordinates.longitude
              ]"
              :visible="!isMarker"
              :fillOpacity="0.65"
              :radius="
                getRadius(marker.export, markerMin, markerMax, dataLegend)
              "
              :color="getColor(marker.export, markerMin, markerMax)"
              :fillColor="getColor(marker.export, markerMin, markerMax)"
              @click="openModal(marker)"
            >
              <l-tooltip :options="{ interactive: true, permanent: false }">
                <span class="tooltip-span"
                  >{{ marker.name }} {{ Math.round(marker.export) }}
                </span>
              </l-tooltip>
            </l-circle-marker>
            <!-- Legend -->
            <l-control position="topright">
              <div id="Legend" class="legend"></div>
            </l-control>

            <l-control position="bottomright">
              <div class="row info">
                <CTabs variant="tabs" :active-tab="0">
                  <CTab title="Main">
                    <CDataTable
                      :items="micro"
                      :fields="mainFields"
                      hover
                      v-if="markerData"
                      class="col-6"
                    />
                  </CTab>
                  <CTab title="Import partners">
                    <CDataTable
                      :items="importDataItems"
                      :fields="importFields"
                      hover
                      class="col-6"
                    />
                  </CTab>
                  <CTab title="Export partners">
                    <CDataTable
                      :items="exportDataItems"
                      :fields="exportFields"
                      hover
                      class="col-6"
                    />
                  </CTab>
                  <CTab title="Import goods">
                    <CDataTable
                      :items="importGoods"
                      :fields="importGoodsFields"
                      hover
                      class="col-6"
                    />
                  </CTab>
                  <CTab title="Export goods">
                    <CDataTable
                      :items="exportGoods"
                      :fields="exportGoodsFields"
                      hover
                      class="col-6"
                    />
                  </CTab>
                </CTabs>
              </div>
            </l-control>

            <l-control position="topleft">
              <div class="leaflet-bar">
                <a
                  class="control-btn"
                  :title="this.titleFeatureMarker"
                  role="button"
                  @click="setFeatureMarker()"
                  >{{ this.btnFeatureMarker }}</a
                >
                <a
                  class="control-btn"
                  :title="this.titleImportExport"
                  role="button"
                  @click="setImportExport()"
                  >{{ this.btnImportExport }}</a
                >
              </div>
            </l-control>
          </l-map>
        </CCardBody>
        <CCardFooter>
          <vue-slider
            v-if="timePeriod"
            :adsorb="true"
            :tooltip="'none'"
            v-model="seriesperiod"
            :data="timePeriod"
            :data-value="'id'"
            :data-label="'name'"
            @change="handleCounterChange"
          />
        </CCardFooter>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { Context } from "@/common";
import {
  LMap,
  LGeoJson,
  LTileLayer,
  LControl,
  LTooltip,
  LCircleMarker
} from "vue2-leaflet";
import mapMixin from "@/components/mixins/map.mixin";
import mapModalMixin from "@/components/mixins/mapModal.mixin";
import sliderMixin from "@/components/mixins/slider.mixin";
import SimpleMapScreenshoter from "leaflet-simple-map-screenshoter";
import VueSlider from "vue-slider-component";

export default {
  name: "GeoMap",
  components: {
    LMap,
    LTileLayer,
    "l-geo-json": LGeoJson,
    LControl,
    LCircleMarker,
    LTooltip,
    VueSlider
  },
  mixins: [mapMixin, mapModalMixin, sliderMixin],
  data: () => ({
    attribution:
      '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    center: [51.16423, 10.45412],
    zoom: 4,
    seriesperiod: "202004",
    markerTimeSeries: [],
    bordersTimeSeries: [],
    markerMax: 60,
    markerMin: -60,
    //delta: 2000,
    //features
    enableTooltip: true,
    layer: {
      style: {
        default: {
          weight: 1,
          opacity: 1,
          color: "gray",
          dashArray: "",
          fillOpacity: 0.7
        },
        over: {
          weight: 1,
          opacity: 1,
          color: "black",
          dashArray: "2",
          fillOpacity: 0.7
        }
      }
    },
    btnFeatureMarker: "F",
    titleFeatureMarker: "Change view to Feature mode",
    isMarker: false,
    isFeature: false,
    btnImportExport: "I",
    titleImportExport: "Load Import",
    isImport: false,
    isExport: false
  }),
  computed: {
    ...mapGetters("geomap", {
      markers: "geomap",
      markerData: "markerData",
      exportData: "exportData"
    }),
    ...mapGetters("period", ["timePeriod"]),
    ...mapGetters("countries", {
      geojson: "countriesborders",
      jsondata: "jsondata"
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
    },
    options() {
      return {
        onEachFeature: this.onEachFeatureFunction
      };
    },
    styleFunction() {
      return () => {
        return {
          weight: this.layer.style.default.weight,
          opacity: this.layer.style.defaultopacity,
          color: this.layer.style.default.color,
          dashArray: this.layer.style.default.dashArray,
          fillOpacity: this.layer.style.default.fillOpacity
        };
      };
    },
    onEachFeatureFunction() {
      /*
      if (!this.enableTooltip) {
        return () => {};
      }
      */
      return (feature, layer) => {
        var value = this.jsondata[feature.properties.iso_a2];
        this.selectedCountry.code = feature.properties.iso_a2;
        this.selectedCountry.name = feature.properties.admin;
        if (value != undefined) {
          value = Math.round(value);
          layer.options.fillColor = this.getColor(value, -60, 60);
          layer.options.color = "gray"; //this.getColor(value,-60,60);
          layer.bindTooltip(
            "<div>" +
              feature.properties.iso_a2 +
              "<br>" +
              feature.properties.admin +
              "<br>" +
              feature.properties.continent +
              "<br>" +
              "export:" +
              value +
              "<br>" +
              " </div>",
            { permanent: false, sticky: true }
          );
          layer.on({
            mouseover: this.mouseover,
            mouseout: this.mouseout //,
            //click: this.openModalOnFeature
            //click: this.openModalOnFeature(feature.properties.iso_a2,feature.properties.admin)
          });
        }
      };
    }
  },
  methods: {
    handleCounterChange(val) {
      this.seriesperiod = val;
      this.buildTimeSeries();
      this.$store.dispatch("countries/getDataSeries").then(seriesdata => {
        this.$store.dispatch("countries/getCountriesBorders", {
          seriesData: seriesdata,
          seriesPeriod: this.seriesperiod
        });
      });
    },
    getExport(marker, exportData, seriesperiod) {
      const localExp = exportData.find(exp => {
        return exp.country == marker.country;
      });
      if (seriesperiod > "202011") {
        return 0;
      } else {
        return localExp ? localExp[seriesperiod] : 1;
      }
    },
    buildTimeSeries() {
      this.markerTimeSeries = this.markers.map(marker => {
        return {
          ...marker,
          export: this.getExport(marker, this.exportData, this.seriesperiod)
        };
      });
      if (this.seriesperiod < "202011") {
        this.dataLegend = this.getDataLegend(
          this.exportData,
          this.seriesperiod
        );
        this.markerMax = this.getMax(this.exportData);
        this.markerMin = this.getMin(this.exportData);
        this.setLegend(this.markerMin, this.markerMax, this.dataLegend);
      }
    },
    setShooter() {
      new SimpleMapScreenshoter().addTo(this.$refs.map.mapObject);
    },
    getDataLegend(exportData, seriesperiod) {
      var data = [];
      exportData.forEach(obj => {
        for (const key in obj) {
          if (key == seriesperiod) {
            //console.log(key);
            data.push(obj[key]);
          }
        }
      });
      return data;
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
    setFeatureMarker() {
      if (this.btnFeatureMarker == "F") {
        this.btnFeatureMarker = "M";
        this.titleFeatureMarker = "Change view Marker mode";
      } else {
        this.btnFeatureMarker = "F";
        this.titleFeatureMarker = "Change view to Feature mode";
      }
      this.isFeature = !this.isFeature;
      this.isMarker = !this.isMarker;
    },
    setImportExport() {
      if (this.btnImportExport == "I") {
        this.btnImportExport = "E";
        this.titleImportExport = "Load Export";
      } else {
        this.btnImportExport = "I";
        this.titleImportExport = "Load Import";
      }
      this.isImport = !this.isImport;
      this.isExport = !this.isExport;
    },
    mouseover(e) {
      var layer = e.target;
      layer.setStyle({
        color: this.layer.style.over.color,
        dashArray: this.layer.style.over.dashArray
      });
      //this.openModalOnFeature(country, name);
    },
    mouseout(e) {
      var layer = e.target;
      layer.setStyle({
        color: this.layer.style.default.color,
        dashArray: this.layer.style.default.dashArray
      });
    }
  },
  created() {
    this.$store.dispatch("period/findByName", "map");
    this.$store.dispatch("coreui/setContext", Context.Map);
    this.$store.dispatch("geomap/findAll").then(() => {
      this.$store.dispatch("geomap/getExportTimeSeries").then(() => {
        this.buildTimeSeries();
        this.$store.dispatch("countries/getDataSeries").then(seriesdata => {
          this.$store.dispatch("countries/getCountriesBorders", {
            seriesData: seriesdata,
            seriesPeriod: this.seriesperiod
          });
        });
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
  width: 360px;
  height: 80px;
  /*border: 1px solid #bbb;*/
  margin-left: 10px;
  padding: 1px !important;
}
#Legend .colorlegend-labels {
  font-size: 11px;
  fill: black;
}
.info {
  /*padding: 6px 8px;*/
  font: 14px/16px Arial, Helvetica, sans-serif;
  background: white;
  /*background: rgba(255,255,255,0.8);*/
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
}
.info h4 {
  /*margin: 0 0 5px;*/
  color: #777;
}
.control-btn {
  font: bold 18px "Lucida Console", Monaco, monospace;
  text-indent: 1px;
}
</style>
