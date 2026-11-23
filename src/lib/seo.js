// SEO Metadata Utility - সব pages এ use করার জন্য
// This generates comprehensive metadata for better SEO

import { BUSINESS, SITE_URL, OG_IMAGE, LOGO_URL, MAP_URL } from '@/config/business';

export function generateMetadata({
    title,
    description,
    keywords = [],
    image = OG_IMAGE,
    type = 'website',
    locale = 'en_US',
    alternateLocales = ['bn_BD'],
    publishedTime,
    modifiedTime,
    author = 'Extrain Web',
    section,
    tags = [],
    noIndex = false,
    canonicalUrl,
}) {
    const baseUrl = SITE_URL;
    const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;
    // canonical is always a full URL; '/' → https://www.extrainweb.com/
    const canonical = !canonicalUrl ? `${baseUrl}/` : canonicalUrl.startsWith('http') ? canonicalUrl : `${baseUrl}${canonicalUrl}`;

    const metadata = {
        title,
        description,
        ...(keywords.length && { keywords: keywords.join(', ') }),
        authors: [{ name: author }],
        creator: 'Extrain Web',
        publisher: 'Extrain Web',
        robots: {
            index: !noIndex,
            follow: !noIndex,
            googleBot: {
                index: !noIndex,
                follow: !noIndex,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        // English and Bangla are the same URL (switched on the page), so there is no hreflang — just one canonical
        alternates: { canonical },
        openGraph: {
            type,
            locale,
            alternateLocale: alternateLocales,
            url: canonical,
            title,
            description,
            siteName: 'Extrain Web',
            images: [
                {
                    url: fullImageUrl,
                    ...(image === OG_IMAGE && { width: 1200, height: 630 }),
                    alt: title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [fullImageUrl],
        },
    };

    // Article-specific metadata
    if (type === 'article' && (publishedTime || modifiedTime || section || tags.length)) {
        metadata.openGraph.article = {
            ...(publishedTime && { publishedTime }),
            ...(modifiedTime && { modifiedTime }),
            ...(author && { authors: [author] }),
            ...(section && { section }),
            ...(tags.length && { tags }),
        };
    }

    return metadata;
}

// Common keyword sets - Website Development Company এর জন্য
// PRIMARY FOCUS: Extrain Web, Extra in Web, Best/Top variants
export const commonKeywords = {
    brand: [
        'Extrain Web',
        'Extra in Web',
        'ExtrainWeb',
        'Extrain Web Bangladesh',
        'Extra in Web Bangladesh',
        'Sheikh Sakibul Hasan',
        'Sheikh Sakib',
        'Sakib sir',
        'Sakib',
        'Sheikh Sakibul Hasan Extrain Web',
    ],
    bestKeywords: [
        'best website development company Bangladesh',
        'best web development agency Bangladesh',
        'top website development company Bangladesh',
        'leading website development company Bangladesh',
        'best web design company Dhaka',
        'top web development agency Dhaka',
        'best custom website developer Bangladesh',
        'top rated web development company',
        '#1 website development company Bangladesh',
    ],
    base: [
        'Extrain Web',
        'Extra in Web',
        'website development company Bangladesh',
        'web development agency Dhaka',
        'custom website design Bangladesh',
        'professional web development',
        'responsive website design',
        'e-commerce website Bangladesh',
        'business website development',
    ],
    services: [
        'custom website development',
        'e-commerce website development',
        'business website design',
        'responsive web design',
        'website redesign services',
        'corporate website development',
        'portfolio website design',
        'web application development',
    ],
    templates: [
        'website templates',
        'ready-made websites',
        'e-commerce template',
        'business website template',
        'responsive templates',
        'HTML templates Bangladesh',
        'premium website templates',
    ],
    software: [
        'ready-made software',
        'business software Bangladesh',
        'inventory management system',
        'POS system Bangladesh',
        'enterprise software',
        'custom software development',
    ],
    local: [
        'website development company Dhaka',
        'web design Bangladesh',
        'best web development agency Bangladesh',
        'professional website designers Dhaka',
        'affordable website development Bangladesh',
        'top website developer Dhaka',
    ],
};

// Schema.org JSON-LD generators

// The whole business as Google should understand it: a local web-design company in Merul Badda, Dhaka.
// Rendered once on every page from the root layout (app/layout.js). Other schemas point to it by @id.
export const BUSINESS_ID = `${SITE_URL}/#business`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export function generateBusinessSchema() {
    const a = BUSINESS.address;
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': ['ProfessionalService', 'Organization'],
                '@id': BUSINESS_ID,
                name: BUSINESS.name,
                alternateName: BUSINESS.alternateName,
                url: `${SITE_URL}/`,
                logo: { '@type': 'ImageObject', url: LOGO_URL, width: 600, height: 105 },
                image: `${SITE_URL}${OG_IMAGE}`,
                description:
                    'Extrain Web is a web development and website design company in Merul Badda, Dhaka, Bangladesh. We build custom websites, e-commerce sites, business software and run digital marketing for businesses across Bangladesh.',
                slogan: 'Your Complete Business Solution Partner',
                foundingDate: BUSINESS.foundingDate,
                founder: { '@type': 'Person', name: BUSINESS.founder },
                telephone: BUSINESS.phone,
                email: BUSINESS.email,
                priceRange: '৳৳',
                currenciesAccepted: 'BDT',
                address: {
                    '@type': 'PostalAddress',
                    streetAddress: a.street,
                    addressLocality: `${a.area}, ${a.city}`,
                    addressRegion: a.region,
                    postalCode: a.postalCode,
                    addressCountry: a.country,
                },
                hasMap: MAP_URL,
                openingHoursSpecification: [
                    {
                        '@type': 'OpeningHoursSpecification',
                        dayOfWeek: BUSINESS.hours.days,
                        opens: BUSINESS.hours.opens,
                        closes: BUSINESS.hours.closes,
                    },
                ],
                areaServed: [
                    { '@type': 'Place', name: 'Badda, Dhaka' },
                    { '@type': 'City', name: 'Dhaka' },
                    { '@type': 'Country', name: 'Bangladesh' },
                ],
                contactPoint: {
                    '@type': 'ContactPoint',
                    contactType: 'customer service',
                    telephone: BUSINESS.phone,
                    email: BUSINESS.email,
                    areaServed: 'BD',
                    availableLanguage: ['English', 'Bengali'],
                },
                knowsAbout: [
                    'Web development',
                    'Website design',
                    'E-commerce website development',
                    'Custom software development',
                    'Search engine optimization',
                    'Digital marketing',
                ],
                sameAs: BUSINESS.sameAs,
            },
            {
                '@type': 'WebSite',
                '@id': WEBSITE_ID,
                url: `${SITE_URL}/`,
                name: BUSINESS.name,
                alternateName: BUSINESS.alternateName,
                publisher: { '@id': BUSINESS_ID },
                inLanguage: ['en', 'bn'],
            },
        ],
    };
}

// Old name, kept so nothing that imports it breaks
export const generateOrganizationSchema = generateBusinessSchema;

// Service Schema for Web Development Services
export function generateServiceSchema(service) {
    const baseUrl = SITE_URL;

    return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: service.title,
        description: service.description,
        provider: { '@id': BUSINESS_ID },
        areaServed: service.areaServed || [
            { '@type': 'City', name: 'Dhaka' },
            { '@type': 'Country', name: 'Bangladesh' },
        ],
        ...(service.url && { url: service.url.startsWith('http') ? service.url : `${baseUrl}${service.url}` }),
        image: service.image || `${baseUrl}${OG_IMAGE}`,
        ...(service.price && {
            offers: {
                '@type': 'Offer',
                price: service.price,
                priceCurrency: 'BDT',
            },
        }),
    };
}

export function generateProductSchema(product) {
    const baseUrl = SITE_URL;

    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        description: product.description,
        image: product.image || `${baseUrl}${OG_IMAGE}`,
        brand: {
            '@type': 'Brand',
            name: 'Extrain Web',
        },
        ...(product.price && {
            offers: {
                '@type': 'Offer',
                price: product.price,
                priceCurrency: 'BDT',
                availability: 'https://schema.org/InStock',
                url: `${baseUrl}/product/${product._id}`,
            },
        }),
        ...(product.rating && {
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: product.rating,
                reviewCount: product.reviewCount || 1,
            },
        }),
    };
}

export function generateBreadcrumbSchema(items) {
    const baseUrl = SITE_URL;

    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
        })),
    };
}

export function generateFAQSchema(faqs) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };
}
