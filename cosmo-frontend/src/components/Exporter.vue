<template>
  <CDropdown
    togglerText="export"
    className="c-header-nav-items mr-2 "
    size="sm"
    direction="down"
  >
    <CDropdownMenu>
      <CDropdownItem
        v-for="item in options"
        :key="item"
        @click="download(item)"
      >
        {{ item }}
      </CDropdownItem>
    </CDropdownMenu>
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
  },
  methods: {
    download(type) {
      switch (type) {
        case "jpeg":
          this.toJPEG(this.data[1], this.filename + "." + type);
          break;
        case "png":
          this.toPNG(this.data[1], this.filename + "." + type);
          break;
        case "pdf":
          this.toPDF(this.data[1], this.filename + "." + type);
          break;
        case "json":
          this.toJSON(this.data[0], this.filename + "." + type);
          break;
        case "csv":
          this.toCSV(this.data[2], this.filename + "." + type);
          break;
        default:
          break;
      }
    },
    toBody(items) {
      html2canvas(items, { useCORS: true }).then((canvas) => {
        document.body.appendChild(canvas);
      });
    },
    toJSON(data, filename) {
      const blob = new Blob([data], { type: "text/plain" });
      saveAs(blob, filename);
    },
    toCSV(data, filename) {
      const blob = new Blob([data], { type: "text/plain" });
      saveAs(blob, filename);
    },
    toJPEG(items, filename) {
      html2canvas(items, {
        useCORS: true,
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        saveAs(imgData, filename);
      });
    },
    toPNG(items, filename) {
      html2canvas(items, {
        useCORS: true,
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        saveAs(imgData, filename);
      });
    },
    toPDF(items, filename) {
      let pdf = new jsPDF("l", "px");
      html2canvas(items, {
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
  },
};
</script>
