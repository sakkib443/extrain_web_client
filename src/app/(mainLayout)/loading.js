// Shown while the next page loads. The Navbar lives in the layout, so it stays on screen; only the page area is replaced.
// Dark and full height so nothing jumps; the spinner only fades in if the wait is long (quick navigations never flash it).
export default function Loading() {
    return (
        <div className="grid min-h-screen place-items-center bg-[color:var(--tone-deep)]" role="status" aria-label="Loading">
            <span className="loading-delay h-10 w-10 animate-spin rounded-full border-[3px] border-white/10 border-t-[#F8921C]" />
        </div>
    );
}
