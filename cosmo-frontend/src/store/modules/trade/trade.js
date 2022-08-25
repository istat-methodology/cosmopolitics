import { tradeService } from "@/services"

const state = {
  charts: null,
  chart: null
}
const mutations = {
  SET_LINE_CHARTS(state, charts) {
    state.charts = charts
  },
  SET_LINE_CHART(state, chart) {
    state.chart = chart
  }
}
const actions = {
  findAll({ commit }) {
    return tradeService
      .findAll()
      .then((data) => {
        commit("SET_LINE_CHARTS", data)
      })
      .catch((err) => {
        console.log(err)
      })
  },
  findByName({ commit }, filter) {
    return tradeService
      .findByName(filter)
      .then((data) => {
        commit("SET_LINE_CHARTS", data)
      })
      .catch((err) => {
        console.log(err)
      })
  }
}

const getters = {
  charts: (state) => {
    return state.charts ? state.charts : null
  },
  chart: (state) => {
    return state.chart ? state.chart : null
  },
  products: (state) => {
    let products = []
    if (state.charts !== null) {
      state.charts.data.forEach((element, index) => {
        products.push({
          id: index.toString(),
          dataname: element.dataname,
          displayName: element.productID + " - " + element.dataname
        })
      })
      products.push({
        id: "00",
        dataname: "All products",
        displayName: "00 - All products"
      })
    }
    return products ? products : null
  }
}
export const trade = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
