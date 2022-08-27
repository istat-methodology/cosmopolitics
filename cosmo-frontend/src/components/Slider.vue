<template>
  <div>
    <vue-slider
      v-if="interval"
      :adsorb="true"
      :tooltip="'none'"
      v-model="selectedPeriod"
      :data="interval"
      :data-value="'id'"
      :data-label="'name'" />
  </div>
</template>
<script>
import VueSlider from "vue-slider-component"

export default {
  name: "Slider",
  components: { VueSlider },
  data: () => ({
    timeout: null
  }),
  props: {
    interval: {
      type: Array,
      default: () => null
    },
    currentTime: {
      type: Object,
      default: () => ({ id: "202003", selectName: "Mar 20" })
    }
  },
  computed: {
    selectedPeriod: {
      get() {
        return this.currentTime ? this.currentTime.id : "202003"
      },
      set(value) {
        //debounce
        if (this.timeout) clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          console.log("Changed!")
          this.$emit("change", this.getSelectedPeriod(value))
        }, 300)
      }
    }
  },
  methods: {
    getSelectedPeriod(selectedId) {
      return this.interval.find((period) => period.id == selectedId)
    }
  }
}
</script>
<style scoped>
.vue-slider {
  margin: 2rem;
}
</style>
