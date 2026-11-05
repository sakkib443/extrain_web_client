// robots.txt - Search Engine Crawlers এর জন্য instructions

export default function robots() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://extrainweb.com';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/dashboard/',
                    '/api/',
                    '/admin/',
                    '/_next/',
                    '/checkout',
                    '/cart',
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
