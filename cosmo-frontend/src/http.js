import axios from "axios";
import store from "@/store";

const axiosAuth = axios.create({
  baseURL: process.env.VUE_APP_DEV_SERVER + "/security"
});

const axiosHack = axios.create({
  baseURL: process.env.VUE_APP_DEV_SERVER
});

const axiosR = axios.create({
  baseURL: process.env.VUE_APP_R_SERVER
});

const axiosPython = axios.create({
  baseURL: process.env.VUE_APP_PYTHON_SERVER
});

//request interceptor
axiosHack.interceptors.request.use(
  config => {
    store.dispatch("coreui/loading", true);
    const token = store.getters["auth/token"];
    if (token && !("jwt-auth" in config.headers)) {
      config.headers["jwt-auth"] = token;
    }
    return config;
  },
  error => {
    Promise.reject(error);
  }
);

//response interceptor
axiosHack.interceptors.response.use(
  response => {
    store.dispatch("coreui/loading", false);
    return response;
  },
  error => {
    store.dispatch("coreui/loading", false);
    manageResponseError(error);
    return Promise.reject(error);
  }
);

//response interceptor
axiosR.interceptors.response.use(
  response => {
    store.dispatch("coreui/loading", false);
    return response;
  },
  error => {
    store.dispatch("coreui/loading", false);
    manageResponseError(error);
    return Promise.reject(error);
  }
);

//response interceptor
axiosPython.interceptors.response.use(
  response => {
    store.dispatch("coreui/loading", false);
    return response;
  },
  error => {
    store.dispatch("coreui/loading", false);
    manageResponseError(error);
    return Promise.reject(error);
  }
);

export { axiosAuth, axiosHack, axiosR, axiosPython };

function manageResponseError(error) {
  console.log("Error status", error.response.status);
  var err = {
    code: error.response.status,
    message: ""
  };
  // Unauthotized access
  if (error.response.status === 401) {
    //User logged
    if ("jwt-auth" in error.response.headers) {
      //redirect to login page
      store.dispatch("error/multipleLogin");
    } else {
      //unauthorized
      store.dispatch("error/unauthorized", err);
    }
  } else if (error.response.status === 400) {
    //Bad request
    err.message = error.response.data.message;
    store.dispatch("error/serverError", err);
  } else if (error.response.status === 500) {
    if (error.response.data.message.includes("AuthenticatedFilter")) {
      //redirect to login page
      store.dispatch("error/tokenExpired");
    } else {
      //internal server error
      err.message = error.response.data.message;
      store.dispatch("error/serverError", err);
    }
  } else {
    err.message = "Sorry, something went wrong!";
    store.dispatch("error/serverError", err);
  }
}
