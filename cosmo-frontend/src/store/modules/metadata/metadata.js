import { metadataService } from "@/services"
import { getPeriod, getTrimesterPeriod } from "@/common"
const state = {
  metadata: null
}
const mutations = {
  SET_METADATA(state, metadata) {
    state.metadata = metadata
  }
}
const actions = {
  getMetadata({ commit }) {
    return metadataService
      .getMetadata()
      .then((data) => {
        commit("SET_METADATA", data)
      })
      .catch((err) => {
        console.log(err)
      })
  }
}
const getters = {
  mapPeriod: (state) => {
    return state.metadata
      ? getPeriod(state.metadata.map.timeStart, state.metadata.map.timeEnd)
      : null
  },
  graphPeriod: (state) => {
    return state.metadata
      ? getPeriod(state.metadata.graph.timeStart, state.metadata.graph.timeEnd)
      : null
  },
  graphTrimesterPeriod: (state) => {
    return state.metadata
      ? getTrimesterPeriod(
          state.metadata.graph.timeStart,
          state.metadata.graph.timeEnd
        )
      : null
  },
  tradePeriod: (state) => {
    return state.metadata
      ? getPeriod(state.metadata.trade.timeStart, state.metadata.trade.timeEnd)
      : null
  },
  processingDay: (state) => {
    return state.metadata ? state.metadata.processingDay : ""
  },
  lastLoadedData: (state) => {
    return state.metadata
      ? state.metadata.lastLoadedData.replace(", ", "-")
      : ""
  },
  appVersion: (state) => {
    return state.metadata ? state.metadata.appVersion : ""
  },
  mapSeries: (state) => {
    return state.metadata ? state.metadata.map.timeSelected : ""
  },
  graphSeries: (state) => {
    return state.metadata ? state.metadata.graph.timeSelected : ""
  },
  tradeSeries: (state) => {
    return state.metadata ? state.metadata.trade.timeSelected : ""
  }
}
export const metadata = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
