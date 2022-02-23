export default {
  data: () => ({
    isInfo: false,
    infoTitle: "",
    mainFields: [
      {
        key: "Year",
        label: ""
      },
      {
        key: "2019",
        label: "2019"
      },
      {
        key: "2020",
        label: "2020"
      }
    ]
  }),
  methods: {
    openInfo(marker) {
      this.$store.dispatch("geomap/getInfo", marker.country).then(() => {
        this.isInfo = true;
        this.infoTitle = marker.name;
      });
    },
    openInfoOnFeature(e) {
      var name = e.layer.feature.properties.admin;
      var code = e.layer.feature.properties.iso_a2;
      this.$store.dispatch("geomap/getInfo", code).then(() => {
        this.isInfo = true;
        this.infoTitle = name;
      });
    },
    openInfoStart(code, name) {
      this.$store.dispatch("geomap/getInfo", code).then(() => {
        this.isInfo = true;
        this.infoTitle = name;
      });
    },
    closeInfo() {
      this.isInfo = false;
    }
  }
};
