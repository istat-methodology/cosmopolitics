export default {
    data: () => ({
        isInfo: false,
        infoTitle: "",
        mainFields: [
          { key: "Year", label: "" },
          { key: "2019", label: "2019" },
          { key: "2020", label: "2020" }
        ],
        importFields: [
          { key: "main_p_2019", label: "Main partner 2019"},
          { key: "tot_imp_2019", label: "Total import 2019" },
          { key: "main_p_2020", label: "Main partner 2020" } ,
          { key: "tot_imp_2020", label: "Total import 2020" }
        ],
        exportFields: [
          { key: "main_p_2019", label: "Main partner 2019" },
          { key: "tot_exp_2019", label: "Total export 2019" },
          { key: "main_p_2020", label: "Main partner 2020" },
          { key: "tot_exp_2020", label: "Total export 2020" }
        ],
        importGoodsFields: [
          { key: "main_g_2019", label: "Main goods 2019" },
          { key: "tot_imp_2019", label: "Total import 2019" },
          { key: "main_g_2020", label: "Main goods 2020" },
          { key: "tot_imp_2020", label: "Total import 2020"}
        ],
        exportGoodsFields: [
          { key: "main_g_2019", label: "Main goods 2019" },
          { key: "tot_exp_2019", label: "Total export 2019" },
          { key: "main_g_2020", label: "Main goods 2020" },
          { key: "tot_exp_2020", label: "Total export 2020" }
        ],
    }),
    methods: {
        openInfo(marker) {
            this.$store.dispatch("geomap/getMarker", marker.country).then(() => {
                this.isInfo = true;
                this.infoTitle = marker.name;
            });
        }, 
        openInfoOnFeature(e) {
          var name = e.layer.feature.properties.admin;
          var code = e.layer.feature.properties.iso_a2;
          this.$store.dispatch("geomap/getMarker", code).then(() => {
              this.isInfo = true;
              this.infoTitle = name;
          });
        },
        openInfoStart(code,name) {
          this.$store.dispatch("geomap/getMarker", code).then(() => {
              this.isInfo = true;
              this.infoTitle = name;
          });
        },
        closeInfo() {
            this.isInfo = false;
        },
    },
};
