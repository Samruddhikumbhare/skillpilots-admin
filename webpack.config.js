module.exports = {
    module: {
      rules: [
        {
          test: /\.js$/,
          enforce: 'pre',
          loader: 'source-map-loader',
          exclude: [/node_modules\/stylis-plugin-rtl/], // Ignore only this package
        },
      ],
    },
  };
  