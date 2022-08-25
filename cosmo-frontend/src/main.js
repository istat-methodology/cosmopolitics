import Vue from "vue"
import VueAppInsights from "vue-application-insights"
import AppInsightsInstrumentationKey from "./appinsights-config.js"
//Vue core
import App from "./App.vue"
import router from "@/router"
import store from "@/store"
//Vue global plugins
import Vuelidate from "vuelidate"
import vSelect from "vue-select"
//CoreUI components
import "@/coreui"
import VueSpinners from "vue-spinners"
//Icons
import { iconsSet as icons } from "@/assets/icons/coreui.js"
import "@/assets/icons/material"
import { Icon } from "leaflet"
// i18n
import VueI18n from "vue-i18n"
import { languages, defaultLocale } from "@/i18n/index.js"

const messages = Object.assign(languages)

Vue.use(VueI18n)
Vue.use(VueAppInsights, {
  id: AppInsightsInstrumentationKey,
  router,
  appInsightsConfig: {
    enableCorsCorrelation: true,
    enableRequestHeaderTracking: true,
    enableResponseHeaderTracking: true
  }
})

const i18n = new VueI18n({
  locale: defaultLocale,
  messages
})

Vue.use(VueSpinners)
//Leaflet - icon (bug fixing)
delete Icon.Default.prototype._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
})
Vue.config.productionTip = false
Vue.use(Vuelidate)
Vue.component("v-select", vSelect)
new Vue({ router, store, icons, i18n, render: (h) => h(App) }).$mount("#app")
