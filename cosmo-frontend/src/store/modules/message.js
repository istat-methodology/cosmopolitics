const state = {
  type: null,
  message: null
};

const mutations = {
  SUCCESS(state, message) {
    state.type = "toast-success";
    state.message = Date.now() + "#" + message; //force message update
  },
  ERROR(state, message) {
    state.type = "toast-error";
    state.message = Date.now() + "#" + message; //force message update
  },
  CLEAR(state) {
    state.type = null;
    state.message = null;
  }
};

const actions = {
  success({ commit }, message) {
    commit("SUCCESS", message);
  },
  error({ commit }, message) {
    commit("ERROR", message);
  },
  clear({ commit }) {
    commit("CLEAR");
  }
};

const getters = {
  type: state => {
    return state.type;
  },
  message: state => {
    return state.message;
  }
};

export const message = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
