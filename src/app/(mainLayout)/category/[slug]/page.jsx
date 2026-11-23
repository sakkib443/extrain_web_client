import { notFound } from "next/navigation";
import { getCategory, KNOWN_SLUGS } from "@/data/categories";
import CategoryView from "./CategoryView";

export async function generateMetadata({ params }) {
    const { slug } = await params;
    if (!KNOWN_SLUGS.includes(slug)) return {};
    const cat = getCategory(slug);
    return {
        title: `${cat.name} Website Development in Bangladesh | Extrain Web`,
        description: cat.description,
        alternates: { canonical: `https://www.extrainweb.com/category/${slug}` },
        openGraph: {
            title: `${cat.name} Website Development in Bangladesh | Extrain Web`,
            description: cat.description,
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
