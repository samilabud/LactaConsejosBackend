/** @type {import('next').NextConfig} */
const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      env: {
        BACKEND_URL: "http://localhost:3080",
      },
      images: {
        remotePatterns: [
          {
            protocol: "http",
            hostname: "localhost",
            port: "3080",
            pathname: "/images/articles/**",
          },
        ],
      },
    };
  }

  return {
    env: {
      BACKEND_URL: "https://lactaconsejosws.onrender.com",
    },
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "https://lactaconsejosws.onrender.com/",
          port: process.env.PORT,
          pathname: "/images/articles/**",
        },
      ],
    },
  };
};
