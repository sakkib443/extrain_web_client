"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue, useReducedMotion, useScroll, useSpring } from "framer-motion";

// Smooth scroll + mouse motion for one section — the same feel as the hero and the services section.
//
//   ref  → put on the <section> (it must be position: relative / absolute)
//   p    → scroll progress of this section, 0 → 1, smoothed.
//          0 = section just touching the bottom of the screen, 0.5 = centred, 1 = just left through the top.
//          Map it with useTransform(p, [0, 1], [+a, -a]) so an element sits in its normal place at 0.5
//          and drifts in / out on either side.
//   mx, my → mouse position inside the section, -0.5 … 0.5, smoothed (0 when the mouse is outside).
//   reduce → true when the visitor asked for less motion; skip the effects then.
//   isLg   → true on screens ≥ 1024px wide (where side-by-side layouts allow bigger movement).
export default function useSectionMotion() {
    const ref = useRef(null);
    const reduce = useReducedMotion();

    const [isLg, setIsLg] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia("(min-width: 1024px)");
        const apply = () => setIsLg(mq.matches);
        apply();
        mq.addEventListener("change", apply);
        return () => mq.removeEventListener("change", apply);
    }, []);

    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const p = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.4 });

    const rawX = useMotionValue(0);
    const rawY = useMotionValue(0);
    const mx = useSpring(rawX, { stiffness: 80, damping: 20 });
    const my = useSpring(rawY, { stiffness: 80, damping: 20 });

    useEffect(() => {
        const el = ref.current;
        if (reduce || !el) return;
        const onMove = (e) => {
            const r = el.getBoundingClientRect();
            rawX.set((e.clientX - r.left) / r.width - 0.5);
            rawY.set((e.clientY - r.top) / r.height - 0.5);
        };
        const onLeave = () => {
            rawX.set(0);
            rawY.set(0);
        };
        el.addEventListener("mousemove", onMove, { passive: true });
        el.addEventListener("mouseleave", onLeave);
        return () => {
            el.removeEventListener("mousemove", onMove);
            el.removeEventListener("mouseleave", onLeave);
        };
    }, [reduce, rawX, rawY]);

    return { ref, p, mx, my, reduce, isLg };
}
