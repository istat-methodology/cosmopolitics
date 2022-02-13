import { axiosR } from "@/http";
export const timeseriesService = {
  findByFilters,
  findLastDate
};
function findByFilters(form) {
  var object = {};
  if (form.fcst != "2") {
    object = {
      
      flow: form.flow,
      var: form.var,
      country: form.country,
      partner: form.partner,
      fcst: form.fcst,
      dataTyoe: form.dataType
    };
  } else {
    object = {
      flow: form.flow,
      var: form.var,
      country: form.country,
      partner: form.partner,
      fcst: form.fcst,
      fcstpolind: form.fcstpolind,
      dataTyoe: form.dataType
    };
  }
  const params = object;

  return axiosR
    .get("/itsa", { params: params })
    .then(res => {
      var data = res.data ? res.data : {};
      //console.log(data);
      return data;
    })
    .catch(err => {
      throw err;
    });
}
function findLastDate(form) {
  const params = {
    flow: form.flow,
    country: form.country,
    partner: form.partner
  };
  return axiosR
    .get("/lastdate", { params: params })
    .then(res => {
      var data = res.data ? res.data : {};
      //console.log(data);
      return data;
    })
    .catch(err => {
      throw err;
    });
}
