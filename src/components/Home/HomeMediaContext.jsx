"use client";

// Gives every home section its photos. The page arrives with the saved photos already in it (rendered on the server);
// after loading, the latest copy is fetched once more so a change made a moment ago shows up without waiting.
// /?preview=home-media shows the admin's unsaved changes from this browser instead.

import React, { createContext, useContext, useEffect, useState } from "react";
import { API_BASE_URL } from "@/config/api";
import { HOME_MEDIA_KEY, HOME_MEDIA_PREVIEW_KEY, mergeHomeMedia } from "@/lib/homeMedia";

const HomeMediaCtx = createContext(null);

const readPreview = () => {
    try {
        if (new URLSearchParams(window.location.search).get("preview") !== HOME_MEDIA_KEY) return null;
        return JSON.parse(localStorage.getItem(HOME_MEDIA_PREVIEW_KEY) || "null");
    } catch {
        return null;
    }
};

export function HomeMediaProvider({ initial, children }) {
    const [media, setMedia] = useState(() => mergeHomeMedia(initial));

    useEffect(() => {
        let alive = true;
        const apply = (data) => {
            if (!alive || !data) return;
            const next = mergeHomeMedia(data);
            setMedia((cur) => (JSON.stringify(cur) === JSON.stringify(next) ? cur : next));
        };
        const preview = readPreview();
        if (preview) {
            Promise.resolve(preview).then(apply);
        } else {
            fetch(`${API_BASE_URL}/site-content/${HOME_MEDIA_KEY}`)
                .then((r) => (r.ok ? r.json() : null))
                .then((j) => apply(j?.data))
                .catch(() => {});
        }
        return () => { alive = false; };
    }, []);

    return <HomeMediaCtx.Provider value={media}>{children}</HomeMediaCtx.Provider>;
}

// outside the provider (e.g. a section used on another page) the defaults are used
const FALLBACK = mergeHomeMedia(null);
export const useHomeMedia = () => useContext(HomeMediaCtx) || FALLBACK;
