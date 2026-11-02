'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    FiPlus, FiSearch, FiGlobe, FiTag, FiCheckCircle, FiClock,
    FiTrash2, FiEdit2, FiEye, FiRefreshCw, FiLayout, FiStar
} from 'react-icons/fi';

import { API_BASE_URL } from '@/config/api';
import { isEditor } from '@/lib/access';

export default function WebsiteAdminPage() {
    const [websites, setWebsites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const canDelete = !isEditor(); // an editor adds and edits, only an admin deletes

    const fetchWebsites = async () => {
        const token = localStorage.getItem('token');
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/websites/admin/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setWebsites(data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchWebsites(); }, []);

    const handleDelete = async (id) => {
        if (!confirm("Remove this marketplace product?")) return;
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_BASE_URL}/websites/admin/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchWebsites();
        } catch (err) { alert("Delete failed"); }
    };

    const filtered = websites.filter(w => {
        const matchSearch = w.title?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || w.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved': return <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 rounded-lg text-[10px] font-semibold uppercase tracking-wide flex items-center gap-1.5"><FiCheckCircle size={11} /> Live</span>;
            case 'pending': return <span className="px-2.5 py-1 bg-amber-500/10 text-amber-600 rounded-lg text-[10px] font-semibold uppercase tracking-wide flex items-center gap-1.5"><FiClock size={11} /> Pending</span>;
            case 'draft': return <span className="px-2.5 py-1 bg-slate-500/10 text-slate-500 rounded-lg text-[10px] font-semibold uppercase tracking-wide">Draft</span>;
            default: return <span className="px-2.5 py-1 bg-rose-500/10 text-rose-500 rounded-lg text-[10px] font-semibold uppercase tracking-wide">{status}</span>;
        }
    };

    const stats = {
        total: websites.length,
        live: websites.filter(w => w.status === 'approved').length,
        pending: websites.filter(w => w.status === 'pending').length,
        featured: websites.filter(w => w.isFeatured).length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-rose-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                        <FiGlobe className="text-white text-xl" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">Website Templates</h1>
                        <p className="text-sm text-slate-500">Premium theme marketplace</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchWebsites}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                    >
                        <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        Reload
                    </button>
                    <Link href="/dashboard/admin/website/create">
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-rose-600 hover:from-emerald-600 hover:to-rose-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-500/25 transition-all">
                            <FiPlus size={16} />
                            New Website
                        </button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards - matching Dashboard Home StatsCard pattern */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Total Templates */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-rose-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-slate-700 to-slate-800 opacity-10 rounded-full blur-2xl" />
                        <div className="relative flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Total Templates</p>
                                <p className="text-3xl font-bold text-slate-800 mb-1">{stats.total}</p>
                                <p className="text-xs text-slate-400 mb-2">All templates</p>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                <FiLayout className="text-2xl text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Published */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-rose-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-emerald-500 to-rose-600 opacity-10 rounded-full blur-2xl" />
                        <div className="relative flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Published</p>
                                <p className="text-3xl font-bold text-slate-800 mb-1">{stats.live}</p>
                                <p className="text-xs text-slate-400 mb-2">Live templates</p>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-rose-600 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                <FiCheckCircle className="text-2xl text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pending */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-amber-500 to-orange-500 opacity-10 rounded-full blur-2xl" />
                        <div className="relative flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Pending</p>
                                <p className="text-3xl font-bold text-slate-800 mb-1">{stats.pending}</p>
                                <p className="text-xs text-slate-400 mb-2">Awaiting review</p>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                <FiClock className="text-2xl text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Featured */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-yellow-500 to-amber-500 opacity-10 rounded-full blur-2xl" />
                        <div className="relative flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Featured</p>
                                <p className="text-3xl font-bold text-slate-800 mb-1">{stats.featured}</p>
                                <p className="text-xs text-slate-400 mb-2">Highlighted</p>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                <FiStar className="text-2xl text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Control Bar */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        placeholder="Search templates..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 outline-none text-sm transition-all"
                    />
                </div>
                <div className="flex items-center gap-2">
                    {['all', 'approved', 'pending', 'draft'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wide transition-all ${statusFilter === status
                                ? 'bg-slate-800 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                }`}
                        >
                            {status === 'all' ? 'All' : status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid Content */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white rounded-3xl border border-slate-200 overflow-hidden animate-pulse">
                            <div className="h-48 bg-slate-100"></div>
                            <div className="p-5 space-y-3">
                                <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                                <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-[2rem] border border-dashed border-slate-300">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-50 rounded-full flex items-center justify-center">
                            <FiGlobe className="text-4xl text-slate-300" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-slate-600">No Websites Found</p>
                            <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or add new template</p>
                        </div>
                        <Link href="/dashboard/admin/website/create">
                            <button className="mt-2 flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-all">
                                <FiPlus size={14} /> Create Website
                            </button>
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filtered.map(w => (
                        <div key={w._id} className="group bg-white rounded-2xl border border-slate-200/60 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300">
                            {/* Image */}
                            <div className="relative h-44 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50">
                                {w.images?.[0] ? (
                                    <img src={w.images[0]} alt={w.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <FiGlobe className="text-4xl text-slate-300" />
                                    </div>
                                )}
                                {/* Overlay Actions */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-4">
                                    <div className="flex gap-2 w-full">
                                        {w.previewUrl && (
                                            <Link href={w.previewUrl} target="_blank" className="flex-1 flex items-center justify-center gap-2 bg-white/95 backdrop-blur text-slate-800 py-2 rounded-lg text-xs font-semibold hover:bg-white transition-all shadow-sm">
                                                <FiEye size={14} /> Preview
                                            </Link>
                                        )}
                                        <Link href={`/dashboard/admin/website/edit/${w._id}`} className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 text-white py-2 rounded-lg text-xs font-semibold hover:bg-emerald-600 transition-all shadow-sm">
                                            <FiEdit2 size={14} /> Edit
                                        </Link>
                                    </div>
                                </div>
                                {/* Badges */}
                                <div className="absolute top-3 left-3 flex gap-2">
                                    {w.isFeatured && (
                                        <span className="px-2.5 py-1 bg-amber-500 text-white text-[10px] font-semibold rounded-lg flex items-center gap-1 shadow-sm">
                                            <FiStar size={10} /> Featured
                                        </span>
                                    )}
                                </div>
                                <div className="absolute top-3 right-3">
                                    {getStatusBadge(w.status)}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="text-sm font-bold text-slate-800 line-clamp-1 mb-2">{w.title}</h3>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">{w.category?.name || 'Uncategorized'}</span>
                                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[10px] font-medium">{w.platform || 'HTML'}</span>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                    <div>
                                        {w.offerPrice && w.offerPrice > 0 ? (
                                            <>
                                                <p className="text-lg font-bold text-emerald-600">৳{w.offerPrice?.toLocaleString()}</p>
                                                <p className="text-xs text-slate-400 line-through">৳{w.price?.toLocaleString()}</p>
                                            </>
                                        ) : (
                                            <p className="text-lg font-bold text-slate-800">৳{w.price?.toLocaleString()}</p>
                                        )}
                                    </div>
                                    {canDelete && (
                                        <button onClick={() => handleDelete(w._id)} className="p-2 bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-400 rounded-lg transition-all">
                                            <FiTrash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
