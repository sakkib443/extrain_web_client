"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Cormorant_Garamond, Amiri } from "next/font/google";

// classic serif italic for the greeting, proper Arabic calligraphy for السلام عليكم
const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600"], style: ["italic"], display: "swap", variable: "--pl-serif" });
const amiri = Amiri({ subsets: ["arabic"], weight: ["700"], display: "swap", variable: "--pl-arabic" });

// First-visit greeting (once per browser tab session — see the data-visited script in the root layout).
//
//   1. "Assalamu Alaikum" types itself out, letter by letter, with a blinking caret
//   2. it lifts away and the brand comes in: logo mark → "Welcome to Extrain Web"
//   3. the tagline "Your Complete Business Solution Partner" fades up with a progress line
//   4. the dark screen splits and slides away, revealing the site
//
// Click / tap / any key skips straight to the reveal.

const GREETING = "Assalamu Alaikum";
const SPLIT = GREETING.indexOf("Alaikum");            // letters from here on are gold
const T_TYPE = 550;                                    // typing starts (after the Arabic line settles)
const TYPE_MS = 55;                                    // per letter — each letter also fades in over 0.38s, so it flows
const T_BRAND = T_TYPE + GREETING.length * TYPE_MS + 850; // typing done + time to enjoy it
const T_TAGLINE = T_BRAND + 1700;
const T_EXIT = T_TAGLINE + 1800;

const EASE = [0.16, 1, 0.3, 1];

