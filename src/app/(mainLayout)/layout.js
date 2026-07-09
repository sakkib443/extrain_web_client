'use client';

import Footer from '@/components/sheard/Footer';
import Navbar from '@/components/sheard/Navbar';
import Preloader from '@/components/sheard/Preloader';
import React from 'react';
import WhatsAppButton from '@/components/sheard/WhatsAppButton';
import ChatBot from '@/components/sheard/ChatBot';

const MainLayout = ({ children }) => {
    return (
        <>
            <Preloader />
            <div>
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
