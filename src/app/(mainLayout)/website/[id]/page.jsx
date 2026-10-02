import React from "react";
import WebsiteDetailsContent from "./WebsiteDetailsContent";

// Helper function to check if string looks like MongoDB ObjectId
const isObjectId = (str) => /^[a-f\d]{24}$/i.test(str);

// SEO - Dynamic Metadata Generation
export async function generateMetadata({ params }) {
    const { id } = await params;

    try {
        // Try slug first, then ID
        const apiUrl = isObjectId(id)
            ? `https://extrain-web-server.vercel.app/api/websites/${id}`
            : `https://extrain-web-server.vercel.app/api/websites/slug/${id}`;

        const response = await fetch(apiUrl, { next: { revalidate: 60 } });
        const result = await response.json();
        const website = result.data;

        if (!website) {
            return {
                title: "Website Not Found | Extrain Web",
                description: "The requested website project could not be found.",
            };
        }

        return {
            title: website.title,
            description: website.description || `Explore ${website.title} - A premium website project by Extrain Web.`,
            keywords: `${website.title}, website development, project template, ${website.projectType}, Extrain Web`,
            openGraph: {
                title: `${website.title} | Extrain Web`,
                description: website.description,
                url: `https://extrainweb.com/website/${website.slug || id}`,
                siteName: "Extrain Web",
                images: [
                    {
                        url: website.images?.[0] || website.image || "/images/logo.png",
                        width: 1200,
                        height: 630,
                        alt: website.title,
                    },
                ],
                type: "website",
            },
            twitter: {
                card: "summary_large_image",
                title: website.title,
                description: website.description,
                images: [website.images?.[0] || website.image || "/images/logo.png"],
            },
        };
    } catch (error) {
        return {
            title: "Project Details | Extrain Web",
            description: "View details of our website development projects.",
        };
    }
}

// Server Component
export default async function WebsiteDetailsPage({ params }) {
    const { id } = await params;

    let website = null;
    let error = null;

    try {
        // Try slug first, then ID
        const apiUrl = isObjectId(id)
            ? `https://extrain-web-server.vercel.app/api/websites/${id}`
            : `https://extrain-web-server.vercel.app/api/websites/slug/${id}`;

        const response = await fetch(apiUrl, { next: { revalidate: 60 } });

        if (!response.ok) {
            throw new Error("Failed to fetch website data");
        }

        const result = await response.json();
        website = result.data;
    } catch (err) {
        console.error("Error fetching website:", err);
        error = err.message;
    }

    return (
        <>
            {/* JSON-LD Structured Data for SEO - পৃথিবীর সেরা SEO এর জন্য এটা মাস্ট */}
            {website && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Product",
                            "name": website.title,
                            "description": website.description,
                            "image": website.images?.[0] || website.image,
                            "brand": {
                                "@type": "Brand",
                                "name": "Extrain Web"
                            },
                            "offers": {
                                "@type": "Offer",
                                "price": website.offerPrice || website.price,
                                "priceCurrency": "BDT",
                                "availability": "https://schema.org/InStock"
                            },
                            "aggregateRating": {
                                "@type": "AggregateRating",
                                "ratingValue": website.rating || "5.0",
                                "reviewCount": website.reviewCount || "1"
                            }
                        })
                    }}
                />
            )}

            <WebsiteDetailsContent initialWebsite={website} />
        </>
    );
}
