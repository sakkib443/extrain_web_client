import { Poppins, Hind_Siliguri, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "../components/sheard/Navbar";
import Footer from "@/components/sheard/Footer";
import TopHeader from "@/components/sheard/TopHeader";
import Script from "next/script";
import { SITE_URL, OG_IMAGE } from "@/config/business";
import { generateBusinessSchema } from "@/lib/seo";

import ReduxProviderWrapper from "@/components/ReduxProvaiderWrapper";
import { LanguageProvider } from "@/context/LanguageContext";

import { Toaster } from "react-hot-toast";
import ScrollToTopOnNavigate from "@/components/sheard/ScrollToTopOnNavigate";
import ChunkErrorReload from "@/components/sheard/ChunkErrorReload";

// Google Fonts
// Main site font (matches the Amoxi reference design). Poppins stays loaded only for the receipts/PDF.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  preload: false, // only the receipts / PDF use real Poppins — don't make every page download it first
});
// (Roboto, Lobster, Caveat, Work Sans and Outfit were loaded here but no page used them — removed for speed.)
// Hind Siliguri for Bengali text
const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  // Each page writes its full title (keyword first, brand last), so no template is added here.
  title: {
    template: "%s",
    default: "Website Design & Web Development Company in Bangladesh | Extrain Web",
  },
  description:
    "Extrain Web is a web development company in Merul Badda, Dhaka. Custom websites, e-commerce, business software and digital marketing for businesses across Bangladesh. Call +880 1711-946614.",
  applicationName: "Extrain Web",
  authors: [{ name: "Sheikh Sakibul Hasan" }],
  creator: "Extrain Web",
  publisher: "Extrain Web",
  manifest: "/manifest.json",
  // No site-wide canonical: every page sets its own. (A canonical "/" here made every page that forgot one say "I am the homepage".)
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "bn_BD",
    alternateLocale: ["en_US"],
    siteName: "Extrain Web",
    title: "Website Design & Web Development Company in Bangladesh | Extrain Web",
    description: "Custom websites, e-commerce, business software and digital marketing — from our office in Merul Badda, Dhaka.",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Extrain Web — Web Development Company in Dhaka" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Website Design & Web Development Company in Bangladesh | Extrain Web",
    description: "Custom websites, e-commerce, business software and digital marketing — Merul Badda, Dhaka.",
    images: [OG_IMAGE],
  },
  verification: {
    google: "yxl3yWdFkrclIR7zzpyfjc5mCC0AmjTpeaii_z6yUVg",
  },
  other: {
    "geo.region": "BD-13",
    "geo.placename": "Merul Badda, Dhaka",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="bn"
      className={`${jakarta.variable} ${poppins.variable} ${hindSiliguri.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Runs before the first paint: a tab that has already seen the greeting never gets the full-screen preloader (no flash on reload) */}
        <script
          dangerouslySetInnerHTML={{
            __html: "try{if(sessionStorage.getItem('hasVisited'))document.documentElement.setAttribute('data-visited','1')}catch(e){}",
          }}
        />
        {/* Google Analytics (GA4) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-NDYX5VFT6W"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-NDYX5VFT6W');
          `}
        </Script>

        {/* Meta (Facebook) Pixel */}
        <Script id="meta-pixel" strategy="lazyOnload">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '2369826856874228');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=2369826856874228&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {/* The business for Google (name, address, phone, hours) — once, on every page */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBusinessSchema()) }}
        />
        <ReduxProviderWrapper>
          <LanguageProvider>
            <Toaster position="top-center" reverseOrder={false} />
            <ChunkErrorReload />
            <ScrollToTopOnNavigate />
            {children}
          </LanguageProvider>
        </ReduxProviderWrapper>
      </body>
    </html>
  );
}
