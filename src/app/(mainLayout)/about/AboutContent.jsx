"use client";

import React from "react";
import WhatWeProvide from "@/components/Home/WhatWeProvide";
import HeroSection from "@/components/Aboutpage/sections/HeroSection";
import MissionSection from "@/components/Aboutpage/sections/MissionSection";
import StatsSection from "@/components/Aboutpage/sections/StatsSection";
import WhySection from "@/components/Aboutpage/sections/WhySection";
import CtaSection from "@/components/Aboutpage/sections/CtaSection";

// Black theme. Section tones alternate (deep / soft) from the top:
//   hero (deep) → mission (soft) → numbers (deep) → what we provide (soft) → why us (deep) → call to action (soft)
export default function AboutContent() {
    return (
        <div className="relative overflow-x-clip bg-[color:var(--tone-deep)] text-white selection:bg-[#F8921C] selection:text-black">
            <HeroSection />
            <MissionSection />
            <StatsSection />
            {/* shared with the Home page — brings its own (soft) background */}
            <WhatWeProvide />
            <WhySection />
            <CtaSection />
        </div>
    );
}
