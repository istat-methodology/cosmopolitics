export function getPeriod(start, end) {
  var arr = new Array();
  var dt = new Date(Number(start.year), (Number(start.month)-1));
  var de = new Date(Number(end.year), (Number(end.month)-1));
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
  return arr;
}
export function getTrimesterPeriod(start, end) {


  var trim = new Array();
  var dt = new Date(Number(start.year), (Number(start.month)-1));
  var de = new Date(Number(end.year), (Number(end.month)-1));
  
  var trimester = 0;
  
  
  while (dt <= de) {

    var monthIndex = dt.getMonth();
    monthIndex = monthIndex + 1;
    monthIndex = String(monthIndex);
    monthIndex = monthIndex.length > 1 ? monthIndex : "0" + monthIndex;
    
    var shortYear = dt.toLocaleDateString("en", {
      year: "2-digit"
    });
    var shortMonth = dt.toLocaleString("en-US", {
      month: "short"
    });
    console.log(shortMonth);
    var longYear = dt.toLocaleDateString("en", {
      year: "numeric"
    });
    
    if (trimester != trimesterOfyear(new Date(dt))) {
      trimester = trimesterOfyear(new Date(dt));
      var idString = String(longYear) + String ('0') + String(trimester);
      var nameString = trimester + "Q " + shortYear;
      var item = {
        id: idString,
        name: nameString,
        trimester: trimester
      };
      trim.push(item);
    }
    dt.setMonth(dt.getMonth() + 1);

  }
  console.log(trim);
    return trim;

}
function trimesterOfyear(date) {
  var month = date.getMonth() + 1;
  return (Math.ceil(month / 3));
}