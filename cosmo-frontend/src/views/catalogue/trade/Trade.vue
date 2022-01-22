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
          <span class="float-right">
            <span class="float-right">
              <button
                class="btn mr-2 float-right btn-sm btn-square"
                title="Info"
                role="button"
                @click="helpOn(true)"
              >
                i
              </button>
            </span>
            <span class="float-right">
              <exporter
                filename="cosmopolitics_trade"
                :data="getData()"
                :options="['jpeg', 'png', 'pdf', 'json']"
              >
              </exporter>
            </span>
          </span>
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
          <div class="row">
            <div class="col-10">
              <span class="float-left"><h6>Trade filter</h6> </span>
            </div>
            <div class="col-2">
              <span class="float-right">
                <button
                  class="btn sm-2 btn-sm btn-square"
                  title="Info"
                  role="button"
                  @click="helpOn(true)"
                >
                  i
                </button>
              </span>
            </div>
          </div>
        </CCardHeader>
        <CCardBody>
          <label for="country" class="card-label" :title="this.countryFilter"
            >Country:</label
          >
          <v-select
            label="name"
            :options="countries"
            placeholder="Country"
            v-model="countrySelected"
          />
          <label for="country" class="card-label mt-3" :title="this.flowFilter"
            >Flows:</label
          >
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
    <!-- Marker modal -->

    <CModal
      title="Changes in basket composition of traded products (CPA -
            classification of products by activity) by Member State"
      :show.sync="isModalHelp"
      size="lg"
    >
      This section provides, for each Member State, the 2020 monthly time series
      of year-over-year changes in the basket composition of exported and
      imported goods, classified according to CPA-2 digits.
      <template #footer>
        <CButton color="outline-primary" square size="sm" @click="helpOn(false)"
          >Close</CButton
        >
      </template>
    </CModal>
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
    tradePeriod: [],
    modalHelpTitle: " About on ",
    isModalHelp: false,
    // help on filter as title
    flowFilter: "digit flows",
    countryFilter: "digit Country"
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
    helpOn(showModal) {
      this.isModalHelp = showModal;
      this.modalHelpTitle = "About map";
    },
    handleSubmit() {
      if (this.countrySelected && this.flowSelected) {
        this.$store.dispatch("trade/findByName", {
          country: this.countrySelected.country,
          flow: this.flowSelected.id
        });
      }
    },
    getData() {
      let trade = [];
      for (let i = 0; i < this.chartData.datasets.length; i++) {
        let obj = {};
        obj[this.chartData.datasets[i].label] = this.chartData.datasets[i].data;
        trade.push(obj);
      }
      let jsonData = JSON.stringify(trade);
      let canvas = document.querySelector("canvas");

      var arr = [];
      arr[0] = jsonData;
      arr[1] = canvas;
      return arr;
    },

    spinnerStart(bool) {
      this.spinner = bool;
    }
  },
  created() {
    this.$store.dispatch("period/findByName", "trade").then(() => {
      for (var i = 0; i < this.timePeriod.length; i++) {
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
