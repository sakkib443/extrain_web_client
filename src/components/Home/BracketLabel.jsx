import React from "react";

// Corner-bracket section label (same visual language as the hero headline).
// size="lg" is the bigger version used as a sub-heading.
// (Full class names are written out so Tailwind can see them.)
const SIZES = {
    md: {
        box: "px-5 py-1.5 text-[13px]",
        tracking: "tracking-[0.22em]",
        bracket: "h-4 w-5",
        dot: "h-2 w-2",
        tl: "-top-[4px] -left-[4px]",
        bl: "-bottom-[4px] -left-[4px]",
        tr: "-top-[4px] -right-[4px]",
        br: "-bottom-[4px] -right-[4px]",
    },
    lg: {
        box: "px-7 py-2.5 text-[18px] sm:text-[21px]",
        tracking: "tracking-[0.2em]",
        bracket: "h-6 w-8",
        dot: "h-2.5 w-2.5",
        tl: "-top-[5px] -left-[5px]",
        bl: "-bottom-[5px] -left-[5px]",
        tr: "-top-[5px] -right-[5px]",
        br: "-bottom-[5px] -right-[5px]",
    },
};

const BracketLabel = ({ children, bn = "", size = "md" }) => {
    const s = SIZES[size] || SIZES.md;
    return (
        // Bengali conjuncts break when letter-spacing is applied, so only the English label is tracked out.
        <span className={`relative inline-block font-semibold uppercase text-[#F8921C] ${s.box} ${bn ? "tracking-normal" : s.tracking} ${bn}`}>
            <span aria-hidden="true" className={`absolute left-0 top-0 border-t border-l border-white/80 ${s.bracket}`}>
                <i className={`absolute ${s.tl} ${s.dot} bg-[#F8921C]`} />
                <i className={`absolute ${s.bl} ${s.dot} bg-[#F8921C]`} />
            </span>
            {children}
            <span aria-hidden="true" className={`absolute right-0 bottom-0 border-b border-r border-white/80 ${s.bracket}`}>
                <i className={`absolute ${s.tr} ${s.dot} bg-[#F8921C]`} />
                <i className={`absolute ${s.br} ${s.dot} bg-[#F8921C]`} />
            </span>
        </span>
    );
};

export default BracketLabel;
