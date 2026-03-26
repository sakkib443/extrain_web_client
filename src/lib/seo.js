// SEO Metadata Utility - সব pages এ use করার জন্য
// This generates comprehensive metadata for better SEO

export function generateMetadata({
    title,
    description,
    keywords = [],
    image = '/images/logo.png',
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
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://extrainweb.com';
    const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;
    const canonical = canonicalUrl || baseUrl;

    const metadata = {
        title,
        description,
        keywords: keywords.join(', '),
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
        alternates: {
            canonical: canonical,
            languages: {
                'en-US': canonical,
                'bn-BD': canonical,
            },
        },
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
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [fullImageUrl],
            creator: '@extrainweb', // আপনার Twitter handle দিয়ে replace করবেন
        },
        verification: {
            google: 'yxl3yWdFkrclIR7zzpyfjc5mCC0AmjTpeaii_z6yUVg', // Google Search Console verification code
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
export function generateOrganizationSchema() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://extrainweb.com';

    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: 'Extrain Web',
        alternateName: 'Extra in Web',
        url: baseUrl,
        logo: `${baseUrl}/images/logo.png`,
        description: 'Professional website development company in Bangladesh. We specialize in custom web development, ready-made website templates, and business software solutions.',
        foundingDate: '2019',
        slogan: 'Your Digital Success Partner',
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Road - 11, DIT Project, Marul Badda, Badda',
            addressLocality: 'Dhaka',
            postalCode: '1214',
            addressCountry: 'BD',
        },
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'Customer Service',
            telephone: '+8801711946614',
            email: 'info.extrainweb@gmail.com',
            availableLanguage: ['English', 'Bengali'],
        },
        sameAs: [
            // আপনার social media links add করবেন
            'https://facebook.com/extrainweb',
            'https://linkedin.com/company/extrainweb',
            // 'https://twitter.com/extrainweb',
            // 'https://youtube.com/@extrainweb',
        ],
    };
}

// Service Schema for Web Development Services
export function generateServiceSchema(service) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://extrainweb.com';

    return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: service.title,
        description: service.description,
        provider: {
            '@type': 'Organization',
            name: 'Extrain Web',
            url: baseUrl,
        },
        areaServed: {
            '@type': 'Country',
            name: 'Bangladesh',
        },
        image: service.image || `${baseUrl}/images/logo.png`,
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
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://extrainweb.com';

    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        description: product.description,
        image: product.image || `${baseUrl}/images/logo.png`,
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
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://extrainweb.com';

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
