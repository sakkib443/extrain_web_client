'use client';

import React, { useEffect, useState } from 'react';
import {
    FiPlus, FiEdit3, FiTrash2, FiLoader, FiCheck, FiX, FiSearch,
    FiRefreshCw, FiCode, FiStar, FiDollarSign, FiDownload, FiEye,
    FiExternalLink, FiTerminal, FiPackage, FiFilter, FiGrid, FiList
} from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Platform Options (matching backend)
const PLATFORM_OPTIONS = [
    'WordPress', 'PHP', 'JavaScript', 'Python', 'React', 'Next.js', 'Vue.js',
    'Angular', 'Node.js', 'Laravel', 'Django', 'Flutter', 'React Native',
    'Android', 'iOS', 'Unity', 'HTML/CSS', 'jQuery', 'Bootstrap', 'Tailwind CSS', 'Other'
];

// Software Type Options (matching backend)
const SOFTWARE_TYPE_OPTIONS = [
    'Plugin', 'Script', 'Application', 'Tool', 'Library', 'Framework',
    'Extension', 'Theme', 'Template', 'Component', 'API', 'SDK',
    'CLI Tool', 'Desktop App', 'Mobile App', 'Other'
];

const SoftwarePage = () => {
    const [software, setSoftware] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [platformFilter, setPlatformFilter] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const router = useRouter();

    const fetchSoftware = async () => {
        const BASE_URL = 'https://extrain-web-server.vercel.app/api';
        const token = localStorage.getItem('token');
        try {
            setLoading(true);
            const res = await fetch(`${BASE_URL}/software/admin/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await res.json();
            setSoftware(result.data || []);
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSoftware();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this software?")) return;
        const BASE_URL = 'https://extrain-web-server.vercel.app/api';
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${BASE_URL}/software/admin/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                fetchSoftware();
                alert('Software deleted successfully');
            } else {
                const data = await res.json();
                alert(data.message || 'Delete failed');
            }
        } catch (err) { alert("Delete failed"); }
    };

    const handleEdit = (id) => {
        router.push(`/dashboard/admin/software/create?edit=${id}`);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
            case 'pending': return 'bg-amber-100 text-amber-600 border-amber-200';
            case 'draft': return 'bg-slate-100 text-slate-600 border-slate-200';
            case 'rejected': return 'bg-rose-100 text-rose-600 border-rose-200';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved': return '✅';
            case 'pending': return '⏳';
            case 'draft': return '📝';
            case 'rejected': return '❌';
            default: return '❓';
        }
    };

    const getPlatformColor = (platform) => {
        const colors = {
            'WordPress': 'bg-blue-100 text-blue-600',
            'PHP': 'bg-indigo-100 text-indigo-600',
            'JavaScript': 'bg-yellow-100 text-yellow-700',
            'React': 'bg-cyan-100 text-cyan-600',
            'Next.js': 'bg-slate-800 text-white',
            'Vue.js': 'bg-emerald-100 text-emerald-600',
            'Node.js': 'bg-green-100 text-green-600',
            'Laravel': 'bg-rose-100 text-rose-600',
            'Python': 'bg-blue-100 text-blue-700',
            'Flutter': 'bg-sky-100 text-sky-600',
        };
        return colors[platform] || 'bg-violet-100 text-violet-600';
    };

    const stats = {
        total: software.length,
        approved: software.filter(s => s.status === 'approved').length,
        pending: software.filter(s => s.status === 'pending').length,
        featured: software.filter(s => s.isFeatured).length,
    };

    const filtered = software.filter(s => {
        const matchSearch = s.title?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || s.status === statusFilter;
        const matchPlatform = platformFilter === 'all' || s.platform === platformFilter;
        return matchSearch && matchStatus && matchPlatform;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
                        <FiCode className="text-white text-xl" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">Software Manager</h1>
                        <p className="text-sm text-slate-500">Scripts, plugins & tools</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchSoftware}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                    >
                        <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        Reload
                    </button>
                    <Link href="/dashboard/admin/software/create">
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-violet-500/25 transition-all">
                            <FiPlus size={16} />
                            Add Software
                        </button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards - matching Dashboard Home StatsCard pattern */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Total Software */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-slate-700 to-slate-800 opacity-10 rounded-full blur-2xl" />
                        <div className="relative flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Total Software</p>
                                <p className="text-3xl font-bold text-slate-800 mb-1">{stats.total}</p>
                                <p className="text-xs text-slate-400 mb-2">All software</p>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                <FiPackage className="text-2xl text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Approved */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-emerald-500 to-green-500 opacity-10 rounded-full blur-2xl" />
                        <div className="relative flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Approved</p>
                                <p className="text-3xl font-bold text-slate-800 mb-1">{stats.approved}</p>
                                <p className="text-xs text-slate-400 mb-2">Live software</p>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                <FiCheck className="text-2xl text-white" />
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
                                <FiLoader className="text-2xl text-white" />
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

            {/* Filters Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        placeholder="Search software..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-violet-300 focus:ring-2 focus:ring-violet-100 outline-none text-sm transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto">
                    {['all', 'approved', 'pending', 'draft'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wide transition-all whitespace-nowrap ${statusFilter === status
                                ? 'bg-slate-800 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                }`}
                        >
                            {status === 'all' ? 'All' : status}
                        </button>
                    ))}
                </div>
                <select
                    value={platformFilter}
                    onChange={(e) => setPlatformFilter(e.target.value)}
                    className="px-4 py-2.5 rounded-xl text-sm font-bold bg-slate-100 border-none outline-none"
                >
                    <option value="all">All Platforms</option>
                    {PLATFORM_OPTIONS.map(p => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </select>
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
                    >
                        <FiGrid size={16} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
                    >
                        <FiList size={16} />
                    </button>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <FiLoader className="animate-spin text-violet-600" size={40} />
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Software...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-[2rem] border border-dashed border-slate-300">
                    <FiCode className="text-4xl text-slate-300 mx-auto mb-4" />
                    <p className="text-sm font-black text-slate-600">No Software Found</p>
                    <p className="text-xs text-slate-400 mt-1">Add your first software product</p>
                    <Link href="/dashboard/admin/software/create">
                        <button className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white text-xs font-bold rounded-xl mx-auto">
                            <FiPlus size={14} /> Create Software
                        </button>
                    </Link>
                </div>
            ) : viewMode === 'grid' ? (
                /* Grid View */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((sw) => (
                        <div key={sw._id} className="group bg-white rounded-2xl border border-slate-200 hover:shadow-xl transition-all overflow-hidden">
                            {/* Image */}
                            <div className="relative h-48 bg-gradient-to-br from-violet-100 to-purple-100 overflow-hidden">
                                {sw.images?.[0] ? (
                                    <img src={sw.images[0]} alt={sw.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <FiCode className="text-violet-300" size={48} />
                                    </div>
                                )}
                                {/* Badges */}
                                <div className="absolute top-3 left-3 flex gap-2">
                                    {sw.isFeatured && (
                                        <span className="px-2 py-1 bg-amber-500 text-white rounded-lg text-[9px] font-black uppercase flex items-center gap-1">
                                            <FiStar size={10} /> Featured
                                        </span>
                                    )}
                                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase ${getPlatformColor(sw.platform)}`}>
                                        {sw.platform}
                                    </span>
                                </div>
                                <div className="absolute top-3 right-3">
                                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase border ${getStatusColor(sw.status)}`}>
                                        {getStatusIcon(sw.status)} {sw.status}
                                    </span>
                                </div>
                                {/* Hover Actions */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-end justify-center pb-4 gap-2">
                                    {sw.previewUrl && (
                                        <a href={sw.previewUrl} target="_blank" className="px-4 py-2 bg-white text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1">
                                            <FiExternalLink size={12} /> Preview
                                        </a>
                                    )}
                                    <button onClick={() => handleEdit(sw._id)} className="px-4 py-2 bg-violet-600 text-white rounded-xl text-xs font-bold flex items-center gap-1">
                                        <FiEdit3 size={12} /> Edit
                                    </button>
                                </div>
                            </div>
                            {/* Content */}
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-black text-slate-800 line-clamp-1">{sw.title}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">v{sw.version}</span>
                                            <span className="text-[10px] font-bold text-violet-500">{sw.softwareType}</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Stats */}
                                <div className="flex items-center gap-4 text-[10px] text-slate-400 mb-4">
                                    <span className="flex items-center gap-1">
                                        <FiStar className="text-amber-500" /> {sw.rating?.toFixed(1) || '0.0'}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FiDownload /> {sw.salesCount || 0} sales
                                    </span>
                                </div>
                                {/* Price */}
                                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                    <div>
                                        {sw.accessType === 'free' ? (
                                            <span className="text-lg font-black text-emerald-600">FREE</span>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg font-black text-violet-600">৳{sw.offerPrice || sw.price}</span>
                                                {sw.offerPrice && sw.offerPrice < sw.price && (
                                                    <span className="text-xs text-slate-400 line-through">৳{sw.price}</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <button onClick={() => handleDelete(sw._id)} className="p-2 bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-400 rounded-xl transition-all">
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* List View */
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
                            <tr>
                                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Software</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Platform</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Type</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Price</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((sw, idx) => (
                                <tr key={sw._id} className={`border-b border-slate-100 hover:bg-slate-50 transition-all ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center overflow-hidden">
                                                {sw.images?.[0] ? (
                                                    <img src={sw.images[0]} className="w-full h-full object-cover" />
                                                ) : (
                                                    <FiCode className="text-violet-400" size={20} />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{sw.title}</p>
                                                <p className="text-[10px] text-slate-400 font-mono">v{sw.version}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${getPlatformColor(sw.platform)}`}>{sw.platform}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-violet-100 text-violet-600 rounded-lg text-xs font-bold">{sw.softwareType}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {sw.accessType === 'free' ? (
                                            <span className="text-sm font-black text-emerald-600">FREE</span>
                                        ) : (
                                            <span className="text-sm font-black text-slate-800">৳{sw.offerPrice || sw.price}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${getStatusColor(sw.status)}`}>
                                            {sw.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            {sw.previewUrl && (
                                                <a href={sw.previewUrl} target="_blank" className="p-2 bg-slate-100 hover:bg-slate-800 hover:text-white text-slate-500 rounded-xl transition-all">
                                                    <FiEye size={14} />
                                                </a>
                                            )}
                                            <button onClick={() => handleEdit(sw._id)} className="p-2 bg-slate-100 hover:bg-violet-600 hover:text-white text-slate-500 rounded-xl transition-all">
                                                <FiEdit3 size={14} />
                                            </button>
                                            <button onClick={() => handleDelete(sw._id)} className="p-2 bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-400 rounded-xl transition-all">
                                                <FiTrash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default SoftwarePage;
