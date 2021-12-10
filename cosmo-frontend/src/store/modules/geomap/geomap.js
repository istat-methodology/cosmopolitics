import { geomapService } from "@/services";

const state = {
  geomap: null,
  markerData: null,
  seriesData: null
};
const mutations = {
  SET_GEOMAP(state, geomap) {
    state.geomap = geomap;
  },
  SET_MARKER(state, markerData) {
    state.markerData = markerData;
  },
  SET_SERIES(state, seriesData) {
    state.seriesData = seriesData;
  }
};

const actions = {
  findAll({ commit }) {
    return geomapService
      .findAll()
      .then(data => {
        commit("SET_GEOMAP", data);
      })
      .catch(err => {
        console.log(err);
      });
  },
  getMarker({ commit }, name) {
    return geomapService
      .findByName(name)
      .then(data => {
        commit("SET_MARKER", data);
      })
      .catch(err => {
        console.log(err);
      });
  },
  getSeries({ commit },name) {
    return geomapService
      .getSeries(name)
      .then(data => {
        commit("SET_SERIES", data);
      })
      .catch(err => {
        console.log(err);
      });
  }
};

const getters = {
  geomap: state => {
    return state.geomap;
  },
  markerData: state => {
    return state.markerData;
  },
  seriesData: state => {
    return state.seriesData;
  }
};
export const geomap = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
