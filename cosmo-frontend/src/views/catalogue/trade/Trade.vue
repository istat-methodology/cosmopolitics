<template>
  <div class="row">
    <div class="col-9">
      <CCard>
        <CCardHeader>
          <span
            >{{ $t("trade.card.title") }} {{ this.countrySelected.name }} -
            {{ this.flowSelected.descr }}</span
          >
          <span class="float-right">
            <button
              class="btn mr-2 float-right btn-sm btn-square"
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
        </CCardHeader>
        <CCardBody>
          <circle-spin v-if="!this.chartData" class="circle-spin"></circle-spin>
          <line-chart
            :chartData="chartData"
            :options="optionsTrade"
            id="trade-chart"
          />
        </CCardBody>
      </CCard>
    </div>
    <div class="col-3">
      <CCard>
        <CCardHeader>
          <span class="float-left">{{ $t("trade.form.title") }} </span>
          <span class="float-right">
            <button
              class="btn sm-2 btn-sm btn-square"
              role="button"
              @click="helpOn(true)"
            >
              i
            </button>
          </span>
        </CCardHeader>
        <CCardBody>
          <label class="card-label"
            >{{ $t("trade.form.fields.country") }}*</label
          >
          <v-select
            label="name"
            :options="countries"
            :placeholder="$t('trade.form.fields.country_placeholder')"
            v-model="countrySelected"
          />
          <label class="card-label mt-3"
            >{{ $t("trade.form.fields.flow") }}*</label
          >
          <v-select
            label="descr"
            :options="flows"
            :placeholder="$t('trade.form.fields.flow_placeholder')"
            v-model="flowSelected"
          />
          <p class="card-label mt-3">*{{ $t("common.mandatory") }}</p>
          <CButton
            color="primary"
            shape="square"
            size="sm"
            @click="handleSubmit"
            class="mt-2"
            >{{ $t("common.submit") }}
          </CButton>
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
    spinner: false,
    tradePeriod: [],
    modalHelpTitle: " About on ",
    isModalHelp: false
  }),
  computed: {
    ...mapGetters("classification", ["countries", "flows", "timeTrade"]),
    ...mapGetters("trade", ["charts"]),
    ...mapGetters("period", ["timePeriod"]),
    chartData() {
      var chartData = {};
      chartData.datasets = [];
      if (this.timePeriod) {
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
      for (const dataset of this.chartData.datasets) {
        trade.push({
          [dataset.label]: dataset.data
        });
      }
      let jsonData = JSON.stringify(trade);
      let canvas = document.querySelector("canvas");

      return [jsonData, canvas];
    },
    spinnerStart(bool) {
      this.spinner = bool;
    }
  },
  created() {
    this.$store.dispatch("period/findByName", "trade").then(() => {
      for (const period of this.timePeriod) {
        this.tradePeriod.push(period.name);
      }
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
.card-header {
  padding: 1rem 1.25rem 0.7rem 1.25rem;
}
.card-header span {
  font-size: 0.875rem;
  font-weight: 500;
}
</style>
