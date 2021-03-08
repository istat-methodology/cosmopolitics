var path = require("path");
module.exports = {
  devServer: {
    host: "0.0.0.0",
    port: 8070,
    compress: true,
    disableHostCheck: true

  },
  configureWebpack: {
    resolve: {
      alias: {
        icons: path.resolve(__dirname, "node_modules/vue-material-design-icons")
      },
      extensions: [".vue"]
    }
  }
};
