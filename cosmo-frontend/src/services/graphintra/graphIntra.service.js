import { axiosPython } from "@/http";

export const graphIntraService = {
  postGraphIntra
};

// Post form without transport
function postGraphIntra(params) {
  const endpoint = !params.trimester ? "/wordtradegraphintra" : "/cpatrim";
  return axiosPython
    .post(endpoint, params.form)
    .then(res => {
      var data = res.data ? res.data : {};
      //console.log(data);
      return data;
    })
    .catch(err => {
      throw err;
    });
}
