<template>
  <CDropdown
    :togglerText="$t('common.exporter')"
    className="c-header-nav-items mr-2 "
    size="sm"
    direction="down"
  >
    <CDropdownItem
      v-for="item in options"
      :key="item"
      @click="download(item)"
      :title="getTitle(item)"
    >
      {{ item }}
    </CDropdownItem>
  </CDropdown>
</template>

<script>
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";

export default {
  name: "exporter",
  props: {
    filename: {
      Type: String,
      default: () => "",
    },
    data: {
      Type: Array,
      default: () => [],
    },
    options: {
      Type: Array,
      default: () => ["jpeg", "png", "pdf", "json", "csv"],
    },
    source: {
      Type: Array,
      default: () => [],
    },
  },
  methods: {
    getTitle(typeformat) {
      return "export as " + typeformat + " format";
    },
    download(type) {
      switch (type) {
        case "json":
          this.toJSON(this.data[0], this.filename + "." + type);
          break;
        case "csv":
          this.toCSV(this.data[0], this.filename + "."+ type);
          break;
        case "jpeg":
          this.toJPEG(this.data[1], this.filename + "."+ type);
          break;
        case "png":
          this.toPNG(this.data[1], this.filename + "."+ type);
          break;
        case "pdf":
          this.toPDF(this.data[1], this.filename + "."+ type);
          break;

        default:
          break;
      }
    },
    toBody(id) {
      html2canvas(this.getCanvas(id), { useCORS: true }).then((canvas) => {
        document.body.appendChild(canvas);
      });
    },
    toJSON(data, filename) {
      var jsonData = {};
      if (this.source == "graph") {
        jsonData = data;
      } else {
        let dat = [];
        for (let i = 0; i < data.datasets.length; i++) {
          let obj = {};
          obj[data.datasets[i].label] = data.datasets[i].data;
          dat.push(obj);
        }
        jsonData = JSON.stringify(dat);
      }

      const blob = new Blob([jsonData], { type: "text/plain" });
      saveAs(blob, filename);
    },
    toCSV(data, filename) {
      var result;
      if (this.source == "table") {
        result = data;
      } else {
        var ctr, keys, columnDelimiter, lineDelimiter;
        var dat = [];
        var lbl = [];
        result = "";
        columnDelimiter = ";";
        lineDelimiter = "\n";
        for (let i = 0; i < data.datasets.length; i++) {
          dat = data.datasets[i].data;
          lbl = data.datasets[i].label;
          keys = Object.keys(dat[0]);
          result += lbl;
          if (keys.length > 0) {
            result += lineDelimiter;
            keys = Object.keys(dat[0]);
            result += keys.join(columnDelimiter);
            result += lineDelimiter;
            dat.forEach(function (item) {
              ctr = 0;
              keys.forEach(function (key) {
                if (ctr > 0) result += columnDelimiter;
                result += item[key];
                ctr++;
              });
              result += lineDelimiter;
            });
          } else {
            dat.forEach(function (item) {
              result += columnDelimiter;
              result += item;
            });
            result += lineDelimiter;
          }
        }
      }
      const blob = new Blob([result], { type: "text/plain" });
      saveAs(blob, filename);
    },
    toJPEG(id, filename) {
      html2canvas(this.getCanvas(id), {
        useCORS: true,
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        saveAs(imgData, filename);
      });
    },
    toPNG(id, filename) {
      html2canvas(this.getCanvas(id), {
        useCORS: true,
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        saveAs(imgData, filename);
      });
    },
    toPDF(id, filename) {
      let pdf = new jsPDF("l", "px");
      html2canvas(this.getCanvas(id), {
        useCORS: true,
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const ratio = (pageWidth - 40) / canvas.width;
        const canvasWidth = canvas.width * ratio;
        const canvasHeight = canvas.height * ratio;
        const marginX = (pageWidth - canvasWidth) / 2;
        const marginY = (pageHeight - canvasHeight) / 2;
        pdf.text(filename, 20, 20);
        pdf.addImage(
          imgData,
          "JPEG",
          marginX,
          marginY,
          canvasWidth,
          canvasHeight
        );
        pdf.save(filename);
      });
    },
    getCanvas(id) {
      return this.source == "graph"
        ? document.getElementById(id).querySelector("canvas")
        : document.getElementById(id);
    },
  },
};
</script>
