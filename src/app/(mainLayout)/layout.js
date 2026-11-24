'use client';

import Footer from '@/components/sheard/Footer';
import Navbar from '@/components/sheard/Navbar';
import RouteProgress from '@/components/sheard/RouteProgress';
import React from 'react';
import WhatsAppButton from '@/components/sheard/WhatsAppButton';
import dynamic from 'next/dynamic';

// the chat widget loads after the page, so it never slows the first screen
const ChatBot = dynamic(() => import('@/components/sheard/ChatBot'), { ssr: false });

const MainLayout = ({ children }) => {
    return (
        <>
            <RouteProgress />
            {/* dark behind every page: while one page swaps to the next, the browser's white never shows (the white flash) */}
            <div className="min-h-screen bg-[#0e0f11]">
                <Navbar />
                {children}
                <Footer />

                <WhatsAppButton />
                <ChatBot />
            </div>
        </>
    );
};

export default MainLayout;
