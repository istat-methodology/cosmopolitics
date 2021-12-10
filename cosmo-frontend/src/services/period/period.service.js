import { axiosHack } from "@/http";
export const periodService = {
  findByName
};

function findByName(name) {
  return axiosHack
    .get("/timeperiod?periodname=" + name)
    .then(res => {
      var data = res.data ? res.data : {};
      console.log(data);
      return data;
    })
    .catch(err => {
      throw err;
    });
}
