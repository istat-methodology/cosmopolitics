import Vue from "vue";
import Vuex from "vuex";

import { auth } from "./modules/auth";
import { error } from "./modules/error";
import { coreui } from "./modules/coreui";
import { message } from "./modules/message";
import { geomap } from "./modules/geomap/geomap";

import { graphIntra } from "./modules/graphintra/graphIntra";
import { graphExtra } from "./modules/graphextra/graphExtra";

import { trade } from "./modules/trade/trade";
import { classification } from "./modules/classification/classification";

import { timeseries } from "./modules/timeseries/timeseries";

import { countries } from "./modules/countries/countries";

// Time period
import { metadata } from "./modules/metadata/metadata";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    error,
    coreui,
    message,
    geomap,

    //new
    graphIntra,
    graphExtra,

    trade,
    classification,
    timeseries,

    countries,
    // time period
    metadata
  }
});
