import { axiosR } from "@/http";
export const becService = {
  findByFilters
};
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
//.get( "/itsa?flow=" + form.flow + "&var=" + form.var + "&country=" + form.country + "&partner=" + form.partner + "&fcst=" + form.fcst )*/
    .then(res => {    
      var data = res.data ? res.data : {};
      console.log(data);
      return data;
    })
    .catch(err => {
      throw err;
  });
}
