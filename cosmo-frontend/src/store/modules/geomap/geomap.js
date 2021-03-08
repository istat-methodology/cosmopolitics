import { geomapService } from "@/services";

const state = {
  geomap: null,
  markerData: null,
  exportData: null,
  importData: null
};

const mutations = {
  SET_GEOMAP(state, geomap) {
    state.geomap = geomap;
  },
  SET_MARKER(state, markerData) {
    state.markerData = markerData;
  },
  SET_EXPORT(state, exportData) {
    state.exportData = exportData;
  },
  SET_IMPORT(state, importData) {
    state.importData = importData;
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
  getExportTimeSeries({ commit }) {
    return geomapService
      .getExportTimeSeries()
      .then(data => {
        commit("SET_EXPORT", data);
      })
      .catch(err => {
        console.log(err);
      });
  },
  getImportTimeSeries({ commit }) {
    return geomapService
      .getImportTimeSeries()
      .then(data => {
        commit("SET_IMPORT", data);
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
  exportData: state => {
    return state.exportData;
  },
  importData: state => {
    return state.importData;
  }
};
export const geomap = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
