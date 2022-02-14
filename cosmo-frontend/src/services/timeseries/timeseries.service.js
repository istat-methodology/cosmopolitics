import {
  axiosR
} from "@/http";
export const timeseriesService = {
  findByFilters
};

function findByFilters(form) {
  var object = {};
  object = {
    //dataType: form.dataType,
    flow: form.flow,
    var: form.var,
    country: form.country,
    partner: form.partner,
    fcst: form.fcst
  };
  const params = object;

  return axiosR
    .get("/itsa", {
      params: params
    })
    .then(res => {
      var data = res.data ? res.data : {};
      //console.log(data);
      return data;
    })
    .catch(err => {
      throw err;
    });
}