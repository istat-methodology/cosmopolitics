<template>
  <div class="row">
    <div class="col-sm-12 col-md-12">
      <div class="card">
        <CCardBody>
          <l-map
            :zoom="zoom"
            :center="center"
            style="height: 550px; width: 100%"
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
              :radius="scale(Math.abs(marker.export) * 400)"
              :color="getColor(Math.round(marker.export))"
              :fillColor="getColor(Math.round(marker.export))"
              @click="openModal(marker)"
            >
              <l-tooltip :options="{ interactive: true, permanent: false }">
                <span class="tooltip-span">{{ marker.name }} </span>
              </l-tooltip>
            </l-circle-marker>

            <!-- Legend -->
            <l-control position="topright">
              <app-legend :legend="legend" />
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
              <CButton color="danger" shape="square" size="sm" @click="stop"
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

import MapLegend from "@/components/MapLegend";
import mapMixin from "@/components/mixins/map.mixin";
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
    "app-legend": MapLegend,
    VueSlider
  },
  mixins: [mapMixin, sliderMixin],
  data: () => ({
    center: [51.16423, 10.45412],
    zoom: 4,
    markerTimeSeries: [],
    markerModal: false,
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
      return localExp ? localExp[periodValue] : 100;
    },

    buildTimeSeries() {
      this.markerTimeSeries = this.markers.map(marker => {
        return {
          ...marker,
          export: this.getExport(marker, this.exportData, this.periodValue)
        };
      });
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
    }
  },
  created() {
    this.$store.dispatch("coreui/setContext", Context.Map);
    this.$store.dispatch("geomap/findAll").then(() => {
      this.$store.dispatch("geomap/getExportTimeSeries").then(() => {
        this.buildTimeSeries();
        this.buildLegend();
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
</style>
