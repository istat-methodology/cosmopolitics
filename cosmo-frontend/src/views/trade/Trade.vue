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
            :height="600"
            id="trade"
            ref="trade"
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
          <label class="card-label">{{
            $t("trade.form.fields.varType")
          }}</label>
          <v-select
            label="descr"
            :options="varType"
            :placeholder="$t('trade.form.fields.varType_placeholder')"
            v-model="varTypeSelected"
            @change="setProducts()"
          />
          <label class="card-label mt-3">{{
            $t("trade.form.fields.country")
          }}</label>
          <v-select
            label="name"
            :options="countries"
            :placeholder="$t('trade.form.fields.country_placeholder')"
            v-model="countrySelected"
            @change="setProducts()"
          />
          <label class="card-label mt-3">{{
            $t("trade.form.fields.flow")
          }}</label>
          <v-select
            label="descr"
            :options="flows"
            :placeholder="$t('trade.form.fields.flow_placeholder')"
            v-model="flowSelected"
            @change="setProducts()"
          />
          <label v-if="products" class="card-label mt-3">
            {{
            $t("trade.form.fields.products")
          }}
          </label>

          <v-select
            v-if="products"
            label="dataname"
            :options="products"
            :placeholder="$t('trade.form.fields.products_placeholder')"
            multiple
            v-model="productSelected"
            ref = "prod"
          />
          <CButton
            color="primary"
            shape="square"
            size="sm"
            @click="handleSubmit"
            class="mt-3"
            >{{ $t("common.submit") }}
          </CButton>
        </CCardBody>
      </CCard>
    </div>
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
    chartData: null,
    productSelected: { id: 999, dataname: "All categories" },
    varTypeSelected: {
      id: 1,
      descr: "in treated value",
    },
    countrySelected: {
      country: "IT",
      name: "Italy",
    },
    flowSelected: {
      id: 1,
      descr: "Import",
    },
    spinner: false,
    labelPeriod: [],
    isModalHelp: false,
  }),
  computed: {
    ...mapGetters("classification", ["varType", "countries", "flows"]),
    ...mapGetters("trade", ["charts"]),
    ...mapGetters("metadata", ["tradePeriod"]),    
    products() {
      var products = [];
      if (this.tradePeriod) {
        if (this.charts) {
          this.charts.data.forEach((element, index) => {
            products.push({
              id: index,
              dataname: element.dataname,
            });
          });
          products.push({ id: 99999, dataname: "All products" });
        }
      }
      return products;
    },
  },
  methods: {
    helpOn(showModal) {
      this.isModalHelp = showModal;
    },
    handleSubmit() {
      if (this.countrySelected && this.flowSelected) {
        this.$store.dispatch("trade/findByName", {
          type: this.varTypeSelected.id,
          country: this.countrySelected.country,
          flow: this.flowSelected.id,
        });
      }
      this.chartData = {};
      this.chartData.datasets = [];
      this.chartData.labels = this.labelPeriod;

      this.productSelected.forEach((element) => {
        if (element.id == 99999) {
          this.charts.data.forEach((element) => {
            this.buildChartObject(element.dataname, element.value);
          });
        } else {
          this.buildChartObject(
            this.charts.data[element.id].dataname,
            this.charts.data[element.id].value
          );
        }
      });
      this.clearColor();
    },
    buildChartObject(description, value) {
      const color = this.getColor();
      this.chartData.datasets.push({
        label: description,
        fill: false,
        backgroundColor: color.background,
        borderColor: color.border,
        data: value,
        showLine: true,
        pointRadius: 2,
      });
    },
    setProducts(){
      this.$emit(this.$refs.prod, { id: 999, dataname: "All categories" });
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
    for (const period of this.tradePeriod) {
      this.labelPeriod.push(period.name);
    }
    this.$store.dispatch("coreui/setContext", Context.Trade);
    this.$store
      .dispatch("trade/findByName", {
        type: this.varTypeSelected.id,
        country: this.countrySelected.country,
        flow: this.flowSelected.id,
      })
      .then(() => {
        this.chartData = {};
        this.chartData.datasets = [];
        this.chartData.labels = this.labelPeriod;
        this.charts.data.forEach((element) => {
          this.buildChartObject(element.dataname, element.value);
        });
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
