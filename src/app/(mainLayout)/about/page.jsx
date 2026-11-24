import React from "react";
import AboutContent from "./AboutContent";
import { BUSINESS_ID } from "@/lib/seo";

export const metadata = {
  title: "About Extrain Web | Web Development Company in Dhaka Since 2023",
  description: "Extrain Web is a web development company in Merul Badda, Dhaka, founded in 2023 by Sheikh Sakibul Hasan. Custom websites, e-commerce, IELTS software and business software for clients across Bangladesh.",
  keywords: "about extrain web, digital agency Bangladesh, web development team, mission and vision, premium web solutions, software development company Dhaka",
  alternates: {
    canonical: "https://www.extrainweb.com/about",
  },
  openGraph: {
    title: "About Extrain Web - Building the Digital Future",
    description: "We are the architects of the digital age. Blending cutting-edge technology with artistic vision to craft exceptional digital experiences.",
    url: "https://www.extrainweb.com/about",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "About Extrain Web",
      },
    ],
  },
};

export default function AboutPage() {
  return (
    <>
      {/* JSON-LD Structured Data for About Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "url": "https://www.extrainweb.com/about",
            "mainEntity": { "@id": BUSINESS_ID }
          })
        }}
      />
      <AboutContent />
    </>
  );
}
