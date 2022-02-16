import { axiosPython } from "@/http";

export const graphIntraService = {
  postGraphIntra
};

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
