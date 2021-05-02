import { policyIndicatorService } from "@/services";

const state = {
  policyIndicators: null,
  policyIndicator: null,
  policyIndicatorCharts: null
};
const mutations = {
  SET_POLICY_INDICATORS(state, policyIndicators) {
    state.policyIndicators = policyIndicators;
  },
  SET_POLICY_INDICATOR(state, policyIndicator) {
    state.policyIndicator = policyIndicator;
  },
  SET_POLICY_INDICATOR_CHARTS(state, policyIndicatorCharts) {
    state.policyIndicatorCharts = policyIndicatorCharts;
  }
};
const actions = {  
  
  findByName({ commit }, filter) {
    return policyIndicatorService
      .findByName(filter)
      .then(data => {
        commit("SET_POLICY_INDICATORS", data);
      })
      .catch(err => {
        console.log(err);
      });
  },
  chartsByName({ commit }, filter) {
    return policyIndicatorService
      .chartsByName(filter)
      .then(data => {
        //data = data.DPM_Index;
        commit("SET_POLICY_INDICATOR_CHARTS", data);
      })
      .catch(err => {
        console.log(err);
      });
  },
  reset({ commit }) {
    commit("SET_POLICY_INDICATORS", null);
    commit("SET_POLICY_INDICATOR_CHARTS", null);
  }
};

const getters = {
  policyIndicators: state => {
    return state.policyIndicators;
  },
  policyIndicator: state => {
    return state.policyIndicator;
  },
  policyIndicatorCharts: state => {
    return state.policyIndicatorCharts;
  }
};
export const policyIndicator = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
