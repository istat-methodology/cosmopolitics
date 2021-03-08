import { axiosHack } from "@/http";
import { config } from "@/common";

export default class AbstractService {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  findAll() {
    return axiosHack
      .get(this.endpoint + "/")
      .then(res => {
        var data = res.data ? res.data : [];
        //console.log(data);
        return data;
      })
      .catch(err => {
        throw err;
      });
  }

  findById(id) {
    return axiosHack
      .get(this.endpoint + "/" + id)
      .then(res => {
        var data = res.data ? res.data : {};
        //console.log(data);
        return data;
      })
      .catch(err => {
        throw err;
      });
  }

  save(formData) {
    return axiosHack
      .post(this.endpoint, formData, config)
      .then(res => {
        var data = res.data ? res.data : {};
        //console.log(data);
        return data;
      })
      .catch(err => {
        throw err;
      });
  }

  update(formData) {
    return axiosHack
      .put(this.endpoint + "/" + formData.id, formData, config)
      .then(res => {
        var data = res.data ? res.data : {};
        //console.log(data);
        return data;
      })
      .catch(err => {
        throw err;
      });
  }

  delete(id) {
    return axiosHack
      .delete(this.endpoint + "/" + id)
      .then(res => {
        //console.log(res.data);
        return res.data;
      })
      .catch(err => {
        throw err;
      });
  }
}
