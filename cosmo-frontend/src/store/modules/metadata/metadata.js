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
  mapPeriod: state => {
    return getPeriod(state.metadata.map.timeStart, state.metadata.map.timeEnd);
  },
  graphPeriod: state => {
    return getPeriod(state.metadata.graph.timeStart, state.metadata.graph.timeEnd);
  },
  tradePeriod: state => {
    return getPeriod(state.metadata.trade.timeStart, state.metadata.trade.timeEnd);
  },

  mapSeries: state => {
    return state.metadata.map.timeSelected;
  },
  graphSeries: state => {
    return state.metadata.graph.timeSelected;
  },
  tradeSeries: state => {
    return state.metadata.trade.timeSelected;
  }
  
};
export const metadata = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};