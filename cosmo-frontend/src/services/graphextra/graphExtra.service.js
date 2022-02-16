import { axiosPython } from "@/http";
export const graphExtraService = {
  postGraphExtra
};
// Post form without transport
function postGraphExtra(formData) {
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
