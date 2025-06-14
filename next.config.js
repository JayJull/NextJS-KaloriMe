const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: [
    /middleware-manifest\.json$/,
    /app-build-manifest\.json$/,
  ],
});

const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
};

module.exports = withPWA(nextConfig);
