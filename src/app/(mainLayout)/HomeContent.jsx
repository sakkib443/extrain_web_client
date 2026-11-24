"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
// sections below the first screen come in their own JS chunks (page speed); still rendered on the server for Google
import { useDispatch } from "react-redux";
import { fetchCategories } from "@/redux/categorySlice";
import Hero from "@/components/Home/Hero";
import HomeCategory from "@/components/Home/HomeCategory";
const AboutServices = dynamic(() => import("@/components/Home/AboutServices"));
const GallerySection = dynamic(() => import("@/components/Home/GallerySection"));
const ClientsSection = dynamic(() => import("@/components/Home/ClientsSection"));
const DigitalProducts = dynamic(() => import("@/components/Home/DigitalProducts"));
const TestimonialSection = dynamic(() => import("@/components/Home/TestimonialSection"));
const TeamSection = dynamic(() => import("@/components/Home/TeamSection"));
import AreasWeServe from "@/components/Home/AreasWeServe";
import { HomeMediaProvider } from "@/components/Home/HomeMediaContext";

export default function HomeContent({ media = null }) {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    return (
        <HomeMediaProvider initial={media}>
        <div className="relative min-h-screen bg-white dark:bg-black selection:bg-rose-600 selection:text-black font-poppins antialiased">
            <main className="relative">
                {/* Hero Section */}
                <section className="relative w-full overflow-hidden z-0 bg-white dark:bg-black">
                    <Hero />
                </section>

                {/* Other Sections */}
                <section className="relative z-10 bg-white dark:bg-[#020202]">
                    <HomeCategory />
                    <AboutServices />
                    <GallerySection />
                    <ClientsSection />
                    <TeamSection />
                    <DigitalProducts />
                    <TestimonialSection />
                    <AreasWeServe />
                </section>
            </main>
        </div>
        </HomeMediaProvider>
    );
}
