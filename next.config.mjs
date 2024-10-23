/** @type {import('next').NextConfig} */
export const nextConfig = {
  experimental: {
    scrollRestoration: true,  // 스크롤 위치 복원 기능 활성화
  },

  webpack: (config, { isServer, dev }) => {
    config.module.rules.push(
      {
        test: /\.(ttf|otf|eot|woff|woff2)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "static/fonts/",
              publicPath: "/_next/static/fonts/",
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      }
    );

    // 환경별로 설정을 다르게 하기
    if (!dev && !isServer) {
      // production build에서만 추가적인 최적화 옵션 적용
      config.optimization.splitChunks = {
        chunks: 'all',
        name: false,  // true 대신 false로 설정
      };
    }

    return config;
  },

  // 기본적으로 dev와 start 환경이 비슷하게 유지되도록 추가 설정
  reactStrictMode: true, // 개발과 프로덕션 모두에서 Strict Mode를 활성화
  compress: true, // start 환경과 dev 환경에서 모두 gzip 압축 활성화
  poweredByHeader: false, // 보안상의 이유로 X-Powered-By 헤더 제거
};

export default nextConfig;
