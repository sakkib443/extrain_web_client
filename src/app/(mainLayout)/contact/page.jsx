import ContactContent from "./ContactContent";
import { generateMetadata as seoGenerateMetadata, commonKeywords } from "@/lib/seo";

// ==================== SEO METADATA ====================
export async function generateMetadata() {
  return seoGenerateMetadata({
    title: "Contact Us | Extrain Web - Top Website Development Agency",
    description: "Get in touch with Extrain Web (Extra in Web) for custom website development, ready-made templates, and business software in Bangladesh. We are located in Marul Badda, Badda, Dhaka.",
    keywords: [
      ...commonKeywords.brand,
      "contact extrain web",
      "web development company dhaka contact",
      "hire web developers bangladesh",
      "website development agency address dhaka"
    ],
    canonicalUrl: "/contact",
  });
}

// ==================== CONTACT PAGE ====================
export default function ContactPage() {
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Extrain Web",
    "description": "Contact page of Extrain Web, a professional website development company in Bangladesh.",
    "url": "https://extrainweb.com/contact",
    "mainEntity": {
      "@type": "Organization",
      "name": "Extrain Web",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+8801711946614",
        "contactType": "customer service",
        "areaServed": "BD",
        "availableLanguage": ["English", "Bengali"]
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <ContactContent />
    </>
  );
}
