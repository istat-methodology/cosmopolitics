import { axiosHack } from "@/http"
export const metadataService = {
  getMetadata
}

function getMetadata() {
  return axiosHack
    .get("/metadata")
    .then((res) => {
      var data = res.data ? res.data : {}
      return data
    })
    .catch((err) => {
      throw err
    })
}
