import React from "react";
import AboutContent from "./AboutContent";

export const metadata = {
  title: "About Us | Extrain Web - Digital Architects",
  description: "Extrain Web is a leading digital agency in Bangladesh specializing in custom web development, premium templates, IELTS software, and business software solutions. Discover our mission and services.",
  keywords: "about extrain web, digital agency Bangladesh, web development team, mission and vision, premium web solutions, software development company Dhaka",
  alternates: {
    canonical: "https://extrainweb.com/about",
  },
  openGraph: {
    title: "About Extrain Web - Building the Digital Future",
    description: "We are the architects of the digital age. Blending cutting-edge technology with artistic vision to craft exceptional digital experiences.",
    url: "https://extrainweb.com/about",
    images: [
      {
        url: "/images/logo.png",
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
            "mainEntity": {
              "@type": "Organization",
              "name": "Extrain Web",
              "alternateName": "Extra in Web",
              "url": "https://extrainweb.com",
              "logo": "https://extrainweb.com/images/logo.png",
              "foundingDate": "2019",
              "description": "Leading website and software development company in Bangladesh specializing in custom web development, premium templates, IELTS software, and business solutions.",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Road - 11, DIT Project, Marul Badda, Badda",
                "addressLocality": "Dhaka",
                "postalCode": "1214",
                "addressCountry": "BD"
              }
            }
          })
        }}
      />
      <AboutContent />
    </>
  );
}
