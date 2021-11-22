<template>
  <div class="row">
    <div class="col-9">
      <div class="card">
        <header class="card-header">
          <b
            ><span
              >Trade data 2020: {{ this.countrySelected.name }} -
              {{ this.flowSelected.descr }}</span
            ></b
          >
          <exporter
            typeDownload="jpeg"
            filename="_trade.jpeg"
            :items="getCanvas()"
          >
          </exporter>
          <exporter
            typeDownload="png"
            filename="_trade.png"
            :items="getCanvas()"
          >
          </exporter>
          <exporter
            typeDownload="pdf"
            filename="_trade.pdf"
            :items="getCanvas()"
          >
          </exporter>
          <exporter
            typeDownload="json"
            filename="_trade.json"
            :items="getJson()"
          >
          </exporter>
        </header>
        <CCardBody>
          <circle-spin v-if="!this.chartData" class="circle-spin"></circle-spin>
          <line-chart
            :chartData="chartData"
            :options="optionsTrade"
            id="trade-chart"
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
import spinnerMixin from "@/components/mixins/spinner.mixin";
import exporter from "@/components/Exporter";

export default {
  name: "Trade",
  components: { LineChart, exporter },
  mixins: [tradeMixin, paletteMixin, spinnerMixin],
  data: () => ({
    countrySelected: {
      country: "IT",
      name: "Italy"
    },
    flowSelected: {
      id: 2,
      descr: "Export"
    },
    download_status: "Download Charts",
    spinner: false,
    tradePeriod:[]
  }),
  computed: {
    ...mapGetters("classification", ["countries", "flows", "timeTrade"]),
    ...mapGetters("trade", ["charts"]),
    ...mapGetters("period", ["timePeriod"]),  
    chartData() {
      var chartData = {};
      chartData.datasets = [];
      if (this.timePeriod) {
        //chartData.labels = this.timeTrade;
        chartData.labels = this.tradePeriod;
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
    },
    getJson() {
      let trade = [];
      for (let i = 0; i < this.chartData.datasets.length; i++) {
        let obj = {};
        obj[this.chartData.datasets[i].label] = this.chartData.datasets[i].data;
        trade.push(obj);
      }
      let jsonData = JSON.stringify(trade);
      return jsonData;
    },
    getCanvas() {
      let canvas = document.querySelector("canvas");
      return canvas;
    },
    spinnerStart(bool) {
      this.spinner = bool;
    }
  },
  created() {
    this.$store.dispatch("period/findByName", "trade").then(() => {
      for (var i=0; i < this.timePeriod.length; i++){
        console.log(this.timePeriod[i].name);  
        this.tradePeriod.push(this.timePeriod[i].name);
      }
      console.log(this.tradePeriod);
    });
    this.$store.dispatch("coreui/setContext", Context.Trade);
    this.$store.dispatch("classification/getCountries");
    this.$store.dispatch("trade/findByName", {
      country: this.countrySelected.country,
      flow: this.flowSelected.id
    });
  }
};
</script>
<style>
.circle-spin {
  position: absolute;
  top: 20%;
  left: 50%;
}
.align-right {
  text-align: right;
}
</style>
