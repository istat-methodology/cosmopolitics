const state = {
  type: null,
  message: null
}

const mutations = {
  SUCCESS(state, message) {
    state.type = "toast-success"
    state.message = Date.now() + "#" + message //force message update
  },
  INFO(state, message) {
    state.type = "toast-info"
    state.message = Date.now() + "#" + message //force message update
  },
  WARNING(state, message) {
    state.type = "toast-warning"
    state.message = Date.now() + "#" + message //force message update
  },
  ERROR(state, message) {
    state.type = "toast-error"
    state.message = Date.now() + "#" + message //force message update
  },
  CLEAR(state) {
    state.type = null
    state.message = null
  }
}

const actions = {
  success({ commit }, message) {
    commit("SUCCESS", message)
  },
  info({ commit }, message) {
    commit("INFO", message)
  },
  warning({ commit }, message) {
    commit("WARNING", message)
  },
  error({ commit }, message) {
    commit("ERROR", message)
  },
  clear({ commit }) {
    commit("CLEAR")
  }
}

const getters = {
  type: (state) => {
    return state.type
  },
  message: (state) => {
    return state.message
  }
}

export const message = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
