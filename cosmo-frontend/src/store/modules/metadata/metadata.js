import {
  metadataService
} from "@/services";
import {
  getPeriod
} from "@/common";
const state = {
  metadata: null,
};
const mutations = {
  SET_METADATA(state, metadata) {
    state.metadata = metadata;
  }
};
const actions = {
  getMetadata({
    commit
  }) {
    return metadataService
      .getMetadata()
      .then(data => {
        commit("SET_METADATA", data);        
      })
      .catch(err => {
        console.log(err);
      });
  }
};
const getters = {
  timePeriodMap: state => {
    return getPeriod(state.metadata[0]["map"]["timeStart"], state.metadata[0]["map"]["timeEnd"]);    
  },
  seriesPeriodMap: state => {
    return state.metadata[0]["map"]["timeSelected"];
  }
};
export const metadata = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};