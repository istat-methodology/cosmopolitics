import Vue from "vue";

//Vue core
import App from "./App.vue";
import router from "@/router";
import store from "@/store";

//Vue global plugins
import Vuelidate from "vuelidate";
import vSelect from "vue-select";
import VueCytoscape from "vue-cytoscape";

//CoreUI components
import "@/coreui";

import VueSpinners from "vue-spinners";

//Icons
import { iconsSet as icons } from "@/assets/icons/coreui.js";
import "@/assets/icons/material";
import { Icon } from "leaflet";

Vue.use(VueSpinners);

//Leaflet - icon (bug fixing)
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

Vue.config.productionTip = false;

Vue.use(Vuelidate);
Vue.component("v-select", vSelect);
Vue.use(VueCytoscape);

new Vue({
  router,
  store,
  icons,
  render: h => h(App)
}).$mount("#app");
