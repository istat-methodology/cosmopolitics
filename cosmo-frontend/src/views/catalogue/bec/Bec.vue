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
                  @click="handleMainChart"
                />
                <span class="c-switch-slider"></span>
              </label>
            </span>
            <span class="padding-right">
              <span v-if="this.countrySelected && this.partnerSelected"
                >{{ $t("timeseries.card.title") }}:
                {{ this.countrySelected.name }} -
                {{ this.partnerSelected.descr }}</span
              >
              <span v-else
                >{{ $t("timeseries.card.title") }} –
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
                @click="helpOn(true)"
              >
                i
              </button>
            </span>
            <span class="float-right">
              <exporter
                filename="cosmopolitics_bec"
                :data="getData(chartData, 'bec')"
                :options="['jpeg', 'png', 'pdf', 'json']"
              >
              </exporter>
            </span>
          </span>
        </CCardHeader>
        <CCardBody v-show="isMainChart">
          <circle-spin v-if="this.spinner" class="circle-spin"></circle-spin>
          <scatter-chart :chartData="chartData" :options="options" id="bec" />
          <vue-slider
            v-if="isSlider"
            :adsorb="true"
            :tooltip="'none'"
            v-model="policyPeriodValue"
            :data="sliderPeriod"
            :data-value="'id'"
            :data-label="'name'"
            @change="handleCounterChange"
          />
        </CCardBody>
      </CCard>

      <CCard v-if="covidEstimationDataTable">
        <CCardHeader>
          <span class="float-left">
            <span class="float-left">
              <label class="form-check-label c-switch c-switch-sm">
                <input
                  type="checkbox"
                  class="form-check-input c-switch-input"
                  checked
                  @click="handleCovidEstimation"
                />
                <span class="c-switch-slider"></span>
              </label>
            </span>
            <span class="padding-right">
              <b> {{ this.covidEstimationTableTitle }}</b>
            </span>
          </span>
          <span class="float-right">
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
            <span class="float-right">
              <exporter
                filename="cosmopolitics_covidestimation"
                :data="
                  getData(
                    this.getDataFromTable(this.covidEstimationDataTable),
                    'covidEstimation'
                  )
                "
                :options="['csv']"
              >
              </exporter>
            </span>
          </span>
        </CCardHeader>
        <CCardBody v-show="isCovidEstimation">
          <CDataTable :items="covidEstimationDataTable" hover />
        </CCardBody>
      </CCard>

      <CCard v-if="modelDataTable">
        <CCardHeader>
          <span class="float-left">
            <span class="float-left">
              <label class="form-check-label c-switch c-switch-sm">
                <input
                  type="checkbox"
                  class="form-check-input c-switch-input"
                  checked
                  @click="handleModel"
                />
                <span class="c-switch-slider"></span>
              </label>
            </span>
            <span class="padding-right">
              <b>{{ this.modelTableTitle }}</b>
            </span>
          </span>
          <span class="float-right">
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
            <span class="float-right">
              <exporter
                filename="cosmopolitics_model"
                :data="
                  getData(this.getDataFromTable(this.modelDataTable), 'model')
                "
                :options="['csv']"
              >
              </exporter>
            </span>
          </span>
          <!--modelDataTable,'model'-->
        </CCardHeader>
        <CCardBody v-show="isModel">
          <CDataTable
            :items="modelDataTable"
            :fields="modelTableFileds"
            hover
          />
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
                  @click="handleDiagNorm"
                />
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
                @click="helpOn(true)"
              >
                i
              </button>
            </span>
            <span class="float-right">
              <exporter
                filename="cosmopolitics_diagnorm"
                :data="getData(chartDataDiagNorm, 'diagnorm')"
                :options="['jpeg', 'png', 'pdf', 'json']"
              >
              </exporter>
            </span>
          </span>
        </CCardHeader>
        <CCardBody v-if="isDiagNorm">
          <scatter-chart
            :chartData="chartDataDiagNorm"
            :options="optionsNorm"
            id="diagnorm"
          />
        </CCardBody>
      </CCard>
      <CCard v-if="chartDataDiagRes">
        <CCardHeader>
          <span class="float-left">
            <span class="float-left">
              <label class="form-check-label c-switch c-switch-sm">
                <input
                  type="checkbox"
                  class="form-check-input c-switch-input"
                  checked
                  @click="handleDiagRes"
                />
                <span class="c-switch-slider"></span>
              </label>
            </span>
            <span class="padding-right">
              <b>{{ this.diagResTitle }}</b>
            </span>
          </span>
          <span class="float-right">
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
            <span class="float-right">
              <exporter
                filename="cosmopolitics_diagres"
                :data="getData(chartDataDiagRes, 'diagres')"
                :options="['jpeg', 'png', 'pdf', 'json']"
              >
              </exporter>
            </span>
          </span>
        </CCardHeader>
        <CCardBody v-if="isDiagRes">
          <scatter-chart
            :chartData="chartDataDiagRes"
            :options="optionsRes"
            id="diagres"
          />
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
                  @click="handleDiagACF"
                />
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
                @click="helpOn(true)"
              >
                i
              </button>
            </span>
            <span class="float-right">
              <exporter
                filename="cosmopolitics_diagacf"
                :data="getData(chartDataDiagACF, 'diagacf')"
                :options="['jpeg', 'png', 'pdf', 'json']"
              >
              </exporter>
            </span>
          </span>
        </CCardHeader>
        <CCardBody v-if="isDiagACF">
          <line-chart
            :chartData="chartDataDiagACF"
            :options="optionsACF"
            id="diagacf"
          />
        </CCardBody>
      </CCard>
    </div>
    <div class="col-3">
      <CCard>
        <CCardHeader>
          <span class="float-left">{{ $t("timeseries.form.title") }}</span>
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
        </CCardHeader>
        <CCardBody>
          <label class="card-label">{{
            $t("timeseries.form.fields.flow")
          }}</label>
          <v-select
            label="descr"
            :options="flows"
            :placeholder="$t('timeseries.form.fields.flow_placeholder')"
            v-model="flowSelected"
            :class="{
              'is-invalid': $v.flowSelected.$error
            }"
          />
          <label class="card-label mt-3" :title="this.countryFilter">{{
            $t("timeseries.form.fields.country")
          }}</label>
          <v-select
            label="name"
            :options="countries"
            :placeholder="$t('timeseries.form.fields.country_placeholder')"
            v-model="countrySelected"
            :class="{
              'is-invalid': $v.countrySelected.$error
            }"
          />
          <label class="card-label mt-3" :title="this.partnerFilter">{{
            $t("timeseries.form.fields.partner")
          }}</label>
          <v-select
            label="descr"
            :options="partners"
            :placeholder="$t('timeseries.form.fields.partner_placeholder')"
            v-model="partnerSelected"
            :class="{
              'is-invalid': $v.partnerSelected.$error
            }"
          />
          <label class="card-label mt-3" :title="this.becFilter">{{
            $t("timeseries.form.fields.bec")
          }}</label>
          <v-select
            label="descr"
            :options="becs"
            :placeholder="$t('timeseries.form.fields.bec_placeholder')"
            v-model="becSelected"
            :class="{
              'is-invalid': $v.becSelected.$error
            }"
          />
          <CButton
            color="primary"
            shape="square"
            size="sm"
            @click="handleSubmit"
            class="mt-4"
            >{{ $t("common.submit") }}</CButton
          >
        </CCardBody>
      </CCard>
    </div>
    <CModal
      title="Time Series visualizatiion"
      :show.sync="isModalHelp"
      size="lg"
    >
      Effective visualization tool for monthly Comext foreign trade data series.
      despite the amount of underlying data, they allow an easily understandable
      reading. useful as a dissemination tool. series are provided in value and
      quantity, with indication of descriptive statistics and the possibility of
      downloading
      <template #footer>
        <CButton color="outline-primary" square size="sm" @click="helpOn(false)"
          >Close</CButton
        >
      </template>
    </CModal>
  </div>

  <!--circle-spin
    v-bind:loading="isLoading"
    class="circle-spin"
  ></circle-spin-->
