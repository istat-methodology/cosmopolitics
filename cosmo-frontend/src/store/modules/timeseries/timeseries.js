import { timeseriesService } from "@/services";

const state = {
  timeseriesChart: null,
  timeseriesCharts: null,
  timeseriesDate: null
};

const mutations = {
  SET_TIMESERIES_CHART(state, timeseriesChart) {
    state.timeseriesChart = timeseriesChart;
  },
  SET_TIMESERIES_CHARTS(state, timeseriesCharts) {
    state.timeseriesCharts = timeseriesCharts;
  },
  SET_LAST_DATE(state, timeseriesDate) {
    state.timeseriesDate = timeseriesDate;
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
  },
  findLastDate({ commit }, form) {
    return timeseriesService
      .findLastDate(form)
      .then(data => {
        commit("SET_LAST_DATE", data);
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
  },
  timeseriesDate: state => {
    return state.timeseriesDate;
  }
};
export const timeseries = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
