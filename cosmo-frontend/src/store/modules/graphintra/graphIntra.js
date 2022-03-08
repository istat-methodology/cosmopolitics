import { graphIntraService } from "@/services";
import { loadImage, getEdgeColor } from "@/common";


const state = {
  graphintra: [],
  status: ""
};
const mutations = {
  SET_GRAPH_INTRA(state, graphintra) {
    state.graphintra = graphintra;
  },
  SET_GRAPH_INTRA_STATUS(state, status) {
    state.status = status;
  }
};
const actions = {
  clear({ commit }) {
    commit("SET_GRAPH_INTRA", null);
  },
  postGraphIntra({ commit }, params) {

    return graphIntraService
      .postGraphIntra(params)
      .then(data => {
        if (data["STATUS"] == undefined) {
          data.nodes.forEach(node => {
            node.x = node.x * 314;
            node.y = node.y * 314;
            node.shape = "image";
            node.image = loadImage(node.label);
            node.size = 15;
          });
          
          data.edges.forEach(edge => {
            edge.color = getEdgeColor(edge.weight, data.edges, 9000, -9000);
          });
          
          commit("SET_GRAPH_INTRA_STATUS", "00");
          commit("SET_GRAPH_INTRA", data);
        } else {
          commit("SET_GRAPH_INTRA_STATUS", data["STATUS"]);
        }
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
    return state.status;
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
