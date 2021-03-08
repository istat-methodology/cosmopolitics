import { chartjsScatterService } from "@/services";
import { buildCharts, getBecChart } from "@/common";

const state = {
  charts: null,
  scatterCharts: null
};

const mutations = {
  SET_CHARTS(state, charts) {
    state.charts = charts;
  },
  SET_SCATTER_CHARTS(state, scatterCharts) {
    state.scatterCharts = scatterCharts;
  }
};
const actions = {
  findByFilters({ commit }, form) {
    return chartjsScatterService
      .findByFilters(form)
      .then(data => {
        var localData = buildCharts(data);
        commit("SET_CHARTS", localData);
        commit("SET_SCATTER_CHARTS", getBecChart(localData, "T1"));
      })
      .catch(err => {
        console.log(err);
      });
  },
  findByTime({ commit }, time){
    var scatterCharts = getBecChart(this.state.chartjsScatter.charts, time);
    commit("SET_SCATTER_CHARTS", scatterCharts);
  }
};

const getters = {
  charts: state => {
    return state.charts;
  },
  scatterCharts: state => {
    return state.scatterCharts;
  }
};
export const chartjsScatter = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
