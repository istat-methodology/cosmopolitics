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
                @click="helpOn(true)"
              >
                i
              </button>
            </span>
            <span class="float-right">
              <exporter
                filename="cosmopolitics_timeseries"
                :data="getData(chartData, 'timeseries')"
              >
              </exporter>
            </span>
          </span>
        </CCardHeader>
        <CCardBody v-show="isMainChart">
          <circle-spin v-if="this.spinner" class="circle-spin"></circle-spin>
          <scatter-chart
            :chartData="chartData"
            :options="options"
            id="timeseries"
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
        </CCardHeader>
        <CCardBody>
          <label class="card-label"
            >{{ $t("timeseries.form.fields.flow") }}*</label
          >
          <v-select
            label="descr"
            :options="flows"
            :placeholder="$t('timeseries.form.fields.flow_placeholder')"
            v-model="flowSelected"
            :class="{
              'is-invalid': $v.flowSelected.$error
            }"
          />
          <label class="card-label mt-3" :title="this.countryFilter"
            >{{ $t("timeseries.form.fields.country") }}*</label
          >
          <v-select
            label="name"
            :options="countries"
            :placeholder="$t('timeseries.form.fields.country_placeholder')"
            v-model="countrySelected"
            :class="{
              'is-invalid': $v.countrySelected.$error
            }"
          />
          <label class="card-label mt-3" :title="this.partnerFilter"
            >{{ $t("timeseries.form.fields.partner") }}*</label
          >
          <v-select
            label="descr"
            :options="partners"
            :placeholder="$t('timeseries.form.fields.partner_placeholder')"
            v-model="partnerSelected"
            :class="{
              'is-invalid': $v.partnerSelected.$error
            }"
          />
          <label class="card-label mt-3" :title="this.becFilter"
            >{{ $t("timeseries.form.fields.bec") }}*</label
          >
          <v-select
            label="descr"
            :options="becs"
            :placeholder="$t('timeseries.form.fields.bec_placeholder')"
            v-model="becSelected"
            :class="{
              'is-invalid': $v.becSelected.$error
            }"
          />
          <p class="card-label mt-3">*{{ $t("common.mandatory") }}</p>
          <CButton
            color="primary"
            shape="square"
            size="sm"
            @click="handleSubmit"
            class="mt-2"
            >{{ $t("common.submit") }}</CButton
          >
        </CCardBody>
      </CCard>
    </div>
    <CModal
      :title="$t('timeseries.modal.main.title')"
      :show.sync="isModalHelp"
      size="lg"
    >
      <p v-html="$t('timeseries.modal.main.body')"></p>
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
import timeseriesDiagMixin from "@/components/mixins/timeseriesDiag.mixin";
import timeseriesMixin from "@/components/mixins/timeseries.mixin";
import ScatterChart from "@/components/charts/ScatterChart";
import LineChart from "@/components/charts/LineChart";
import { required } from "vuelidate/lib/validators";
import spinnerMixin from "@/components/mixins/spinner.mixin";
import exporter from "@/components/Exporter";

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
    flowSelected: null,
    countrySelected: null,
    partnerSelected: null,
    becSelected: null,
    
    //timeSelected: null,

    chartData: null,
    chartDataDiagNorm: null,
    chartDataDiagACF: null,


    isMainChart: true,
    isDiagNorm: true,
    isDiagACF: true,

    //download_status: "Download Charts",
    //modalHelpTitle: " About on ",
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
      "timeNext"
    ]),
    ...mapGetters("timeseries", ["timeseriesCharts", "timeseriesDate"]),
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
    }
  },
  methods: {
    helpOn(showModal) {
      this.isModalHelp = showModal;
      this.modalHelpTitle = "About map";
    },
    handleMainChart() {
      this.isMainChart = !this.isMainChart;
    },

    handleDiagNorm() {
      this.isDiagNorm = !this.isDiagNorm;
    },
    handleDiagACF() {
      this.isDiagACF = !this.isDiagACF;
    },
    handleSubmit() {
      this.$v.$touch();
      this.spinnerStart(true);
      if (
        !this.$v.flowSelected.$invalid &&
        !this.$v.becSelected.$invalid &&
        !this.$v.countrySelected.$invalid &&
        !this.$v.partnerSelected.$invalid
      ) {
        const form = {
          flow: this.flowSelected.id,
          var: this.becSelected.id,
          country: this.countrySelected.country,
          partner: this.partnerSelected.id,
          fcst: 0
        };
        this.$store.dispatch("timeseries/findByFilters", form).then(() => {
          this.buildTimeseriesCharts(this.timeseriesCharts);
          if (this.timeLapse) {
            this.spinnerStart(false);
            this.chartData = this.getTimeseriesChart();
          }
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
    }
  },
  created() {
    this.$store.dispatch("coreui/setContext", Context.Policy);
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
.circle-spin {
  position: absolute;
  top: 20%;
  left: 50%;
}
.align-right {
  text-align: right;
}
</style>
