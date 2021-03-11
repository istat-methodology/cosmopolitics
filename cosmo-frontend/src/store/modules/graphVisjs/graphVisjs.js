import { graphVisjsService } from "@/services";

const state = {
  graphs: [],
  graph: null
};
const mutations = {
  SET_GRAPHS(state, graphs) {
    state.graphs = graphs;
  },
  SET_GRAPH(state, graph) {
    state.graph = graph;
  }
};
const actions = {
  findAll({ commit }, n) {
    return graphVisjsService
      .findAll(n)
      .then(data => {
        commit("SET_GRAPHS", data);
      })
      .catch(err => {
        console.log(err);
      });
  },
  findById({ commit }, id) {
    return graphVisjsService
      .findById(id)
      .then(data => {
        data.graph.nodes.forEach(node => {
          node.x = node.x * 314;
          node.y = node.y * 314;
          node.shape = "image";
          node.image =
            "https://flagpedia.net/data/flags/mini/" +
            node.label.toLowerCase() +
            ".png";
          node.size = 15;
        });
        commit("SET_GRAPH", data);
      })
      .catch(err => {
        console.log(err);
      });
  },
  postGraph({ commit }, form) {
    return graphVisjsService
      .postGraph(form)
      .then(data => {
        data.nodes.forEach(node => {
          node.x = node.x * 314;
          node.y = node.y * 314;
          node.shape = "image";
          node.image =
            "https://flagpedia.net/data/flags/mini/" +
            node.label.toLowerCase() +
            ".png";
          node.size = 15;
        });
        commit("SET_GRAPH", data);
      })
      .catch(err => {
        console.log(err);
      });
  },
  postGraphPlus({ commit }, form) {
    return graphVisjsService
      .postGraphPlus(form)
      .then(data => {
        data.nodes.forEach(node => {
          node.x = node.x * 314;
          node.y = node.y * 314;
          node.shape = "image";
          node.image =
            "https://flagpedia.net/data/flags/mini/" +
            node.label.toLowerCase() +
            ".png";
          node.size = 15;
        });
        commit("SET_GRAPH", data);
      })
      .catch(err => {
        console.log(err);
      });
  },
  clear({ commit }) {
    commit("SET_GRAPH", null);
  }
};
const getters = {
  graphs: state => {
    return state.graphs;
  },
  graph: state => {
    return state.graph;
  },
  nodes: state => {
    return state.graph ? state.graph.nodes : [];
  },
  edges: state => {
    return state.graph ? state.graph.edges : [];
  },
  metrics: state => {
    return state.graph ? state.graph.metriche : null;
  }
};
export const graphVisjs = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
