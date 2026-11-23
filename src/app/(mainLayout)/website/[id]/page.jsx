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
                robots: { index: false, follow: true },
                description: "The requested website project could not be found.",
            };
        }

        return {
            title: `${website.title} | Extrain Web`,
            description: (website.description || `${website.title} — a ready website by Extrain Web, web development company in Dhaka.`).slice(0, 160),
            alternates: { canonical: `https://www.extrainweb.com/website/${website.slug || id}` },
            keywords: `${website.title}, website development, project template, ${website.projectType}, Extrain Web`,
            openGraph: {
                title: `${website.title} | Extrain Web`,
                description: website.description,
                url: `https://www.extrainweb.com/website/${website.slug || id}`,
                siteName: "Extrain Web",
                images: [
                    {
                        url: website.images?.[0] || website.image || "/og-image.jpg",
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
                images: [website.images?.[0] || website.image || "/og-image.jpg"],
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
                                "availability": "https://schema.org/InStock",
                                "url": `https://www.extrainweb.com/website/${website.slug || id}`,
                                "seller": { "@id": "https://www.extrainweb.com/#business" }
                            },
                            // only real reviews — a made-up rating can get the whole site a Google penalty
                            ...(website.rating > 0 && website.reviewCount > 0 && {
                                "aggregateRating": {
                                    "@type": "AggregateRating",
                                    "ratingValue": website.rating,
                                    "reviewCount": website.reviewCount
                                }
                            })
                        })
                    }}
                />
            )}

            <WebsiteDetailsContent initialWebsite={website} />
        </>
    );
}
