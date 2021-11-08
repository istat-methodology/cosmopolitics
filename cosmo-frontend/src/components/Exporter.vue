<template>
  <CButton
    color="primary"
    shape="square"
    size="sm"
    class="mr-2 float-right"
    @click="download(typeDownload)"
  >
    {{ typeDownload }}
  </CButton>
</template>

<script>
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";

export default {
  name: "exporter",
  props: {
    typeDownload: {
      Type: String,
      default: () => ""
    },
    filename: {
      Type: String,
      default: () => ""
    },
    items: {
      Type: Array,
      default: () => []
    }
  },
  methods: {
    download(typeDownload) {
      switch (typeDownload) {
        case "body":
          this.toJPEG(this.items, this.filename);
          break;
        case "jpeg":
          this.toJPEG(this.items, this.filename);
          break;
        case "png":
          this.toPNG(this.items, this.filename);
          break;
        case "pdf":
          this.toPDF(this.items, this.filename);
          break;
        case "json":
          this.toJSON(this.items, this.filename);
          break;
        default:
          break;
      }
    },
    toBody(items) {
      html2canvas(items, { useCORS: true }).then(canvas => {
        document.body.appendChild(canvas);
      });
    },
    toJSON(data, filename) {
      const blob = new Blob([data], { type: "text/plain" });
      saveAs(blob, filename);
    },
    toJPEG(items, filename) {
      html2canvas(items, {
        useCORS: true
      }).then(canvas => {
        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        saveAs(imgData, filename);
      });
    },
    toPNG(items, filename) {
      html2canvas(items, {
        useCORS: true
      }).then(canvas => {
        const imgData = canvas.toDataURL("image/png");
        saveAs(imgData, filename);
      });
    },
    toPDF(items, filename) {
      let pdf = new jsPDF("l", "px");
      html2canvas(items, {
        useCORS: true
      }).then(canvas => {
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
    }
  }
};
</script>
