import ContactContent from "./ContactContent";
import { generateMetadata as seoGenerateMetadata, commonKeywords, BUSINESS_ID } from "@/lib/seo";
import { SITE_URL } from "@/config/business";

// ==================== SEO METADATA ====================
export async function generateMetadata() {
  return seoGenerateMetadata({
    title: "Contact Extrain Web | Web Development Company in Merul Badda, Dhaka",
    description: "Visit or call Extrain Web — Pragati Tower, Pragati Sarani, Merul Badda, Dhaka 1212. Phone / WhatsApp +880 1711-946614. Open every day, 10 AM – 8 PM.",
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
    name: "Contact Extrain Web",
    url: `${SITE_URL}/contact`,
    description: "Contact Extrain Web, a web development company in Merul Badda, Dhaka.",
    about: { "@id": BUSINESS_ID },
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
