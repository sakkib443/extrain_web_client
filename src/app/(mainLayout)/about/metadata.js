import { generateMetadata as generateSEOMetadata, commonKeywords } from '@/lib/seo';

// SEO Metadata for About Page - Best Website Development Company
// Founder: Sheikh Sakibul Hasan
export const metadata = generateSEOMetadata({
    title: 'About Us - Best Website Development Company Founded by Sheikh Sakibul Hasan | Extrain Web',
    description: 'Meet Extrain Web (Extra in Web) - Bangladesh\'s best website development company. Founded by Sheikh Sakibul Hasan, we deliver top-rated custom web solutions, premium templates, and business software. Leading web development agency in Dhaka.',
    keywords: [
        ...commonKeywords.brand,
        ...commonKeywords.bestKeywords,
        ...commonKeywords.local,
        'about Extrain Web',
        'about Extra in Web',
        'Sheikh Sakibul Hasan founder',
        'best website development company Dhaka',
        'top web designers Bangladesh',
        'leading digital agency Bangladesh',
    ],
    image: '/images/about-og.jpg',
    canonicalUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://extrainweb.com'}/about`,
});
