<template>
  <CContainer class="d-flex align-items-center min-vh-100">
    <CRow class="w-100 justify-content-center">
      <CCol md="6">
        <div class="clearfix">
          <h1 class="float-left display-3 mr-4">401</h1>
          <h4 class="pt-3">Ops, something went wrong!</h4>
          <p class="text-muted">
            You are not authorized to access this page.
          </p>
        </div>
        <div class="clearfix mt-3">
          <router-link tag="a" to="/">
            <CIcon name="cilHome"></CIcon> <span>Go to home page</span>
          </router-link>
        </div>
      </CCol>
    </CRow>
  </CContainer>
</template>

<script>
export default {
  name: "error"
};
</script>
