import { countriesService } from "@/services";

const state = {
  countries: null,
  countriesborders: null,
  
};
const mutations = {
  SET_COUNTRIES(state, countries) {
    state.countries = countries;
  },
  SET_COUNTRIES_BORDERS(state, countriesborders) {
    state.countriesborders = countriesborders;
  },
};
const actions = {
  getCountries({ commit }) {
    return countriesService
      .findAll("countries")
      .then(data => {
        commit("SET_COUNTRIES", data);
      })
      .catch(err => {
        console.log(err);
      });
  },
  getCountriesBorders({ commit }) {
    return countriesService
      .findAll("countriesborders")
      .then(data => {
        commit("SET_COUNTRIES_BORDERS", data);
      })
      .catch(err => {
        console.log(err);
      });
  },
};
const getters = {
  countries: state => {
    return state.countries;
  },
  countriesborders: state => {
    return state.countriesborders;
  }
};
export const countries = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
