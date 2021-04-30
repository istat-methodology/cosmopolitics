<template>
  <div class="row">
    <div class="col-9">
      <div class="card">
        <header class="card-header">
          <b><span>Trade data 2020: {{ this.countrySelected.name }} - {{ this.flowSelected.descr }}</span
          ></b>
        </header>
        <CCardBody>
          <line-chart :chartData="chartData" :options="optionsTrade" />
        </CCardBody>
      </div>
    </div>
    <div class="col-3">
      <CCard>
        <CCardHeader>
          Trade filter
        </CCardHeader>
        <CCardBody>
          <label for="country" class="card-label">Country:</label>
          <v-select
            label="name"
            :options="countries"
            placeholder="Country"
            v-model="countrySelected"
          />
          <label for="country" class="card-label mt-3">Flows:</label>
          <v-select
            label="descr"
            :options="flows"
            placeholder="Flows"
            v-model="flowSelected"
          />
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
import tradeMixin from "@/components/mixins/tradeDiag.mixin";
import LineChart from "@/components/charts/LineChart";

export default {
  name: "Trade",
  components: {
    LineChart
  },
  mixins: [tradeMixin, paletteMixin],
  data: () => ({
    countrySelected: {
      country: "IT",
      name: "Italy"
    },
    flowSelected: { 
      id: 2, 
      descr: "Export" 
    }
  }),
  computed: {
    ...mapGetters("classification", ["countries", "flows","timeTrade"]),
    ...mapGetters("trade", ["charts"]),
    chartData() {
      var chartData = {};
      chartData.datasets = [];
      chartData.labels = this.timeTrade;
      if (this.charts) {
        this.charts.data.forEach(element => {
          const color = this.getColor();
          chartData.datasets.push({
            label: element.dataname,
            fill: false,
            backgroundColor: color.background,
            borderColor: color.border,
            data: element.value,
            showLine: true,
            pointRadius: 3
          });
        });
      }
      this.clearColor();
      return chartData;
    }
  },
  methods: {
    handleSubmit() {
      if (this.countrySelected && this.flowSelected) {
        this.$store.dispatch("trade/findByName", {
          country: this.countrySelected.country,
          flow: this.flowSelected.id
        });
      }
    }
  },
  created() {
    this.$store.dispatch("coreui/setContext", Context.Trade);
    this.$store.dispatch("classification/getCountries");
    this.$store.dispatch("trade/findByName", { country: this.countrySelected.country, flow: this.flowSelected.id });
  }
};
</script>
