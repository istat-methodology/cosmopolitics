export default {
  data: () => ({
    optionsMobility: {
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: false,
        text: ""
      },
      tooltips: {
        mode: "index",
        intersect: true
      },
      hover: {
        mode: "nearest",
        intersect: true
      },
      scales: {
        xAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
              labelString: ""
            }
          }
        ],
        yAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
              labelString: ""
            }
          }
        ]
      }
    },
    mobilityTableFileds: [
      { key: "row", label: "" },
      { key: "Retail", label: "Retail",_classes: 'align-right' },
      { key: "Grocery_Pharmacy", label: "Grocery Pharmacy",_classes: 'align-right' },
      { key: "Parks", label: "Parks",_classes: 'align-right' },
      { key: "Transit_Station", label: "Transit Station",_classes: 'align-right' },
      { key: "Workplaces", label: "Workplaces",_classes: 'align-right' },
      { key: "Residential", label: "Residential",_classes: 'align-right' }
    ],
    mobilityTypes: [
      { id: 1, name: "Retail", descr: "Retail" },
      { id: 2, name: "Grocery_Pharmacy", descr: "Grocery pharmacy" },
      { id: 3, name: "Parks", descr: "Parks" },
      { id: 4, name: "Transit_Station", descr: "Station" },
      { id: 5, name: "Workplaces", descr: "Workplaces" },
      { id: 6, name: "Residential", descr: "Residential" },
      { id: 7, name: "Policy Indicator", descr: "Policy Indicator" }
    ]
  })
};
