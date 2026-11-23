export const metadata = {
    title: "Blog — Web Development, Design & Marketing Tips | Extrain Web",
    description: "Articles from Extrain Web, a web development company in Dhaka: website costs in Bangladesh, design, SEO, e-commerce and digital marketing tips.",
    alternates: { canonical: "/blog" },
    openGraph: {
        title: "Extrain Web Blog",
        description: "Web development, design, SEO and marketing tips from our team in Dhaka.",
        url: "https://www.extrainweb.com/blog",
        images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Extrain Web Blog" }],
    },
};

export default function BlogLayout({ children }) {
    return children;
}
