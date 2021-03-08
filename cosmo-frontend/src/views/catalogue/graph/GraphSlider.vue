<template>
  <div class="row">
    <div class="col-2">
      <CCard>
        <CCardHeader>
          Search filters
        </CCardHeader>
        <CCardBody>
          Add your filters here!
        </CCardBody>
      </CCard>
    </div>
    <div class="col-10">
      <div class="card">
        <header class="card-header">
          Network - Graph
          <div class="card-header-actions">
            <CButton
              shape="square"
              size="sm"
              color="primary"
              class="mr-2"
              @click="play"
              :disabled="disablePlay"
              >Play</CButton
            >
            <CButton shape="square" size="sm" color="danger" @click="stop"
              >Stop</CButton
            >
          </div>
        </header>
        <CCardBody>
          <network
            class="network"
            ref="network"
            :nodes="network.nodes"
            :edges="network.edges"
            :options="network.options"
          />
          <vue-slider
            :adsorb="true"
            v-model="counter"
            :interval="10"
            :marks="true"
            @change="handleChange"
          />
        </CCardBody>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import { Network } from "vue-visjs";
import VueSlider from "vue-slider-component";
import visMixin from "@/components/mixins/vis.mixin";

export default {
  name: "GraphVisjs",
  components: { Network, VueSlider },
  mixins: [visMixin],
  data: () => ({
    timer: null,
    counter: 0,
    ids: [
      201910,
      201911,
      201912,
      202001,
      202002,
      202003,
      202004,
      202005,
      202006,
      202007,
      202008,
      202009,
      202010
    ],
    delta: 1000,
    disablePlay: false
  }),
  computed: {
    ...mapGetters("graphVisjs", ["nodes", "edges"]),
    network() {
      return this.nodes && this.edges
        ? {
            nodes: this.nodes,
            edges: this.edges,
            options: this.options
          }
        : {
            nodes: [],
            edges: [],
            options: null
          };
    },
    sliderValue() {
      return this.counter * 8;
    }
  },
  methods: {
    handleChange(val) {
      console.log("Slider value: " + val);
      //Now you can draw the network
    },
    drawNetwork(id) {
      this.$store.dispatch("graphVisjs/findById", id);
    },
    play() {
      this.$store.dispatch("graphVisjs/clear");
      this.counter = 0;
      this.timer = setInterval(() => {
        if (this.counter < this.ids.length) {
          this.drawNetwork(this.ids[this.counter]);
          this.counter++;
        } else {
          this.stop();
        }
      }, this.delta);
      this.disablePlay = true;
    },
    stop() {
      clearInterval(this.timer);
      this.disablePlay = false;
    }
  },
  created() {
    this.$store.dispatch("graphVisjs/clear");
  }
};
</script>

<style>
.events {
  text-align: left;
  height: 50px;
}
.network {
  text-align: center;
  height: 450px;
  border: 1px solid #ccc;
  margin: 5px 0;
}
</style>
