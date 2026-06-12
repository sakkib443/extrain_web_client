"use client";

import IeltsHero from "./components/IeltsHero";
import IeltsFeatures from "./components/IeltsFeatures";
import IeltsHowItWorks from "./components/IeltsHowItWorks";
import IeltsPricing from "./components/IeltsPricing";
import IeltsCTA from "./components/IeltsCTA";

export default function IeltsSoftwarePage() {
    return (
        <main className="overflow-hidden">
            {/* Hero Section */}
            <IeltsHero />

            {/* Key Features — hidden temporarily */}
            {/* <IeltsFeatures /> */}

            {/* Pricing Packages */}
            <IeltsPricing />

            {/* How It Works */}
            <IeltsHowItWorks />

            {/* Final CTA */}
            <IeltsCTA />
        </main>
    );
}
