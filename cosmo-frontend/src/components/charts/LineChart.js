import { Line, mixins } from "vue-chartjs"
//import zoom from 'chartjs-plugin-zoom';
const { reactiveProp } = mixins
export default {
  extends: Line,
  mixins: [reactiveProp],
  props: {
    chartData: {
      type: Object,
      default: null
    },
    options: {
      type: Object,
      default: () => {
        return {
          responsive: true,
          maintainAspectRatio: false
        }
      }
    }
  },
  mounted() {
    //this.addPlugin(zoom);
    this.renderChart(this.chartData, this.options)
  }
}
