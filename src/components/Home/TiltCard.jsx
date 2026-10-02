"use client";

import React from "react";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

const SPRING = { stiffness: 140, damping: 18, mass: 0.5 };

// Wraps a card: it leans toward the mouse (3D tilt) and a soft light follows the pointer.
// Same hover effect as the services cards. `radius` should match the card's own corner radius.
const TiltCard = ({ children, className = "", radius = "1rem", max = 6 }) => {
    const reduce = useReducedMotion();
    const mx = useMotionValue(0.5);
    const my = useMotionValue(0.5);
    const rotateX = useSpring(useTransform(my, [0, 1], [max, -max]), SPRING);
    const rotateY = useSpring(useTransform(mx, [0, 1], [-max * 1.3, max * 1.3]), SPRING);
    const gx = useTransform(mx, [0, 1], [0, 100]);
    const gy = useTransform(my, [0, 1], [0, 100]);
    const glare = useMotionTemplate`radial-gradient(360px circle at ${gx}% ${gy}%, rgba(255,255,255,0.17), transparent 55%)`;

    const onMove = (e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
    };
    const onLeave = () => {
        mx.set(0.5);
        my.set(0.5);
    };

    return (
        <motion.div
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 1100 }}
            className={`group/tilt relative ${className}`}
        >
            {children}
            {!reduce && (
                <motion.div
                    aria-hidden="true"
                    style={{ background: glare, borderRadius: radius }}
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
                />
            )}
        </motion.div>
    );
};

export default TiltCard;
