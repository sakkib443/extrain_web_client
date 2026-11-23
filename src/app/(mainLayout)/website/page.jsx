import React, { Suspense } from "react";
import WebsitePageContent from "./WebsitePageContent";

// SEO - Metadata for the listing page
export const metadata = {
    title: "Ready-Made Websites & Templates in Bangladesh | Extrain Web",
    description: "Browse our collection of premium, fully-functional websites. Get your business online instantly with our high-quality website templates and custom solutions. Best website marketplace in Bangladesh.",
    keywords: "website marketplace, buy websites, premium website templates, ready-made websites, website development Bangladesh, portfolio, e-commerce, real estate websites",
    alternates: {
        canonical: "https://www.extrainweb.com/website",
    },
    openGraph: {
        title: "Extrain Web Marketplace - Premium Websites",
        description: "Explore the best collection of ready-to-deploy websites for startups and enterprises.",
        url: "https://www.extrainweb.com/website",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Extrain Web Marketplace",
            },
        ],
    },
};

// Server Component
export default async function WebsitePage() {
    let websites = [];

    try {
        const response = await fetch("https://extrain-web-server.vercel.app/api/websites?limit=100", {
            next: { revalidate: 60 },
        });
        const result = await response.json();
        websites = result.data || [];
    } catch (error) {
        console.error("Failed to fetch websites for SSR:", error);
    }

    return (
        <>
            {/* JSON-LD for CollectionPage and ItemList SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "CollectionPage",
                        "name": "Extrain Web Marketplace - Premium Websites",
                        "description": "A curated collection of professional websites for sale.",
                        "url": "https://www.extrainweb.com/website",
                        "mainEntity": {
                            "@type": "ItemList",
                            "numberOfItems": websites.length,
                            "itemListElement": websites.slice(0, 10).map((site, index) => ({
                                "@type": "ListItem",
                                "position": index + 1,
                                "url": `https://www.extrainweb.com/website/${site.slug || site._id}`,
                                "name": site.title,
                                "image": site.images?.[0] || site.image
                            }))
                        }
                    })
                }}
            />

            <WebsitePageContent initialWebsites={websites} />
        </>
    );
}
