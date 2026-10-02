import React from "react";

// Small decorative pieces for section backgrounds (the animations live in globals.css: decor-spin / decor-float).

// Four-point sparkle. filled → solid, otherwise a thin outline. Colour comes from the text colour (currentColor).
export const Star4 = ({ size = 60, filled = false, className = "", style }) => (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} style={style} aria-hidden="true">
        <path
            d="M50 2 C53 33 67 47 98 50 C67 53 53 67 50 98 C47 67 33 53 2 50 C33 47 47 33 50 2 Z"
            fill={filled ? "currentColor" : "none"}
            stroke={filled ? "none" : "currentColor"}
            strokeWidth="1.6"
            strokeLinejoin="round"
        />
    </svg>
);

// A small "+" mark.
export const Plus = ({ size = 16, className = "" }) => (
    <svg viewBox="0 0 20 20" width={size} height={size} className={className} aria-hidden="true">
        <path d="M10 2v16M2 10h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
);

// Faint dot grid that only shows toward the edges, so the middle (text, cards) stays clean.
export const EdgeDots = ({ className = "" }) => (
    <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 ${className}`}
        style={{
            backgroundImage: "radial-gradient(rgba(150,154,164,0.14) 1px, transparent 1.2px)",
            backgroundSize: "30px 30px",
            maskImage: "radial-gradient(ellipse 62% 70% at 50% 50%, transparent 38%, #000 92%)",
            WebkitMaskImage: "radial-gradient(ellipse 62% 70% at 50% 50%, transparent 38%, #000 92%)",
        }}
    />
);

// A ring with a glowing dot on its rim; the ring turns slowly (decor-spin).
export const OrbitRing = ({ className = "", dashed = false, reverse = false, dot = "top", dotColor = "#F8921C" }) => (
    <div
        aria-hidden="true"
        className={`rounded-full border ${dashed ? "border-dashed" : ""} ${reverse ? "decor-spin-rev" : "decor-spin"} ${className}`}
    >
        <span
            className={`absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full ${dot === "top" ? "-top-[5px]" : "-bottom-[5px]"}`}
            style={{ background: dotColor, boxShadow: `0 0 18px ${dotColor}` }}
        />
    </div>
);
