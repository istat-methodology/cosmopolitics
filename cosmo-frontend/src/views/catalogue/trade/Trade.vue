<template>
  <div class="row">
    <div class="col-9">
      <CCard>
        <CCardHeader>
          <span
            >{{ $t("trade.card.title") }} {{ this.flowSelected.descr }} -
            {{ this.countrySelected.name }}
          </span>
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
              :data="getData(this.chartData, 'trade')"
            >
            </exporter>
          </span>
        </CCardHeader>
        <CCardBody>
          <circle-spin v-if="!this.chartData" class="circle-spin"></circle-spin>
          <line-chart
            :chartData="chartData"
            :options="optionsTrade"
            :height="500"
            id="trade"
          />
        </CCardBody>
      </CCard>
    </div>
    <div class="col-3">
      <CCard>
        <CCardHeader>
          <span class="float-left">{{ $t("trade.form.title") }} </span>
        </CCardHeader>
        <CCardBody>
          <label class="card-label"
            >{{ $t("trade.form.fields.dataType") }}*</label
          >
          <v-select
            label="descr"
            :options="tradeDataType"
            :placeholder="$t('trade.form.fields.dataType_placeholder')"
            v-model="tradeDataTypeSelected"
          />
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
      :title="$t('trade.modal.main.title')"
      :show.sync="isModalHelp"
      size="lg"
      ><p v-html="$t('trade.modal.main.body')"></p>
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
    tradeDataTypeSelected: {
      id: 1,
      descr: "in treated value",
    },
    countrySelected: {
      country: "IT",
      name: "Italy",
    },
    flowSelected: {
      id: 2,
      descr: "Export",
    },
    spinner: false,
    labelPeriod: [],
    modalHelpTitle: " About on ",
    isModalHelp: false,
  }),
  computed: {
    ...mapGetters("classification", [
      "tradeDataType",
      "countries",
      "flows",
      "timeTrade",
    ]),
    ...mapGetters("trade", ["charts"]),
    ...mapGetters("metadata", ["tradePeriod"]),
    chartData() {
      var chartData = {};
      chartData.datasets = [];
      if (this.tradePeriod) {
        chartData.labels = this.labelPeriod;
        if (this.charts) {
          this.charts.data.forEach((element) => {
            const color = this.getColor();
            chartData.datasets.push({
              label: element.dataname,
              fill: false,
              backgroundColor: color.background,
              borderColor: color.border,
              data: element.value,
              showLine: true,
              pointRadius: 2,
            });
          });
        }
      }
      this.clearColor();
      return chartData;
    },
  },
  methods: {
    helpOn(showModal) {
      this.isModalHelp = showModal;
      this.modalHelpTitle = "About map";
    },
    handleSubmit() {
      if (this.countrySelected && this.flowSelected) {
        this.$store.dispatch("trade/findByName", {
          type: this.tradeDataTypeSelected.id,
          country: this.countrySelected.country,
          flow: this.flowSelected.id,
        });
      }
    },
    getData(data, id) {
      if (data != null) {
        return [data, id];
      }
      return null;
    },
    spinnerStart(bool) {
      this.spinner = bool;
    },
  },
  created() {
    this.$store.dispatch("period/findByName", "trade").then(() => {
      for (const period of this.tradePeriod) {
        this.labelPeriod.push(period.name);
      }
    });
    this.$store.dispatch("coreui/setContext", Context.Trade);
    this.$store.dispatch("trade/findByName", {
      country: this.countrySelected.country,
      flow: this.flowSelected.id,
    });
  },
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
