// Small helpers shared by the /about sections (same entrance animation as the Home sections).

export const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.65, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
    }),
};

export const viewport = { once: true, amount: 0.2 };

// spread onto a motion element:  <motion.h2 {...reveal(1)} />
export const reveal = (custom = 0) => ({
    variants: fadeUp,
    custom,
    initial: "hidden",
    whileInView: "show",
    viewport,
});

// Outlined letters (hollow, white stroke) — same look as "CREATIVE" in the Home hero.
export const outlineStyle = {
    color: "transparent",
    WebkitTextStroke: "1.5px rgba(255,255,255,0.85)",
    letterSpacing: "0",
};
export const filledAccent = { color: "#F8921C", WebkitTextStroke: "0" };
