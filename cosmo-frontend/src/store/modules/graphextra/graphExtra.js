import {
  graphExtraService
} from "@/services";
import {
  loadImage,
  getEdgeColor,
  getEdgeWidth
} from "@/common";

const state = {
  graphextra: [],
  status: ""
};
const mutations = {
  SET_GRAPH_EXTRA(state, graphextra) {
    state.graphextra = graphextra;
  },
  SET_GRAPH_EXTRA_STATUS(state, status) {
    state.status = status;
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
            node.image = loadImage(node.label);
            node.size = 15;
          });
          data.edges.forEach(edge => {
            edge.color = {
              color: "#b1b7c1",
              highlight: "#768192",
              hover: getEdgeColor(edge.weight, data.edges),
              inherit: "from",
              opacity: 1.0
            },
            edge.width = getEdgeWidth(edge.weight, data.edges);
          });
          commit("SET_GRAPH_EXTRA_STATUS", "00");
          commit("SET_GRAPH_EXTRA", data);
        } else {
          commit("SET_GRAPH_EXTRA_STATUS", data["STATUS"]);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
};
const getters = {
  graphextra: state => {
    return state.graphextra;
  },
  status: state => {
    return state.status;
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