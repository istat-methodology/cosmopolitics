export default {
  data: () => ({
    currentColor: 0,
    colorPalette: [
      {
        border: "rgba(46, 184, 92, 1)", //green
        background: "rgba(46, 184, 92, 0.2)"
      },
      {
        border: "rgba(50, 31, 219, 1)", //blue
        background: "rgba(50, 31, 219, 0.2)"
      },
      {
        border: "rgba(229, 83, 83, 1)", //red
        background: "rgba(229, 83, 83, 0.2)"
      },
      {
        border: "rgba(249, 177, 21, 1)", //orange
        background: "rgba(249, 177, 21, 0.2)"
      },
      {
        border: "rgba(51, 153, 255, 1)", //cyan
        background: "rgba(51, 153, 255, 0.2)"
      },
      {
        border: "rgba(206, 210, 216, 1)", //gray
        background: "rgba(206, 210, 216, 0.2)"
      },
      { border: "#06188a", background: "#06188a" },
      { border: "#4260aa", background: "#4260aa" },
      { border: "#8999cc", background: "#8999cc" },
      { border: "#94c4f5", background: "#94c4f5" },
      { border: "#726dff", background: "#726dff" },
      { border: "#48baff", background: "#48baff" },
      { border: "#558bff", background: "#558bff" },
      { border: "#35b9e0", background: "#35b9e0" },
      { border: "#1ce2ff", background: "#1ce2ff" },
      { border: "#c1e7ff", background: "#c1e7ff" },
      { border: "#fa0404", background: "#fa0404" },
      { border: "#820101", background: "#820101" },
      { border: "#BD0026", background: "#BD0026" },
      { border: "#FC4E2A", background: "#FC4E2A" },
      { border: "#FD8D3C", background: "#FD8D3C" },
      { border: "#FEB24C", background: "#FEB24C" },
      { border: "#ff10c5", background: "#ff10c5" },
      { border: "#bb379b", background: "#bb379b" },
      { border: "#d462bd", background: "#d462bd" },
      { border: "#f9b2e7", background: "#f9b2e7" },
      { border: "#43BE4F", background: "#43BE4F" }
    ]
  }),
  methods: {
    getColor() {
      this.currentColor =
        this.currentColor >= this.colorPalette.length - 1
          ? 0
          : this.currentColor;
      const color = this.colorPalette[this.currentColor];
      this.currentColor++;
      return color;
    },
    clearColor() {
      this.currentColor = 0;
    }
  }
};