const Preloader = () => {
    const reduce = useReducedMotion();
    const [show, setShow] = useState(true);
    const [phase, setPhase] = useState("greet"); // greet → brand → tagline
    const [typed, setTyped] = useState(0);

    const finish = () => {
        try { sessionStorage.setItem("hasVisited", "true"); } catch { /* private mode */ }
        setShow(false);
    };

    useEffect(() => {
        let visited = false;
        try { visited = !!sessionStorage.getItem("hasVisited"); } catch { /* ignore */ }
        if (visited) {
            setShow(false);
            return;
        }

        // no page scrolling behind the greeting
        const prevOverflow = document.documentElement.style.overflow;
        document.documentElement.style.overflow = "hidden";

        const timers = [];
        const speed = reduce ? 0.5 : 1;
        const at = (ms, fn) => timers.push(setTimeout(fn, ms * speed));

        // typing
        for (let i = 1; i <= GREETING.length; i++) at(T_TYPE + i * TYPE_MS, () => setTyped(i));
        at(T_BRAND, () => setPhase("brand"));
        at(T_TAGLINE, () => setPhase("tagline"));
        at(T_EXIT, finish);

        const skip = () => finish();
        window.addEventListener("keydown", skip);

        return () => {
            timers.forEach(clearTimeout);
            window.removeEventListener("keydown", skip);
            document.documentElement.style.overflow = prevOverflow;
        };
    }, [reduce]);

    // let the page scroll again as soon as the curtain starts to lift
    useEffect(() => {
        if (!show) document.documentElement.style.overflow = "";
    }, [show]);

    const branded = phase !== "greet";

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    key="preloader"
                    onClick={finish}
                    role="status"
                    aria-label="Welcome to Extrain Web"
                    data-phase={phase}
                    className={`site-preloader ${serif.variable} ${amiri.variable} fixed inset-0 z-[9999] cursor-pointer overflow-hidden`}
                >
                    {/* ===== two halves of the curtain — they slide apart on exit ===== */}
                    <motion.div
                        className="absolute inset-x-0 top-0 h-[calc(50%+2px)] bg-[#0b0c0e]"
                        exit={{ y: "-100%" }}
                        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
                    />
                    <motion.div
                        className="absolute inset-x-0 bottom-0 h-[calc(50%+2px)] bg-[#0b0c0e]"
                        exit={{ y: "100%" }}
                        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
                    />

                    {/* ===== content layer (fades out just before the curtain opens) ===== */}
                    <motion.div
                        className="absolute inset-0"
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.35, ease: "easeIn" }}
                    >
                        {/* atmosphere: soft orange glow, faint grid, slow orbit ring */}
                        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                            <motion.div
                                className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F8921C]/[0.10] blur-[110px]"
                                animate={{ scale: branded ? 1.15 : 0.85, opacity: branded ? 1 : 0.6 }}
                                transition={{ duration: 1.4, ease: EASE }}
                            />
                            <div
                                className="absolute inset-0 opacity-[0.05]"
                                style={{
                                    backgroundImage:
                                        "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
                                    backgroundSize: "56px 56px",
                                    maskImage: "radial-gradient(ellipse at center, #000 20%, transparent 70%)",
                                    WebkitMaskImage: "radial-gradient(ellipse at center, #000 20%, transparent 70%)",
                                }}
                            />
                            <motion.div
                                className="absolute left-1/2 top-1/2 aspect-square w-[min(80vw,30rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/[0.08]"
                                initial={{ opacity: 0, rotate: 0 }}
                                animate={{ opacity: branded ? 1 : 0, rotate: 90 }}
                                transition={{ opacity: { duration: 1 }, rotate: { duration: 12, ease: "linear" } }}
                            />
                        </div>

                        <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
                            {/* ---------- 1. greeting (stays mounted; lifts and blurs away when the brand step starts) ---------- */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={branded ? { opacity: 0, y: -30, filter: "blur(10px)" } : { opacity: 1, y: 0, filter: "blur(0px)" }}
                                transition={{ duration: 0.7, ease: EASE }}
                                className={`flex flex-col items-center ${branded ? "pointer-events-none absolute" : ""}`}
                            >
                                {/* Arabic calligraphy between two ornament lines */}
                                <div className="flex items-center gap-4 sm:gap-6">
                                    <motion.i
                                        className="block h-px w-12 origin-right bg-gradient-to-r from-transparent to-[#F8921C]/70 sm:w-20"
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ duration: 1, delay: 0.2, ease: EASE }}
                                    />
                                    <motion.span
                                        initial={{ opacity: 0, scale: 0.9, filter: "blur(6px)" }}
                                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                        transition={{ duration: 0.9, ease: EASE }}
                                        lang="ar"
                                        dir="rtl"
                                        className={`pl-arabic preloader-gold text-[2.1rem] leading-[1.4] sm:text-[2.8rem]`}
                                    >
                                        السلام عليكم
                                    </motion.span>
                                    <motion.i
                                        className="block h-px w-12 origin-left bg-gradient-to-l from-transparent to-[#F8921C]/70 sm:w-20"
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ duration: 1, delay: 0.2, ease: EASE }}
                                    />
                                </div>

                                {/* typed greeting: every new letter fades up out of a soft blur */}
                                <p
                                    className={`pl-serif mt-3 flex min-h-[1.2em] items-baseline justify-center whitespace-pre italic leading-[1.15] text-[clamp(2.6rem,8vw,5.2rem)]`}
                                    aria-label={GREETING}
                                >
                                    {GREETING.slice(0, typed).split("").map((ch, i) => (
                                        <motion.span
                                            key={i}
                                            aria-hidden="true"
                                            initial={{ opacity: 0, y: "0.25em", filter: "blur(8px)" }}
                                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                            transition={{ duration: 0.38, ease: EASE }}
                                            className={`inline-block ${i >= SPLIT ? "preloader-gold font-semibold" : "font-medium text-white"}`}
                                        >
                                            {ch}
                                        </motion.span>
                                    ))}
                                    <span aria-hidden="true" className="preloader-caret ml-1.5 inline-block h-[0.8em] w-[2px] self-center rounded-full bg-[#F8921C] shadow-[0_0_12px_2px_rgba(248,146,28,0.7)]" />
                                </p>

                                {/* after typing: diamond ornament + a quiet translation */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={typed === GREETING.length ? { opacity: 1 } : { opacity: 0 }}
                                    transition={{ duration: 0.6, ease: EASE }}
                                    className="mt-5 flex flex-col items-center"
                                >
                                    <span className="flex items-center gap-3">
                                        <motion.i
                                            className="block h-px w-16 origin-right bg-gradient-to-r from-transparent to-white/40"
                                            initial={{ scaleX: 0 }}
                                            animate={typed === GREETING.length ? { scaleX: 1 } : { scaleX: 0 }}
                                            transition={{ duration: 0.8, ease: EASE }}
                                        />
                                        <i className="block h-2 w-2 rotate-45 bg-[#F8921C]" />
                                        <motion.i
                                            className="block h-px w-16 origin-left bg-gradient-to-l from-transparent to-white/40"
                                            initial={{ scaleX: 0 }}
                                            animate={typed === GREETING.length ? { scaleX: 1 } : { scaleX: 0 }}
                                            transition={{ duration: 0.8, ease: EASE }}
                                        />
                                    </span>
                                    <span className={`pl-serif mt-3 text-base italic tracking-wide text-white/45 sm:text-lg`}>
                                        Peace be upon you
                                    </span>
                                </motion.div>
                            </motion.div>

                            {/* ---------- 2 + 3. brand + tagline ---------- */}
                            {branded && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.4, delay: 0.35 }}
                                    className="flex flex-col items-center"
                                >
                                    {/* logo mark: same orange tile as the Navbar, with a soft halo */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                        transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
                                        className="relative mb-7"
                                    >
                                        <span className="absolute -inset-3 rounded-[1.4rem] border border-[#F8921C]/30" />
                                        <span className="absolute inset-0 animate-ping rounded-2xl bg-[#F8921C]/25 [animation-duration:2.4s]" />
                                        <span className="relative grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-[#FFB45A] to-[#F8921C] text-3xl font-extrabold text-black shadow-[0_20px_50px_-12px_rgba(248,146,28,0.85)]">
                                            A
                                        </span>
                                    </motion.div>

                                    <motion.p
                                        initial={{ opacity: 0, y: 14, letterSpacing: "0.1em" }}
                                        animate={{ opacity: 1, y: 0, letterSpacing: "0.04em" }}
                                        transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
                                        className={`pl-serif flex items-center gap-3 text-xl italic text-white/65 sm:text-2xl`}
                                    >
                                        <i className="h-px w-8 bg-gradient-to-r from-transparent to-white/40" />
                                        Welcome to
                                        <i className="h-px w-8 bg-gradient-to-l from-transparent to-white/40" />
                                    </motion.p>

                                    {/* wordmark: letters rise in, then a light sheen sweeps across */}
                                    <p
                                        className="pl-sans relative mt-2 flex overflow-hidden pb-1 font-extrabold leading-[1.1] tracking-[-0.02em] text-[clamp(2.8rem,9vw,5.6rem)]"
                                        aria-label="Extrain Web"
                                    >
                                        {"Extrain Web".split("").map((ch, i) => (
                                            <motion.span
                                                key={i}
                                                aria-hidden="true"
                                                initial={{ y: "115%", rotate: 6 }}
                                                animate={{ y: 0, rotate: 0 }}
                                                transition={{ duration: 0.8, delay: 0.6 + i * 0.04, ease: EASE }}
                                                className={`inline-block ${ch === " " ? "w-[0.28em]" : i >= 8 ? "preloader-gold" : "preloader-silver"}`}
                                            >
                                                {ch === " " ? " " : ch}
                                            </motion.span>
                                        ))}
                                        <motion.span
                                            aria-hidden="true"
                                            className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/70 to-transparent mix-blend-overlay"
                                            initial={{ left: "-40%" }}
                                            animate={{ left: "120%" }}
                                            transition={{ duration: 1.3, delay: 1.25, ease: "easeInOut" }}
                                        />
                                    </p>

                                    {/* underline ornament */}
                                    <span className="mt-3 flex items-center gap-2">
                                        <motion.i
                                            className="block h-[2px] w-20 origin-right rounded-full bg-gradient-to-r from-transparent to-[#F8921C]"
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{ duration: 0.9, delay: 1.05, ease: EASE }}
                                        />
                                        <motion.i
                                            className="block h-1.5 w-1.5 rotate-45 bg-[#F8921C]"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ duration: 0.4, delay: 1.05 }}
                                        />
                                        <motion.i
                                            className="block h-[2px] w-20 origin-left rounded-full bg-gradient-to-l from-transparent to-[#F8921C]"
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{ duration: 0.9, delay: 1.05, ease: EASE }}
                                        />
                                    </span>

                                    {/* tagline + progress line */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={phase === "tagline" ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                                        transition={{ duration: 0.8, ease: EASE }}
                                        className="mt-6 flex flex-col items-center"
                                    >
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/70 sm:text-[13px]">
                                            Your Complete Business Solution Partner
                                        </p>
                                        <span className="mt-8 h-[2px] w-44 overflow-hidden rounded-full bg-white/10">
                                            <motion.span
                                                className="block h-full rounded-full bg-gradient-to-r from-[#F8921C]/50 to-[#FFB45A]"
                                                initial={{ width: "0%" }}
                                                animate={phase === "tagline" ? { width: "100%" } : { width: "0%" }}
                                                transition={{ duration: 1.5, ease: "easeInOut" }}
                                            />
                                        </span>
                                    </motion.div>
                                </motion.div>
                            )}
                        </div>

                        <p className="absolute inset-x-0 bottom-6 text-center text-[11px] uppercase tracking-[0.3em] text-white/25">
                            Tap to skip
                        </p>
                    </motion.div>

                    <style jsx>{`
                        /* own fonts — must beat the global Bangla-mode rule (body.font-bengali * { … !important }) */
                        :global(body .site-preloader .pl-serif), :global(body .site-preloader .pl-serif *) { font-family: var(--pl-serif), Georgia, serif !important; }
                        :global(body .site-preloader .pl-arabic), :global(body .site-preloader .pl-arabic *) { font-family: var(--pl-arabic), "Traditional Arabic", serif !important; }
                        :global(body .site-preloader .pl-sans), :global(body .site-preloader .pl-sans *) { font-family: var(--font-jakarta), sans-serif !important; }
                        /* caret breathes instead of hard-blinking */
                        @keyframes preloaderBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0.15; } }
                        :global(.preloader-caret) { animation: preloaderBlink 1.1s ease-in-out infinite; }
                        /* gradient lettering */
                        :global(.preloader-gold) {
                            background: linear-gradient(180deg, #ffd08a 0%, #f8921c 55%, #c9680a 100%);
                            -webkit-background-clip: text;
                            background-clip: text;
                            color: transparent;
                            filter: drop-shadow(0 6px 22px rgba(248, 146, 28, 0.35));
                        }
                        :global(.preloader-silver) {
                            background: linear-gradient(180deg, #ffffff 0%, #e9eaee 55%, #a9adb7 100%);
                            -webkit-background-clip: text;
                            background-clip: text;
                            color: transparent;
                        }
                    `}</style>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Preloader;
