import { axiosR } from "@/http";
export const mobilityService = {
  findByName,
  chartsByName
};

function findByName(filter) {
  return axiosR
    .get(
      "/desc-summary?region=" + filter.region + "&subregion=" + filter.subregion
    )
    .then(res => {
      var data = res.data ? res.data : {};
      //console.log(data);
      return data;
    })
    .catch(err => {
      throw err;
    });
}
function chartsByName(filter) {
  return axiosR
    .get(
      "/mobility-components?region=" +
        filter.region +
        "&subregion=" +
        filter.subregion
    )
    .then(res => {
      var data = res.data ? res.data : {};
      //console.log(data);
      return data;
    })
    .catch(err => {
      throw err;
    });
}
