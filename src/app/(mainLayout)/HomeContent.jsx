"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCategories } from "@/redux/categorySlice";
import Hero from "@/components/Home/Hero";
import HomeCategory from "@/components/Home/HomeCategory";
import WhatWeProvide from "@/components/Home/WhatWeProvide";
import DigitalProducts from "@/components/Home/DigitalProducts";
import MissionSection from "@/components/Home/MissionSection";
import TestimonialSection from "@/components/Home/TestimonialSection";
import CompanyLogos from "@/components/Home/CompanyLogos";

export default function HomeContent() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    return (
        <div className="relative min-h-screen bg-white dark:bg-black selection:bg-rose-600 selection:text-black font-poppins antialiased">
            <main className="relative">
                {/* Hero Section */}
                <section className="relative w-full overflow-hidden z-0 bg-white dark:bg-black">
                    <Hero />
                </section>

                {/* Other Sections */}
                <section className="relative z-10 bg-white dark:bg-[#020202]">
                    <HomeCategory />
                    <DigitalProducts />
                    <MissionSection />
                    <WhatWeProvide />
                    <CompanyLogos />
                    <TestimonialSection />
                </section>
            </main>
        </div>
    );
}
