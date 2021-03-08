import { axiosR } from "@/http";
export const chartjsScatterService = {
  findAll,
  findByFilters
};
function findAll() {
  return axiosR
    .get("/timelapse/")

    .then(res => {
      var data = res.data ? res.data : {};
      //console.log(data);
      return data;
    })
    .catch(err => {
      throw err;
    });
}
function findByFilters(form) {
  const params = {
    flow: form.flow,
    var: form.var,
    country: form.country,
    partner: form.partner,
    fcst: form.fcst
  };
  return axiosR
    .get("/itsa", { params: params })
    .then(res => {
      var data = res.data ? res.data : {};
      console.log(data);
      return data;
    })
    .catch(err => {
      throw err;
    });
}
