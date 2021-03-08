import { axiosHack } from "@/http";
export const classificationService = {
  findAll
};
function findAll(classification) {
  return axiosHack
    .get("/" + classification)
    .then(res => {
      var data = res.data ? res.data : {};
      //console.log(data);
      return data;
    })
    .catch(err => {
      throw err;
    });
}
