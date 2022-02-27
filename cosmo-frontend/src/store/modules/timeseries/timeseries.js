import { timeseriesService } from "@/services";
const state = {
  timeseriesChart: [],
  timeseriesCharts: []
};
const mutations = {
  SET_TIMESERIES_CHART(state, timeseriesChart) {
    state.timeseriesChart = timeseriesChart;
  },
  SET_TIMESERIES_CHARTS(state, timeseriesCharts) {
    state.timeseriesCharts = timeseriesCharts;
  }
};
const actions = {
  findByFilters({ commit }, form) {
    return timeseriesService
      .findByFilters(form)
      .then(data => {
        commit("SET_TIMESERIES_CHARTS", data);
      })
      .catch(err => {
        console.log(err);
      });
  }
};
const getters = {
  timeseriesChart: state => {
    return state.timeseriesChart;
  },
  timeseriesCharts: state => {
    return state.timeseriesCharts;
  }
};
export const timeseries = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
