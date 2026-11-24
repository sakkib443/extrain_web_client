// Local landing page (server component — all text is in the HTML Google downloads, no JavaScript needed).
// Used by /web-development-company-badda and /web-development-company-dhaka. Content: data/localPages.js.
// Same black / orange look as the rest of the site.

import Image from "next/image";
import Link from "next/link";
import { BUSINESS, ADDRESS_LINE, ADDRESS_LINE_BN, MAP_URL, MAP_EMBED_URL } from "@/config/business";
import { LOCAL_SERVICES, LOCAL_STEPS } from "@/data/localPages";
import LocalHomeBlocks from "./LocalHomeBlocks";
import { API_BASE_URL } from "@/config/api";
import { fetchHomeMedia } from "@/lib/homeMedia";

const ORANGE = "#F8921C";

const Arrow = () => (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const SectionTitle = ({ kicker, children }) => (
    <div className="mb-10">
        <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.18em]" style={{ color: ORANGE }}>{kicker}</p>
        <h2 style={{ color: "#fff" }} className="max-w-3xl text-3xl font-bold leading-tight md:text-4xl">{children}</h2>
    </div>
);

export default async function LocalLanding({ page }) {
    // same photos as the home page (Dashboard → Design → Home Page → Photos)
    const media = await fetchHomeMedia(API_BASE_URL);
    const waText = encodeURIComponent(`Hello Extrain Web! I want a website. (from the ${page.place} page)`);

    return (
        <main className="bg-[color:var(--tone-deep)] text-white">
            {/* ============ HOME-STYLE HERO (the page's H1: home headline + this page's keyword lines) ============ */}
            <LocalHomeBlocks part="hero" media={media} keywordLines={page.heroLines} />

            {/* ============ INTRO (this page's own text) ============ */}
            <section className="relative overflow-hidden">
                <div aria-hidden="true" className="pointer-events-none absolute -top-40 right-[-10%] h-[36rem] w-[36rem] rounded-full blur-[120px]" style={{ background: "rgba(248,146,28,0.12)" }} />
                <div className="container relative mx-auto grid items-center gap-12 px-6 pb-16 pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:pb-24 lg:pt-24">
                    <div>
                        <nav aria-label="Breadcrumb" className="mb-6 text-[13px] text-white/50">
                            <Link href="/" className="hover:text-white">Home</Link>
                            <span className="mx-2">/</span>
                            <span className="text-white/80">{page.h1}</span>
                        </nav>
                        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-white/80">
                            <span className="h-2 w-2 rounded-full" style={{ background: ORANGE }} />
                            {page.eyebrow}
                        </p>
                        <h2 style={{ color: "#fff" }} className="text-[clamp(2.1rem,4.4vw,3.8rem)] font-bold leading-[1.1] tracking-[-0.01em]">
                            {page.h1}
                        </h2>
                        <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 lg:text-lg">{page.intro}</p>
                        <p className="hind-siliguri mt-4 max-w-xl text-[15px] leading-relaxed text-white/55" lang="bn">{page.introBn}</p>

                        <div className="mt-9 flex flex-wrap items-center gap-3">
                            <a
                                href={`tel:${BUSINESS.phone}`}
                                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-black transition-colors hover:opacity-90"
                                style={{ background: ORANGE }}
                            >
                                Call {BUSINESS.phoneDisplay}
                            </a>
                            <a
                                href={`${BUSINESS.whatsapp}?text=${waText}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:border-white/50"
                            >
                                WhatsApp us
                            </a>
                            <Link href="/confirm-order" className="inline-flex items-center gap-2 px-3 py-3.5 text-sm font-semibold text-white/80 hover:text-white">
                                Order a website <Arrow />
                            </Link>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="relative aspect-[3/2] overflow-hidden rounded-[2rem] border border-white/10">
                            <Image
                                src="/extrain-web-team-demo-dhaka-expo.webp" // real photo: our team showing our software to visitors at a tech expo in Dhaka
                                alt="Extrain Web team demonstrating website and software solutions to visitors at a tech expo in Dhaka, Bangladesh"
                                fill
                                priority
                                sizes="(min-width: 1024px) 45vw, 100vw"
                                className="object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-6 left-6 right-6 rounded-2xl border border-white/10 bg-black/75 p-5 backdrop-blur-md sm:left-auto sm:max-w-xs">
                            <p className="text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: ORANGE }}>Our office</p>
                            <p className="mt-1 text-sm leading-6 text-white/85">{ADDRESS_LINE}</p>
                            <p className="mt-1 text-[13px] text-white/55">{BUSINESS.hoursText}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ HOME SECTIONS: services grid + about our services ============ */}
            <LocalHomeBlocks part="top" media={media} />

            {/* ============ SERVICES ============ */}
            <section className="bg-[color:var(--tone-soft)] py-20 lg:py-24">
                <div className="container mx-auto px-6 lg:px-10">
                    <SectionTitle kicker="Services">Website design &amp; development services in {page.place}</SectionTitle>
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {LOCAL_SERVICES.map((s) => (
                            <Link
                                key={s.href + s.title}
                                href={s.href}
                                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-[#F8921C]/60"
                            >
                                <h3 style={{ color: "#fff" }} className="text-lg font-semibold">{s.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-white/60">{s.desc}</p>
                                <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold" style={{ color: ORANGE }}>
                                    Learn more <Arrow />
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ WHY US ============ */}
            <section className="py-20 lg:py-24">
                <div className="container mx-auto px-6 lg:px-10">
                    <SectionTitle kicker="Why Extrain Web">{page.whyTitle}</SectionTitle>
                    <div className="grid gap-5 md:grid-cols-2">
                        {page.why.map((w, i) => (
                            <div key={w.title} className="flex gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-black" style={{ background: ORANGE }}>
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <div>
                                    <h3 style={{ color: "#fff" }} className="text-lg font-semibold">{w.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-white/60">{w.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ PROCESS ============ */}
            <section className="bg-[color:var(--tone-soft)] py-20 lg:py-24">
                <div className="container mx-auto px-6 lg:px-10">
                    <SectionTitle kicker="How it works">From first call to a live website</SectionTitle>
                    <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {LOCAL_STEPS.map((s, i) => (
                            <li key={s.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                                <p className="text-3xl font-bold" style={{ color: ORANGE }}>{i + 1}</p>
                                <h3 style={{ color: "#fff" }} className="mt-3 text-lg font-semibold">{s.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-white/60">{s.desc}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            {/* ============ HOME SECTIONS: gallery, clients, testimonials ============ */}
            <LocalHomeBlocks part="proof" media={media} />

            {/* ============ AREAS + OFFICE + MAP ============ */}
            <section className="py-20 lg:py-24">
                <div className="container mx-auto grid gap-12 px-6 lg:grid-cols-2 lg:px-10">
                    <div>
                        <SectionTitle kicker="Service area">{page.areasTitle}</SectionTitle>
                        <ul className="flex flex-wrap gap-2.5">
                            {page.areas.map((a) => (
                                <li key={a} className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/75">{a}</li>
                            ))}
                        </ul>

                        <address className="mt-10 not-italic">
                            <p className="text-[12px] font-semibold uppercase tracking-[0.16em]" style={{ color: ORANGE }}>Visit or call</p>
                            <p className="mt-3 text-lg font-semibold text-white">{BUSINESS.name}</p>
                            <p className="mt-1 text-white/75">{ADDRESS_LINE}, Bangladesh</p>
                            <p className="hind-siliguri mt-1 text-white/50" lang="bn">{ADDRESS_LINE_BN}</p>
                            <p className="mt-3 text-white/75">
                                Phone / WhatsApp: <a href={`tel:${BUSINESS.phone}`} className="font-semibold text-white hover:text-[#F8921C]">{BUSINESS.phoneDisplay}</a>
                            </p>
                            <p className="mt-1 text-white/75">
                                Email: <a href={`mailto:${BUSINESS.email}`} className="text-white hover:text-[#F8921C]">{BUSINESS.email}</a>
                            </p>
                            <p className="mt-1 text-white/75">Open: {BUSINESS.hoursText} (Friday closed)</p>
                            <a href={MAP_URL} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: ORANGE }}>
                                Get directions on Google Maps <Arrow />
                            </a>
                        </address>
                    </div>
                    <div className="h-[380px] overflow-hidden rounded-[2rem] border border-white/10 lg:h-auto lg:min-h-[460px]">
                        <iframe
                            src={MAP_EMBED_URL}
                            title={`Map: Extrain Web office, Merul Badda, Dhaka`}
                            width="100%"
                            height="100%"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="h-full w-full border-0"
                        />
                    </div>
                </div>
            </section>

            {/* ============ FAQ ============ */}
            <section className="bg-[color:var(--tone-soft)] py-20 lg:py-24">
                <div className="container mx-auto max-w-4xl px-6 lg:px-10">
                    <SectionTitle kicker="FAQ">Questions people ask us</SectionTitle>
                    <div className="space-y-3">
                        {page.faqs.map((f, i) => (
                            <details key={f.q} open={i === 0} className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 open:border-[#F8921C]/50">
                                <summary className="cursor-pointer list-none text-lg font-semibold text-white">
                                    <h3 style={{ color: "#fff" }} className="inline text-lg font-semibold">{f.q}</h3>
                                </summary>
                                <p className="mt-3 text-[15px] leading-relaxed text-white/65">{f.a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ CTA ============ */}
            <section className="py-20 lg:py-24">
                <div className="container mx-auto px-6 lg:px-10">
                    <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 text-center md:p-14">
                        <h2 style={{ color: "#fff" }} className="text-3xl font-bold md:text-4xl">Ready to get your website?</h2>
                        <p className="mx-auto mt-4 max-w-2xl text-white/65">
                            Tell us about your business and get a fixed quote — call, WhatsApp or come to our office in Merul Badda.
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            <a href={`tel:${BUSINESS.phone}`} className="rounded-full px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-black" style={{ background: ORANGE }}>
                                Call now
                            </a>
                            <Link href="/confirm-order" className="rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white hover:border-white/50">
                                Order a website
                            </Link>
                        </div>
                        <p className="mt-8 text-sm text-white/50">
                            Also see:{" "}
                            {page.related.map((r) => (
                                <span key={r.href}>
                                    <Link href={r.href} className="underline hover:text-white">{r.label}</Link>
                                    {" · "}
                                </span>
                            ))}
                            <Link href="/happy-clients" className="underline hover:text-white">Our happy clients</Link>
                            {" · "}
                            <Link href="/website" className="underline hover:text-white">Ready-made websites</Link>
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}

// metadata + structured data for a local page (used by both route files)
export function localMetadata(page) {
    const url = `https://www.extrainweb.com/${page.slug}`;
    return {
        title: page.metaTitle,
        description: page.metaDescription,
        alternates: { canonical: url },
        openGraph: {
            type: "website",
            url,
            title: page.metaTitle,
            description: page.metaDescription,
            siteName: "Extrain Web",
            locale: "en_US",
            images: [{ url: "/og-extrain-web-team-dhaka.jpg", width: 1200, height: 630, alt: "Extrain Web team at a tech expo in Dhaka" }],
        },
        twitter: { card: "summary_large_image", title: page.metaTitle, description: page.metaDescription, images: ["/og-extrain-web-team-dhaka.jpg"] },
    };
}

export function LocalSchema({ page }) {
    const url = `https://www.extrainweb.com/${page.slug}`;
    const business = { "@id": "https://www.extrainweb.com/#business" };
    const graph = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": `${url}#webpage`,
                url,
                name: page.metaTitle,
                description: page.metaDescription,
                isPartOf: { "@id": "https://www.extrainweb.com/#website" },
                about: business,
                inLanguage: "en",
                breadcrumb: { "@id": `${url}#breadcrumb` },
                // the photo Google should show next to this page in search results
                primaryImageOfPage: { "@type": "ImageObject", url: "https://www.extrainweb.com/extrain-web-team-demo-dhaka-expo.webp", width: 1200, height: 900 },
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${url}#breadcrumb`,
                itemListElement: [
                    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.extrainweb.com/" },
                    { "@type": "ListItem", position: 2, name: page.h1, item: url },
                ],
            },
            {
                "@type": "Service",
                "@id": `${url}#service`,
                name: page.h1,
                serviceType: "Web development and website design",
                provider: business,
                areaServed: page.areas.map((a) => ({ "@type": "Place", name: `${a}, Dhaka` })),
                url,
            },
            {
                "@type": "FAQPage",
                "@id": `${url}#faq`,
                mainEntity: page.faqs.map((f) => ({
                    "@type": "Question",
                    name: f.q,
                    acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
            },
        ],
    };
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />;
}
