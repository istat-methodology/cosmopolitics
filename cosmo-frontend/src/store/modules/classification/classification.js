import { classificationService } from "@/services";

const state = {
  countries: [],
  products: [],
  productPlus: [],
  transports: [],
  partners: [],
  becs: [],
  productsCPA: [],
  productsIntra: [],
  productsExtra: [],
  dataType: [
    {
      id: 1,
      descr: "Yearly variation series"
    },
    {
      id: 2,
      descr: "Raw data series"
    }
  ],
  varType: [
    {
      id: 1,
      descr: "in treated value"
    },
    {
      id: 2,
      descr: "in treated quantity"
    }
  ],
  flows: [
    {
      id: 1,
      descr: "Import"
    },
    {
      id: 2,
      descr: "Export"
    }
  ],
  weights: [
    {
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
  SET_PRODUCTS_CPA(state, productsCPA) {
    state.productsCPA = productsCPA;
  },
  SET_PRODUCTS_INTRA(state, productsIntra) {
    state.productsIntra = productsIntra;
  },
  SET_PRODUCTS_EXTRA(state, productsExtra) {
    state.productsExtra = productsExtra;
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
  getProductsCPA({ commit }) {
    return classificationService
      .findAll("productsCPA")
      .then(data => {
        commit("SET_PRODUCTS_CPA", data);
      })
      .catch(err => {
        console.log(err);
      });
  },
  getProductsIntra({ commit }) {
    return classificationService
      .findAll("productsIntra")
      .then(data => {
        commit("SET_PRODUCTS_INTRA", data);
      })
      .catch(err => {
        console.log(err);
      });
  },
  getProductsExtra({ commit }) {
    return classificationService
      .findAll("productsExtra")
      .then(data => {
        commit("SET_PRODUCTS_EXTRA", data);
      })
      .catch(err => {
        console.log(err);
      });
  },

  getTransports({ commit }) {
    return classificationService
      .findAll("transports")
      .then(data => {
        //Add 'All' to the list of transports
        data.push({
          id: 99,
          descr: "All"
        });
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

  productsCPA: state => {
    return state.productsCPA;
  },
  //graph intra
  productsIntra: state => {
    return state.productsIntra;
  },

  //graph extra
  productsExtra: state => {
    return state.productsExtra;
  },
  transports: state => {
    return state.transports;
  },
  flows: state => {
    return state.flows;
  },
  //timeseries
  dataType: state => {
    return state.dataType;
  },
  //timeseries //trade
  varType: state => {
    return state.varType;
  },

  weights: state => {
    return state.weights;
  },
  partners: state => {
    return state.partners;
  },
  becs: state => {
    return state.becs;
  },
  timeNext: state => {
    return state.timeNext;
  }
  /*,

  timeTrade: state => {
    return state.timeTrade;
  }
  */
};
export const classification = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
