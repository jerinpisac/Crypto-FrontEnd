import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="dark">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Prompt:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;1,200;1,300&display=swap"
          rel="stylesheet"
        ></link>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
        <meta
          name="twitter:description"
          content="The Zephyr Project - A Crypto Trading Platform"
        />
        <meta name="twitter:image" content="/thumbnail.png"></meta>
        <meta name="theme-color" content="#1f1f20" />
        <style>
          {`
            /* width */
            ::-webkit-scrollbar {
              width: 7px;
            }

            /* Track */
            ::-webkit-scrollbar-track {
              background: zinc-800/80;
            }

            /* Handle */
            ::-webkit-scrollbar-thumb {
              background: #353839;
              border-radius: 15px;
            }
          `}
        </style>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
