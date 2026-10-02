"use client";

import { useEffect, useState } from "react";

// Entrance animations should play when the visitor can actually see them.
// On the first page of a session the greeting preloader covers the screen, so this returns false until the
// preloader starts opening (it fires INTRO_EVENT). Every other time — later pages, reloads, other tabs that
// already saw the greeting — it is true right away.

export const INTRO_EVENT = "extrain:intro-ready";

export function announceIntroReady() {
    if (typeof window === "undefined") return;
    window.__extrainIntroReady = true;
    window.dispatchEvent(new Event(INTRO_EVENT));
}

export default function useIntroReady() {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let seen = false;
        try {
            seen = !!sessionStorage.getItem("hasVisited") || document.documentElement.hasAttribute("data-visited");
        } catch { /* storage blocked — don't hold the page hostage */ seen = true; }

        if (seen || window.__extrainIntroReady) {
            setReady(true);
            return;
        }
        const on = () => setReady(true);
        window.addEventListener(INTRO_EVENT, on);
        // safety net: never keep content hidden if the preloader is missing or broken
        const t = setTimeout(on, 12000);
        return () => {
            window.removeEventListener(INTRO_EVENT, on);
            clearTimeout(t);
        };
    }, []);

    return ready;
}
