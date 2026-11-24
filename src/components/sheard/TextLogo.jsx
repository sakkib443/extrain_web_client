// Site logo: the browser-tab icon (app/icon.svg — orange "E" with the teal dot) + "Extrain Web" in the site's own bold font.
// size: "sm" (mobile menu), "md" (header), "lg" (footer)
const SIZES = {
    sm: { icon: "h-9 w-9", text: "text-[1.4rem]" },
    md: { icon: "h-10 w-10", text: "text-[1.55rem]" },
    lg: { icon: "h-11 w-11", text: "text-[1.7rem]" },
};

export default function TextLogo({ size = "md", className = "" }) {
    const s = SIZES[size] || SIZES.md;
    return (
        <span className={`inline-flex items-center gap-2.5 ${className}`}>
            <svg viewBox="0 0 32 32" aria-hidden="true" className={`${s.icon} shrink-0 rounded-[10px] ring-1 ring-white/15`}>
                <rect width="32" height="32" rx="6" fill="#0A0A0A" />
                <text x="16" y="23.5" fontFamily="Arial, sans-serif" fontSize="21" fontWeight="bold" fill="#FD9A00" textAnchor="middle">E</text>
                <circle cx="24.5" cy="7.5" r="3" fill="#0CB2A9" />
            </svg>
            <span className={`${s.text} font-extrabold leading-none tracking-tight text-white`}>Extrain Web</span>
        </span>
    );
}