</template>
<script>
import { mapGetters } from "vuex";
import { Context } from "@/common";
import paletteMixin from "@/components/mixins/palette.mixin";
import becDiagMixin from "@/components/mixins/becDiag.mixin";
import becMixin from "@/components/mixins/bec.mixin";
import ScatterChart from "@/components/charts/ScatterChart";
import LineChart from "@/components/charts/LineChart";
import VueSlider from "vue-slider-component";
import { required } from "vuelidate/lib/validators";
import spinnerMixin from "@/components/mixins/spinner.mixin";
import exporter from "@/components/Exporter";

export default {
  name: "Bec",
  components: {
    ScatterChart,
    LineChart,
    VueSlider,
    exporter
  },
  mixins: [paletteMixin, becDiagMixin, becMixin, spinnerMixin],
  data: () => ({
    spinner: false,
    //Form fields
    flowSelected: null,
    countrySelected: null,
    partnerSelected: null,
    becSelected: null,
    previsionSelected: null,
    timeSelected: null,

    prevision: [],
    chartData: null,
    chartDataDiagNorm: null,
    chartDataDiagRes: null,
    chartDataDiagACF: null,

    policyPeriodValue: "",
    policyPeriod: [],

    isSlider: false,

    isMainChart: true,
    isCovidEstimation: true,
    csvCovidEstimation: "",
    isModel: true,
    csvModel: "",
    isDiagNorm: true,
    isDiagRes: true,
    isDiagACF: true,
    download_status: "Download Charts",
    modalHelpTitle: " About on ",
    isModalHelp: false,

    // help on filter as title
    flowFilter: "digit flows",
    countryFilter: "digit Country",
    partnerFilter: "digit Partner",
    becFilter: "digit Bec"
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
    ...mapGetters("bec", ["becCharts", "becDate"]),

    sliderPeriod() {
      return this.getBecSlider();
    },
    options() {
      return this.getOptions(this.startSeries.min, this.startSeries.year);
    }
  },
  validations: {
    flowSelected: {
      required
    },
    countrySelected: {
      required
    },
    partnerSelected: {
      required
    },
    becSelected: {
      required
    },
    previsionSelected: {
      required
    }
  },
  methods: {
    helpOn(showModal) {
      this.isModalHelp = showModal;
      this.modalHelpTitle = "About map";
    },
    handleCheck(month, event) {
      console.log(event);
      alert(month);
    },

    handleCounterChange(val) {
      var iVal = this.getBecSliderVal(val);
      if (iVal <= this.maxTimeStep) {
        this.chartData = this.getBecChart(iVal);
      }
    },
    handleMainChart() {
      this.isMainChart = !this.isMainChart;
    },
    handleDiagRes() {
      this.isDiagRes = !this.isDiagRes;
    },
    handleDiagNorm() {
      this.isDiagNorm = !this.isDiagNorm;
    },
    handleDiagACF() {
      this.isDiagACF = !this.isDiagACF;
    },
    handleCovidEstimation() {
      this.isCovidEstimation = !this.isCovidEstimation;
    },
    handleModel() {
      this.isModel = !this.isModel;
    },
    handleSubmit() {
      this.$v.$touch(); //validate form data

      if (
        !this.$v.flowSelected.$invalid &&
        !this.$v.becSelected.$invalid &&
        !this.$v.countrySelected.$invalid &&
        !this.$v.partnerSelected.$invalid
        //&&
        //!this.$v.previsionSelected.$invalid
      ) {
        const form = {
          flow: this.flowSelected.id,
          var: this.becSelected.id,
          country: this.countrySelected.country,
          partner: this.partnerSelected.id,
          fcst: 0 // this.previsionSelected.id
        };

        this.$store.dispatch("bec/findByFilters", form).then(() => {
          this.buildBecCharts(this.becCharts);
          if (this.timeLapse) {
            this.chartData = this.getBecChart(0);
            this.isSlider = true;
          }
        });
      }
    },
    getData(data, id) {
      if (data != null) {
        var arr = [];
        if (id == "model") {
          arr[2] = data;
        } else if (id == "covidEstimation") {
          arr[2] = data;
        } else {
          let dat = [];
          for (let i = 0; i < data.datasets.length; i++) {
            let obj = {};
            obj[data.datasets[i].label] = data.datasets[i].data;
            dat.push(obj);
          }
          let jsonData = JSON.stringify(dat);
          arr[0] = jsonData;
          let canvas = document.getElementById(id);
          arr[1] = canvas;
        }
        return arr;
      }
    },

    spinnerStart(bool) {
      this.spinner = bool;
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
</style>
