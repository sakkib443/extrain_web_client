"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

// A thin orange bar along the top of the screen: it starts the moment an internal link is clicked and completes when the
// new page is in place. Feedback without moving anything on the page.
const RouteProgress = () => {
    const pathname = usePathname();
    const [width, setWidth] = useState(0);
    const [visible, setVisible] = useState(false);
    const timers = useRef({ tick: 0, hide: 0, guard: 0 });
    const running = useRef(false);

    const stopTimers = () => {
        clearInterval(timers.current.tick);
        clearTimeout(timers.current.hide);
        clearTimeout(timers.current.guard);
    };

    const start = () => {
        stopTimers();
        running.current = true;
        setVisible(true);
        setWidth(8);
        timers.current.tick = setInterval(() => setWidth((w) => w + (90 - w) * 0.1), 180); // eases towards 90 %, never reaches it by itself
        timers.current.guard = setTimeout(finish, 12000); // never leave the bar hanging
    };

    const finish = () => {
        if (!running.current) return;
        running.current = false;
        stopTimers();
        setWidth(100);
        timers.current.hide = setTimeout(() => { setVisible(false); setWidth(0); }, 320);
    };

    // from now on the page is interactive: in-app navigations get the fade-in (see .page-in in globals.css)
    useEffect(() => { document.documentElement.setAttribute("data-hydrated", "1"); }, []);

    // a new page is in place → complete the bar
    useEffect(() => { finish(); }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

    // an internal link was clicked → start the bar
    useEffect(() => {
        const onClick = (e) => {
            if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            const a = e.target instanceof Element ? e.target.closest("a[href]") : null;
            if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
            let url;
            try { url = new URL(a.href, window.location.href); } catch { return; }
            if (url.origin !== window.location.origin) return;
            if (url.pathname === window.location.pathname) return; // same page or a #hash jump
            start();
        };
        document.addEventListener("click", onClick, true);
        return () => { document.removeEventListener("click", onClick, true); stopTimers(); };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div
            aria-hidden="true"
            className="pointer-events-none fixed left-0 top-0 z-[10000] h-[3px] bg-[#F8921C] shadow-[0_0_12px_rgba(248,146,28,0.8)]"
            style={{
                width: `${width}%`,
                opacity: visible ? 1 : 0,
                transition: width === 0 ? "none" : "width 220ms ease-out, opacity 300ms ease",
            }}
        />
    );
};

export default RouteProgress;
