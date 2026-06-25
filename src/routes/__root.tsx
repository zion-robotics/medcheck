/// <reference types="vite-plugin-pwa/react" />
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { BackgroundBlobs } from "../components/BackgroundBlobs";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-8xl font-extrabold text-brand">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-navy">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full btn-gradient px-6 py-3 text-sm font-semibold text-white"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-navy">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. Try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="inline-flex items-center justify-center rounded-full btn-gradient px-5 py-2.5 text-sm font-semibold text-white"
          >
            Try again
          </button>
          <a href="/" className="inline-flex items-center justify-center rounded-full border-2 border-brand px-5 py-2.5 text-sm font-semibold text-brand">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#0A4174" },
      { title: "MedCheck — Counterfeit Drug Intelligence for Nigeria" },
      {
        name: "description",
        content:
          "Proactive risk intelligence on counterfeit medicines in Nigeria. AI photo pre-screening, live alerts map, and NAFDAC verification — all in one place.",
      },
      { name: "author", content: "MedCheck" },
      { property: "og:site_name", content: "MedCheck" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "MedCheck — Counterfeit Drug Intelligence for Nigeria" },
      { property: "og:description", content: "Proactive counterfeit-drug intelligence. AI pre-screening, live alerts, NAFDAC verification." },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "MedCheck" },
      { name: "twitter:description", content: "Proactive counterfeit-drug intelligence for Nigeria." },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "apple-mobile-web-app-title", content: "MedCheck" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", type: "image/svg+xml", href: "/medcheck-icon.svg" },
      { rel: "apple-touch-icon", href: "/icons/medcheck-icon-180.png" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "MedCheck",
          url: "/",
          logo: "/icons/medcheck-icon-512.png",
          description: "Proactive counterfeit-drug intelligence for Nigeria.",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function PwaRegister() {
  useRegisterSW({ immediate: true });
  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Surface route changes to a placeholder analytics layer.
  // TODO: replace with real analytics provider (Plausible/PostHog/etc.)
  useEffect(() => {
    const unsub = router.subscribe("onResolved", ({ toLocation }) => {
      if (typeof window !== "undefined") {
        // window.analytics?.page?.(toLocation.pathname)
        // eslint-disable-next-line no-console
        console.debug("[analytics] pageview", toLocation.pathname);
      }
    });
    return () => unsub();
  }, [router]);

  return (
    <QueryClientProvider client={queryClient}>
      {mounted && <PwaRegister />}
      <BackgroundBlobs />
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.div
          key={router.state.location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Outlet />
          <Footer />
        </motion.div>
      </AnimatePresence>
    </QueryClientProvider>
  );
}
