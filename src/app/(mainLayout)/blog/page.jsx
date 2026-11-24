// Blog list — rendered on the server: posts written into the site (data/blogPosts.js) + any published in the dashboard.
import BlogIndex from "@/components/Blog/BlogIndex";
import { STATIC_POSTS } from "@/data/blogPosts";

export const revalidate = 3600;

async function getDashboardPosts() {
    try {
        const res = await fetch("https://extrain-web-server.vercel.app/api/blogs?status=published&limit=50", { next: { revalidate: 3600 } });
        if (!res.ok) return [];
        const json = await res.json();
        return Array.isArray(json.data) ? json.data.filter((b) => b.slug) : [];
    } catch {
        return [];
    }
}

export default async function BlogPage() {
    const dashboard = await getDashboardPosts();
    const posts = [...STATIC_POSTS, ...dashboard].sort(
        (a, b) => new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt)
    );
    return <BlogIndex posts={posts} />;
}
