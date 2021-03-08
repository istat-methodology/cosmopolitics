<template>
  <div class="row">
    <div class="col-9">
      <div class="card">
        <CCardBody>
          <CTabs variant="tabs" :active-tab="1">
            <CTab>
              <template #title>
                <span>Data</span>
              </template>
              <CCard class="card-no-shadow">
                <CCardBody>
                  <CDataTable
                    :items="mobilities"
                    :fields="importFields"
                    hover
                  />
                </CCardBody>
              </CCard>
            </CTab>
            <CTab>
              <template #title>
                <span>Grocery Pharmacy</span>
              </template>
              <CCard class="card-no-shadow">
                <CCardBody>
                  <line-chart
                    :chartData="chartGroceryPharmacy"
                    :options="options"
                  />
                </CCardBody>
              </CCard>
            </CTab>
            <CTab>
              <template #title>
                <span>Parks</span>
              </template>
              <CCard class="card-no-shadow">
                <CCardBody>
                  <line-chart :chartData="chartParks" :options="options" />
                </CCardBody>
              </CCard>
            </CTab>
          </CTabs>
        </CCardBody>
      </div>
    </div>
    <div class="col-3">
      <CCard>
        <CCardHeader>
          Mobility filter
        </CCardHeader>
        <CCardBody>
          <label for="country" class="card-label">Country:</label>
          <v-select
            label="name"
            :options="countries"
            placeholder="Country"
            v-model="countrySelected"
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
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { Context } from "@/common";
import mobilityMixin from "@/components/mixins/mobility.mixin";
import LineChart from "@/components/charts/LineChart";
import chartMixin from "@/components/mixins/chart.mixin";

export default {
  name: "Mobility",
  components: {
    LineChart
  },
  mixins: [mobilityMixin, chartMixin],
  data: () => ({
    //Form fields
    countrySelected: null,
    activeTab: 1,
    importFields: [
      { key: "row", label: "" },
      { key: "Retail", label: "Retail" },
      { key: "Pharmacy", label: "Pharmacy" },
      { key: "Parks", label: "Parks" },
      { key: "Station", label: "Station" },
      { key: "Workplaces", label: "Workplaces" },
      { key: "Residential", label: "Residential" }
    ]
  }),
  computed: {
    ...mapGetters("classification", ["countries", "timeNext"]),
    ...mapGetters("mobility", [
      "mobilities",
      "chartGroceryPharmacy",
      "chartParks"
    ])
  },
  methods: {
    handleSubmit() {
      if (this.countrySelected) {
        this.$store.dispatch("mobility/findByName", {
          region: this.countrySelected.name,
          subregion: this.countrySelected.name
        });
        this.$store.dispatch("mobility/chartsByName", {
          region: this.countrySelected.name,
          subregion: this.countrySelected.name
        });
        this.countryName = this.countrySelected.name;
      }
    }
  },
  created() {
    this.$store.dispatch("coreui/setContext", Context.Mobility);
    this.$store.dispatch("classification/getCountries");
    this.$store.dispatch("mobility/findByName", {
      region: "Italy",
      subregion: "Italy"
    });
    this.$store.dispatch("mobility/chartsByName", {
      region: "Italy",
      subregion: "Italy"
    });
  }
};
</script>
