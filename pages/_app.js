import "tailwindcss/tailwind.css";
import { Provider } from "next-auth/client";
import NProgress from "nprogress";

import { useEffect } from "react";
import { useRouter } from "next/router";

import "../public/nprogress.css";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    router.events.on("routeChangeComplete", (url) => {
      NProgress.done();
    });

    router.events.on("routeChangeStart", () => {
      NProgress.start();
    });

    router.events.on("routeChangeError", () => {
      NProgress.done();
    });
    return () => {
      router.events.off("routeChangeComplete");
    };
  }, [router.events]);

  return (
    <>
      <Provider session={pageProps.session}>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

export default MyApp;
