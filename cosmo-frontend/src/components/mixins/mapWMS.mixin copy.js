/*
<script>
  <template>
    <l-map>
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
      <l-control position="bottomleft">
        <button @click="setWMSLayer()">WMS</button>
        <button @click="resetLayer()">reset layer</button>
      </l-control>
    </l-map>
  </template>
</script>
import {
  LWMSTileLayer
} from "vue2-leaflet";

import axios from "axios";
import WMSCapabilities from 'wms-capabilities';
components: {
    "l-wms-tile-layer" : LWMSTileLayer,
},
export default {
    data: () => ({

      wmsLayer : {
        url: '',
        name: '',
        visible: true,
        format: 'image/png',
        layers: '',
        transparent: true,
        attribution: '',
      },
    }),
    methods: {
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
};
*/
