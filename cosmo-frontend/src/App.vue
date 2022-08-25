<template>
  <div id="app">
    <div class="c-app">
      <app-sidebar></app-sidebar>
      <CWrapper>
        <app-toast></app-toast>
        <app-header />
        <div class="c-body">
          <main class="c-main">
            <CContainer fluid>
              <transition name="fade" mode="out-in">
                <router-view :key="$route.fullPath"></router-view>
              </transition>
            </CContainer>
          </main>
          <app-footer />
        </div>
      </CWrapper>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Sidebar from "@/components/Sidebar"
import Toast from "@/components/Toast"
export default {
  name: "App",
  components: {
    "app-header": Header,
    "app-footer": Footer,
    "app-sidebar": Sidebar,
    "app-toast": Toast
  },
  created() {
    //Clear messages
    this.$store.dispatch("message/clear")
    this.$store.dispatch("coreui/clearContext")
    // load metadata
    this.$store.dispatch("metadata/getMetadata").then(() => {
      // load classifications
      this.$store.dispatch("classification/getTransports")
      this.$store.dispatch("classification/getCountries")
      this.$store.dispatch("classification/getPartners")
      this.$store.dispatch("classification/getProductsCPA")
      this.$store.dispatch("classification/getProductsIntra")
      this.$store.dispatch("classification/getProductsExtra")
    })
  }
}
</script>
<style lang="scss">
// Import Main styles for this application
@import "./assets/scss/style";

//Transition
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
