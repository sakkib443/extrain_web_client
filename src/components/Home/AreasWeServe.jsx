import Link from "next/link";

// A small band near the bottom of the home page that links to the local landing pages.
// Internal links from the home page tell Google these pages matter (SEO), and visitors from those areas find their page.
const LINKS = [
    { href: "/web-development-company-dhaka", label: "Web Development Company in Dhaka" },
    { href: "/web-development-company-badda", label: "Website Development in Merul Badda" },
    { href: "/web-development-company-near-brac-university", label: "Web Development near BRAC University" },
    { href: "/category/ecommerce", label: "E-commerce Website Development in Dhaka" },
];

export default function AreasWeServe() {
    return (
        <section className="border-t border-white/10 bg-[#0e0f11] px-5 py-12 sm:px-8" aria-labelledby="areas-we-serve">
            <div className="mx-auto max-w-[1280px]">
                <h2 id="areas-we-serve" style={{ color: "#fff" }} className="text-xl font-bold sm:text-2xl">
                    Custom website &amp; software development across Bangladesh
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
                    Our office is in Merul Badda, Dhaka, and we build websites for businesses all over Bangladesh.
                </p>
                <ul className="mt-6 flex flex-wrap gap-3">
                    {LINKS.map((l) => (
                        <li key={l.href}>
                            <Link
                                href={l.href}
                                className="inline-flex items-center rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:border-[#F8921C] hover:text-[#F8921C]"
                            >
                                {l.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
