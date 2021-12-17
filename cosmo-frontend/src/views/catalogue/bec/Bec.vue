<template>
  <div class="row">
    <div class="col-9">
      <CCard>
        <CCardHeader>
          <b>
            <span v-if="this.countrySelected && this.partnerSelected"
              >{{ this.countrySelected.name }} -
              {{ this.partnerSelected.descr }}</span
            >
            <span v-else>BEC analysis</span>
          </b>

          <label
            class="float-right sm-2 c-switch form-check-label c-switch-sm c-switch-primary"
          >
            <input
              type="checkbox"
              class="sm-2 c-switch-input form-check-input"
              checked
              @click="handleMainChart"
            />
            <span class="c-switch-slider"></span>
          </label>

          <span class="sm-2"> </span>
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
        </CCardHeader>
        <CCardBody v-show="isMainChart">
          <circle-spin v-if="this.spinner" class="circle-spin"></circle-spin>
          <scatter-chart
            :chartData="chartData"
            :options="options"
            id="bec-first-chart"
          />
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
          <b> {{ this.covidEstimationTableTitle }}</b>
          <label
            class="float-right c-switch form-check-label c-switch-sm c-switch-primary"
          >
            <input
              type="checkbox"
              class="c-switch-input form-check-input"
              @click="handleCovidEstimation"
            />
            <span class="c-switch-slider"></span>
          </label>
        </CCardHeader>
        <CCardBody v-show="isCovidEstimation">
          <CDataTable
            :items="covidEstimationDataTable"
            :fields="covidEstimationTableFileds"
            hover
          />
        </CCardBody>
      </CCard>

      <CCard v-if="modelDataTable">
        <CCardHeader>
          <b>{{ this.modelTableTitle }}</b>
          <label
            class="float-right c-switch form-check-label c-switch-sm c-switch-primary"
          >
            <input
              type="checkbox"
              class="c-switch-input form-check-input"
              @click="handleModel"
            />
            <span class="c-switch-slider"></span>
          </label>
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
          <b>{{ this.diagNormTitle }}</b>
          <label
            class="float-right c-switch form-check-label c-switch-sm c-switch-primary"
          >
            <input
              type="checkbox"
              class="c-switch-input form-check-input"
              @click="handleDiagNorm"
            />
            <span class="c-switch-slider"></span>
          </label>
        </CCardHeader>
        <CCardBody v-if="isDiagNorm">
          <scatter-chart
            :chartData="chartDataDiagNorm"
            :options="optionsNorm"
          />
        </CCardBody>
      </CCard>
      <CCard v-if="chartDataDiagRes">
        <CCardHeader>
          <b>{{ this.diagResTitle }}</b>
          <label
            class="float-right c-switch form-check-label c-switch-sm c-switch-primary"
          >
            <input
              type="checkbox"
              class="c-switch-input form-check-input"
              @click="handleDiagRes"
            />
            <span class="c-switch-slider"></span>
          </label>
        </CCardHeader>
        <CCardBody v-if="isDiagRes">
          <scatter-chart :chartData="chartDataDiagRes" :options="optionsRes" />
        </CCardBody>
      </CCard>
      <CCard v-if="chartDataDiagACF">
        <CCardHeader>
          <b>{{ this.diagACFTitle }}</b>
          <label
            class="float-right c-switch form-check-label c-switch-sm c-switch-primary"
          >
            <input
              type="checkbox"
              class="c-switch-input form-check-input"
              @click="handleDiagACF"
            />
            <span class="c-switch-slider"></span>
          </label>
        </CCardHeader>
        <CCardBody v-if="isDiagACF">
          <line-chart :chartData="chartDataDiagACF" :options="optionsACF" />
        </CCardBody>
      </CCard>
    </div>
    <div class="col-3">
      <CCard>
        <CCardHeader>
          <h6 >Prevision for Interrupted Time Series</h6>
          <h6>Trade filter</h6>
        </CCardHeader>
        <CCardBody>
          <label class="card-label">Flows:</label>
          <v-select
            label="descr"
            :options="flows"
            placeholder="Flows"
            v-model="flowSelected"
            :class="{
              'is-invalid': $v.flowSelected.$error
            }"
          />
          <label class="card-label mt-3">Country:</label>
          <v-select
            label="name"
            :options="countries"
            placeholder="Country"
            v-model="countrySelected"
            :class="{
              'is-invalid': $v.countrySelected.$error
            }"
          />
          <label class="card-label mt-3">Partner:</label>
          <v-select
            label="descr"
            :options="partners"
            placeholder="Partner"
            v-model="partnerSelected"
            :class="{
              'is-invalid': $v.partnerSelected.$error
            }"
          />
          <label class="card-label mt-3">Bec:</label>
          <v-select
            label="descr"
            :options="becs"
            placeholder="Bec"
            v-model="becSelected"
            :class="{
              'is-invalid': $v.becSelected.$error
            }"
          />
          <!--label class="card-label mt-3">Prevision:</label-->
          <!--v-select
            label="descr"
            :options="previsions"
            placeholder="Prevision"
            v-model="previsionSelected"
            :class="{
              'is-invalid': $v.previsionSelected.$error
            }"
          /-->
          <!--template v-if="isForecasting">
            <div class="col-12">
              <div class="row">
                <label for="country" class="card-label mt-3"
                  >Time & Restriction:</label
                >
              </div>
              <div class="row">
                <div v-for="(item, index) in prevision" v-bind:key="index">
                  <div role="group" class="custom-control custom-checkbox">
                    <input
                      type="checkbox"
                      class="custom-control-input"
                      v-bind:id="item.month"
                      v-bind:name="item.month"
                      v-bind:value="item.restriction"
                      v-model="item.selected"
                    />
                    <label
                      v-bind:for="item.month"
                      class="custom-control-label"
                      >{{ item.month }}</label
                    >
                  </div>
                  <input
                    type="number"
                    placeholder="0"
                    step="0.01"
                    min="0"
                    max="1"
                    class="form-control"
                    v-model="item.restriction"
                  />
                </div>
              </div>
            </div>
          </template-->
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
//import { required, helpers } from "vuelidate/lib/validators";
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
    isCovidEstimation: false,
    isModel: false,
    isDiagNorm: false,
    isDiagRes: false,
    isDiagACF: false,
    download_status: "Download Charts"
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
    /*isForecasting() {
      var forecast = false;
      if (
        this.previsionSelected &&
        this.flowSelected &&
        this.countrySelected &&
        this.partnerSelected
      ) {
        if (this.previsionSelected.id == 2) {
          this.createForecast();
          forecast = true;
        } else {
          forecast = false;
        }
      }
      return forecast;
    },
    */
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
    handleCheck(month, event) {
      console.log(event);
      alert(month);
    },
    /*
    createForecast() {
      const form = {
        flow: this.flowSelected.id,
        country: this.countrySelected.country,
        partner: this.partnerSelected.id
      };
      this.$store.dispatch("bec/findLastDate", form).then(() => {
        var yearOfBec = this.becDate[0].substr(2, 2);
        var monthOfBec = parseInt(this.becDate[0].substr(5, 2));
        var month = monthOfBec + 1;
        var year = parseInt(yearOfBec);

        this.prevision = [];
        // loop to draw 6 month
        for (var i = 1; i <= 6; i++) {
          if (month > 12) {
            month = 1;
            year = parseInt(year) + 1;
          }
          var iMonth = month - 1;
          var monthName = this.months[iMonth];
          var monthShortName = monthName.substr(0, 3);
          var element = monthShortName + "-" + year;
          this.prevision.push({
            selected: false,
            month: element,
            restriction: 0
          });
          month = month + 1;
        }
      });
    },
    */
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
        /*
        if (this.isForecasting) {
          var restriction = [];
          this.prevision.forEach(element => {
            if (element.selected) {
              restriction.push(element.restriction);
            }
          });
          form.fcstpolind = restriction.join(",");
        }
        */
        this.$store.dispatch("bec/findByFilters", form).then(() => {
          this.buildBecCharts(this.becCharts);
          if (this.timeLapse) {
            this.chartData = this.getBecChart(0);
            this.isSlider = true;
          }
        });
      }
    },
    getJson() {
      if (this.chartData != null) {
        let bec = [];
        for (let i = 0; i < this.chartData.datasets.length; i++) {
          let obj = {};
          obj[this.chartData.datasets[i].label] = this.chartData.datasets[
            i
          ].data;
          bec.push(obj);
        }
        let jsonData = JSON.stringify(bec);
        return jsonData;
      }
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
}</style
>>
