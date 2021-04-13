export default {
  data: () => ({
    periodValue: "201912",
    timePeriod: [
      { id: "201912", name: "Dec 19" },
      { id: "202001", name: "Jan 20" },
      { id: "202002", name: "Feb 20" },
      { id: "202003", name: "Mar 20" },
      { id: "202004", name: "Apr 20" },
      { id: "202005", name: "May 20" },
      { id: "202006", name: "Jun 20" },
      { id: "202007", name: "Jul 20" },
      { id: "202008", name: "Aug 20" },
      { id: "202009", name: "Sep 20" },
      { id: "202010", name: "Oct 20" },
      { id: "202011", name: "Nov 20" }
    ],
    policyPeriodValue: "202003",
    policyPeriod: [
      { id: "202003", name: "Mar 20" },
      { id: "202004", name: "Apr 20" },
      { id: "202005", name: "May 20" },
      { id: "202006", name: "Jun 20" },
      { id: "202007", name: "Jul 20" },
      { id: "202008", name: "Aug 20" },
      { id: "202009", name: "Sep 20" },
      { id: "202010", name: "Oct 20" },
      { id: "202011", name: "Nov 20" },
      { id: "202012", name: "Dec 20" },
      { id: "202101", name: "Jan 21" },
      { id: "202102", name: "Feb 21" }
    ],
    periodTimeMap: [
      { id: "202003", time: "T1", val: 1 },
      { id: "202004", time: "T2", val: 2 },
      { id: "202005", time: "T3", val: 3 },
      { id: "202006", time: "T4", val: 4 },
      { id: "202007", time: "T5", val: 5 },
      { id: "202008", time: "T6", val: 6 },
      { id: "202009", time: "T7", val: 7 },
      { id: "202010", time: "T8", val: 8 },
      { id: "202011", time: "T9", val: 9 },
      { id: "202012", time: "T10", val: 10 },
      { id: "202101", time: "T11", val: 11 },
      { id: "202102", time: "T12", val: 12 }
    ]
  }),
  methods: {
    getSliderPeriod(value) {
      var period = [];
      var t = 0;
      this.policyPeriod.forEach(element => {
        if (t <= this.maxTimeStep) {
          if (parseInt(element.id) <= parseInt(value)) period.push(element);
          t++;
        }
      });
      return period;
    },
    getTime(value) {
      var obj = this.periodTimeMap.find(element => {
        return element.id == value;
      });
      return obj ? obj.time : null;
    },
    getVal(value) {
      var obj = this.periodTimeMap.find(element => {
        return element.id == value;
      });
      return obj ? obj.val : null;
    }
  }
};
