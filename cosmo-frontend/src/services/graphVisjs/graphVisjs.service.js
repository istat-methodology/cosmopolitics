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
