import Vue from "vue";
import Vuex from "vuex";

import { auth } from "./modules/auth";
import { error } from "./modules/error";
import { coreui } from "./modules/coreui";
import { message } from "./modules/message";
import { geomap } from "./modules/geomap/geomap";
import { graphVisjs } from "./modules/graphVisjs/graphVisjs";
//import { chartjsBar } from "./modules/chartjsBar/chartjsBar";
//import { chartjsScatter } from "./modules/chartjsScatter/chartjsScatter";
import { trade } from "./modules/trade/trade";
import { classification } from "./modules/classification/classification";
import { mobility } from "./modules/mobility/mobility";
import { policyIndicator } from "./modules/policyIndicator/policyIndicator";
import { bec } from "./modules/bec/bec";
// time period
import { period } from "./modules/period/period";
import { countries } from "./modules/countries/countries";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    error,
    coreui,
    message,
    geomap,
    graphVisjs,
    //chartjsBar,
    //chartjsScatter,
    trade,
    classification,
    mobility,
    policyIndicator,
    bec,
    //
    period,
    countries
  }
});
