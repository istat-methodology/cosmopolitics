import { axiosR } from "@/http";
export const policyIndicatorService = {
 
  findByName,
  chartsByName
};

function findByName(filter) {
  return axiosR
    .get( "/policy-indicator?region=" +  filter.region + "&subregion=" + filter.subregion  )
    .then(res => {
      var data = res.data ? res.data : {};
      console.log(data);
      return data;
    })
    .catch(err => {      
      throw err;
    });
}

function chartsByName(filter) { 
  return axiosR
    .get( "/policy-indicator?region=" + filter.region + "&subregion=" +  filter.subregion )
    .then(res => {
      var data = res.data ? res.data : {};
      console.log(data);
      return data;
    })
    .catch(err => {
      throw err;
    });
}
