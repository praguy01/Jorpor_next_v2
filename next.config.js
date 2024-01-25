/** @type {import('next').NextConfig} */

const nextConfig = {
    
    };


module.exports = {
  // async headers() {
  //   return [
  //     {
  //       source: '/(.*)',
  //       headers: [
  //         {
  //           key: 'Access-Control-Allow-Origin',
  //           value: 'http://platform-jorpor.local',
  //         },
  //       ],
  //     },
  //   ];
  // },
    webpack(config, options) {
      config.module.rules.push({
        test: /\.mp3$/,
        use: {
          loader: "url-loader",
        },
      });
      return config;
    },
  pageExtensions: ['mdx', 'md', 'jsx', 'js', 'tsx', 'ts'],
 
}
