"use client";

import React from 'react';
import { motion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import Marquee from 'react-fast-marquee';
import { useLanguage } from '@/context/LanguageContext';
import useSectionMotion from '@/hooks/useSectionMotion';
import { Star4, EdgeDots, OrbitRing } from './Decor';

const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.65, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
    }),
};
const viewport = { once: true, amount: 0.2 };

const companies = [
    { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
    { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
    { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
    { name: "Spotify", logo: "https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg" },
    { name: "Slack", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Slack_Technologies_Logo.svg" },
    { name: "Adobe", logo: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.png" },
    { name: "Figma", logo: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg" },
    { name: "Airbnb", logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg" }
];

// One logo tile. Every logo is turned into a white silhouette (brightness-0 + invert), so black logos stay visible on black.
const LogoTile = ({ company, hidden = false }) => (
    <div aria-hidden={hidden || undefined} className="group mx-3 cursor-pointer lg:mx-4">
        <div className="flex h-20 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-9 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#F8921C]/60 hover:bg-white/[0.06] hover:shadow-[0_24px_50px_-28px_rgba(248,146,28,0.55)] lg:h-24 lg:px-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={company.logo}
                alt={hidden ? "" : company.name}
                className="h-8 w-auto object-contain opacity-60 brightness-0 invert transition-all duration-300 group-hover:scale-110 group-hover:opacity-100 lg:h-10"
            />
        </div>
    </div>
);

const CompanyLogos = () => {
    const { language } = useLanguage();
    const isBn = language === "bn";
    const bn = isBn ? "hind-siliguri" : "";

    // ---- smooth scroll + mouse motion (same feel as the other home sections) ----
    const { ref: sectionRef, p, mx, reduce } = useSectionMotion();
    const headY = useTransform(p, [0, 1], [18, -18]);
    // fast scrolling leans the logo strip a little (same as the clients strip)
    const { scrollY } = useScroll();
    const scrollSpeed = useSpring(useVelocity(scrollY), { stiffness: 120, damping: 30 });
    const stripSkew = useTransform(scrollSpeed, [-2400, 0, 2400], [5, 0, -5]);
    const ringX = useTransform(mx, [-0.5, 0.5], [26, -26]);
    const ringY = useTransform(p, [0, 1], [60, -60]);
    const ring2X = useTransform(mx, [-0.5, 0.5], [-24, 24]);
    const ring2Y = useTransform(p, [0, 1], [-54, 54]);
    const starY = useTransform(p, [0, 1], [-60, 60]);
    const starX = useTransform(mx, [-0.5, 0.5], [-22, 22]);

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden bg-[color:var(--tone-deep)] py-24 text-white lg:py-28"
        >
            {/* ===== background decoration ===== */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                <div className="absolute left-1/2 top-1/2 h-72 w-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F8921C]/[0.05] blur-3xl" />
                <EdgeDots />
                <motion.div
                    style={reduce ? undefined : { x: ringX, y: ringY }}
                    className="absolute -left-[15rem] top-[4%] hidden sm:block"
                >
                    <div className="relative aspect-square w-[30rem]">
                        <OrbitRing className="absolute inset-0 border-white/[0.09]" />
                        <OrbitRing reverse dashed dot="bottom" className="absolute inset-[16%] border-[#F8921C]/20" />
                    </div>
                </motion.div>
                <motion.div
                    style={reduce ? undefined : { x: ring2X, y: ring2Y }}
                    className="absolute -right-[13rem] bottom-[0%] hidden md:block"
                >
                    <div className="relative aspect-square w-[26rem]">
                        <OrbitRing dashed reverse dot="bottom" className="absolute inset-0 border-white/[0.09]" />
                        <OrbitRing className="absolute inset-[18%] border-white/[0.06]" />
                    </div>
                </motion.div>
                <motion.div style={reduce ? undefined : { x: starX, y: starY }} className="absolute right-[12%] top-[12%] hidden md:block">
                    <Star4 size={36} filled className="decor-float text-[#F8921C]" style={{ animationDuration: "10s" }} />
                </motion.div>
            </div>

            <div className="container relative z-10 mx-auto px-6 lg:px-10">
                <motion.div
                    style={reduce ? undefined : { y: headY }}
                    className="mx-auto mb-14 flex max-w-3xl flex-col items-center text-center lg:mb-16"
                >
                    <motion.span
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={viewport}
                        className="mb-7 block h-[3px] w-16 rounded-full bg-[#F8921C]"
                    />
                    <motion.h2
                        variants={fadeUp}
                        custom={1}
                        initial="hidden"
                        whileInView="show"
                        viewport={viewport}
                        style={{ color: "#fff" }}
                        className={`text-[1.7rem] font-bold leading-[1.25] sm:text-3xl lg:text-[2.35rem] ${bn}`}
                    >
                        {isBn ? (
                            <>আমাদের শিক্ষার্থীরা <i className="font-light">যেখানে কাজ করছে</i></>
                        ) : (
                            <>Building Future With <i className="font-light">Top Companies</i></>
                        )}
                    </motion.h2>
                    <motion.p
                        variants={fadeUp}
                        custom={2}
                        initial="hidden"
                        whileInView="show"
                        viewport={viewport}
                        className="mt-4 max-w-2xl text-center text-xs uppercase tracking-widest text-white/60 sm:text-sm"
                    >
                        Trusted by industry leaders worldwide
                    </motion.p>
                </motion.div>
            </div>

            {/* ===== logo strip, edge to edge ===== */}
            <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.1 }}
                className="relative z-10"
            >
                <div
                    className="overflow-hidden"
                    style={{
                        maskImage: "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)",
                        WebkitMaskImage: "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)",
                    }}
                >
                    {/* leans with the page's scroll speed */}
                    <motion.div style={reduce ? undefined : { skewX: stripSkew }}>
                        <Marquee gradient={false} speed={50} pauseOnHover={true} className="py-6">
                            {companies.map((company, index) => (
                                <LogoTile key={index} company={company} />
                            ))}
                            {companies.map((company, index) => (
                                <LogoTile key={`dup-${index}`} company={company} hidden />
                            ))}
                        </Marquee>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

export default CompanyLogos;
