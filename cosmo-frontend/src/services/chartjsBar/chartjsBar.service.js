import { axiosHack } from "@/http";
export const chartjsBarService = {
  findAll,
  findByName
};
function findAll() {
  return axiosHack

    .get("/exportvqs/")
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
    .get("/exportvqs/" + name)
    .then(res => {
      var data = res.data ? res.data : {};
      console.log(data);
      return data;
    })
    .catch(err => {
      throw err;
    });
}
