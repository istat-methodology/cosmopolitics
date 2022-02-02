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
            @ready="
              setShooter();
              openInfoStart('IT', 'Italy');
            "
            @click="closeInfo()"
          >
            <l-tile-layer :url="url" :attribution="attribution" />
            <l-geo-json
              v-if="geoJson"
              :visible="isFeature"
              :geojson="geoJson"
              :options="options"
              :options-style="styleFunction"
              @click="openInfoOnFeature"
            ></l-geo-json>
            <!-- Circle markers -->
            <l-circle-marker
              v-for="(marker, i) in markerPeriodSeries"
              v-bind:key="i"
              :lat-lng="[
                marker.coordinates.latitude,
                marker.coordinates.longitude
              ]"
              :visible="!isMarker"
              :fillOpacity="0.65"
              :radius="
                getRadius(marker.series, markerMin, markerMax, dataLegend)
              "
              :color="getColor(marker.series, markerMin, markerMax)"
              :fillColor="getColor(marker.series, markerMin, markerMax)"
              @click="openInfo(marker)"
            >
              <l-tooltip :options="{ interactive: true, permanent: false }">
                <!--Math.round(marker.series)  -->
                <span class="tooltip-span"
                  >{{ marker.name }} {{ ie }} {{ marker.series.toFixed(1) + "%"}} 
                </span>
              </l-tooltip>
            </l-circle-marker>
            <!-- Legend -->
            <l-control position="topright">
              <div id="Legend" class="legend"></div>
            </l-control>

            <l-control position="bottomleft">
              <div class="info" v-if="isInfo">
                <h5>{{ this.infoTitle }}</h5>
                <CTabs v-if="infoData" variant="tabs" :active-tab="0">
                  <CTab title="Main">
                    <CDataTable :items="micro" :fields="mainFields" hover />
                  </CTab>
                  <CTab title="Import partners">
                    <CDataTable
                      :items="importDataItems"                  
                      :fields="importFields"
                      hover
                    />
                  </CTab>
                  <CTab title="Export partners">
                    <CDataTable
                      :items="exportDataItems"
                      :fields="exportFields"
                      hover
                    />
                  </CTab>
                  <CTab title="Import goods">
                    <CDataTable
                      :items="importGoods"
                      :fields="importGoodsFields"
                      hover
                    />
                  </CTab>
                  <CTab title="Export goods">
                    <CDataTable
                      :items="exportGoods"
                      :fields="exportGoodsFields"
                      hover
                    />
                  </CTab>
                </CTabs>
              </div>
            </l-control>

            <l-control position="topleft">
              <div class="leaflet-bar">
                <a
                  class="control-btn"
                  title="Info"
                  role="button"
                  @click="helpOn(true)"
                  >i</a
                >
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
            v-model="seriesPeriod"
            :data="timePeriod"
            :data-value="'id'"
            :data-label="'name'"
            @change="handleCounterChange"
          />
        </CCardFooter>
      </div>
    </div>
    <!-- Marker modal -->
    <CModal
      :title="$t('map.modal.main.title')"
      :show.sync="isModalHelp"
      size="lg"
    >
     <p v-html="$t('map.modal.main.body')"></p>
      <template #footer>
        <CButton color="outline-primary" square size="sm" @click="helpOn(false)"
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
  LGeoJson,
  LTileLayer,
  LControl,
  LTooltip,
  LCircleMarker
} from "vue2-leaflet";
import mapMixin from "@/components/mixins/map.mixin";
import mapInfoMixin from "@/components/mixins/mapInfo.mixin";
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
  mixins: [mapMixin, mapInfoMixin, sliderMixin],
  data: () => ({
    attribution:
      '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    center: [51.16423, 1.45412],
    zoom: 4,
    seriesPeriod: "202004",
    markerPeriodSeries: [],
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
          dashArray: "",
          fillOpacity: 0.7
        }
      }
    },
    btnFeatureMarker: "F",
    titleFeatureMarker: "Change view to Feature mode",
    isMarker: false,
    isFeature: false,
    seriesName: "exportseries",
    btnImportExport: "IMP",
    titleImportExport: "Load Import",
    isImport: false,
    isExport: false,
    ie: "Export",
    startTime: "2019",
    modalHelpTitle: " About on ",
    isModalHelp: false
  }),
  computed: {
    ...mapGetters("period", ["timePeriod"]),
    ...mapGetters("geomap", {
      markers: "geomap",
      infoData: "infoData",
      seriesData: "seriesData"
    }),
    ...mapGetters("countries", {
      geoJson: "countriesBorders",
      jsonData: "jsonData"
    }),
    micro() {
      return this.infoData ? this.infoData[0]["Main Import"] : [];
    },
    importDataItems() {
      return this.infoData ? this.infoData[0].ImpP : [];
    },
    exportDataItems() {
      return this.infoData ? this.infoData[0].ExpP : [];
    },
    importGoods() {
      return this.infoData ? this.infoData[0].ImpG : [];
    },
    exportGoods() {
      return this.infoData ? this.infoData[0].ExpG : [];
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
      return (feature, layer) => {
        var value = this.jsonData[feature.properties.iso_a2];
        this.selectedCountry.code = feature.properties.iso_a2;
        this.selectedCountry.name = feature.properties.admin;
        layer.options.fillColor = "#00000000";
        if (value != undefined) {          
          layer.options.fillColor = this.getColor(value, -60, 60);
          layer.options.color = "gray"; //this.getColor(value,-60,60);
          layer.bindTooltip(
            "<div>" +
              //feature.properties.iso_a2 +
              //"<br>" +
              feature.properties.admin +
              "<span> " +
              this.ie +
              "</span> " +
              value.toFixed(1) + "%" +
              "</span>" +
              " </div>",
            { permanent: false, sticky: true }
          );
          layer.on({
            mouseover: this.mouseover,
            mouseout: this.mouseout
          });
        }
      };
    }
  },
  methods: {
    helpOn(showModal) {
      this.isModalHelp = showModal;
      this.modalHelpTitle = "About map";
    },
    handleCounterChange(val) {
      this.seriesPeriod = val;
      this.buildPeriodSeries();
      this.buildFeatures();
    },
    getPeriodSeries(marker, seriesData, seriesPeriod) {
      const localSeries = seriesData.find(serie => {
        return serie.country == marker.country;
      });
      if (seriesPeriod > "202011") {
        return 0;
      } else {
        return localSeries ? localSeries[seriesPeriod] : 1;
      }
    },
    buildPeriodSeries() {
      this.markerPeriodSeries = this.markers.map(marker => {
        return {
          ...marker,
          series: this.getPeriodSeries(
            marker,
            this.seriesData,
            this.seriesPeriod
          )
        };
      });
      if (this.seriesPeriod < "202011") {
        this.dataLegend = this.getDataLegend(
          this.seriesData,
          this.seriesPeriod
        );
        this.markerMax = this.getMax(this.seriesData);
        this.markerMin = this.getMin(this.seriesData);
        this.setLegend(
          this.markerMin,
          this.markerMax,
          this.dataLegend,
          this.ie
        );
      }
    },
    buildFeatures() {
      this.$store
        .dispatch("countries/getDataSeries", this.seriesName)
        .then(seriesData => {
          this.$store.dispatch("countries/getCountriesBorders", {
            seriesData: seriesData,
            seriesPeriod: this.seriesPeriod
          });
        });
    },
    setShooter() {
      let pluginOptions = {
        hideElementsWithSelectors: []
      };

      new SimpleMapScreenshoter(pluginOptions).addTo(this.$refs.map.mapObject);
    },
    getDataLegend(seriesData, seriesPeriod) {
      var data = [];
      seriesData.forEach(obj => {
        for (const key in obj) {
          if (key == seriesPeriod) {
            //console.log(key);
            data.push(obj[key]);
          }
        }
      });
      return data;
    },
    getMax(seriesData) {
      var max = 1;
      seriesData.forEach(obj => {
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
    getMin(seriesData) {
      var min = -1;
      seriesData.forEach(obj => {
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
      if (this.btnImportExport == "IMP") {
        this.btnImportExport = "EXP";
        this.titleImportExport = "Load Export";
        this.seriesName = "importseries";
        this.ie = "Import";
      } else {
        this.btnImportExport = "IMP";
        this.titleImportExport = "Load Import";
        this.seriesName = "exportseries";
        this.ie = "Export";
      }
      this.getDataSeries(this.seriesName);
      this.isImport = !this.isImport;
      this.isExport = !this.isExport;
    },
    mouseover(e) {
      var layer = e.target;
      layer.setStyle({
        color: this.layer.style.over.color,
        dashArray: this.layer.style.over.dashArray
      });
    },
    mouseout(e) {
      var layer = e.target;
      layer.setStyle({
        color: this.layer.style.default.color,
        dashArray: this.layer.style.default.dashArray
      });
    },
    getDataSeries() {
      this.$store.dispatch("geomap/findAll").then(() => {
        this.$store.dispatch("geomap/getSeries", this.seriesName).then(() => {
          this.buildPeriodSeries();
          this.buildFeatures();
        });
      });
    }
  },
  created() {
    this.$store.dispatch("period/findByName", "map");
    this.$store.dispatch("coreui/setContext", Context.Map);
    this.getDataSeries("exportseries");
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
  font: 11px Arial, Helvetica, sans-serif;
  background: white;
  /*background: rgba(255,255,255,0.8);*/
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  width: 550px;
  height: 400px;
}
.info h5 {
  /*margin: 0 0 5px;*/
  text-align: center;
  text-shadow: 0 0 15px rgba(0, 0, 0, 0.2);

  color: #777;
}
.control-btn {
  font: bold 12px "Lucida Console", Monaco, monospace;
  text-indent: 1px;
}
</style>
