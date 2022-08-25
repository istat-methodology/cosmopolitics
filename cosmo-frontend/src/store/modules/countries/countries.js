import { countriesService } from "@/services"
import { getData } from "@/common"

const state = {
  jsonData: null,
  seriesData: null,
  countries: null,
  countriesBorders: null
}
const mutations = {
  SET_COUNTRIES(state, countries) {
    state.countries = countries
  },
  SET_JSON_DATA(state, jsonData) {
    state.jsonData = jsonData
  },
  SET_SERIES_DATA(state, seriesData) {
    state.seriesData = seriesData
  },
  SET_COUNTRIES_BORDERS(state, countriesBorders) {
    state.countriesBorders = countriesBorders
  }
}
const actions = {
  getCountries({ commit }) {
    return countriesService
      .findAll("countries")
      .then((data) => {
        commit("SET_COUNTRIES", data)
      })
      .catch((err) => {
        console.log(err)
      })
  },
  getCountriesBorders({ commit }, seriesData) {
    return countriesService
      .findAll("countriesBorders")
      .then((data) => {
        commit("SET_JSON_DATA", getData(seriesData))
        commit("SET_COUNTRIES_BORDERS", data)
      })
      .catch((err) => {
        console.log(err)
      })
  },
  getDataSeries({ commit }, name) {
    return countriesService
      .getDataSeries(name)
      .then((data) => {
        commit("SET_SERIES_DATA", data)
        return data
      })
      .catch((err) => {
        console.log(err)
      })
  }
}
const getters = {
  countries: (state) => {
    return state.countries
  },
  jsonData: (state) => {
    return state.jsonData
  },
  exportData: (state) => {
    return state.seriesData
  },
  countriesBorders: (state) => {
    return state.countriesBorders
  }
}
export const countries = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
