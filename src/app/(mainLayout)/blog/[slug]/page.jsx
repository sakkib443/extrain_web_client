import React from 'react';
import BlogDetailsContent from './BlogDetailsContent';

export async function generateMetadata({ params }) {
    const { slug } = await params;

    try {
        const response = await fetch(`https://extrain-web-server.vercel.app/api/blogs/slug/${slug}`, {
            next: { revalidate: 60 },
        });
        const result = await response.json();
        const blog = result.data;

        if (!blog) {
            return {
                title: "Blog Not Found | Extrain Web",
                robots: { index: false, follow: true },
                description: "The requested blog post could not be found.",
            };
        }

        return {
            title: `${blog.title} | Extrain Web Blog`,
            description: blog.excerpt || blog.description?.substring(0, 160),
            alternates: { canonical: `https://www.extrainweb.com/blog/${slug}` },
            keywords: blog.tags?.join(', ') || 'web development blog, tech news, Extrain Web',
            openGraph: {
                title: blog.title,
                description: blog.excerpt,
                url: `https://www.extrainweb.com/blog/${slug}`,
                siteName: "Extrain Web",
                images: [
                    {
                        url: blog.thumbnail || "/og-image.jpg",
                        width: 1200,
                        height: 630,
                        alt: blog.title,
                    },
                ],
                type: "article",
                publishedTime: blog.publishedAt || blog.createdAt,
                authors: [`${blog.author?.firstName} ${blog.author?.lastName}`],
                tags: blog.tags,
            },
            twitter: {
                card: "summary_large_image",
                title: blog.title,
                description: blog.excerpt,
                images: [blog.thumbnail || "/og-image.jpg"],
            },
        };
    } catch (error) {
        return {
            title: "Blog | Extrain Web",
            description: "Read the latest news and articles from Extrain Web.",
        };
    }
}

export default async function SingleBlogPage({ params }) {
    const { slug } = await params;

    let blog = null;

    try {
        const response = await fetch(`https://extrain-web-server.vercel.app/api/blogs/slug/${slug}`, {
            next: { revalidate: 60 },
        });
        const result = await response.json();
        blog = result.data;
    } catch (error) {
        console.error('Failed to fetch blog:', error);
    }

    return (
        <>
            {blog && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "BlogPosting",
                            "headline": blog.title,
                            "description": blog.excerpt,
                            "image": blog.thumbnail,
                            "author": {
                                "@type": "Person",
                                "name": `${blog.author?.firstName} ${blog.author?.lastName}`
                            },
                            "publisher": { "@id": "https://www.extrainweb.com/#business" },
                            "mainEntityOfPage": `https://www.extrainweb.com/blog/${slug}`,
                            "datePublished": blog.publishedAt || blog.createdAt,
                            "dateModified": blog.updatedAt || blog.createdAt
                        })
                    }}
                />
            )}
            <BlogDetailsContent initialBlog={blog} />
        </>
    );
}
