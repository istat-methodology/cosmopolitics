import { timeseriesService } from "@/services"
import { isArrayNull } from "@/common"
const state = {
  timeseriesChart: null,
  timeseriesCharts: null,
  statusMain: "",
  statusACF: "",
  statusNorm: ""
}
const mutations = {
  SET_TIMESERIES_CHART(state, timeseriesChart) {
    state.timeseriesChart = timeseriesChart
  },
  SET_TIMESERIES_CHARTS(state, timeseriesCharts) {
    state.timeseriesCharts = timeseriesCharts
  },
  SET_TIMESERIES_STATUS_MAIN(state, statusMain) {
    state.statusMain = statusMain
  },
  SET_TIMESERIES_STATUS_ACF(state, statusACF) {
    state.statusACF = statusACF
  },
  SET_TIMESERIES_STATUS_NORM(state, statusNorm) {
    state.statusNorm = statusNorm
  }
}
const actions = {
  findByFilters({ commit }, form) {
    return timeseriesService
      .findByFilters(form)
      .then((data) => {
        commit("SET_TIMESERIES_STATUS_ACF", data["statusACF"])
        commit("SET_TIMESERIES_STATUS_NORM", data["statusNorm"])
        var statusMain =
          isArrayNull(data["diagMain"]["series"]) == false
            ? data["statusMain"]
            : "00"
        commit("SET_TIMESERIES_STATUS_MAIN", statusMain)
        if (statusMain == "01") {
          commit("SET_TIMESERIES_CHARTS", data)
        } else {
          commit("SET_TIMESERIES_CHARTS", null)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
}
const getters = {
  statusMain: (state) => {
    return state.statusMain
  },
  statusACF: (state) => {
    return state.statusACF
  },
  statusNorm: (state) => {
    return state.statusNorm
  },
  timeseriesChart: (state) => {
    return state.timeseriesChart ? state.timeseriesChart : null
  },
  timeseriesCharts: (state) => {
    return state.timeseriesCharts ? state.timeseriesCharts : null
  }
}
export const timeseries = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
