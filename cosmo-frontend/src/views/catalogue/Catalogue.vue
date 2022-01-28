<template>
  <div class="row">
    <div class="col-sm-6 col-md-4">
      <div class="card">
        <header class="card-header">
          <span class="card-title">{{ $t("landing.map.title") }}</span>
        </header>
        <div class="card-body">
          <p v-html="$t('landing.map.body')"></p>
          <p class="section-link">
            <router-link tag="a" :to="{ name: 'Map' }"
              ><span> {{ $t("landing.map.link") }}<chevron-right-icon /></span>
            </router-link>
          </p>
        </div>
      </div>
    </div>
    <div class="col-sm-6 col-md-4">
      <div class="card">
        <header class="card-header">
          <span class="card-title">{{ $t("landing.graph.title") }}</span>
        </header>
        <div class="card-body">
          <p v-html="$t('landing.graph.body')"></p>
          <p class="section-link">
            <router-link tag="a" :to="{ name: 'Graph' }"
              ><span>
                {{ $t("landing.graph.link") }}<chevron-right-icon
              /></span>
            </router-link>
          </p>
        </div>
      </div>
    </div>
    <div class="col-sm-6 col-md-4">
      <div class="card">
        <header class="card-header">
          <span class="card-title">{{ $t("landing.timeseries.title") }}</span>
        </header>
        <div class="card-body">
          <p v-html="$t('landing.timeseries.body')"></p>
          <p class="section-link">
            <router-link tag="a" :to="{ name: 'TimeSeries' }"
              ><span>
                {{ $t("landing.timeseries.link") }}<chevron-right-icon
              /></span>
            </router-link>
          </p>
        </div>
      </div>
    </div>
    <div class="col-sm-6 col-md-4">
      <div class="card">
        <header class="card-header">
          <span class="card-title">{{ $t("landing.trade.title") }}</span>
        </header>
        <div class="card-body">
          <p v-html="$t('landing.trade.body')"></p>
          <p class="section-link">
            <router-link tag="a" :to="{ name: 'Trade' }"
              ><span>
                {{ $t("landing.trade.link") }}<chevron-right-icon
              /></span>
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Context } from "@/common";
export default {
  name: "Metadata",
  created() {
    this.$store.dispatch("coreui/setContext", Context.Home);
  }
};
</script>

<style scoped>
.material-design-icon > .material-design-icon__svg {
  bottom: -0.17rem;
}
.card-title {
  font-weight: 600;
}
</style>
