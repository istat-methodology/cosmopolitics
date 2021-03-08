import { axiosHack } from "@/http";
export const chartjsLineService = {
  findAll,
  findByName
};
function findAll() {
  return axiosHack
    .get("/importvqs/")
    .then(res => {
      var data = res.data ? res.data : {};
      //console.log(data);
      return data;
    })
    .catch(err => {
      throw err;
    });
}
function findByName(filter) {
  const endpoint = filter.flow == 1 ? "importvqs" : "exportvqs";
  return axiosHack
    .get("/" + endpoint + "/" + filter.name)
    .then(res => {
      var data = res.data ? res.data : {};
      console.log(data);
      return data;
    })
    .catch(err => {
      throw err;
    });
}
