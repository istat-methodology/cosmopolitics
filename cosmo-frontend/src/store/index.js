import Vue from "vue";
import Vuex from "vuex";

import { auth } from "./modules/auth";
import { error } from "./modules/error";
import { coreui } from "./modules/coreui";
import { message } from "./modules/message";
import { geomap } from "./modules/geomap/geomap";
import { graphVisjs } from "./modules/graphVisjs/graphVisjs";
import { chartjsBar } from "./modules/chartjsBar/chartjsBar";
import { chartjsScatter } from "./modules/chartjsScatter/chartjsScatter";
import { chartjsLine } from "./modules/chartjsLine/chartjsLine";
import { classification } from "./modules/classification/classification";
import { mobility } from "./modules/mobility/mobility";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    error,
    coreui,
    message,
    geomap,
    graphVisjs,
    chartjsBar,
    chartjsScatter,
    chartjsLine,
    classification,
    mobility
  }
});
