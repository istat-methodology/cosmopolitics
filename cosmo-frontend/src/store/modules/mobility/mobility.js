import { mobilityService } from "@/services";

const state = {
  mobilities: [],
  mobility: null,
  mobilityCharts: null
};
const mutations = {
  SET_MOBILITIES(state, mobilities) {
    state.mobilities = mobilities;
  },
  SET_MOBIITY(state, mobility) {
    state.mobility = mobility;
  },
  SET_MOBILITY_CHARTS(state, mobilityCharts) {
    state.mobilityCharts = mobilityCharts;
  }
};
const actions = {
  findAll({ commit }) {
    return mobilityService
      .findAll()
      .then(data => {
        commit("SET_MOBILITIES", data);
      })
      .catch(err => {
        console.log(err);
      });
  },
  findByName({ commit }, filter) {
    return mobilityService
      .findByName(filter)
      .then(data => {
        commit("SET_MOBILITIES", data);
      })
      .catch(err => {
        console.log(err);
      });
  },
  chartsByName({ commit }, filter) {
    return mobilityService
      .chartsByName(filter)
      .then(data => {
        commit("SET_MOBILITY_CHARTS", data);
      })
      .catch(err => {
        console.log(err);
      });
  }
};

const getters = {
  mobilities: state => {
    return state.mobilities;
  },
  mobility: state => {
    return state.mobility;
  },
  mobilityCharts: state => {
    return state.mobilityCharts;
  }
};
export const mobility = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
