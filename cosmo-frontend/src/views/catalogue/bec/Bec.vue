<template>
  <div class="row">
    <div class="col-9">
      <CCard> 
        <CCardHeader>
          <b><span v-if="this.countrySelected && this.partnerSelected"
            >{{ this.countrySelected.country }} -
            {{ this.partnerSelected.descr }}</span
          ><span v-else>BEC analysis</span></b>
          <label class="float-right c-switch form-check-label c-switch-sm c-switch-info">
              <input type="checkbox" class="c-switch-input form-check-input" checked @click="handleMainChart">
              <span class="c-switch-slider"></span>
           </label>
        </CCardHeader>
        <CCardBody v-show="isMainChart">
          <scatter-chart :chartData="chartData" :options="options" />
          <vue-slider
            v-if="showSlider"
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
      
      <CCard v-if="covidEstimationDataTable" >
        <CCardHeader>
            <b> {{ this.covidEstimationTableTitle }}</b>
            <label class="float-right c-switch form-check-label c-switch-sm c-switch-info">
              <input type="checkbox" class="c-switch-input form-check-input"  @click="handleCovidEstimation">
              <span class="c-switch-slider"></span>
            </label>
        </CCardHeader>
        <CCardBody v-show="isCovidEstimation">
          <CDataTable  :items="covidEstimationDataTable" :fields="covidEstimationTableFileds" hover />
        </CCardBody>
      </CCard>
      
      <CCard v-if="modelDataTable">
        <CCardHeader >
            <b>{{ this.modelTableTitle }}</b>
            <label class="float-right c-switch form-check-label c-switch-sm c-switch-info">
              <input type="checkbox" class="c-switch-input form-check-input"  @click="handleModel">
              <span class="c-switch-slider"></span>
            </label>
        </CCardHeader>
        <CCardBody v-show="isModel">
          <CDataTable  :items="modelDataTable" :fields="modelTableFileds" hover />         
        </CCardBody>
      </CCard>


      <CCard v-if="chartDataDiagNorm"> 
        <CCardHeader>
          <b>{{ this.diagNormTitle }}</b>
          <label class="float-right c-switch form-check-label c-switch-sm c-switch-info">
              <input type="checkbox" class="c-switch-input form-check-input"  @click="handleDiagNorm">
              <span class="c-switch-slider"></span>
           </label>
        </CCardHeader>
        <CCardBody v-if="isDiagNorm">
          <scatter-chart :chartData="chartDataDiagNorm" :options="options" />
        </CCardBody>
      </CCard>
      <CCard v-if="chartDataDiagRes"> 
        <CCardHeader>
          <b>{{ this.diagResTitle }}</b>
          <label class="float-right c-switch form-check-label c-switch-sm c-switch-info">
              <input type="checkbox" class="c-switch-input form-check-input"  @click="handleDiagRes">
              <span class="c-switch-slider"></span>
           </label>
        </CCardHeader>
        <CCardBody v-if="isDiagRes">
          <scatter-chart :chartData="chartDataDiagRes" :options="options" />
        </CCardBody>
      </CCard>
      <CCard v-if="chartDataDiagACF">
        <CCardHeader>
          <b>{{ this.diagACFTitle }}</b>
          <label class="float-right c-switch form-check-label c-switch-sm c-switch-info">
              <input type="checkbox" class="c-switch-input form-check-input"  @click="handleDiagACF">
              <span class="c-switch-slider"></span>
           </label>
        </CCardHeader>
        <CCardBody v-if="isDiagACF">
          <line-chart :chartData="chartDataDiagACF" :options="optionsLine" />
        </CCardBody>
      </CCard>
        
    </div>
    <div class="col-3">
      <CCard>
        <CCardHeader>
          Trade filter
        </CCardHeader>
        <CCardBody>
          <label for="country" class="card-label">Flows:</label>
          <v-select
            label="descr"
            :options="flows"
            placeholder="Flows"
            v-model="flowSelected"
          />
          <label for="country" class="card-label mt-3">Country:</label>
          <v-select
            label="name"
            :options="countries"
            placeholder="Country"
            v-model="countrySelected"
          />
          <label for="country" class="card-label mt-3">Partner:</label>
          <v-select
            label="descr"
            :options="partners"
            placeholder="Partner"
            v-model="partnerSelected"
          />
          <label for="country" class="card-label mt-3">Bec:</label>
          <v-select
            label="descr"
            :options="becs"
            placeholder="Bec"
            v-model="becSelected"
          />
          <label for="country" class="card-label mt-3">Prevision:</label>
          <v-select
            label="descr"
            :options="previsions"
            placeholder="Prevision"
            v-model="previsionSelected"
          />
          <template v-if="isForecasting">
            <label for="country" class="card-label mt-3">Time:</label>
            <v-select
              label="descr"
              :options="timeNext"
              placeholder="Prevision"
              v-model="timeSelected"
            />
            <CInput
              label="Restriction"
              placeholder="Set restriction"
              class="card-label mt-2"
              v-model="restriction"
            />
          </template>
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
import scatterMixin from "@/components/mixins/scatter.mixin";
import becMixin from "@/components/mixins/bec.mixin";
import ScatterChart from "@/components/charts/ScatterChart";
import LineChart from "@/components/charts/LineChart";
import VueSlider from "vue-slider-component";

