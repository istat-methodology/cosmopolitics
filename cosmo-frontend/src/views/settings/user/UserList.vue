<template>
  <div class="row">
    <div class="col-sm-6 col-md-6">
      <div class="card ">
        <header class="card-header">
          Users
        </header>
        <div class="card-body">
          <table class="table table-striped ">
            <thead>
              <tr>
                <th>id</th>
                <th>email</th>
                <th>name</th>
                <th>surname</th>
                <th>role</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in users" :key="item.id">
                <td>{{ item.id }}</td>
                <td>{{ item.email }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.surname }}</td>
                <td>{{ item.role }}</td>

                <td>
                  <router-link
                    tag="a"
                    :to="{
                      name: 'UserEdit',
                      params: { id: item.id }
                    }"
                  >
                    edit
                  </router-link>
                </td>
                <td>
                  <router-link
                    tag="a"
                    :to="{
                      name: 'UserDelete',
                      params: { id: item.id }
                    }"
                  >
                    delete
                  </router-link>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <button class="btn-outline-dark btn-sm">
                <router-link
                  tag="a"
                  :to="{
                    name: 'UserAdd'
                    /*,
                      params: { id: item.id }
                      */
                  }"
                >
                  Add!
                </router-link>
              </button>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { axiosHack } from "@/http";
export default {
  name: "UserList",
  data() {
    return {
      users: []
    };
  },
  created() {
    axiosHack.get("/users").then(response => {
      console.log(response);
      this.users = response.data;
    });
  }
};
</script>
