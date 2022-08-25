<template>
  <div class="row">
    <div class="col-9">
      <CCard>
        <CCardHeader>
          <span class="float-left">
            <span class="float-left">
              <label class="form-check-label c-switch c-switch-sm">
                <input
                  type="checkbox"
                  class="form-check-input c-switch-input"
                  checked
                  @click="handleMainChart" />
                <span class="c-switch-slider"></span>
              </label>
            </span>
            <span class="padding-right">
              <span v-if="countrySelected && partnerSelected"
                >{{ $t("timeseries.card.title") }}:
                {{ this.countrySelected.name }} -
                {{ this.partnerSelected.descr }}</span
              >
              <span v-else
                >{{ $t("timeseries.card.title") }} -
                {{ $t("timeseries.card.comext") }}</span
              >
            </span>
          </span>
          <span class="float-right">
            <span class="float-right">
              <button
                class="btn sm-2 btn-sm btn-square"
                title="Info"
                role="button"
                @click="helpOn(true)">
                i
              </button>
            </span>
            <span class="float-right">
              <exporter
                v-if="timeseriesCharts"
                filename="cosmopolitics_timeseries"
                :data="getTabularData(timeseriesCharts.diagMain, 'timeseries')"
                :filter="getSearchFilter()"
                source="table">
              </exporter>
            </span>
          </span>
        </CCardHeader>
        <CCardBody v-if="isMainChart">
          <circle-spin v-if="spinner" class="circle-spin"></circle-spin>
          <line-chart
            :chartData="chartDataDiagMain"
            :options="options"
            id="timeseries" />
          <div class="timeseries-info">
            <span>
              <span class="text-primary" v-if="mean"> Mean: </span
              >{{ this.mean }},
              <span class="text-primary" v-if="std">Standard deviation: </span
              >{{ this.std }}
            </span>
          </div>
        </CCardBody>
      </CCard>
      <CCard v-if="chartDataDiagNorm">
        <CCardHeader>
          <span class="float-left">
            <span class="float-left">
              <label class="form-check-label c-switch c-switch-sm">
                <input
                  type="checkbox"
                  class="form-check-input c-switch-input"
                  checked
                  @click="handleDiagNorm" />
                <span class="c-switch-slider"></span>
              </label>
            </span>
            <span class="padding-right">
              <b>{{ this.diagNormTitle }}</b>
            </span>
          </span>
          <span class="float-right">
            <span class="float-right">
              <button
                class="btn sm-2 btn-sm btn-square"
                title="Info"
                role="button"
                @click="helpOn(true)">
                i
              </button>
            </span>
            <span class="float-right">
              <exporter
                filename="cosmopolitics_diagnorm"
                :data="getData(chartDataDiagNorm, 'diagnorm')">
              </exporter>
            </span>
          </span>
        </CCardHeader>
        <CCardBody v-if="isDiagNorm">
          <scatter-chart
            :chartData="chartDataDiagNorm"
            :options="optionsNorm"
            id="diagnorm" />
        </CCardBody>
      </CCard>
      <CCard v-if="chartDataDiagACF">
        <CCardHeader>
          <span class="float-left">
            <span class="float-left">
              <label class="form-check-label c-switch c-switch-sm">
                <input
                  type="checkbox"
                  class="form-check-input c-switch-input"
                  checked
                  @click="handleDiagACF" />
                <span class="c-switch-slider"></span>
              </label>
            </span>
            <span class="padding-right">
              <b>{{ this.diagACFTitle }}</b>
            </span>
          </span>
          <span class="float-right">
            <span class="float-right">
              <button
                class="btn sm-2 btn-sm btn-square"
                title="Info"
                role="button"
                @click="helpOn(true)">
                i
              </button>
            </span>
            <span class="float-right">
              <exporter
                filename="cosmopolitics_diagacf"
                :data="getData(chartDataDiagACF, 'diagacf')">
              </exporter>
            </span>
          </span>
        </CCardHeader>
        <CCardBody v-if="isDiagACF">
          <line-chart
            :chartData="chartDataDiagACF"
            :options="optionsACF"
            id="diagacf" />
        </CCardBody>
      </CCard>
    </div>
    <div class="col-3">
      <CCard>
        <CCardHeader>
          <span class="float-left">{{ $t("timeseries.form.title") }}</span>
          <!--span class="float-right">
            <exporter
              filename="cosmopolitics_timeseries_filter"
              :data="getSearchFilter()"
              :options="['csv']"
              source="filter"
            >
            </exporter>
          </span-->
        </CCardHeader>
        <CCardBody>
          <label class="card-label">{{
            $t("timeseries.form.fields.dataType")
          }}</label>
          <v-select
            label="descr"
            :options="dataType"
            :placeholder="$t('timeseries.form.fields.dataType_placeholder')"
            v-model="dataTypeSelected"
            :class="{
              'is-invalid': $v.dataTypeSelected.$error
            }" />
          <label class="card-label mt-3">{{
            $t("timeseries.form.fields.varType")
          }}</label>
          <v-select
            label="descr"
            :options="varType"
            :placeholder="$t('timeseries.form.fields.varType_placeholder')"
            v-model="varTypeSelected"
            :class="{
              'is-invalid': $v.varTypeSelected.$error
            }" />
          <label class="card-label mt-3">{{
            $t("timeseries.form.fields.flow")
          }}</label>
          <v-select
            label="descr"
            :options="flows"
            :placeholder="$t('timeseries.form.fields.flow_placeholder')"
            v-model="flowSelected"
            :class="{
              'is-invalid': $v.flowSelected.$error
            }" />
          <label class="card-label mt-3">{{
            $t("timeseries.form.fields.country")
          }}</label>
          <v-select
            label="name"
            :options="countries"
            :placeholder="$t('timeseries.form.fields.country_placeholder')"
            v-model="countrySelected"
            :class="{
              'is-invalid': $v.countrySelected.$error
            }" />
          <label class="card-label mt-3">{{
            $t("timeseries.form.fields.partner")
          }}</label>
          <v-select
            label="descr"
            :options="partners"
            :placeholder="$t('timeseries.form.fields.partner_placeholder')"
            v-model="partnerSelected"
            :class="{
              'is-invalid': $v.partnerSelected.$error
            }" />
          <label class="card-label mt-3">{{
            $t("timeseries.form.fields.productsCPA")
          }}</label>
          <v-select
            label="descr"
            :options="productsCPA"
            :placeholder="$t('timeseries.form.fields.productsCPA_placeholder')"
            v-model="productsCPASelected"
            :class="{
              'is-invalid': $v.productsCPASelected.$error
            }" />
          <CButton
            color="primary"
            shape="square"
            size="sm"
            @click="handleSubmit"
            class="mt-3"
            >{{ $t("common.submit") }}</CButton
          >
        </CCardBody>
      </CCard>
    </div>
    <CModal
      :title="$t('timeseries.modal.main.title')"
      :show.sync="isModalHelp"
      size="lg">
      <p v-html="$t('timeseries.modal.main.body')"></p>
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
import { Context, Status } from "@/common"
import paletteMixin from "@/components/mixins/palette.mixin"
import timeseriesDiagMixin from "@/components/mixins/timeseriesDiag.mixin"
import timeseriesMixin from "@/components/mixins/timeseries.mixin"
import ScatterChart from "@/components/charts/ScatterChart"
import LineChart from "@/components/charts/LineChart"
import { required } from "vuelidate/lib/validators"
import spinnerMixin from "@/components/mixins/spinner.mixin"
import exporter from "@/components/Exporter"

