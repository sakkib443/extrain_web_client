import { notFound } from "next/navigation";
import { getCategory, KNOWN_SLUGS } from "@/data/categories";
import CategoryView from "./CategoryView";

export async function generateMetadata({ params }) {
    const { slug } = await params;
    if (!KNOWN_SLUGS.includes(slug)) return {};
    const cat = getCategory(slug);
    return {
        title: `${cat.name} Website Development & Templates | Extrain Web`,
        description: cat.description,
        alternates: { canonical: `https://extrainweb.com/category/${slug}` },
    };
}

export default async function CategoryPage({ params }) {
    const { slug } = await params;
    if (!KNOWN_SLUGS.includes(slug)) notFound();
    return <CategoryView slug={slug} />;
}
