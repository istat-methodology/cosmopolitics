<template>
  <div class="d-flex align-items-center min-vh-100">
    <CContainer fluid>
      <CRow class="justify-content-center">
        <CCol col="7" md="7" xl="6">
          <div class="card-group">
            <div class="card text-white bg-gradient-primary d-md-down-none">
              <div class="card-body text-center">
                <div class="mt-2">
                  <h2>RegEdit</h2>
                  <p style="margin-bottom:5rem">
                    Benvenuti nell'applicazione RegEdit. <br />
                    L'applicazione permette di modificare gli indirizzi presenti
                    nel registro dei luogi.
                  </p>
                  <p class="mb-0">
                    Il progetto è open-source, il codice sorgente è disponibile
                    <a
                      style="color:white"
                      href="https://github.com/istat-methodology/regedit-frontend"
                      target="_blank"
                      >@github</a
                    >
                  </p>
                </div>
              </div>
            </div>
            <CCard class="mb-0">
              <CCardHeader align="center">
                <h3 class="mt-3">Accedi a RegEdit</h3>
              </CCardHeader>
              <CCardBody class="mb-0 mt-3">
                <CAlert color="danger" v-if="errorMsg" class="text-center">
                  <span>{{ errorMsg }}</span>
                </CAlert>
                <CForm>
                  <div class="form-group">
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <div class="input-group-text">
                          <CIcon name="cilUser"></CIcon>
                        </div>
                      </div>
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Username"
                        v-model.trim="username"
                      />
                    </div>
                  </div>
                  <div class="form-group">
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <div class="input-group-text">
                          <CIcon name="cil-lock-locked"></CIcon>
                        </div>
                      </div>
                      <input
                        type="password"
                        class="form-control"
                        placeholder="Password"
                        autocomplete="on"
                        v-model="password"
                      />
                    </div>
                  </div>
                  <CRow>
                    <CCol col="12">
                      <CButton
                        :disabled="isLoading"
                        shape="square"
                        size="sm"
                        color="primary"
                        @click.prevent="handleSubmit"
                        @keyup.enter="handleSubmit"
                        >Sign in</CButton
                      >
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </div>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import { CRow, CCol, CForm } from "@coreui/vue";
import { mapGetters } from "vuex";
import { AuthStatus } from "@/common";

export default {
  components: {
    CRow,
    CCol,
    CForm
  },
  data() {
    return {
      username: "",
      password: ""
    };
  },
  computed: {
    ...mapGetters("auth", ["errorMsg"]),
    ...mapGetters("coreui", ["isLoading"])
  },
  methods: {
    handleSubmit() {
      const formData = {
        username: this.username,
        password: this.password
      };
      this.$store.dispatch("auth/login", formData).then(res => {
        if (res.status === AuthStatus.Logged) this.$router.push("/"); //Go to main page
      });
    }
  }
};
</script>

<style scoped>
h3 {
  margin-bottom: 0.4rem;
  font-size: 24px;
  font-weight: 300;
  letter-spacing: -0.5px;
}

.logo {
  width: 30%;
  margin-bottom: 0.4rem;
  margin-top: 0.3rem;
}

.register {
  margin-top: 2rem;
  border-top: 1px solid #d8dbe0;
  padding-top: 0.8rem;
  text-align: center;
}

.btn:focus,
.btn-success:focus {
  box-shadow: none;
}

.btn-success:not(:disabled):not(.disabled):active:focus,
.btn-success:not(:disabled):not(.disabled).active:focus {
  box-shadow: none;
}
.form-group {
  margin-bottom: 1.5rem;
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
</style>
