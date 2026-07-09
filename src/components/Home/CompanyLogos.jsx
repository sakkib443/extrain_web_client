"use client";

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Marquee from 'react-fast-marquee';

const CompanyLogos = () => {
    const { language } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";

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

    return (
        <section className="py-24 bg-white dark:bg-[#050505] border-t border-gray-100 dark:border-white/5 overflow-hidden">
            <div className="container mx-auto px-6 mb-16">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-[2px] bg-[#0CB2A9] mb-6"></div>
                    <h3 className={`text-3xl md:text-5xl font-black uppercase font-poppins text-center text-gray-900 dark:text-white ${bengaliClass}`}>
                        {language === 'bn' ? 'আমাদের শিক্ষার্থীরা যেখানে কাজ করছে' : 'Building Future With Top Companies'}
                    </h3>
                    <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-2xl text-center text-sm uppercase tracking-widest">
                        Trusted by industry leaders worldwide
                    </p>
                </div>
            </div>

            <div className="relative">
                {/* Gradient Masks */}
                <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-white dark:from-[#050505] to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-white dark:from-[#050505] to-transparent z-10" />

                <Marquee gradient={false} speed={50} pauseOnHover={true} className="py-8">
                    {companies.map((company, index) => (
                        <div key={index} className="mx-12 lg:mx-20 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer group transform hover:scale-110">
                            <img
                                src={company.logo}
                                alt={company.name}
                                className="h-10 lg:h-14 w-auto object-contain dark:invert group-hover:dark:invert-0"
                            />
                        </div>
                    ))}
                    {companies.map((company, index) => (
                        <div key={`dup-${index}`} className="mx-12 lg:mx-20 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer group transform hover:scale-110">
                            <img
                                src={company.logo}
                                alt={company.name}
                                className="h-10 lg:h-14 w-auto object-contain dark:invert group-hover:dark:invert-0"
                            />
                        </div>
                    ))}
                </Marquee>
            </div>
        </section>
    );
};

export default CompanyLogos;
