export function getPeriod(start, end) {
  var arr = new Array()
  var dt = new Date(Number(start.year), Number(start.month) - 1)
  var de = new Date(Number(end.year), Number(end.month) - 1)
  var counter = 0
  while (dt <= de) {
    var monthIndex = dt.getMonth()
    monthIndex = monthIndex + 1
    monthIndex = String(monthIndex)
    monthIndex = monthIndex.length > 1 ? monthIndex : "0" + monthIndex
    var shortYear = dt.toLocaleDateString("en", { year: "2-digit" })
    var shortMonth = dt.toLocaleString("en-US", { month: "short" })
    var longYear = dt.toLocaleDateString("en", { year: "numeric" })
    var idString = String(longYear) + String(monthIndex)
    var isoDate = String(longYear) + "-" + String(monthIndex) + "-01"
    var selectString = shortMonth + " " + longYear
    var sliderString = counter % 3 == 0 ? shortMonth + " " + shortYear : ""
    var item = {
      id: idString,
      isoDate,
      name: sliderString,
      selectName: selectString
    }
    arr.push(item)
    dt.setMonth(dt.getMonth() + 1)
    counter++
  }
  return arr
}
export function getTrimesterPeriod(start, end) {
  var trim = new Array()
  var dt = new Date(Number(start.year), Number(start.month) - 1)
  var de = new Date(Number(end.year), Number(end.month) - 1)

  var trimester = 0

  while (dt <= de) {
    var monthIndex = dt.getMonth()
    monthIndex = monthIndex + 1
    monthIndex = String(monthIndex)
    monthIndex = monthIndex.length > 1 ? monthIndex : "0" + monthIndex

    var shortYear = dt.toLocaleDateString("en", {
      year: "2-digit"
    })
    var longYear = dt.toLocaleDateString("en", {
      year: "numeric"
    })

    if (trimester != trimesterOfyear(new Date(dt))) {
      trimester = trimesterOfyear(new Date(dt))
      var idString = String(longYear) + String("0") + String(trimester)
      var sliderString = "T" + trimester + " " + shortYear
      var selectString = "T" + trimester + " " + longYear
      var item = {
        id: idString,
        name: sliderString,
        selectName: selectString,
        trimester: trimester
      }
      trim.push(item)
    }
    dt.setMonth(dt.getMonth() + 1)
  }
  //console.log(trim);
  return trim
}
function trimesterOfyear(date) {
  var month = date.getMonth() + 1
  return Math.ceil(month / 3)
}
