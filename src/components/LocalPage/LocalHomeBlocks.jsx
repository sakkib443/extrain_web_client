"use client";

// The home page's own sections, reused on the local pages (Badda, Dhaka, BRAC University) so they look like the home page.
// part="hero"   → the home hero with the page's own keyword lines in the H1
// part="top"    → services grid + "about our services"
// part="proof"  → gallery, clients, testimonials
// The local page's own text (intro, why, areas, FAQ) sits between these blocks, so every page stays unique for Google.

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useDispatch } from "react-redux";
import { fetchCategories } from "@/redux/categorySlice";
import Hero from "@/components/Home/Hero";
import { HomeMediaProvider } from "@/components/Home/HomeMediaContext";

const HomeCategory = dynamic(() => import("@/components/Home/HomeCategory"));
const AboutServices = dynamic(() => import("@/components/Home/AboutServices"));
const GallerySection = dynamic(() => import("@/components/Home/GallerySection"));
const ClientsSection = dynamic(() => import("@/components/Home/ClientsSection"));
const TestimonialSection = dynamic(() => import("@/components/Home/TestimonialSection"));

export default function LocalHomeBlocks({ part, media = null, keywordLines }) {
    const dispatch = useDispatch();
    useEffect(() => {
        if (part === "top") dispatch(fetchCategories());
    }, [dispatch, part]);

    return (
        <HomeMediaProvider initial={media}>
            <div className="relative bg-white dark:bg-black font-poppins antialiased">
                {part === "hero" && (
                    <section className="relative w-full overflow-hidden z-0 bg-white dark:bg-black">
                        <Hero keywordLines={keywordLines} />
                    </section>
                )}
                {part === "top" && (
                    <section className="relative z-10 bg-white dark:bg-[#020202]">
                        <HomeCategory />
                        <AboutServices />
                    </section>
                )}
                {part === "proof" && (
                    <section className="relative z-10 bg-white dark:bg-[#020202]">
                        <GallerySection />
                        <ClientsSection />
                        <TestimonialSection />
                    </section>
                )}
            </div>
        </HomeMediaProvider>
    );
}
