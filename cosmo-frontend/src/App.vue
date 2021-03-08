<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "app",
  created() {
    //Manage browser refresh F5
    this.$store.dispatch("auth/reloadCredentials");
    //Clear messages
    this.$store.dispatch("message/clear");
  }
};
</script>
