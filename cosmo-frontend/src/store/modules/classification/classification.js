import {
  classificationService
} from "@/services";

const state = {
  countries: [],
  products: [],
  productPlus: [],
  transports: [],
  partners: [],
  becs: [],
  productsTimeSeries: [],
  dataType: [{
      "id": 1,
      "descr": "Yearly variation series"
    },
    {
      "id": 2,
      "descr": "Raw data series"
    }
  ],
  flows: [{
      id: 1,
      descr: "Import"
    },
    {
      id: 2,
      descr: "Export"
    }
  ],
  previsions: [{
      id: 0,
      descr: "Interrupted Time Series"
    },
    {
      id: 1,
      descr: "Nowcasting"
    },
    {
      id: 2,
      descr: "Forecasting"
    }
  ],
  weights: [{
      id: 1,
      descr: true
    },
    {
      id: 2,
      descr: false
    }
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
  },
  SET_PRODUCTS_TIMESERIES(state, productsTimeSeries) {
    state.productsTimeSeries = productsTimeSeries;
  }
};
const actions = {
  getCountries({
    commit
  }) {
    return classificationService
      .findAll("countries")
      .then(data => {
        commit("SET_COUNTRIES", data);
      })
      .catch(err => {
        console.log(err);
      });
  },
  getProducts({
    commit
  }) {
    return classificationService
      .findAll("product3s")
      .then(data => {
        commit("SET_PRODUCTS", data);
      })
      .catch(err => {
        console.log(err);
      });
  },
  getProductPlus({
    commit
  }) {
    return classificationService
      .findAll("productplus")
      .then(data => {
        commit("SET_PRODUCT_PLUS", data);
      })
      .catch(err => {
        console.log(err);
      });
  },
    getProductsTimeSeries({
      commit
    }) {
      return classificationService
        .findAll("productsTimeSeries")
        .then(data => {
          commit("SET_PRODUCTS_TIMESERIES", data);
        })
        .catch(err => {
          console.log(err);
        });
    },
  getTransports({
    commit
  }) {
    return classificationService
      .findAll("transports")
      .then(data => {
        commit("SET_TRANSPORTS", data);
      })
      .catch(err => {
        console.log(err);
      });
  },
  getPartners({
    commit
  }) {
    return classificationService
      .findAll("partners")
      .then(data => {
        commit("SET_PARTNERS", data);
      })
      .catch(err => {
        console.log(err);
      });
  },
  getBecs({
    commit
  }) {
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
  productsTimeSeries: state => {
    return state.productsTimeSeries;
  },
  transports: state => {
    return state.transports;
  },
  flows: state => {
    return state.flows;
  },
  dataType: state => {
    return state.dataType;
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
  timeTrade: state => {
    return state.timeTrade;
  }
};
export const classification = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};