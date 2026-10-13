'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { dhApi } from '@/lib/domainHosting';
import { decorate, todayKey } from '@/lib/domainLogic';

// Loads every domain / hosting record (+ the projects they can be linked to) once; each screen filters it in the browser.
export default function useDomainHosting() {
    const [raw, setRaw] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [today, setToday] = useState(() => todayKey());

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const [d, p] = await Promise.all([dhApi.list(), dhApi.projects()]);
            setRaw(Array.isArray(d) ? d : []);
            setProjects(Array.isArray(p) ? p : []);
            setToday(todayKey()); // a tab left open overnight picks up the new day on refresh
        } catch (e) {
            toast.error(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const items = useMemo(() => raw.map((d) => decorate(d, today)), [raw, today]);

    return { items, projects, loading, reload: load, today };
}
