<template>
  <div class="d-flex align-items-center min-vh-100">
    <CContainer fluid>
      <CRow class="justify-content-center">
        <CCol md="6" lg="4">
          <CCard class="mx-4 mb-0">
            <CCardHeader align="center">
              <h3 class="mt-3">Register to IS<sup>2</sup> Workbench</h3>
            </CCardHeader>
            <CCardBody class="p-4">
              <CForm>
                <CAlert color="danger" v-if="showGlobalError">
                  <span>Account exists!</span>
                  <span>
                    Please go to
                    <router-link tag="a" to="/login">
                      <span>login page</span>
                    </router-link>
                  </span>
                </CAlert>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text">
                      <CIcon name="cilUser"></CIcon>
                    </div>
                  </div>
                  <input
                    type="text"
                    class="form-control"
                    :class="{ invalid: $v.username.$error }"
                    placeholder="User name"
                    v-model.trim="username"
                  />
                  <span class="help-block" :class="{ show: $v.username.$error }"
                    >Please enter your username.</span
                  >
                </div>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text">
                      <CIcon name="cilAt"></CIcon>
                    </div>
                  </div>
                  <input
                    type="text"
                    class="form-control"
                    :class="{ invalid: $v.email.$error }"
                    placeholder="Email"
                    v-model.trim="email"
                  />
                  <span class="help-block" :class="{ show: $v.email.$error }"
                    >Please enter a valid email address.</span
                  >
                </div>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text">
                      <CIcon name="cilUser"></CIcon>
                    </div>
                  </div>
                  <input
                    type="text"
                    class="form-control"
                    :class="{ invalid: $v.fullname.$error }"
                    placeholder="Full name"
                    v-model.trim="fullname"
                  />
                  <span class="help-block" :class="{ show: $v.fullname.$error }"
                    >Please enter your fullname.</span
                  >
                </div>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text">
                      <CIcon name="cil-lock-locked"></CIcon>
                    </div>
                  </div>
                  <input
                    type="password"
                    class="form-control"
                    :class="{ invalid: $v.password.$error }"
                    placeholder="Password"
                    v-model="password"
                  />
                  <span class="help-block" :class="{ show: $v.password.$error }"
                    >Password should contain at least 6 characters.</span
                  >
                </div>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text">
                      <CIcon name="cil-lock-locked"></CIcon>
                    </div>
                  </div>
                  <input
                    type="password"
                    class="form-control"
                    :class="{ invalid: $v.confirmPassword.$error }"
                    placeholder="Repeat password"
                    @input="$v.confirmPassword.$touch()"
                    v-model="confirmPassword"
                  />
                  <span
                    class="help-block"
                    :class="{ show: $v.confirmPassword.$error }"
                    >Passwords are different</span
                  >
                </div>
                <CButton color="success" block @click.prevent="handleSubmit()"
                  >Create Account</CButton
                >
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import { required, email, minLength, sameAs } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";

export default {
  name: "Register",
  data() {
    return {
      username: "",
      email: "",
      fullname: "",
      password: "",
      confirmPassword: ""
    };
  },
  computed: {
    ...mapGetters("auth", ["status"]),
    showGlobalError() {
      if (status == "USER_EXISTS") {
        return true;
      }
      return false;
    }
  },
  validations: {
    username: {
      required
    },
    email: {
      required,
      email
    },
    fullname: {
      required
    },
    password: {
      required,
      minLen: minLength(6)
    },
    confirmPassword: {
      sameAs: sameAs("password")
    }
  },
  methods: {
    handleSubmit() {
      this.$v.$touch(); //validate form data
      if (!this.$v.$invalid) {
        const formData = {
          username: this.username,
          email: this.email,
          fullname: this.fullname,
          password: this.password
        };
        console.log(formData);
        this.$store.dispatch("auth/register", formData);
      }
    }
  }
};
</script>

<style scoped>
.c-app:not(.c-legacy-theme):not(.c-dark-theme) .card {
  border: 1px solid #d8dee2;
}

h3 {
  margin-bottom: 0.4rem;
  font-size: 24px;
  font-weight: 300;
  letter-spacing: -0.5px;
}

.logo {
  width: 30%;
  margin-bottom: 0.2rem;
  margin-top: 0.3rem;
}

a {
  color: #e55353;
}

a:hover {
  color: #e55353;
  text-decoration: underline;
}

.btn:focus,
.btn-success:focus {
  box-shadow: none;
}

.btn-success:not(:disabled):not(.disabled):active:focus,
.btn-success:not(:disabled):not(.disabled).active:focus {
  box-shadow: none;
}

.form-control:focus {
  outline: 0;
  box-shadow: none;
  color: #768192;
  background-color: #fff;
  border-color: #d8dbe0;
}

.welcome {
  margin-bottom: 0px;
}

.help-block {
  visibility: hidden;
  width: 100%;
  margin-top: 0.25rem;
  margin-bottom: 0.5rem;
  font-size: 80%;
  color: #e55353;
  font-style: italic;
}

.invalid {
  border-color: #e55353 !important;
}

.show {
  visibility: visible;
}
</style>
