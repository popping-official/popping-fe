import type { Metadata } from "next";
import React from "react";
import GlobalStyle from "@/public/styles/global";
import CommonProvider from "./redux/provider";
import Head from "next/head";
import GoogleAnalytics from "./components/GoogleAnalytics";

export const metadata: Metadata = {
  title: 'POPPING',
  description: '팝업스토어는 현재 진행중, 팝핑',
  icons: {
    icon: '/favicons/favicon.ico',
    apple: [
      { rel: 'apple-touch-icon', sizes: '57x57', url: '/favicons/apple-icon-57x57.png' },
      { rel: 'apple-touch-icon', sizes: '60x60', url: '/favicons/apple-icon-60x60.png' },
      { rel: 'apple-touch-icon', sizes: '72x72', url: '/favicons/apple-icon-72x72.png' },
      { rel: 'apple-touch-icon', sizes: '76x76', url: '/favicons/apple-icon-76x76.png' },
      { rel: 'apple-touch-icon', sizes: '114x114', url: '/favicons/apple-icon-114x114.png' },
      { rel: 'apple-touch-icon', sizes: '120x120', url: '/favicons/apple-icon-120x120.png' },
      { rel: 'apple-touch-icon', sizes: '144x144', url: '/favicons/apple-icon-144x144.png' },
      { rel: 'apple-touch-icon', sizes: '152x152', url: '/favicons/apple-icon-152x152.png' },
      { rel: 'apple-touch-icon', sizes: '180x180', url: '/favicons/apple-icon-180x180.png' },
    ],
    other: [
      { rel: 'icon', type: 'image/png', sizes: '16x16', url: '/favicons/favicon-16x16.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', url: '/favicons/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '96x96', url: '/favicons/favicon-96x96.png' },
      { rel: 'msapplication-TileImage', url: '/favicons/ms-icon-144x144.png' },
      { rel: 'icon', type: 'image/png', sizes: '36x36', url: '/favicons/android-icon-36x36.png' },
      { rel: 'icon', type: 'image/png', sizes: '48x48', url: '/favicons/android-icon-48x48.png' },
      { rel: 'icon', type: 'image/png', sizes: '72x72', url: '/favicons/android-icon-72x72.png' },
      { rel: 'icon', type: 'image/png', sizes: '96x96', url: '/favicons/android-icon-96x96.png' },
      { rel: 'icon', type: 'image/png', sizes: '144x144', url: '/favicons/android-icon-144x144.png' },
      { rel: 'icon', type: 'image/png', sizes: '192x192', url: '/favicons/android-icon-192x192.png' },
    ],
  },
  manifest: '/favicons/manifest.json',
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => (
  <html lang="ko">
    <Head>
      <GoogleAnalytics />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
      />
      {/* <script
        type="text/javascript"
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=ac2db24dbfbd7f14b74f515ed599011d&libraries=services,clusterer,drawing`}
        async
        defer
      ></script> */}
    </Head>
    <head>
      <script
        type="text/javascript"
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_SOCIAL_AUTH_NAVER_CLIENT_ID}&language=ko`}
        async
      ></script>
    </head>

    <GlobalStyle />
    <body>
      <CommonProvider>{children}</CommonProvider>
    </body>
  </html>
);

export default RootLayout;