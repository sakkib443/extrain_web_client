"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// This component scrolls to top on every route change
const ScrollToTopOnNavigate = () => {
    const pathname = usePathname();

    useEffect(() => {
        // 1. Store the current path as a redirect target if the user navigates to login
        // This helps the login page know where to return the user
        if (pathname === '/login' || pathname === '/register') {
            // We don't want to store the login/register paths themselves
        } else {
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('redirectPath', pathname + window.location.search);
            }
        }

        // 2. Scroll to top when pathname changes
        // Using requestAnimationFrame to ensure the scroll happens after the page content is rendered
        const scroll = () => {
            window.scrollTo({
                top: 0,
                behavior: "instant"
            });
        };

        requestAnimationFrame(() => {
            scroll();
            // Double check after a small delay for content that might load/shift
            setTimeout(scroll, 10);
        });
    }, [pathname]);

    return null; // This component doesn't render anything
};

export default ScrollToTopOnNavigate;
