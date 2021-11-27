import { axiosHack } from "@/http";
export const countriesService = {
  findAll,
  getDataSeries
};
function findAll(jsondataname) {
  return axiosHack
    .get("/" + jsondataname)
    .then(res => {
      var data = res.data ? res.data : {};
      //console.log(data);
      return data;
    })
    .catch(err => {
      throw err;
    });
}
function getDataSeries() {
  return axiosHack
    .get("/exportseries")
    .then(res => {
      var data = res.data ? res.data : {};
      //console.log(data);
      return data;
    })
    .catch(err => {
      throw err;
    });
}
