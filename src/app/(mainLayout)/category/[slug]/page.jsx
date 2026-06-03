import { getCategory } from "@/data/categories";
import CategoryView from "./CategoryView";

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const cat = getCategory(slug);
    return {
        title: `${cat.name} Website Development & Templates | Extrain Web`,
        description: cat.description,
        alternates: { canonical: `https://extrainweb.com/category/${slug}` },
    };
}

export default async function CategoryPage({ params }) {
    const { slug } = await params;
    return <CategoryView slug={slug} />;
}
