import {
  graphExtraService
} from "@/services";

const state = {
  graphextra: []
};
const mutations = {
  SET_GRAPH_EXTRA(state, graphextra) {
    state.graphextra = graphextra;
  }
};
const actions = {
  clear({
    commit
  }) {
    commit("SET_GRAPH_EXTRA", null);
  },
  postGraphExtra({
    commit
  }, form) {
    return graphExtraService
      .postGraphExtra(form)
      .then(data => {
        if (data["STATUS"] == undefined) {
          data.nodes.forEach(node => {
            node.x = node.x * 314;
            node.y = node.y * 314;
            node.shape = "image";
            node.image = require("@/assets/flags/w40/" +
              node.label.toLowerCase() +
              ".png");
            node.size = 15;
          });
        }
        commit("SET_GRAPH_EXTRA", data);
      })
      .catch(err => {
        console.log(err);
      });
  },

};
const getters = {  
  graphextra: state => {
    return state.graphextra;
  },
  status: state => {
    return state.graphextra ? state.graphextra.STATUS : "00";

  },
  nodes: state => {
    return state.graphextra ? state.graphextra.nodes : [];
  },
  edges: state => {
    return state.graphextra ? state.graphextra.edges : [];
  },
  metrics: state => {
    return state.graphextra ? state.graphextra.metriche : null;
  }
};

export const graphExtra = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};