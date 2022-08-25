import axios from "axios"
import store from "@/store"

const axiosAuth = axios.create({
  baseURL: process.env.VUE_APP_CLS_SERVER + "/security"
})

const axiosHack = axios.create({
  baseURL: process.env.VUE_APP_CLS_SERVER
})

const axiosR = axios.create({
  baseURL: process.env.VUE_APP_R_SERVER
})

const axiosPython = axios.create({
  baseURL: process.env.VUE_APP_PYTHON_SERVER
})

//request interceptor
axiosHack.interceptors.request.use(
  (config) => {
    store.dispatch("coreui/loading", true)
    const token = store.getters["auth/token"]
    if (token && !("jwt-auth" in config.headers)) {
      config.headers["jwt-auth"] = token
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

//response interceptor
axiosHack.interceptors.response.use(
  (response) => {
    store.dispatch("coreui/loading", false)
    return response
  },
  (error) => {
    store.dispatch("coreui/loading", false)
    manageServerError(error, "json")
    return Promise.reject(error)
  }
)

//response interceptor
axiosR.interceptors.response.use(
  (response) => {
    store.dispatch("coreui/loading", false)
    return response
  },
  (error) => {
    store.dispatch("coreui/loading", false)
    manageServerError(error, "R")
    return Promise.reject(error)
  }
)

//response interceptor
axiosPython.interceptors.response.use(
  (response) => {
    store.dispatch("coreui/loading", false)
    return response
  },
  (error) => {
    store.dispatch("coreui/loading", false)
    manageServerError(error, "python")
    return Promise.reject(error)
  }
)

export { axiosAuth, axiosHack, axiosR, axiosPython }

function manageServerError(error, server) {
  console.log("[Error] Ops, something went wrong in " + server)
  var err = {
    code: 500,
    message: "Sorry, something went wrong in " + server + " server!"
  }
  store.dispatch("error/serverError", err)
}
