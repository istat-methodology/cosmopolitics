<template>
  <CSidebar
    fixed
    :minimize="minimize"
    :show="show"
    @update:show="
      (value) => $store.commit('coreui/set', ['sidebarShow', 'responsive'])
    "
  >
    <CSidebarBrand class="d-md-down-none" to="/">
      <CIcon name="cil-terminal" size="lg"></CIcon>
      <span class="brand">Cosmopolitics</span>
    </CSidebarBrand>

    <ul class="c-sidebar-nav h-100 ps" style="position: relative">
      <li class="c-sidebar-nav-item">
        <router-link
          tag="a"
          :to="{ name: 'Home' }"
          class="c-sidebar-nav-link"
          :class="{ 'c-active': isHome }"
        >
          <CIcon name="cil-home" class="c-sidebar-nav-icon" />{{
            $t("sidebar.home")
          }}
          <span class="badge badge-primary">Alpha</span>
        </router-link>
      </li>
      <li class="c-sidebar-nav-title">Analysis</li>
      <li class="c-sidebar-nav-item">
        <router-link
          tag="a"
          :to="{ name: 'Map' }"
          class="c-sidebar-nav-link"
          :class="{ 'c-active c-active-primary': isMap }"
        >
          <CIcon name="cil-layers" class="c-sidebar-nav-icon" />
          {{ $t("sidebar.map") }}
        </router-link>
      </li>
      <li class="c-sidebar-nav-item">
        <router-link
          tag="a"
          :to="{ name: 'Graph' }"
          class="c-sidebar-nav-link"
          :class="{ 'c-active c-active-success': isGraph }"
        >
          <CIcon name="cil-layers" class="c-sidebar-nav-icon" />{{
            $t("sidebar.graph")
          }}
        </router-link>
      </li>
      <li class="c-sidebar-nav-item">
        <router-link
          tag="a"
          :to="{ name: 'Bec' }"
          class="c-sidebar-nav-link"
          :class="{ 'c-active c-active-warning': isPolicy }"
        >
          <CIcon name="cil-layers" class="c-sidebar-nav-icon" />
          {{ $t("sidebar.timeseries") + " old" }}
        </router-link>
      </li>
      <li class="c-sidebar-nav-item">
        <router-link
          tag="a"
          :to="{ name: 'TimeSeries' }"
          class="c-sidebar-nav-link"
          :class="{ 'c-active c-active-warning': isPolicy }"
        >
          <CIcon name="cil-layers" class="c-sidebar-nav-icon" />
          {{ $t("sidebar.timeseries") }}
        </router-link>
      </li>
      <li class="c-sidebar-nav-item">
        <router-link
          tag="a"
          :to="{ name: 'Trade' }"
          class="c-sidebar-nav-link"
          :class="{ 'c-active c-active-danger': isTrade }"
        >
          <CIcon name="cil-layers" class="c-sidebar-nav-icon" />
          {{ $t("sidebar.trade") }}
        </router-link>
      </li>
    </ul>
  </CSidebar>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters("coreui", {
      show: "sidebarShow",
      minimize: "sidebarMinimize",
      isHome: "isHome",
      isMap: "isMap",
      isGraph: "isGraph",
      isGraphPlus: "isGraphPlus",
      isPolicy: "isPolicy",
      isTrade: "isTrade",
      isMobility: "isMobility",
    }),
  },
};
</script>
<style scoped>
.brand {
  font-size: 1.2em;
  padding-left: 1rem;
}
.c-active-primary {
  border-left: 3px solid#321fdb;
}
.c-active-success {
  border-left: 3px solid#2eb85c;
}
.c-active-warning {
  border-left: 3px solid#f9b115;
}
.c-active-danger {
  border-left: 3px solid#e55353;
}
</style>
