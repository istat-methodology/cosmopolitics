import { classificationService } from "@/services";

const state = {
  countries: [],
  products: [],
  productPlus: [],
  transports: [],
  partners: [],
  becs: [],
  flows: [
    { id: 1, descr: "Import" },
    { id: 2, descr: "Export" }
  ],
  previsions: [
    { id: 0, descr: "Nothing" },
    { id: 1, descr: "Nowcasting" },
    { id: 2, descr: "Forecasting" }
  ],
  weights: [
    { id: 1, descr: true },
    { id: 2, descr: false }
  ],
  timeNext: [
    { id: 0, descr: "March 2021", value: "202103" },
    { id: 1, descr: "April 2021", value: "202104" },
    { id: 2, descr: "May 2021", value: "202105" },
    { id: 3, descr: "June 2021", value: "202106" },
    { id: 4, descr: "July 2021", value: "202107" },
    { id: 5, descr: "August 2021", value: "202108" },
    { id: 6, descr: "September 2021", value: "202109" },
    { id: 7, descr: "October 2021", value: "202110" },
    { id: 8, descr: "November 2021", value: "202111" },
    { id: 9, descr: "December 2021", value: "202112" }
  ],
  mobilityTypes: [
    { id: 1, name: "Retail", descr: "Retail" },
    { id: 2, name: "Grocery_Pharmacy", descr: "Grocery pharmacy" },
    { id: 3, name: "Parks", descr: "Parks" },
    { id: 4, name: "Transit_Station", descr: "Station" },
    { id: 5, name: "Workplaces", descr: "Workplaces" },
    { id: 6, name: "Residential", descr: "Residential" },
    { id: 7, name: "Policy Indicator", descr: "Policy Indicator" }
  ]
};

const mutations = {
  SET_COUNTRIES(state, countries) {
    state.countries = countries;
  },
  SET_PRODUCTS(state, products) {
    state.products = products;
  },
  SET_PRODUCT_PLUS(state, productPlus) {
    state.productPlus = productPlus;
  },
  SET_TRANSPORTS(state, transports) {
    state.transports = transports;
  },
  SET_PARTNERS(state, partners) {
    state.partners = partners;
  },
  SET_BECS(state, becs) {
    state.becs = becs;
  }
};

const actions = {
  getCountries({ commit }) {
    return classificationService
      .findAll("countries")
      .then(data => {
        commit("SET_COUNTRIES", data);
      })
      .catch(err => {
        console.log(err);
      });
  },
  getProducts({ commit }) {
    return classificationService
      .findAll("product3s")
      .then(data => {
        commit("SET_PRODUCTS", data);
      })
      .catch(err => {
        console.log(err);
      });
  },
  getProductPlus({ commit }) {
    return classificationService
      .findAll("productplus")
      .then(data => {
        commit("SET_PRODUCT_PLUS", data);
      })
      .catch(err => {
        console.log(err);
      });
  },
  getTransports({ commit }) {
    return classificationService
      .findAll("transports")
      .then(data => {
        commit("SET_TRANSPORTS", data);
      })
      .catch(err => {
        console.log(err);
      });
  },
  getPartners({ commit }) {
    return classificationService
      .findAll("partners")
      .then(data => {
        commit("SET_PARTNERS", data);
      })
      .catch(err => {
        console.log(err);
      });
  },
  getBecs({ commit }) {
    return classificationService
      .findAll("becs")
      .then(data => {
        commit("SET_BECS", data);
      })
      .catch(err => {
        console.log(err);
      });
  }
};

const getters = {
  countries: state => {
    return state.countries;
  },
  products: state => {
    return state.products;
  },
  productPlus: state => {
    return state.productPlus;
  },
  transports: state => {
    return state.transports;
  },
  flows: state => {
    return state.flows;
  },
  weights: state => {
    return state.weights;
  },
  previsions: state => {
    return state.previsions;
  },
  partners: state => {
    return state.partners;
  },
  becs: state => {
    return state.becs;
  },
  timeNext: state => {
    return state.timeNext;
  },
  mobilityTypes: state => {
    return state.mobilityTypes;
  }
};
export const classification = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
