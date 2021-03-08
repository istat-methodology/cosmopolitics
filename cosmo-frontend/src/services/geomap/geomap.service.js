import { axiosHack } from "@/http";
export const geomapService = {
  findAll,
  findByName,
  getExportTimeSeries,
  getImportTimeSeries
};

function findAll() {
  return axiosHack
    .get("/countries")
    .then(res => {
      var data = res.data ? res.data : {};
      //console.log(data);
      return data;
    })
    .catch(err => {
      throw err;
    });
}

function findByName(name) {
  return axiosHack
    .get("/iemarkers?Country_Code=" + name)
    .then(res => {
      var data = res.data ? res.data : {};
      console.log(data);
      return data;
    })
    .catch(err => {
      throw err;
    });
}

function getExportTimeSeries() {
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

function getImportTimeSeries() {
  return axiosHack
    .get("/importseries")
    .then(res => {
      var data = res.data ? res.data : {};
      //console.log(data);
      return data;
    })
    .catch(err => {
      throw err;
    });
}
