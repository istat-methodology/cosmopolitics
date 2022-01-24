
export function getPeriod(start, end) {
  //const months = Array.from({length: 12}, (item, i) => {
  //   return new Date(0, i).toLocaleString('en-US', {month: 'short'})
  //});
  //console.log(months);
  //timePeriod: [
  //      { id: "201912", name: "Dec 19" },
  //d3.timeFormat('%b-%y') rembember mybe to use!!!
  var arr = new Array();
  var dt = new Date(start);
  var de = new Date(end);
  while (dt <= de) {
    var monthIndex = dt.getMonth();
    monthIndex = monthIndex + 1;
    monthIndex = String(monthIndex);
    monthIndex = monthIndex.length > 1 ? monthIndex : "0" + monthIndex;
    var shortYear = dt.toLocaleDateString("en", { year: "2-digit" });
    var shortMonth = dt.toLocaleString("en-US", { month: "short" });
    var longYear = dt.toLocaleDateString("en", { year: "numeric" });
    var idString = String(longYear) + String(monthIndex);
    var nameString = shortMonth + " " + shortYear;
    var item = { id: idString, name: nameString };
    arr.push(item);
    dt.setMonth(dt.getMonth() + 1);
  }
  //console.log(arr);
  return arr;
}
