import HomeContent from "./HomeContent";
import { API_BASE_URL } from "@/config/api";
import { fetchHomeMedia } from "@/lib/homeMedia";
import { generateMetadata as seoGenerateMetadata, commonKeywords, generateOrganizationSchema } from "@/lib/seo";

// ==================== SEO METADATA ====================
export async function generateMetadata() {
  const metadata = seoGenerateMetadata({
    title: "Best Website Development Company in Bangladesh | Extrain Web",
    description: "Extrain Web (Extra in Web) — Top-rated website development agency in Bangladesh. We build high-performance custom websites, premium templates, and business software in Dhaka.",
    keywords: [
      ...commonKeywords.brand,
      ...commonKeywords.bestKeywords,
      ...commonKeywords.base,
      ...commonKeywords.local,
      "web design agency bangladesh",
      "e-commerce development company dhaka"
    ],
    canonicalUrl: "/",
  });

  return metadata;
}

// ==================== HOME PAGE ====================
export default async function HomePage() {
  const organizationSchema = generateOrganizationSchema();
  // the photos saved in Dashboard → Design → Home Page → Photos (null = the built-in ones)
  const media = await fetchHomeMedia(API_BASE_URL);

  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* Home Content Component */}
      <HomeContent media={media} />
    </>
  );
}
