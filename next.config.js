// next.config.js
const nextConfig = {
  output: 'export',
  basePath: '/workout-app',
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/workout-app',
        basePath: false,
        permanent: true
      }
    ];
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });
    return config;
  },
  devIndicators: {
    appIsrStatus: false
  }
};

module.exports = nextConfig;