// next.config.js
module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });
    return config;
  },
  // Add this line to disable the static indicator
  devIndicators: {
    appIsrStatus: false
  }
};