export default {
  name: "Bec",
  components: {
    ScatterChart,
    LineChart,
    VueSlider
  },
  mixins: [paletteMixin, scatterMixin, becMixin],
  data: () => ({
    //Form fields
    flowSelected: null,
    countrySelected: null,
    partnerSelected: null,
    becSelected: null,
    previsionSelected: null,
    timeSelected: null,
    restriction: 0,
    showSlider: false,
    
    chartData: null,

    chartDataDiagNorm: null,
    chartDataDiagRes: null,
    chartDataDiagACF: null,

    timeLapse: null,
    maxTimeStep: 0,
    
    policyPeriodValue: "",
    policyPeriod: [],   
    
    isMainChart:true,

    isCovidEstimation:false,
    isModel:false,
    
    isDiagNorm:false,
    isDiagRes:false,
    isDiagACF:false,
    
    
    optionsLine:{

        responsive: true,
        maintainAspectRatio: false,
        legend:{
            display:true
           
        },
        
        title: {
            display: true,
            text: "AUTOCORRELATION",
            fontColor: "#404040",
            fontSize: 16,
            fontWeight: "bold",
            verticalAlign: "top",
            horizontalAlign: "center",
            padding: 0,
            fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif"
        },
      scales: {            
            xAxes: [{
              scaleLabel: {
                display: true,
                fontSize: 16,
                fontWeight: "bold",
                fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif",                                  
                labelString: "Lag"
              },
              ticks: {
                stepSize: 0.1
              }
            }
          ],
          yAxes: [{       
              scaleLabel: {
                display: true,
                fontSize: 16,
                fontWeight: "bold",
                fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif",                
                labelString: "ACF"
              },
              ticks: {
                stepSize: 0.1
              }
            }
         ],       
       }
     }
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
    ...mapGetters("bec", ["becCharts"]),
    isForecasting() {
      var forecast = false;
      if (this.previsionSelected)
        forecast = this.previsionSelected.id == 2 ? true : false;
      return forecast;
    },
    sliderPeriod() {
      return this.getBecSlider();
    }
  },
  methods: {
    handleCounterChange(val) {
      var iVal = this.getBecSliderVal(val);
      if (iVal <= this.maxTimeStep) {
        this.chartData = this.getBecChart(iVal);
      }
    },
    handleMainChart(){
      this.isMainChart = !this.isMainChart;     
    },
    handleDiagRes(){
      this.isDiagRes = !this.isDiagRes;     
    },
    handleDiagNorm(){
      this.isDiagNorm = !this.isDiagNorm;     
    },
    handleDiagACF(){
      this.isDiagACF = !this.isDiagACF;     
    },
    handleCovidEstimation(){
      this.isCovidEstimation = !this.isCovidEstimation;     
    },
    handleModel(){
      this.isModel = !this.isModel;     
    },
    handleSubmit() {
      const form = {
        flow: this.flowSelected.id,
        var: this.becSelected.id,
        country: this.countrySelected.country,
        partner: this.partnerSelected.id,
        fcst: this.previsionSelected.id
      };
      if (this.isForecasting) {
        form.fcstpolind = this.restriction;
      }
      this.$store.dispatch("bec/findByFilters", form).then(() => {
        this.buildBecCharts(this.becCharts);
        if (this.timeLapse) {         
          this.chartData = this.getBecChart(0);
          this.showSlider = true;
        }
      });     
    }, 
  },
  created() {
    this.$store.dispatch("coreui/setContext", Context.Policy);
    this.$store.dispatch("classification/getCountries");
    this.$store.dispatch("classification/getPartners");
    this.$store.dispatch("classification/getBecs");      
  }
};
</script>
