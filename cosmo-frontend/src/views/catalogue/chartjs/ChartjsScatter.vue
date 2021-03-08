<template>
  <div class="row">
    <div class="col-9">
      <div class="card">
        <header class="card-header">
          <span v-if="this.countrySelected && this.partnerSelected"
            >{{ this.countrySelected.country }} -
            {{ this.partnerSelected.descr }}</span
          ><span v-else>BEC analysis</span>
        </header>
        <CCardBody>
          <scatter-chart :chartData="scatterCharts" :options="options" />
          <vue-slider
            v-if="showSlider"
            :adsorb="true"
            :tooltip="'none'"
            v-model="policyPeriodValue"
            :data="sliderPeriod"
            :data-value="'id'"
            :data-label="'name'"
            @change="handleCounterChange"
          />
        </CCardBody>
      </div>
    </div>
    <div class="col-3">
      <CCard>
        <CCardHeader>
          Trade filter
        </CCardHeader>
        <CCardBody>
          <label for="country" class="card-label">Flows:</label>
          <v-select
            label="descr"
            :options="flows"
            placeholder="Flows"
            v-model="flowSelected"
          />
          <label for="country" class="card-label mt-3">Country:</label>
          <v-select
            label="name"
            :options="countries"
            placeholder="Country"
            v-model="countrySelected"
          />
          <label for="country" class="card-label mt-3">Partner:</label>
          <v-select
            label="descr"
            :options="partners"
            placeholder="Partner"
            v-model="partnerSelected"
          />
          <label for="country" class="card-label mt-3">Bec:</label>
          <v-select
            label="descr"
            :options="becs"
            placeholder="Bec"
            v-model="becSelected"
          />
          <label for="country" class="card-label mt-3">Prevision:</label>
          <v-select
            label="descr"
            :options="previsions"
            placeholder="Prevision"
            v-model="previsionSelected"
          />
          <template v-if="isForecasting">
            <label for="country" class="card-label mt-3">Time:</label>
            <v-select
              label="descr"
              :options="timeNext"
              placeholder="Prevision"
              v-model="timeSelected"
            />
            <CInput
              label="Restriction"
              placeholder="Set restriction"
              class="card-label mt-2"
              v-model="restriction"
            />
          </template>
          <CButton
            color="primary"
            shape="square"
            size="sm"
            @click="handleSubmit"
            class="mt-3"
            >Go!</CButton
          >
        </CCardBody>
      </CCard>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { Context } from "@/common";
import paletteMixin from "@/components/mixins/palette.mixin";
import scatterMixin from "@/components/mixins/scatter.mixin";
import sliderMixin from "@/components/mixins/slider.mixin";

import ScatterChart from "@/components/charts/ScatterChart";
import VueSlider from "vue-slider-component";

export default {
  name: "ChartjsScatter",
  components: {
    ScatterChart,
    VueSlider
  },
  mixins: [paletteMixin, scatterMixin, sliderMixin],
  data: () => ({
    //Form fields
    flowSelected: null,
    countrySelected: null,
    partnerSelected: null,
    becSelected: null,
    previsionSelected: null,
    timeSelected: null,
    restriction: 0,

    //Slider
    showSlider: false
  }),
  computed: {
    ...mapGetters("classification", [
      "countries",
      "partners",
      "becs",
      "flows",
      "previsions",
      "timeNext"
    ]),
    ...mapGetters("chartjsScatter", ["scatterCharts"]),
    isForecasting() {
      var forecast = false;
      if (this.previsionSelected)
        forecast = this.previsionSelected.id == 2 ? true : false;
      return forecast;
    },
    sliderPeriod() {
      return this.timeSelected
        ? this.getSliderPeriod(this.timeSelected.value)
        : this.getSliderPeriod("202103");
    }
  },
  methods: {
    handleCounterChange(val) {
      var time = this.getTime(val);
      console.log("Time " + time);
      this.$store.dispatch("chartjsScatter/findByTime", time);
    },
    handleSubmit() {
      const form = {
        flow: this.flowSelected.id,
        var: this.becSelected.id,
        country: this.countrySelected.country,
        partner: this.partnerSelected.id,
        fcst: this.previsionSelected.id
      };
      if (this.isForecasting) {
        form.fcstpolind = this.restriction;
      }
      this.$store.dispatch("chartjsScatter/findByFilters", form).then(() => {
        this.showSlider = true;
      });
    }
  },
  created() {
    this.$store.dispatch("coreui/setContext", Context.Policy);
    this.$store.dispatch("classification/getCountries");
    this.$store.dispatch("classification/getPartners");
    this.$store.dispatch("classification/getBecs");
  }
};
</script>
