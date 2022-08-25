import { axiosHack } from "@/http"
export const countriesService = {
  findAll,
  getDataSeries
}

function findAll(jsonDataName) {
  return axiosHack
    .get("/" + jsonDataName)
    .then((res) => {
      var data = res.data ? res.data : {}
      //console.log(data);
      return data
    })
    .catch((err) => {
      throw err
    })
}

function getDataSeries(name) {
  return axiosHack
    .get("/" + name)
    .then((res) => {
      var data = res.data ? res.data : {}
      //console.log(data);
      return data
    })
    .catch((err) => {
      throw err
    })
}
