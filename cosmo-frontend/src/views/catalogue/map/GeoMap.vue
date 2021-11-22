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
              :radius="getRadius(marker.export, markerMin, markerMax, dataLegend)"
              :color="getColor(marker.export, markerMin, markerMax, dataLegend)"
              :fillColor="getColor(marker.export, markerMin, markerMax, dataLegend)"
              @click="openModal(marker)"
            >
              <l-tooltip :options="{ interactive: true, permanent: false }">
                <span class="tooltip-span"
                  >{{ marker.name }} {{  marker.export }}
                </span>
              </l-tooltip>
            </l-circle-marker>
            <!-- Legend -->
            <l-control position="topright">
              <div id="Legend" class="legend"></div>
            </l-control>
          </l-map>
        </CCardBody>
        <CCardFooter>
          <vue-slider 
            v-if="timePeriod"
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
import mapMixin from "@/components/mixins/map.mixin";
import SimpleMapScreenshoter from "leaflet-simple-map-screenshoter";
import sliderMixin from "@/components/mixins/slider.mixin";
import VueSlider from "vue-slider-component";
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
    periodValue: "201912",
    center: [51.16423, 10.45412],
    zoom: 4,
    markerTimeSeries: [],
    markerModal: false,
    markerMax: 1,
    markerMin: -1,
    dataLegend: [], 
    markerColors: [],
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
    ...mapGetters(
      "geomap", {
      markers: "geomap",
      markerData: "markerData",
      exportData: "exportData"
      }), 
    ...mapGetters("period", ["timePeriod"]),    
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
      const localExp = exportData.find(exp => { return exp.country == marker.country; });
      if ( periodValue > "202011") { 
            return 0 
      } else { 
            return localExp ? localExp[periodValue] : 1
      }
    },
    buildTimeSeries() {            
      this.markerTimeSeries = this.markers.map(marker => {
        return {
          ...marker,
          export: this.getExport(marker, this.exportData, this.periodValue)
        };
      });
      if ( this.periodValue < "202011") { 
        this.dataLegend = this.getDataLegend(this.exportData, this.periodValue);
        this.markerMax = this.getMax(this.exportData);
        this.markerMin = this.getMin(this.exportData);
        this.setLegend(this.markerMin, this.markerMax, this.dataLegend);
      }
    },
    setShooter() {
      new SimpleMapScreenshoter().addTo(this.$refs.map.mapObject);
    },
    
    getDataLegend(exportData, periodValue) {
      var data = [];
      exportData.forEach(obj => {
        for (const key in obj) {
          if (key == periodValue) {
            //console.log(key);
            data.push(obj[key]);
          }
        }
      });
      //console.log(" getdatalegend: period  =>" + periodValue);
      //console.log(" getdatalegend data: =>" + data);
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
  },
  created() {
    this.$store.dispatch("period/findByName", "map");
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

</style>