// One blog article (server component — the whole article is in the HTML Google downloads).
// Dark site look: title block, wide cover, readable text column, sticky sidebar with a quote card and service links,
// then "More articles".

import Image from "next/image";
import Link from "next/link";
import { BUSINESS } from "@/config/business";
import { formatDate } from "./BlogIndex";

const ORANGE = "#F8921C";

const SERVICES = [
    { href: "/web-development-company-dhaka", label: "Web development company in Dhaka" },
    { href: "/web-development-company-badda", label: "Website development in Merul Badda" },
    { href: "/category/ecommerce", label: "E-commerce website development" },
    { href: "/website", label: "Custom websites we build" },
    { href: "/digital-marketing", label: "SEO & digital marketing" },
];

export default function BlogArticle({ blog, related = [] }) {
    const author = [blog.author?.firstName, blog.author?.lastName].filter(Boolean).join(" ") || "Extrain Web";
    const waText = encodeURIComponent(`Hello Extrain Web! I read "${blog.title}" and want to talk about a website.`);

    return (
        <main className="bg-[color:var(--tone-deep)] text-white">
            {/* ============ TITLE ============ */}
            <header className="relative overflow-hidden">
                <div aria-hidden="true" className="pointer-events-none absolute -top-40 right-[-10%] h-[32rem] w-[32rem] rounded-full blur-[120px]" style={{ background: "rgba(248,146,28,0.12)" }} />
                <div className="container relative mx-auto max-w-5xl px-6 pb-10 pt-10 lg:px-10 lg:pt-14">
                    <nav aria-label="Breadcrumb" className="mb-6 text-[13px] text-white/50">
                        <Link href="/" className="hover:text-white">Home</Link>
                        <span className="mx-2">/</span>
                        <Link href="/blog" className="hover:text-white">Blog</Link>
                    </nav>
                    {blog.category?.name && (
                        <span className="mb-5 inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-black" style={{ background: ORANGE }}>
                            {blog.category.name}
                        </span>
                    )}
                    <h1 style={{ color: "#fff" }} className="text-[clamp(1.9rem,3.8vw,3.2rem)] font-bold leading-[1.15] tracking-[-0.01em]">
                        {blog.title}
                    </h1>
                    {blog.excerpt && <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/65">{blog.excerpt}</p>}
                    <div className="mt-7 flex items-center gap-3 text-[14px] text-white/55">
                        <span className="grid h-10 w-10 place-items-center rounded-full text-sm font-bold text-black" style={{ background: ORANGE }}>
                            {author.charAt(0)}
                        </span>
                        <div>
                            <p className="font-semibold text-white/85">{author}</p>
                            <p>
                                {formatDate(blog.publishedAt || blog.createdAt)}
                                {blog.readingTime ? ` · ${blog.readingTime} min read` : ""}
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* ============ COVER ============ */}
            {blog.thumbnail && (
                <div className="container mx-auto max-w-5xl px-6 lg:px-10">
                    <div className="relative aspect-[1200/630] overflow-hidden rounded-[2rem] border border-white/10">
                        <Image src={blog.thumbnail} alt={blog.title} fill priority sizes="(min-width: 1024px) 960px, 100vw" className="object-cover" />
                    </div>
                </div>
            )}

            {/* ============ ARTICLE + SIDEBAR ============ */}
            <div className="container mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-10">
                <article>
                    <div className="blog-content blog-content-dark" dangerouslySetInnerHTML={{ __html: blog.content || "" }} />

                    {blog.tags?.length > 0 && (
                        <ul className="mt-12 flex flex-wrap gap-2 border-t border-white/10 pt-8" aria-label="Tags">
                            {blog.tags.map((tag) => (
                                <li key={tag} className="rounded-full border border-white/15 px-3.5 py-1.5 text-[13px] text-white/60">#{tag}</li>
                            ))}
                        </ul>
                    )}
                </article>

                <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
                    <div className="rounded-3xl border border-[#F8921C]/30 bg-[#F8921C]/[0.06] p-6">
                        <p className="text-[12px] font-bold uppercase tracking-[0.16em]" style={{ color: ORANGE }}>Free consultation</p>
                        <p style={{ color: "#fff" }} className="mt-2 text-lg font-bold leading-snug">Planning a website or software?</p>
                        <p className="mt-2 text-sm leading-relaxed text-white/60">Talk to our team in Merul Badda, Dhaka — {BUSINESS.hoursText}.</p>
                        <div className="mt-5 flex flex-col gap-2.5">
                            <a href={`tel:${BUSINESS.phone}`} className="rounded-full px-5 py-3 text-center text-sm font-semibold text-black hover:opacity-90" style={{ background: ORANGE }}>
                                Call {BUSINESS.phoneDisplay}
                            </a>
                            <a href={`${BUSINESS.whatsapp}?text=${waText}`} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/20 px-5 py-3 text-center text-sm font-semibold text-white hover:border-white/50">
                                WhatsApp us
                            </a>
                        </div>
                    </div>

                    <nav aria-label="Our services" className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                        <p style={{ color: "#fff" }} className="mb-3 font-bold">Our services</p>
                        <ul className="space-y-2.5 text-[14px]">
                            {SERVICES.map((s) => (
                                <li key={s.href}>
                                    <Link href={s.href} className="text-white/65 transition-colors hover:text-[#F8921C]">{s.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </aside>
            </div>

            {/* ============ MORE ARTICLES ============ */}
            {related.length > 0 && (
                <section className="border-t border-white/10">
                    <div className="container mx-auto max-w-6xl px-6 py-16 lg:px-10">
                        <div className="mb-8 flex items-end justify-between gap-4">
                            <h2 style={{ color: "#fff" }} className="text-2xl font-bold">More articles</h2>
                            <Link href="/blog" className="text-sm font-semibold" style={{ color: ORANGE }}>All articles →</Link>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {related.map((p) => (
                                <Link key={p.slug} href={`/blog/${p.slug}`} className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition-colors hover:border-[#F8921C]/50">
                                    <div className="relative aspect-[1200/630] overflow-hidden">
                                        {p.thumbnail && <Image src={p.thumbnail} alt={p.title} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />}
                                    </div>
                                    <div className="p-5">
                                        <h3 style={{ color: "#fff" }} className="font-bold leading-snug transition-colors group-hover:text-[#F8921C]">{p.title}</h3>
                                        <p className="mt-2 text-[13px] text-white/50">{formatDate(p.publishedAt || p.createdAt)}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}
