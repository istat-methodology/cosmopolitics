import { axiosPython } from "@/http"
export const graphService = {
  postGraphExtra,
  postGraphIntra
}
function postGraphExtra(params) {
  const endpoint = params.trimester ? "/graphExtraTrim" : "/graphExtraMonth"
  return axiosPython
    .post(endpoint, params.form)
    .then((res) => {
      var data = res.data ? res.data : {}
      //console.log(data);
      return data
    })
    .catch((err) => {
      throw err
    })
}

// Post form without transport
function postGraphIntra(params) {
  const endpoint = params.trimester ? "/graphIntraTrim" : "/graphIntraMonth"
  return axiosPython
    .post(endpoint, params.form)
    .then((res) => {
      var data = res.data ? res.data : {}
      //console.log(data);
      return data
    })
    .catch((err) => {
      throw err
    })
}
