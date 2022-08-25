export default {
  data: () => ({}),
  methods: {
    getSliderPeriod(value) {
      var period = []
      var t = 0
      this.policyPeriod.forEach((element) => {
        if (t <= this.maxTimeStep) {
          if (parseInt(element.id) <= parseInt(value)) period.push(element)
          t++
        }
      })
      return period
    },
    getTime(value) {
      var obj = this.periodTimeMap.find((element) => {
        return element.id == value
      })
      return obj ? obj.time : null
    },
    getVal(value) {
      var obj = this.periodTimeMap.find((element) => {
        return element.id == value
      })
      return obj ? obj.val : null
    },
    getSliderTime(start, end) {
      var arr = new Array()
      var dt = new Date(start)
      while (dt <= end) {
        var monthIndex = dt.getMonth()
        monthIndex = monthIndex + 1
        monthIndex = String(monthIndex)
        monthIndex = monthIndex.length > 1 ? monthIndex : "0" + monthIndex

        var shortYear = dt.toLocaleDateString("en", {
          year: "2-digit"
        })
        var shortMonth = dt.toLocaleString("en-US", {
          month: "short"
        })
        var longYear = dt.toLocaleDateString("en", {
          year: "numeric"
        })

        var idString = String(longYear) + String(monthIndex)
        var nameString = shortMonth + " " + shortYear
        var item = {
          id: idString,
          name: nameString
        }
        arr.push(item)
        dt.setMonth(dt.getMonth() + 1)
      }
      //console.log(arr);
      return arr
    }
  }
}
