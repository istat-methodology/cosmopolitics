<template>
  <div class="row">
    <div class="col-sm-12 col-md-12">
      <div class="card">
        <header class="card-header">
          Chartjs
          <div class="card-header-actions">
            <router-link tag="a" :to="{ name: 'Map' }">
              <add-icon />
            </router-link>
          </div>
        </header>
        <CCardBody>
          <div class="small">
            <bar-chart :chartData="chartData" :options="options" />
          </div>
        </CCardBody>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import BarChart from "@/components/charts/BarChart";
export default {
  name: "ChartjsBar",
  components: {
    BarChart
  },

  data() {
    return {
      currentColor: 0,
      colorPalette: [
        {
          border: "rgba(46, 184, 92, 1)", //green
          background: "rgba(46, 184, 92, 0.2)"
        },
        {
          border: "rgba(50, 31, 219, 1)", //blue
          background: "rgba(50, 31, 219, 0.2)"
        },
        {
          border: "rgba(229, 83, 83, 1)", //red
          background: "rgba(229, 83, 83, 0.2)"
        },
        {
          border: "rgba(249, 177, 21, 1)", //orange
          background: "rgba(249, 177, 21, 0.2)"
        },
        {
          border: "rgba(51, 153, 255, 1)", //cyan
          background: "rgba(51, 153, 255, 0.2)"
        },
        {
          border: "rgba(206, 210, 216, 1)", //gray
          background: "rgba(206, 210, 216, 0.2)"
        }
      ],
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              },
              gridLines: {
                display: true
              }
            }
          ],
          xAxes: [
            {
              gridLines: {
                display: true
              }
            }
          ]
        },
        legend: {
          display: true,
          legendPosition: "left"
        },
        responsive: true,
        maintainAspectRatio: false
      }
    };
  },
  methods: {
    getColor() {
      this.currentColor =
        this.currentColor >= this.colorPalette.length - 1
          ? 0
          : this.currentColor;
      const color = this.colorPalette[this.currentColor];
      this.currentColor++;
      return color;
    },
    clearColor() {
      this.currentColor = 0;
    }
  },
  computed: {
    ...mapGetters("chartjsBar", { covid: "charts" }),
    chartData() {
      var chartData = {};
      chartData.labels = [];
      chartData.datasets = [];
      chartData.labels = ["confirmed", "recovered", "deaths"];
      this.covid.forEach(covid => {
        const color = this.getColor();
        chartData.datasets.push({
          label: covid.province,
          backgroundColor: color.background,
          borderColor: color.border,
          borderWidth: 2,
          data: [
            covid.stats.confirmed,
            covid.stats.recovered,
            covid.stats.deaths
          ]
        });
      });
      this.clearColor();
      return chartData;
    }
  },
  created() {
    //this.$store.dispatch("chartjsBar/findByName", "Italy");
    this.$store.dispatch("chartjsBar/findAll");
  }
};
</script>
