/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "prod-files-secure.s3.us-west-2.amazonaws.com",
      "i.postimg.cc"
    ]
  }
};

module.exports = nextConfig;
