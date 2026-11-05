// ===================================================================
// Home page photos — the built-in defaults.
// What the admin saves in Dashboard → Design → Home Page → Photos replaces these, section by section
// (see lib/homeMedia.js). Until something is saved, the page looks exactly like this.
// ===================================================================

import { CLIENTS } from "@/data/clients";

const U = (id, w = 900) => `https://images.unsplash.com/${id}?w=${w}&q=80`;
const stock = (id, label, labelBn) => ({ src: U(id), full: U(id, 1600), label, labelBn });
const local = (src, label, labelBn, pos) => ({ src, full: src, label, labelBn, ...(pos ? { pos } : {}) });
// our own event photos: a small file for the tile, the big one for the lightbox
const summit = (n, label, labelBn, pos = "50% 25%") => ({
    src: `/images/gallery/summit-2026-${n}-sm.webp`,
    full: `/images/gallery/summit-2026-${n}.webp`,
    label,
    labelBn,
    pos,
});

// the photos of the clients (same files as the "Our Clients" cards)
const clientShots = CLIENTS.filter((c) => c.image)
    .slice(0, 3)
    .map((c) => ({ src: c.image, full: c.image, label: c.name, labelBn: c.nameBn || c.name }));

export const GALLERY_ROW_H = 340; // desktop px; a portrait (3:4) tile is ~255 wide, a landscape (4:3) one ~450

export const DEFAULT_HOME_MEDIA = {
    hero: {
        // the big image on the right — switch with the arrows when there is more than one
        slides: [
            { src: "/hero-office.webp", alt: "Extrain Web team in our office", pos: "92% 25%" },
            { src: "/hero-team.webp", alt: "Our creative team at work", pos: "50% 25%" },
        ],
        background: "/hero-bg.webp", // behind the headline
        overlay: 25, // % of black over the background, for text contrast
    },

    // "Services That Power Your Digital Growth" — left, centre (bigger), right
    services: [
        { src: U("photo-1460925895917-afdab827c52f", 1000), pos: "50% 50%" }, // Digital Marketing
        { src: U("photo-1542744095-70fccefd4b65", 1400), pos: "50% 45%" }, // Web Design & Development
        { src: U("photo-1452587925148-ce544e77e70d", 1000), pos: "50% 50%" }, // Content & Media
    ],

    // "Growth roadmap" — the three-photo collage
    roadmap: [
        { src: U("photo-1498050108023-c5249f4df085", 1000), pos: "50% 50%" }, // Web Design & Development
        { src: U("photo-1551288049-bebda4e38f71", 1000), pos: "50% 45%" }, // Digital Marketing
        { src: U("photo-1492691527719-9d1e07e534b4", 1000), pos: "38% 50%" }, // Content & Media
    ],

    // Gallery: rows that slide in opposite directions. A row is a list of columns; a column has one tall photo or
    // two stacked. Every column in a row has the same height, so the top and bottom edges line up.
    gallery: {
        rowHeight: GALLERY_ROW_H,
        rows: [
            {
                columns: [
                    { w: 255, items: [summit(1, "Bangladesh AI Business Summit 2026", "বাংলাদেশ এআই বিজনেস সামিট ২০২৬")] },
                    { w: 450, items: [summit(2, "Our team at the summit", "সামিটে আমাদের টিম", "50% 40%")] },
                    { w: 240, items: [summit(4, "At our booth", "আমাদের স্টলে")] },
                    { w: 450, items: [summit(6, "Visitors at our booth", "স্টলে দর্শনার্থীদের ভিড়", "50% 40%")] },
                    { w: 440, items: [local("/hero-office.webp", "Our team", "আমাদের টিম")] },
                    {
                        w: 280,
                        items: [
                            stock("photo-1522542550221-31fd19575a2d", "Web design", "ওয়েব ডিজাইন"),
                            stock("photo-1581291518857-4e27b48ff24e", "Wireframing", "ওয়্যারফ্রেম"),
                        ],
                    },
                    ...(clientShots[0] ? [{ w: 380, items: [clientShots[0]] }] : []),
                    { w: 270, items: [stock("photo-1516035069371-29a1b244cc32", "Photography", "ফটোগ্রাফি")] },
                    { w: 380, items: [stock("photo-1521737711867-e3b97375f902", "Team at work", "কাজের মুহূর্ত")] },
                    {
                        w: 300,
                        items: [
                            stock("photo-1600880292203-757bb62b4baf", "Celebrating wins", "সফলতার উদযাপন"),
                            stock("photo-1556761175-5973dc0f32e7", "Team sessions", "টিম সেশন"),
                        ],
                    },
                ],
            },
            {
                columns: [
                    { w: 255, items: [summit(8, "AI Business Summit 2026", "এআই বিজনেস সামিট ২০২৬")] },
                    { w: 450, items: [summit(3, "Live demo of Azadi 24", "আজাদী ২৪-এর লাইভ ডেমো", "50% 40%")] },
                    { w: 255, items: [summit(5, "Showing our software", "দর্শনার্থীদের সফটওয়্যার দেখানো")] },
                    { w: 255, items: [summit(7, "Azadi 24 booth", "আজাদী ২৪ স্টল", "50% 50%")] },
                    { w: 400, items: [local("/hero-team.webp", "Creative sessions", "ক্রিয়েটিভ সেশন")] },
                    ...(clientShots[1] ? [{ w: 400, items: [clientShots[1]] }] : []),
                    {
                        w: 300,
                        items: [
                            stock("photo-1552664730-d307ca884978", "Brainstorming", "ব্রেইনস্টর্মিং"),
                            stock("photo-1499750310107-5fef28a66643", "Where ideas begin", "যেখানে আইডিয়ার শুরু"),
                        ],
                    },
                    { w: 280, items: [stock("photo-1531482615713-2afd69097998", "Development", "ডেভেলপমেন্ট")] },
                    { w: 420, items: [stock("photo-1542744173-8e7e53415bb0", "Client presentations", "ক্লায়েন্ট প্রেজেন্টেশন")] },
                    ...(clientShots[2] ? [{ w: 380, items: [clientShots[2]] }] : []),
                    {
                        w: 290,
                        items: [
                            stock("photo-1522202176988-66273c2fd55f", "Collaboration", "একসাথে কাজ"),
                            stock("photo-1557804506-669a67965ba0", "Planning", "প্ল্যানিং"),
                        ],
                    },
                ],
            },
        ],
    },
};
