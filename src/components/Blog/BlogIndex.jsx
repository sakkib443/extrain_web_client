// Blog list page (server component — every post title, summary and link is in the HTML Google downloads).
// Same black / orange look as the rest of the site: one big featured post, then a grid of cards.

import Image from "next/image";
import Link from "next/link";

const ORANGE = "#F8921C";

export const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

const Arrow = () => (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const Meta = ({ post }) => (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-white/50">
        <span>{formatDate(post.publishedAt || post.createdAt)}</span>
        {post.readingTime ? (<><span aria-hidden="true">·</span><span>{post.readingTime} min read</span></>) : null}
    </p>
);

const Cover = ({ post, sizes, priority = false }) =>
    post.thumbnail ? (
        <Image src={post.thumbnail} alt={post.title} fill sizes={sizes} priority={priority} className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
    ) : (
        <div className="absolute inset-0 grid place-items-center bg-white/[0.04] text-3xl font-extrabold text-white/20">Extrain Web</div>
    );

function FeaturedPost({ post }) {
    return (
        <Link
            href={`/blog/${post.slug}`}
            className="group grid overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] transition-colors hover:border-[#F8921C]/50 lg:grid-cols-[1.15fr_0.85fr]"
        >
            <div className="relative aspect-[1200/630] lg:aspect-auto lg:min-h-[360px]">
                <Cover post={post} sizes="(min-width: 1024px) 60vw, 100vw" priority />
            </div>
            <div className="flex flex-col justify-center gap-4 p-7 sm:p-10">
                <span className="w-fit rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-black" style={{ background: ORANGE }}>
                    Latest · {post.category?.name || "Blog"}
                </span>
                <h2 style={{ color: "#fff" }} className="text-2xl font-bold leading-snug transition-colors group-hover:text-[#F8921C] sm:text-3xl">
                    {post.title}
                </h2>
                <p className="line-clamp-3 text-[15px] leading-relaxed text-white/65">{post.excerpt}</p>
                <Meta post={post} />
                <span className="mt-1 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: ORANGE }}>
                    Read article <Arrow />
                </span>
            </div>
        </Link>
    );
}

function PostCard({ post }) {
    return (
        <Link
            href={`/blog/${post.slug}`}
            className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition-colors hover:border-[#F8921C]/50"
        >
            <div className="relative aspect-[1200/630] overflow-hidden">
                <Cover post={post} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
            </div>
            <div className="flex flex-1 flex-col gap-3 p-6">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: ORANGE }}>
                    {post.category?.name || "Blog"}
                </span>
                <h3 style={{ color: "#fff" }} className="text-lg font-bold leading-snug transition-colors group-hover:text-[#F8921C]">
                    {post.title}
                </h3>
                <p className="line-clamp-3 text-[14px] leading-relaxed text-white/60">{post.excerpt}</p>
                <div className="mt-auto pt-2">
                    <Meta post={post} />
                </div>
            </div>
        </Link>
    );
}

export default function BlogIndex({ posts }) {
    const [first, ...rest] = posts;

    return (
        <main className="bg-[color:var(--tone-deep)] text-white">
            {/* ============ HEADER ============ */}
            <section className="relative overflow-hidden">
                <div aria-hidden="true" className="pointer-events-none absolute -top-40 right-[-10%] h-[32rem] w-[32rem] rounded-full blur-[120px]" style={{ background: "rgba(248,146,28,0.12)" }} />
                <div className="container relative mx-auto px-6 pb-10 pt-10 lg:px-10 lg:pt-14">
                    <nav aria-label="Breadcrumb" className="mb-6 text-[13px] text-white/50">
                        <Link href="/" className="hover:text-white">Home</Link>
                        <span className="mx-2">/</span>
                        <span className="text-white/80">Blog</span>
                    </nav>
                    <h1 style={{ color: "#fff" }} className="text-[clamp(2.2rem,4.6vw,3.8rem)] font-bold leading-[1.1] tracking-[-0.01em]">
                        Blog
                        <span className="mt-3 block text-base font-medium leading-snug tracking-normal text-white/60 sm:text-lg">
                            Web development, design &amp; marketing tips from our team in Dhaka
                        </span>
                    </h1>
                </div>
            </section>

            {/* ============ POSTS ============ */}
            <section className="container mx-auto px-6 pb-24 lg:px-10">
                {first ? (
                    <>
                        <FeaturedPost post={first} />
                        {rest.length > 0 && (
                            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {rest.map((p) => <PostCard key={p.slug} post={p} />)}
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-white/60">New articles are coming soon.</p>
                )}
            </section>

            {/* ============ CTA ============ */}
            <section className="border-t border-white/10">
                <div className="container mx-auto flex flex-col items-start justify-between gap-6 px-6 py-14 lg:flex-row lg:items-center lg:px-10">
                    <div>
                        <h2 style={{ color: "#fff" }} className="text-2xl font-bold">Need a website for your business?</h2>
                        <p className="mt-2 text-white/60">Custom website &amp; software development in Merul Badda, Dhaka — free consultation.</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link href="/contact" className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-black hover:opacity-90" style={{ background: ORANGE }}>
                            Get a free quote <Arrow />
                        </Link>
                        <Link href="/web-development-company-dhaka" className="inline-flex items-center rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white hover:border-white/50">
                            Our services
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
