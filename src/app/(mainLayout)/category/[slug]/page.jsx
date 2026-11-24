import { notFound } from "next/navigation";
import { getCategory, KNOWN_SLUGS } from "@/data/categories";
import CategoryView from "./CategoryView";

export async function generateMetadata({ params }) {
    const { slug } = await params;
    if (!KNOWN_SLUGS.includes(slug)) return {};
    const cat = getCategory(slug);
    // every category gets a keyword description (name + "website development in Bangladesh" + office + phone)
    const description = cat.metaDescription ||
        `${cat.name} website development in Bangladesh by Extrain Web — custom design, mobile-friendly and SEO-ready. Office in Merul Badda, Dhaka. Call +880 1711-946614.`;
    return {
        title: cat.metaTitle || `${cat.name} Website Development in Bangladesh | Extrain Web`,
        description,
        alternates: { canonical: `https://www.extrainweb.com/category/${slug}` },
        openGraph: {
            title: cat.metaTitle || `${cat.name} Website Development in Bangladesh | Extrain Web`,
            description,
            url: `https://www.extrainweb.com/category/${slug}`,
            images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
        },
    };
}

export default async function CategoryPage({ params }) {
    const { slug } = await params;
    if (!KNOWN_SLUGS.includes(slug)) notFound();
    return <CategoryView slug={slug} />;
}
