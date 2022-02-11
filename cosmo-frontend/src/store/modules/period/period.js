import { periodService } from "@/services";
import { getPeriod } from "@/common";
const state = {
  timePeriod: null,
  periodValue: "",
  metadata: {
    ProcessingDay: "09-02-2022, 13:52:50",
    annualCurrentYear: 2020,
    annualPreviousYear: 2019,
    lastData: "11, 2021",
    windowMonths: 36,
    monthsToExtract: 48,
    offsetMonthToExtract: 3
  }
};
const mutations = {
  SET_TIME_PERIOD(state, timePeriod) {
    state.timePeriod = timePeriod;
  },
  SET_PERIOD_VALUE(state, periodValue) {
    state.periodValue = periodValue;
  }
};
const actions = {
  findByName({ commit }, filter) {
    return periodService
      .findByName(filter)
      .then(data => {
        commit(
          "SET_TIME_PERIOD",
          getPeriod(data[0].values.timeStart, data[0].values.timeEnd)
        );
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
