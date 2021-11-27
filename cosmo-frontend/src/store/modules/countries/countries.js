import { countriesService } from "@/services";
import { getData } from "@/common";

const state = {
  jsondata:null,
  seriesdata: null,
  countries: null,
  countriesborders: null  
};
const mutations = {
  SET_COUNTRIES(state, countries) {
    state.countries = countries;
  },
  SET_JSON_DATA(state, jsondata) {
    state.jsondata = jsondata;
  },
  SET_SERIES_DATA(state, seriesdata) {
    state.seriesdata = seriesdata;
  },
  SET_COUNTRIES_BORDERS(state, countriesborders) {
    state.countriesborders = countriesborders;
  },
};
const actions = {
  getCountries({ commit }) {
    return countriesService
      .findAll("countries")
      .then(data => {
        commit("SET_COUNTRIES", data);
      })
      .catch(err => {
        console.log(err);
      });
  },
  getCountriesBorders({ commit }, seriesdata,) {
    return countriesService
      .findAll("countriesBorders")
      .then(data => {       
        commit("SET_JSON_DATA", getData(seriesdata));
        commit("SET_COUNTRIES_BORDERS", data);
      })
      .catch(err => {
        console.log(err);
      });
  },
  getDataSeries({ commit }) {
    return countriesService
      .getDataSeries()
      .then(data => {
        commit("SET_SERIES_DATA", data);
        return data;
      })
      .catch(err => {
        console.log(err);
      });
  },
};
const getters = {
  countries: state => {
    return state.countries;
  },
  jsondata: state => {
    return state.jsondata;
  },
  exportData: state => {
    return state.seriesdata;
  },
  countriesborders: state => {
    return state.countriesborders;
  }
};
export const countries = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
