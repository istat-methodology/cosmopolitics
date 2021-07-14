import { policyIndicatorService } from "@/services";
const state = {
  policyIndicators: null,
  policyIndicator: null
};
const mutations = {
  SET_POLICY_INDICATORS(state, policyIndicators) {
    state.policyIndicators = policyIndicators;
  },
  SET_POLICY_INDICATOR(state, policyIndicator) {
    state.policyIndicator = policyIndicator;
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
  reset({ commit }) {
    commit("SET_POLICY_INDICATORS", null);
    commit("SET_POLICY_INDICATOR", null);
  }
};

const getters = {
  policyIndicators: state => {
    return state.policyIndicators;
  },
  policyIndicator: state => {
    return state.policyIndicator;
  }
};
export const policyIndicator = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
