<template>
  <CDropdown
    :togglerText="$t('common.exporter')"
    className="c-header-nav-items mr-2 "
    size="sm"
    direction="down">
    <CDropdownItem
      v-for="item in options"
      :key="item"
      @click="download(item)"
      :title="getTitle(item)">
      {{ item }}
    </CDropdownItem>
  </CDropdown>
</template>

<script>
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { saveAs } from "file-saver"

export default {
  name: "exporter",
  props: {
    filename: {
      Type: String,
      default: () => ""
    },
    data: {
      Type: Array,
      default: () => []
    },
    fields: {
      Type: Array,
      default: () => []
    },
    header: {
      Type: Array,
      default: () => null
    },
    filter: {
      Type: Array,
      default: () => null
    },
    options: {
      Type: Array,
      default: () => ["jpeg", "png", "pdf", "json", "csv"]
    },
    source: {
      Type: String,
      default: () => ""
    },
    timePeriod: {
      Type: Array,
      default: () => null
    }
  },
  methods: {
    getTitle(typeformat) {
      return "export as " + typeformat + " format"
    },
    download(type) {
      switch (type) {
        case "json":
          this.toJSON(this.data[0], this.filename + "." + type)
          break
        case "csv":
          this.toCSV(this.data[0], this.filename + "." + type)
          break
        case "jpeg":
          this.toJPEG(this.data[1], this.filename + "." + type)
          break
        case "png":
          this.toPNG(this.data[1], this.filename + "." + type)
          break
        case "pdf":
          this.toPDF(this.data[1], this.filename + "." + type)
          break

        default:
          break
      }
    },
    toBody(id) {
      html2canvas(this.getCanvas(id), { useCORS: true }).then((canvas) => {
        document.body.appendChild(canvas)
      })
    },
    toJSON(data, filename) {
      var jsonData = {}
      if (this.source == "graph") {
        jsonData = data
      } else {
        let dat = []
        for (let i = 0; i < data.datasets.length; i++) {
          let obj = {}
          obj[data.datasets[i].label] = data.datasets[i].data
          dat.push(obj)
        }
        jsonData = JSON.stringify(dat)
      }
      const blob = new Blob([jsonData], { type: "text/plain" })
      saveAs(blob, filename)
    },

    toCSV(data, filename) {
      const columnDelimiter = ";"
      const rowDelimiter = "\n"
      let result = ""
      let row = ""
      if (data) {
        if (this.source == "table") {
          if (this.filter) {
            this.filter.forEach((row) => {
              let ln = ""
              for (const col in row) {
                ln += row[col]
                ln += columnDelimiter
              }
              result += ln.slice(0, -1) //remove last column delimiter
              //add column delimiters
              if (Object.keys(data[0]).length > 1)
                result += Array(Object.keys(data[0]).length - 1)
                  .fill("")
                  .join(columnDelimiter)
              result += rowDelimiter
            })
            //add empty row
            result += Array(Object.keys(data[0]).length)
              .fill("")
              .join(columnDelimiter)
            result += rowDelimiter
          }
          if (this.header) {
            row = ""
            this.header.forEach((obj) => {
              row += obj
              row += columnDelimiter
            })
            result += row.slice(0, -1) //remove last column delimiter
            result += rowDelimiter
          }

          const cols = Object.keys(data[0]) //get keys from first element
          data.forEach((obj) => {
            row = ""
            cols.forEach((col) => {
              //if (this.fields != col) {
              row += obj[col]
              row += columnDelimiter
              //}
            })
            result += row.slice(0, -1) //remove last column delimiter
            result += rowDelimiter
          })
        } else if (this.source == "matrix") {
          const obj = {}
          //Add filters
          if (this.filter) {
            this.filter.forEach((row) => {
              let ln = ""
              for (const col in row) {
                ln += row[col]
                ln += columnDelimiter
              }
              result += ln.slice(0, -1) //remove last column delimiter
              //add column delimiters
              result += Array(data.length).fill("").join(columnDelimiter)
              result += rowDelimiter
            })
          }
          //Add empty row
          result += Array(data.length + 1)
            .fill("")
            .join(columnDelimiter)
          result += rowDelimiter

          if (this.timePeriod)
            obj["time"] = this.timePeriod.map((t) => {
              return t.isoDate
            })
          data.forEach((col) => {
            obj[col.dataname.replaceAll(";", ",")] = col.value //replace ; with , in product label
          })
          const cols = Object.keys(obj)
          result += cols.join(columnDelimiter)
          result += rowDelimiter
          for (var idx = 0; idx < obj[Object.keys(obj)[0]].length; idx++) {
            row = ""
            cols.forEach((col) => {
              row += obj[col][idx]
              row += columnDelimiter
            })
            result += row.slice(0, -1).replaceAll(".", ",") //remove last column delimiter and change decimal separator
            result += rowDelimiter
          }
        } else {
          data.datasets.forEach((dataset) => {
            const rows = dataset.data
            const cols = Object.keys(rows[0])
            result += dataset.label.replaceAll(";", ",") //replace ; with , in product label
            if (cols.length > 0) {
              result += rowDelimiter
              result += cols.join(columnDelimiter)
              result += rowDelimiter
              rows.forEach((obj) => {
                row = ""
                cols.forEach((key) => {
                  row += obj[key]
                  row += columnDelimiter
                })
                result += row.slice(0, -1) //remove last column delimiter
                result += rowDelimiter
              })
            } else {
              rows.forEach((el) => {
                result += columnDelimiter
                result += el
              })
              result += rowDelimiter
            }
          })
        }
      }
      const blob = new Blob([result], { type: "text/plain" })
      saveAs(blob, filename)
    },
    toJPEG(id, filename) {
      html2canvas(this.getCanvas(id), {
        useCORS: true
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/jpeg", 1.0)
        saveAs(imgData, filename)
      })
    },
    toPNG(id, filename) {
      html2canvas(this.getCanvas(id), {
        useCORS: true
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png")
        saveAs(imgData, filename)
      })
    },
    toPDF(id, filename) {
      let pdf = new jsPDF("l", "px")
      html2canvas(this.getCanvas(id), {
        useCORS: true
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png")
        const pageWidth = pdf.internal.pageSize.getWidth()
        const pageHeight = pdf.internal.pageSize.getHeight()
        const ratio = (pageWidth - 40) / canvas.width
        const canvasWidth = canvas.width * ratio
        const canvasHeight = canvas.height * ratio
        const marginX = (pageWidth - canvasWidth) / 2
        const marginY = (pageHeight - canvasHeight) / 2
        pdf.text(filename, 20, 20)
        pdf.addImage(
          imgData,
          "JPEG",
          marginX,
          marginY,
          canvasWidth,
          canvasHeight
        )
        pdf.save(filename)
      })
    },
    getCanvas(id) {
      return this.source == "graph"
        ? document.getElementById(id).querySelector("canvas")
        : document.getElementById(id)
    }
  }
}
</script>
