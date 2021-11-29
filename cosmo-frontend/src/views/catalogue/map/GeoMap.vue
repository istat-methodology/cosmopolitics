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
            @ready="setShooter()"          >
            <l-tile-layer :url="url" :attribution="attribution" />
            <l-geo-json v-if="geojson"
            :visible="isFeature"
            :geojson="geojson" 
            :options="options"
            :options-style="styleFunction" 
            ></l-geo-json>
            <l-wms-tile-layer
              :key="wmsLayer.name"
              :base-url="wmsLayer.url"
              :layers="wmsLayer.layers"
              :visible="wmsLayer.visible"
              :name="wmsLayer.name"
              :attribution="wmsLayer.attribution"
              :transparent="true"
              format="image/png"
              layer-type="base">
            </l-wms-tile-layer>
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
              :radius="getRadius(marker.export, markerMin, markerMax, dataLegend)"
              :color="getColor(marker.export, markerMin, markerMax)"
              :fillColor="getColor(marker.export, markerMin, markerMax)"
              @click="openModal(marker)"
            >
              <l-tooltip :options="{ interactive: true, permanent: false }">
                <span class="tooltip-span"
                  >{{ marker.name }} {{  Math.round(marker.export) }}
                </span>
              </l-tooltip>
            </l-circle-marker>
            <!-- Legend -->
            <l-control position="topright">
              <div id="Legend" class="legend"></div>
            </l-control>
            <l-control position="bottomleft">
              <button @click="setFeatureMarker()">{{this.btnFeatureMarker}}</button>
              <!--button @click="setWMSLayer()">WMS</button>
              <button @click="resetLayer()">reset layer</button-->
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
  LGeoJson,
  LTileLayer,
  LWMSTileLayer,
  LControl,
  LTooltip,
  LCircleMarker
} from "vue2-leaflet";
import mapMixin from "@/components/mixins/map.mixin";
import SimpleMapScreenshoter from "leaflet-simple-map-screenshoter";
import sliderMixin from "@/components/mixins/slider.mixin";
import VueSlider from "vue-slider-component";
import axios from "axios";
import WMSCapabilities from 'wms-capabilities';
export default {
  name: "GeoMap",
  components: {
    LMap,
    LTileLayer,
    "l-wms-tile-layer" : LWMSTileLayer,
    "l-geo-json": LGeoJson,
    LControl,
    LCircleMarker,
    LTooltip,
    VueSlider
  },
  mixins: [mapMixin, sliderMixin],
  data: () => ({
    seriesperiod: "202004",
    center: [51.16423, 10.45412],
    zoom: 4,
    markerTimeSeries: [],
    bordersTimeSeries: [],
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
    disablePlay: false,
    wmsLayer : {
        url: '',
        name: '',
        visible: true,
        format: 'image/png',
        layers: '',
        transparent: true,
        attribution: '',
    },       
    geojsoncolor: null,       
    currentStrokeWidth: 0.5,
    currentStrokeColor: "gray",
    btnFeatureMarker:"Feature",
    isMarker:false,
    isFeature:false,
  }),
  computed: {
    ...mapGetters(
      "geomap", {
      markers: "geomap",
      markerData: "markerData",
      exportData: "exportData"
      }), 
    ...mapGetters("period", ["timePeriod"]),
    ...mapGetters("countries", {
        geojson : "countriesborders",
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
        weight: 1,
        opacity: 1,
        color: 'gray',
        dashArray: '',
        fillOpacity: 0.7
        };
      };
    },
    onEachFeatureFunction() {
      if (!this.enableTooltip) {
        return () => {};
      }
      return (feature, layer) => {        
        var value = this.jsondata[feature.properties.iso_a2];
        if (value != undefined){
          value = Math.round(value);
          layer.options.fillColor = this.getColor(value,-60,60);
          layer.options.color = "gray"; //this.getColor(value,-60,60);    
          layer.bindTooltip("<div>" 
          + feature.properties.iso_a2 + "<br>" 
          + feature.properties.admin +  "<br>" 
          + feature.properties.continent +  "<br>"
          + "export:" + value +  "<br>"
          + " </div>" , { permanent: false, sticky: true }        
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
    mouseover(e) {
        var layer = e.target;
        layer.setStyle({        
            color: 'black',
            dashArray: '2'
        });
    },
    mouseout(e) {
        var layer = e.target;
        layer.setStyle({
            color: 'gray',
            dashArray: ''   
        });
        this.currentItem = { name: "", value: 0 };
    },
    zoomToFeature(e) {
      LMap.fitBounds(e.target.getBounds());
    },
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
      this.seriesperiod = val;
      this.buildTimeSeries();    
      this.$store.dispatch("countries/getDataSeries").then((seriesdata) => {
        this.$store.dispatch("countries/getCountriesBorders",{seriesData:seriesdata, seriesPeriod:this.seriesperiod});
      });
    },
    getExport(marker, exportData, seriesperiod) {
      const localExp = exportData.find(exp => { return exp.country == marker.country; });
      if ( seriesperiod > "202011") { 
            return 0 
      } else { 
            return localExp ? localExp[seriesperiod] : 1
      }
    },
    buildTimeSeries() {            
      this.markerTimeSeries = this.markers.map(marker => {
        return { ...marker, export: this.getExport(marker, this.exportData, this.seriesperiod)};
      });
      if ( this.seriesperiod < "202011") { 
        this.dataLegend = this.getDataLegend(this.exportData, this.seriesperiod);
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
    setFeatureMarker(){
      if (this.btnFeatureMarker=="Feature"){
        this.btnFeatureMarker="Marker";
      }else{
        this.btnFeatureMarker="Feature";
      }
      this.isFeature= !this.isFeature;
      this.isMarker= !this.isMarker;
    },
    setWMSLayer(){
      this.wmsLayer = {
        url: 'https://ahocevar.com/geoserver/wms',
        visible: true,
        format: 'image/png',
        name:'ne:ne',
        layers:'ne:ne',
        transparent: true
      }          
      var wmsUrl = "https://ahocevar.com/geoserver/wms?service=wms&version=1.1.1&request=GetCapabilities"; 
      axios.get(wmsUrl).then((res) => {
        // For convert the xml to JSON
        const json = new WMSCapabilities(res.data).toJSON();
        // GetCapabilities provides all the layers so we need to filter the required one.      
        //const workspace="";
        const layer_name="opengeo:countries";
        const layers = json?.Capability?.Layer?.Layer;
        const layer = layers?.filter((l) => l.Name === `${layer_name}` )[0];
        // To get the bounding box of the layer
        const bbox = layer?.LatLonBoundingBox;
        // Use this bounding box to zoom to the layer,
        var fitBounds=[];
        fitBounds.push([ [bbox[1], bbox[0]],  [bbox[3], bbox[2]], ]);
        console.log(fitBounds);
      });  
    },
    resetLayer(){
      this.wmsLayer = {
        url: '',
        name: '',
        visible: false,
        format: 'image/png',
        layers: '',
        transparent: true,
        attribution: '',
      }         
    }
  },
  created() {    
    this.$store.dispatch("period/findByName", "map");
    this.$store.dispatch("coreui/setContext", Context.Map);
    this.$store.dispatch("geomap/findAll").then(() => {
        this.$store.dispatch("geomap/getExportTimeSeries").then(() => {        
            this.buildTimeSeries();
            this.$store.dispatch("countries/getDataSeries").then((seriesdata) => {
            this.$store.dispatch("countries/getCountriesBorders",{seriesData:seriesdata, seriesPeriod:this.seriesperiod});
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

</style>