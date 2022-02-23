import {
  graphIntraService
} from "@/services";

const state = {
  graphintra: [],
};

const mutations = {
  SET_GRAPH_INTRA(state, graphintra) {
    state.graphintra = graphintra;
  },
};
const actions = {
  clear({
    commit
  }) {
    commit("SET_GRAPH_INTRA", null);
  },
  postGraphIntra({
    commit
  }, form) {
    return graphIntraService
      .postGraphIntra(form)
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
        commit("SET_GRAPH_INTRA", data);
      })
      .catch(err => {
        console.log(err);
      });
  }
};
const getters = {

  graph: state => {
    return state.graphintra;
  },
  status: state => {
    return state.graphintra ? state.graphintra.STATUS : "00";
    
  },
  nodes: state => {
    return state.graphintra ? state.graphintra.nodes : [];
  },
  edges: state => {
    return state.graphintra ? state.graphintra.edges : [];
  },
  metrics: state => {
    return state.graphintra ? state.graphintra.metriche : null;
  }
};
export const graphIntra = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};