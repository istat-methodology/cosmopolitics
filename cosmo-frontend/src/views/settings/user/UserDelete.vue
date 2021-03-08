<template>
  <div class="row">
    <div class="col-sm-6 col-md-6">
      <div class="card ">
        <header class="card-header">
          User
          <router-link
            tag="a"
            :to="{
              name: 'UserList'
            }"
          >
            <span class="pl-1"
              ><users-icon class="pr-3" />back to user list</span
            >
          </router-link>
        </header>

        <div class="card-body">
          <form @submit.prevent="submit">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="inputGroup-sizing-default"
                  >Name</span
                >
              </div>
              <input
                class="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-default"
                v-model="user.name"
              />
            </div>
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="inputGroup-sizing-default"
                  >Surname</span
                >
              </div>
              <input
                class="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-default"
                v-model="user.surname"
              />
            </div>
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="inputGroup-sizing-default"
                  >Email</span
                >
              </div>
              <input
                class="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-default"
                v-model="user.email"
              />
            </div>
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="inputGroup-sizing-default"
                  >Role</span
                >
              </div>
              <input
                class="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-default"
                v-model="user.role"
              />
            </div>
            <button
              class="btn btn-outline-dark btn-sm"
              type="submit"
              :disabled="submitStatus === 'PENDING'"
            >
              Delete!
            </button>
            <p class="typo__p" v-if="submitStatus === 'OK'">
              Thanks for your submission!
            </p>
            <p class="typo__p" v-if="submitStatus === 'ERROR'">
              Please fill the form correctly.
            </p>
            <p class="typo__p" v-if="submitStatus === 'PENDING'">
              Sending...
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { axiosHack } from "@/http";
const querystring = require("querystring");
export default {
  name: "UserEdit",
  data() {
    return {
      //formTouched: false,
      submitStatus: null,
      user: {
        name: "",
        surname: "",
        email: "",
        role: ""
      }
    };
  },
  created() {
    axiosHack.get("/users/" + this.$route.params.id).then(response => {
      console.log(response);
      this.user = response.data;
    });
  },
  methods: {
    submit() {
      axiosHack
        .delete("/users/" + this.user.id, querystring.stringify(this.user))
        .then(response => {
          console.log(response);
          this.users = response.data;
          this.submitStatus = response.statusText;
        });
    }
  }
};
</script>
