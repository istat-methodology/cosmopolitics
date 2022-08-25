export function getData(series) {
  var arr = series.seriesData
  var period = series.seriesPeriod
  var data = {}
  arr.forEach((obj) => {
    var key = obj.country
    var value = obj[period]
    data[key] = value
  })
  return data
}
