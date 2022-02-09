import { axiosPython } from "@/http";

export const graphVisjsService = {
  findAll,
  findById,
  postGraph,
  postGraphPlus
};
function findAll() {
  return axiosPython
    .get("/pythongraph/")
    .then(res => {
      var data = res.data ? res.data : {};
      //console.log(data);
      return data;
    })
    .catch(err => {
      throw err;
    });
}

function findById(id) {
  return axiosPython
    .get("/pythongraph/" + id)
    .then(res => {
      var data = res.data ? res.data : {};
      //console.log(data);
      return data;
    })
    .catch(err => {
      throw err;
    });
}
// transport
function postGraph(formData) {
//function postGraphExtra(formData) {
  return axiosPython
    //.post("/wordtradegraphextra", formData)
    .post("/wordtradegraph", formData)
    .then(res => {
      var data = res.data ? res.data : {};
      //console.log(data);
      return data;
    })
    .catch(err => {
      throw err;
    });
}
// no transport
function postGraphPlus(formData) {
//function postGraphIntra(formData) {
  return axiosPython
    //.post("/wordtradegraphintra", formData)
    .post("/wordtradegraphplus", formData)
    .then(res => {
      var data = res.data ? res.data : {};
      //console.log(data);
      return data;
    })
    .catch(err => {
      throw err;
    });
}
