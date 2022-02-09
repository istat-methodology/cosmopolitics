import {
  geomapService
} from "@/services";

const state = {
  geomap: null,
  infoData: null,
  seriesData: null
};
const mutations = {
  SET_GEOMAP(state, geomap) {
    state.geomap = geomap;
  },
  SET_INFO(state, infoData) {
    state.infoData = infoData;
  },
  SET_SERIES(state, seriesData) {
    state.seriesData = seriesData;
  }
};

const actions = {
  findAll({
    commit
  }) {
    return geomapService
      .findAll()
      .then(data => {
        commit("SET_GEOMAP", data);
      })
      .catch(err => {
        console.log(err);
      });
  },
  getInfo({
    commit
  }, name) {
    return geomapService
      .findByName(name)
      .then(data => {
        console.log(data);
        data[0]["Main Import"].forEach(obj => {
          for (const key in obj) {
            console.log(obj[key]);
            var val = obj[key];
            if (typeof val === 'number') {
              obj[key] = val.toLocaleString('en-US');
            }
          }
        });
        commit("SET_INFO", data);
      })
      .catch(err => {
        console.log(err);
      });
  },
  getSeries({
    commit
  }, name) {
    return geomapService
      .getSeries(name)
      .then(data => {
        commit("SET_SERIES", data);
      })
      .catch(err => {
        console.log(err);
      });
  }
};

const getters = {
  geomap: state => {
    return state.geomap;
  },
  infoData: state => {
    return state.infoData;
  },
  seriesData: state => {
    return state.seriesData;
  }
};
export const geomap = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};