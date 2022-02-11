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
    // load metadata 
    this.$store.dispatch("metadata/getMetadata");
    // load classifications
    // graph
    this.$store.dispatch("classification/getTransports");
    this.$store.dispatch("classification/getProducts");
    //timeseries
    
    this.$store.dispatch("classification/getCountries");

    this.$store.dispatch("classification/getPartners");
    this.$store.dispatch("classification/getBecs");
    //trade
    

  }
};
</script>
