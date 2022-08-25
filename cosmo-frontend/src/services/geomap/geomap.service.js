import { axiosHack } from "@/http"
export const geomapService = {
  findAll,
  findByName,
  getSeries
}

function findAll() {
  return axiosHack
    .get("/countries")
    .then((res) => {
      var data = res.data ? res.data : {}
      //console.log(data);
      return data
    })
    .catch((err) => {
      throw err
    })
}

function findByName(name) {
  return axiosHack
    .get("/ieinfo?Country_Code=" + name)
    .then((res) => {
      var data = res.data ? res.data : {}
      //console.log(data);
      return data
    })
    .catch((err) => {
      throw err
    })
}

function getSeries(name) {
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
