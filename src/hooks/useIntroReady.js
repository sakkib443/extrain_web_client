"use client";


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

// The greeting preloader was removed for page speed (2026-11-24), so content is visible at once.
// Kept as a hook so Hero/Navbar don't change; returns true right away.
export default function useIntroReady() {
    return true;
}
