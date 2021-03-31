import { becService } from "@/services";

const state = {
  becChart: null,
  becCharts: null
};

const mutations = {
  SET_BEC_CHART(state, becChart) {
    state.becChart = becChart;
  },
  SET_BEC_CHARTS(state, becCharts) {
    state.becCharts = becCharts;
  }
};
const actions = {
  findByFilters({ commit }, form) {
    return becService
      .findByFilters(form)
      .then(data => {
        commit("SET_BEC_CHARTS", data);
      })
      .catch(err => {
        console.log(err);
      });
  },
  findByTime({ commit }, time) {
    return becService
      .findByTime(time)
      .then(data => {
        commit("SET_BEC_CHART", data);
      })
      .catch(err => {
        console.log(err);
      });
  }
};

const getters = {
  becChart: state => {
    return state.becChart;
  },
  becCharts: state => {
    return state.becCharts;
  }
};
export const bec = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
