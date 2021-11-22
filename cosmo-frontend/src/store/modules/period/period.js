import { periodService } from "@/services";
import { getSliderTime } from "@/common";
const state = {
  timePeriod: null,
  periodValue: ""
};
const mutations = {
  SET_TIME_PERIOD(state, timePeriod) {
    state.timePeriod = timePeriod;
  },
  SET_PERIOD_VALUE(state, periodValue) {
    state.periodValue = periodValue;
  },
};
const actions = {
  findByName({ commit }, filter) {
    return periodService
      .findByName(filter)
      .then(data => {
        commit("SET_TIME_PERIOD", getSliderTime(data[0].values.timeStart,data[0].values.timeEnd));
        commit("SET_PERIOD_VALUE", data[0].values.timeSelected);
      })
      .catch(err => {
        console.log(err);
      });
  }    
};
const getters = {
  timePeriod: state => {
    return state.timePeriod;
  },
  periodValue: state => {
    return state.periodValue;
  }
};
export const period = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
