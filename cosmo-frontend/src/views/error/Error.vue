<template>
  <div class="row w-100 justify-content-center mt">
    <div class="col-6">
      <div class="clearfix">
        <h1 class="float-left display-3 mr-4">500</h1>
        <h4 class="pt-3">Houston, we have a problem!</h4>
        <p class="text-muted">
          An error occurred, please contact Cosmopolitics administrator
        </p>
      </div>
      <div class="clearfix mb-3">
        <h4 class="pt-3">Error message:</h4>
        <p class="text-muted">{{ msg }}</p>
      </div>
      <div class="clearfix mb-3">
        <router-link tag="a" to="/">
          <CIcon name="cilHome"></CIcon>
          <span>&nbsp;Go to home page</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  computed: {
    ...mapGetters("error", ["msg"])
  }
}
</script>
