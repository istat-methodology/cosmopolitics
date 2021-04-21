import { becService } from "@/services";

const state = {
  becChart: null,
  becCharts: null,
  becDate:null
};

const mutations = {
  SET_BEC_CHART(state, becChart) {
    state.becChart = becChart;
  },
  SET_BEC_CHARTS(state, becCharts) {
    state.becCharts = becCharts;
  },
  SET_LAST_DATE(state, becDate) {
    state.becDate = becDate;
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
  findLastDate({ commit }, form) {
    return becService
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
  becChart: state => {
    return state.becChart;
  },
  becCharts: state => {
    return state.becCharts;
  },
  becDate: state => {
    return state.becDate;
  }

};
export const bec = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
