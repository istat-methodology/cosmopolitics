import { axiosPython } from "@/http";

export const graphVisjsService = {
  findAll,
  findById,
  postGraph,
  postGraphIntra,
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
// Post form with transport
function postGraph(formData) {
  return axiosPython
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
// Post form without transport
function postGraphPlus(formData) {
  return axiosPython
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
// Post form without transport
function postGraphIntra(formData) {
  return axiosPython
    .post("/wordtradegraphintra", formData)
    .then(res => {
      var data = res.data ? res.data : {};
      //console.log(data);
      return data;
    })
    .catch(err => {
      throw err;
    });
}
