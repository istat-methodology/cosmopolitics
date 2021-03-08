<template>
  <div class="c-app">
    <app-sidebar></app-sidebar>
    <CWrapper>
      <app-toast></app-toast>
      <app-header />
      <div class="c-body">
        <main class="c-main">
          <CContainer fluid>
            <transition name="fade" mode="out-in">
              <router-view></router-view>
            </transition>
          </CContainer>
        </main>
        <app-footer />
      </div>
    </CWrapper>
  </div>
</template>

<script>
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import Toast from "@/components/Toast";

export default {
  name: "App",
  components: {
    "app-header": Header,
    "app-footer": Footer,
    "app-sidebar": Sidebar,
    "app-toast": Toast
  },
  created() {
    this.$store.dispatch("coreui/clearContext");
  }
};
</script>

<style lang="scss">
// Import Main styles for this application
@import "../assets/scss/style";

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
