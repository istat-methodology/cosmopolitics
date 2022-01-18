var previusYear = "2019";
var currentYear = "2020";

export default {
  data: () => ({
    isInfo: false,
    infoTitle: "",
    mainFields: [{
        key: "Year",
        label: ""
      },
      {
        key: previusYear,
        label: previusYear
      },
      {
        key: currentYear,
        label: currentYear
      }
    ],
    importFields: [{
        key: "main_p_" + previusYear,
        label: "Main partners " + previusYear
      },
      {
        key: "tot_imp_" + previusYear,
        label: "Total import " + previusYear
      },
      {
        key: "main_p_" + currentYear,
        label: "Main partners " + currentYear
      },
      {
        key: "tot_imp_" + currentYear,
        label: "Total import " + currentYear
      }
    ],
    exportFields: [{
        key: "main_p_" + previusYear,
        label: "Main partners " + previusYear
      },
      {
        key: "tot_exp_" + previusYear,
        label: "Total export " + previusYear
      },
      {
        key: "main_p_" + currentYear,
        label: "Main partners " + currentYear
      },
      {
        key: "tot_exp_" + currentYear,
        label: "Total export " + currentYear
      }
    ],
    importGoodsFields: [{
        key: "main_g_" + previusYear,
        label: "Main goods " + previusYear
      },
      {
        key: "tot_imp_" + previusYear,
        label: "Total import " + previusYear
      },
      {
        key: "main_g_" + currentYear,
        label: "Main goods " + currentYear
      },
      {
        key: "tot_imp_" + currentYear,
        label: "Total import " + currentYear
      }
    ],
    exportGoodsFields: [{
        key: "main_g_" + previusYear,
        label: "Main goods " + previusYear
      },
      {
        key: "tot_exp_" + previusYear,
        label: "Total export " + previusYear
      },
      {
        key: "main_g_" + currentYear,
        label: "Main goods " + currentYear
      },
      {
        key: "tot_exp_" + currentYear,
        label: "Total export " + currentYear
      }
    ],
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
    },
  },
};