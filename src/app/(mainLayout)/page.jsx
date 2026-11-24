import HomeContent from "./HomeContent";
import { API_BASE_URL } from "@/config/api";
import { fetchHomeMedia } from "@/lib/homeMedia";
import { generateMetadata as seoGenerateMetadata, commonKeywords } from "@/lib/seo";

// ==================== SEO METADATA ====================
export async function generateMetadata() {
  const metadata = seoGenerateMetadata({
    title: "Custom Website & Software Development Company in Bangladesh | Extrain Web",
    description: "Extrain Web is a website design and web development company in Bangladesh, based in Merul Badda, Dhaka. Custom websites, e-commerce, software and SEO. Call +880 1711-946614.",
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
  // the photos saved in Dashboard → Design → Home Page → Photos (null = the built-in ones)
  const media = await fetchHomeMedia(API_BASE_URL);

  return (
    <>
      {/* the business schema (address, phone, hours) is in app/layout.js, on every page */}
      {/* Home Content Component */}
      <HomeContent media={media} />
    </>
  );
}