export default {
  name: "TimeSeries",
  components: {
    ScatterChart,
    LineChart,
    exporter
  },
  mixins: [paletteMixin, timeseriesDiagMixin, timeseriesMixin, spinnerMixin],
  data: () => ({
    spinner: false,
    //Form fields
    dataTypeSelected: null,
    varTypeSelected: null,
    flowSelected: null,
    countrySelected: null,
    partnerSelected: null,
    productsCPASelected: null,
    //Charts
    chartDataDiagMain: null,
    chartDataDiagNorm: null,
    chartDataDiagACF: null,

    isMainChart: true,
    isDiagNorm: true,
    isDiagACF: true,
    isModalHelp: false,
    mean: null,
    std: null
  }),
  computed: {
    ...mapGetters("classification", [
      "countries",
      "partners",
      "flows",
      "dataType",
      "varType",
      "productsCPA"
    ]),
    ...mapGetters("timeseries", [
      "timeseriesCharts",
      "statusMain",
      "statusACF",
      "statusNorm"
    ]),
    options() {
      return this.getOptions(this.statusMain != "00" ? true : false)
    }
  },
  validations: {
    dataTypeSelected: {
      required
    },
    varTypeSelected: {
      required
    },
    flowSelected: {
      required
    },
    countrySelected: {
      required
    },
    partnerSelected: {
      required
    },
    productsCPASelected: {
      required
    },
    becSelected: {
      required
    }
  },
  methods: {
    helpOn(showModal) {
      this.isModalHelp = showModal
    },
    handleMainChart() {
      this.isMainChart = !this.isMainChart
    },
    handleDiagNorm() {
      this.isDiagNorm = !this.isDiagNorm
    },
    handleDiagACF() {
      this.isDiagACF = !this.isDiagACF
    },
    handleSubmit() {
      this.$v.$touch()
      if (
        !this.$v.dataTypeSelected.$invalid &&
        !this.$v.varTypeSelected.$invalid &&
        !this.$v.flowSelected.$invalid &&
        !this.$v.productsCPASelected.$invalid &&
        !this.$v.countrySelected.$invalid &&
        !this.$v.partnerSelected.$invalid
      ) {
        const form = {
          flow: this.flowSelected.id,
          var: this.productsCPASelected.id,
          country: this.countrySelected.country,
          partner: this.partnerSelected.id,
          dataType: this.dataTypeSelected.id,
          varType: this.varTypeSelected.id
        }
        this.spinnerStart(true)
        this.$store.dispatch("timeseries/findByFilters", form).then(() => {
          if (this.statusMain == Status.success) {
            this.buildTimeseriesCharts(
              this.timeseriesCharts,
              this.dataTypeSelected.descr,
              this.statusMain,
              this.statusNorm,
              this.statusACF
            )
            this.optionsNorm.title.text =
              "QQ-Norm Plot (in " + this.diagNormMag + ")"
          } else {
            this.chartDataDiagMain = this.emptyChart()
            this.mean = null
            this.std = null
            this.chartDataDiagNorm = null
            this.chartDataDiagACF = null
            this.$store.dispatch(
              "message/warning",
              this.$t("timeseries.message.empty")
            )
          }
          this.spinnerStart(false)
        })
      }
    },
    removeData(chart) {
      chart.data.labels.pop()
      chart.data.datasets.forEach((dataset) => {
        dataset.data.pop()
      })
      chart.update()
    },
    getData(data, id) {
      if (data != null) {
        return [data, id]
      }
      return null
    },
    getSearchFilter() {
      let data = []
      data.push({
        field: this.$t("timeseries.download.title"),
        value: ""
      })
      data.push({
        field: this.$t("timeseries.form.fields.dataType"),
        value: this.dataTypeSelected ? this.dataTypeSelected.descr : ""
      })
      data.push({
        field: this.$t("timeseries.form.fields.varType"),
        value: this.varTypeSelected ? this.varTypeSelected.descr : ""
      })
      data.push({
        field: this.$t("timeseries.form.fields.flow"),
        value: this.flowSelected ? this.flowSelected.descr : ""
      })
      data.push({
        field: this.$t("timeseries.form.fields.country"),
        value: this.countrySelected ? this.countrySelected.name : ""
      })
      data.push({
        field: this.$t("timeseries.form.fields.partner"),
        value: this.partnerSelected ? this.partnerSelected.descr : ""
      })
      data.push({
        field: this.$t("timeseries.form.fields.productsCPA"),
        value: this.productsCPASelected ? this.productsCPASelected.descr : ""
      })
      data.push({
        field: this.$t("common.start_date"),
        value: this.timeseriesCharts
          ? this.timeseriesCharts.diagMain.date[0]
          : ""
      })
      data.push({
        field: this.$t("common.end_date"),
        value: this.timeseriesCharts
          ? this.timeseriesCharts.diagMain.date[
              this.timeseriesCharts.diagMain.date.length - 1
            ]
          : ""
      })
      return data
    },
    getTabularData(data, id) {
      if (data != null) {
        const table = []
        const timePoints = data.date
        const values = data.series
        if (timePoints)
          timePoints.forEach((tp, index) => {
            const dt = new Date(tp)
            const year = dt.getFullYear()
            const month = dt.getMonth() + 1
            table.push({
              field: year + "-" + month,
              value: values[index]
            })
            //console.log(year + "-" + month + "," + values[index]);
          })
        return [table, id]
      }
      return null
    },
    spinnerStart(bool) {
      this.spinner = bool
    },
    clearChart() {
      document.getElementById("timeseries").removeChild("canvas")
    }
  },
  created() {
    this.$store.dispatch("coreui/setContext", Context.Policy)
  }
}
</script>
<style>
.align-right {
  text-align: right;
}
.padding-right {
  padding-left: 10px;
}
.card-header {
  padding: 1rem 1.25rem 0.7rem 1.25rem;
}
.card-header span {
  font-size: 0.875rem;
  font-weight: 500;
}
.timeseries-info {
  margin-left: 2.5em;
  margin-top: 0.4em;
  font-size: small;
}
.circle-spin {
  position: absolute;
  top: 20%;
  left: 50%;
}
.align-right {
  text-align: right;
}
</style>
