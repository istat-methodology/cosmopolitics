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
              @click="helpOn(true)">
              i
            </button>
          </span>
          <span class="float-right">
            <exporter
              v-if="this.charts && this.tradePeriod"
              filename="cosmopolitics_basket"
              :data="getData(this.charts.data, 'trade')"
              :filter="getSearchFilter()"
              source="matrix"
              :timePeriod="this.tradePeriod">
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
            ref="trade" />
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
            v-model="varTypeSelected" />
          <label class="card-label mt-3">{{
            $t("trade.form.fields.country")
          }}</label>
          <v-select
            label="name"
            :options="countries"
            :placeholder="$t('trade.form.fields.country_placeholder')"
            v-model="countrySelected" />
          <label class="card-label mt-3">{{
            $t("trade.form.fields.flow")
          }}</label>
          <v-select
            label="descr"
            :options="flows"
            :placeholder="$t('trade.form.fields.flow_placeholder')"
            v-model="flowSelected" />
          <label v-if="products" class="card-label mt-3">
            {{ $t("trade.form.fields.products") }}
          </label>
          <v-select
            v-if="products"
            label="displayName"
            :options="products"
            :placeholder="$t('trade.form.fields.products_placeholder')"
            multiple
            v-model="productSelected"
            ref="prod" />
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
        <CButton color="primary" shape="square" size="sm" @click="helpOn(false)"
          >Close</CButton
        >
      </template>
    </CModal>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import { Context } from "@/common"
import paletteMixin from "@/components/mixins/palette.mixin"
import tradeMixin from "@/components/mixins/tradeDiag.mixin"
import LineChart from "@/components/charts/LineChart"
import spinnerMixin from "@/components/mixins/spinner.mixin"
import exporter from "@/components/Exporter"

export default {
  name: "Trade",
  components: { LineChart, exporter },
  mixins: [tradeMixin, paletteMixin, spinnerMixin],
  data: () => ({
    //Form (default values)
    idAllProducts: "00",
    productSelected: [
      { id: "00", dataname: "All products", displayName: "00 - All products" }
    ],
    varTypeSelected: {
      id: 1,
      descr: "Euro"
    },
    countrySelected: {
      country: "IT",
      name: "Italy"
    },
    flowSelected: {
      id: 1,
      descr: "Import"
    },
    //Chart
    chartData: null,
    labelPeriod: [],
    //Spinner
    spinner: false,
    isModalHelp: false
  }),
  computed: {
    ...mapGetters("classification", ["varType", "countries", "flows"]),
    ...mapGetters("trade", ["charts", "products"]),
    ...mapGetters("metadata", ["tradePeriod"])
  },
  methods: {
    helpOn(showModal) {
      this.isModalHelp = showModal
    },
    handleSubmit() {
      if (this.varTypeSelected && this.countrySelected && this.flowSelected) {
        this.spinnerStart(true)
        this.$store
          .dispatch("trade/findByName", {
            type: this.varTypeSelected.id,
            country: this.countrySelected.country,
            flow: this.flowSelected.id
          })
          .then(() => {
            this.chartData = {}
            this.chartData.datasets = []
            this.chartData.labels = this.labelPeriod
            this.productSelected.forEach((product) => {
              if (product.id === "00") {
                this.charts.data.forEach((element) => {
                  this.buildChartObject(element.dataname, element.value)
                })
              } else {
                this.buildChartObject(
                  this.charts.data[product.id].dataname,
                  this.charts.data[product.id].value
                )
              }
            })
          })
        this.clearColor()
        this.spinnerStart(true)
      }
    },
    buildChartObject(description, value) {
      const color = this.getColor()
      this.chartData.datasets.push({
        label: description,
        fill: false,
        backgroundColor: color.background,
        borderColor: color.border,
        data: value,
        showLine: true,
        pointRadius: 2
      })
    },
    getData(data, id) {
      if (data != null) {
        let selectedAll = false
        const selectedProds = this.productSelected.map((prod) => {
          if (prod.id == "00") selectedAll = true
          return prod.dataname
        })
        //filter on selected products
        if (selectedAll) return [data, id]
        else {
          const selectedData = data.filter((series) => {
            if (selectedProds.includes(series.dataname)) return series
          })
          return [selectedData, id]
        }
      }
      return null
    },
    getSearchFilter() {
      let data = []
      data.push({
        field: this.$t("trade.download.title"),
        value: ""
      })
      data.push({
        field: this.$t("trade.form.fields.varType"),
        value: this.varTypeSelected ? this.varTypeSelected.descr : ""
      })
      data.push({
        field: this.$t("trade.form.fields.country"),
        value: this.countrySelected ? this.countrySelected.name : ""
      })
      data.push({
        field: this.$t("trade.form.fields.flow"),
        value: this.flowSelected ? this.flowSelected.descr : ""
      })
      data.push({
        field: this.$t("timeseries.form.fields.productsCPA"),
        value: this.productSelected
          ? this.productSelected
              .map((prod) => {
                return prod.dataname
              })
              .join("#")
          : ""
      })
      data.push({
        field: this.$t("common.start_date"),
        value: this.tradePeriod ? this.tradePeriod[0].isoDate : ""
      })
      data.push({
        field: this.$t("common.end_date"),
        value: this.tradePeriod
          ? this.tradePeriod[this.tradePeriod.length - 1].isoDate
          : ""
      })
      return data
    },
    spinnerStart(bool) {
      this.spinner = bool
    }
  },
  created() {
    this.spinnerStart(true)
    if (this.tradePeriod !== null) {
      for (const period of this.tradePeriod) {
        this.labelPeriod.push(period.name)
      }
    }
    this.$store.dispatch("coreui/setContext", Context.Trade)
    this.$store
      .dispatch("trade/findByName", {
        type: this.varTypeSelected.id,
        country: this.countrySelected.country,
        flow: this.flowSelected.id
      })
      .then(() => {
        this.chartData = {}
        this.chartData.datasets = []
        this.chartData.labels = this.labelPeriod
        this.charts.data.forEach((element) => {
          this.buildChartObject(element.dataname, element.value)
        })
      })

    this.spinnerStart(false)
  }
}
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
