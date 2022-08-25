import { axiosHack } from "@/http"
export const tradeService = {
  findByName
}

function findByName(filter) {
  const endpoint =
    filter.type == 1
      ? filter.flow == 1
        ? "importValue"
        : "exportValue"
      : filter.flow == 1
      ? "importQuantity"
      : "exportQuantity"

  return axiosHack
    .get("/" + endpoint + "/" + filter.country)
    .then((res) => {
      var data = res.data ? res.data : {}
      //console.log(data);
      return data
    })
    .catch((err) => {
      throw err
    })
}
