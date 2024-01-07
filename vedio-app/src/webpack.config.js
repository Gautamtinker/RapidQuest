// webpack.config.js

// webpack.config.js

module.exports = {
  // ... other webpack configurations

  resolve: {
    fallback: {
      stream: require.resolve("stream-browserify"),
    },
  },
};
