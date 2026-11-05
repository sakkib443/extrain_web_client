'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    FiPlus,
    FiSearch,
    FiTrash2,
    FiEdit,
    FiEye,
    FiStar,
    FiChevronLeft,
    FiChevronRight,
    FiPlay,
    FiCheck,
    FiX,
    FiClock,
    FiHeart,
} from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import { API_BASE_URL } from '@/config/api';

export default function AdminTestimonialsPage() {
    const { isDark } = useTheme();
    const router = useRouter();
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null, title: '' });
    const [createModal, setCreateModal] = useState(false);
    const [editModal, setEditModal] = useState({ show: false, data: null });
    const [formData, setFormData] = useState({
        clientName: '',
        clientNameBn: '',
        companyName: '',
        companyNameBn: '',
        title: '',
        titleBn: '',
        type: 'testimonial',
        videoId: '',
        description: '',
        descriptionBn: '',
        clientDesignation: '',
        clientDesignationBn: '',
        rating: 5,
        status: 'pending',
        isFeatured: false,
        order: 0,
    });
    const [submitting, setSubmitting] = useState(false);

    // Fetch testimonials
    const fetchTestimonials = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            let url = `${API_BASE_URL}/testimonials?page=${currentPage}&limit=10`;
            if (searchTerm) url += `&searchTerm=${searchTerm}`;
            if (statusFilter) url += `&status=${statusFilter}`;
            if (typeFilter) url += `&type=${typeFilter}`;

            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                setTestimonials(data.data || []);
                setTotalPages(data.meta?.totalPages || 1);
                setTotalItems(data.meta?.total || 0);
            }
        } catch (error) {
            console.error('Failed to fetch testimonials:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, [currentPage, searchTerm, statusFilter, typeFilter]);

    // Create testimonial
    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${API_BASE_URL}/testimonials`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setCreateModal(false);
                resetForm();
                fetchTestimonials();
            }
        } catch (error) {
            console.error('Failed to create testimonial:', error);
        } finally {
            setSubmitting(false);
        }
    };

    // Update testimonial
    const handleUpdate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${API_BASE_URL}/testimonials/${editModal.data._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setEditModal({ show: false, data: null });
                resetForm();
                fetchTestimonials();
            }
        } catch (error) {
            console.error('Failed to update testimonial:', error);
        } finally {
            setSubmitting(false);
        }
    };

    // Delete testimonial
    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${API_BASE_URL}/testimonials/${deleteModal.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                setDeleteModal({ show: false, id: null, title: '' });
                fetchTestimonials();
            }
        } catch (error) {
            console.error('Failed to delete testimonial:', error);
        }
    };

    // Update status
    const handleStatusChange = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('accessToken');
            await fetch(`${API_BASE_URL}/testimonials/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });
            fetchTestimonials();
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    // Toggle featured
    const handleToggleFeatured = async (id) => {
        try {
            const token = localStorage.getItem('accessToken');
            await fetch(`${API_BASE_URL}/testimonials/${id}/featured`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchTestimonials();
        } catch (error) {
            console.error('Failed to toggle featured:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            clientName: '',
            clientNameBn: '',
            companyName: '',
            companyNameBn: '',
            title: '',
            titleBn: '',
            type: 'testimonial',
            videoId: '',
            description: '',
            descriptionBn: '',
            clientDesignation: '',
            clientDesignationBn: '',
            rating: 5,
            status: 'pending',
            isFeatured: false,
            order: 0,
        });
    };

    const openEditModal = (item) => {
        setFormData({
            clientName: item.clientName || '',
            clientNameBn: item.clientNameBn || '',
            companyName: item.companyName || '',
            companyNameBn: item.companyNameBn || '',
            title: item.title || '',
            titleBn: item.titleBn || '',
            type: item.type || 'testimonial',
            videoId: item.videoId || '',
            description: item.description || '',
            descriptionBn: item.descriptionBn || '',
            clientDesignation: item.clientDesignation || '',
            clientDesignationBn: item.clientDesignationBn || '',
            rating: item.rating || 5,
            status: item.status || 'pending',
            isFeatured: item.isFeatured || false,
            order: item.order || 0,
        });
        setEditModal({ show: true, data: item });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
            case 'pending': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
            case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
            default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
        }
    };

    const getTypeColor = (type) => {
        return type === 'testimonial'
            ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
            : 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    };

    // Form Modal Component
    const FormModal = ({ isEdit = false, onSubmit }) => (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <div className={`w-full max-w-2xl my-8 p-6 rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {isEdit ? 'Edit Testimonial' : 'Add New Testimonial'}
                </h3>
                <form onSubmit={onSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Client Name */}
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                Client Name *
                            </label>
                            <input
                                type="text"
                                value={formData.clientName}
                                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                                required
                                className={`w-full px-3 py-2 rounded-lg border ${isDark
                                    ? 'bg-slate-700 border-slate-600 text-white'
                                    : 'bg-white border-slate-200 text-slate-900'
                                    } focus:outline-none focus:ring-2 focus:ring-rose-500/20`}
                            />
                        </div>
                        {/* Client Name Bengali */}
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                Client Name (Bengali)
                            </label>
                            <input
                                type="text"
                                value={formData.clientNameBn}
                                onChange={(e) => setFormData({ ...formData, clientNameBn: e.target.value })}
                                className={`w-full px-3 py-2 rounded-lg border ${isDark
                                    ? 'bg-slate-700 border-slate-600 text-white'
                                    : 'bg-white border-slate-200 text-slate-900'
                                    } focus:outline-none focus:ring-2 focus:ring-rose-500/20`}
                            />
                        </div>
                        {/* Company Name */}
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                Company Name *
                            </label>
                            <input
                                type="text"
                                value={formData.companyName}
                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                required
                                className={`w-full px-3 py-2 rounded-lg border ${isDark
                                    ? 'bg-slate-700 border-slate-600 text-white'
                                    : 'bg-white border-slate-200 text-slate-900'
                                    } focus:outline-none focus:ring-2 focus:ring-rose-500/20`}
                            />
                        </div>
                        {/* Company Name Bengali */}
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                Company Name (Bengali)
                            </label>
                            <input
                                type="text"
                                value={formData.companyNameBn}
                                onChange={(e) => setFormData({ ...formData, companyNameBn: e.target.value })}
                                className={`w-full px-3 py-2 rounded-lg border ${isDark
                                    ? 'bg-slate-700 border-slate-600 text-white'
                                    : 'bg-white border-slate-200 text-slate-900'
                                    } focus:outline-none focus:ring-2 focus:ring-rose-500/20`}
                            />
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            Title *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            className={`w-full px-3 py-2 rounded-lg border ${isDark
                                ? 'bg-slate-700 border-slate-600 text-white'
                                : 'bg-white border-slate-200 text-slate-900'
                                } focus:outline-none focus:ring-2 focus:ring-rose-500/20`}
                        />
                    </div>

                    {/* Title Bengali */}
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            Title (Bengali)
                        </label>
                        <input
                            type="text"
                            value={formData.titleBn}
                            onChange={(e) => setFormData({ ...formData, titleBn: e.target.value })}
                            className={`w-full px-3 py-2 rounded-lg border ${isDark
                                ? 'bg-slate-700 border-slate-600 text-white'
                                : 'bg-white border-slate-200 text-slate-900'
                                } focus:outline-none focus:ring-2 focus:ring-rose-500/20`}
                        />
                    </div>

                    {/* Video ID */}
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            YouTube Video ID * (e.g., dQw4w9WgXcQ)
                        </label>
                        <input
                            type="text"
                            value={formData.videoId}
                            onChange={(e) => setFormData({ ...formData, videoId: e.target.value })}
                            required
                            placeholder="Enter YouTube video ID"
                            className={`w-full px-3 py-2 rounded-lg border ${isDark
                                ? 'bg-slate-700 border-slate-600 text-white'
                                : 'bg-white border-slate-200 text-slate-900'
                                } focus:outline-none focus:ring-2 focus:ring-rose-500/20`}
                        />
                        {formData.videoId && (
                            <div className="mt-2">
                                <img
                                    src={`https://img.youtube.com/vi/${formData.videoId}/mqdefault.jpg`}
                                    alt="Video thumbnail"
                                    className="w-32 h-auto rounded-lg"
                                />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Type */}
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                Type
                            </label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className={`w-full px-3 py-2 rounded-lg border ${isDark
                                    ? 'bg-slate-700 border-slate-600 text-white'
                                    : 'bg-white border-slate-200 text-slate-900'
                                    } focus:outline-none focus:ring-2 focus:ring-rose-500/20`}
                            >
                                <option value="testimonial">Testimonial</option>
                                <option value="review">Review</option>
                            </select>
                        </div>
                        {/* Status */}
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                Status
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className={`w-full px-3 py-2 rounded-lg border ${isDark
                                    ? 'bg-slate-700 border-slate-600 text-white'
                                    : 'bg-white border-slate-200 text-slate-900'
                                    } focus:outline-none focus:ring-2 focus:ring-rose-500/20`}
                            >
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                        {/* Rating */}
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                Rating
                            </label>
                            <select
                                value={formData.rating}
                                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                                className={`w-full px-3 py-2 rounded-lg border ${isDark
                                    ? 'bg-slate-700 border-slate-600 text-white'
                                    : 'bg-white border-slate-200 text-slate-900'
                                    } focus:outline-none focus:ring-2 focus:ring-rose-500/20`}
                            >
                                {[1, 2, 3, 4, 5].map(n => (
                                    <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>
                                ))}
                            </select>
                        </div>
                        {/* Order */}
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                Display Order
                            </label>
                            <input
                                type="number"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                                className={`w-full px-3 py-2 rounded-lg border ${isDark
                                    ? 'bg-slate-700 border-slate-600 text-white'
                                    : 'bg-white border-slate-200 text-slate-900'
                                    } focus:outline-none focus:ring-2 focus:ring-rose-500/20`}
                            />
                        </div>
                    </div>

                    {/* Featured */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isFeatured"
                            checked={formData.isFeatured}
                            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                            className="w-4 h-4 rounded border-slate-300"
                        />
                        <label htmlFor="isFeatured" className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            Featured on Homepage
                        </label>
                    </div>

                    {/* Description */}
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className={`w-full px-3 py-2 rounded-lg border ${isDark
                                ? 'bg-slate-700 border-slate-600 text-white'
                                : 'bg-white border-slate-200 text-slate-900'
                                } focus:outline-none focus:ring-2 focus:ring-rose-500/20`}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => {
                                if (isEdit) setEditModal({ show: false, data: null });
                                else setCreateModal(false);
                                resetForm();
                            }}
                            className={`flex-1 py-2.5 rounded-xl font-medium transition-colors ${isDark
                                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 py-2.5 rounded-xl font-medium bg-gradient-to-r from-rose-600 to-cyan-500 text-white hover:opacity-90 transition-all disabled:opacity-50"
                        >
                            {submitting ? 'Saving...' : (isEdit ? 'Update' : 'Create')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className={`text-2xl md:text-3xl font-bold font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Happy Clients
                    </h1>
                    <p className={`mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Manage testimonials & reviews • {totalItems} total
                    </p>
                </div>
                <button
                    onClick={() => { resetForm(); setCreateModal(true); }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-cyan-500 text-white font-semibold shadow-lg shadow-rose-600/30 hover:shadow-xl hover:scale-[1.02] transition-all"
                >
                    <FiPlus size={18} />
                    Add Testimonial
                </button>
            </div>

            {/* Filters */}
            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} size={18} />
                        <input
                            type="text"
                            placeholder="Search testimonials..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border transition-all ${isDark
                                ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-500 focus:border-rose-600'
                                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-rose-600'
                                } focus:outline-none focus:ring-2 focus:ring-rose-600/20`}
                        />
                    </div>
                    {/* Type Filter */}
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className={`px-4 py-2.5 rounded-xl border transition-all ${isDark
                            ? 'bg-slate-700/50 border-slate-600 text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-900'
                            } focus:outline-none focus:ring-2 focus:ring-rose-600/20`}
                    >
                        <option value="">All Types</option>
                        <option value="testimonial">Testimonial</option>
                        <option value="review">Review</option>
                    </select>
                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className={`px-4 py-2.5 rounded-xl border transition-all ${isDark
                            ? 'bg-slate-700/50 border-slate-600 text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-900'
                            } focus:outline-none focus:ring-2 focus:ring-rose-600/20`}
                    >
                        <option value="">All Status</option>
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Testimonials List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-rose-600/30 border-t-rose-600 rounded-full animate-spin"></div>
                    </div>
                ) : testimonials.length === 0 ? (
                    <div className={`text-center py-20 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
                        <FiHeart className={`mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} size={48} />
                        <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>No testimonials found</h3>
                        <p className={`mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Add your first client testimonial!</p>
                        <button
                            onClick={() => { resetForm(); setCreateModal(true); }}
                            className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-cyan-500 text-white font-semibold"
                        >
                            <FiPlus size={18} />
                            Add Testimonial
                        </button>
                    </div>
                ) : (
                    testimonials.map((item) => (
                        <div
                            key={item._id}
                            className={`p-4 md:p-6 rounded-2xl border transition-all hover:shadow-lg ${isDark
                                ? 'bg-slate-800/50 border-slate-700/50 hover:border-rose-600/50'
                                : 'bg-white border-slate-200 hover:border-rose-600/50'
                                }`}
                        >
                            <div className="flex flex-col md:flex-row gap-4">
                                {/* Thumbnail */}
                                <div className="w-full md:w-48 h-32 md:h-28 relative rounded-xl overflow-hidden flex-shrink-0 bg-black">
                                    <img
                                        src={`https://img.youtube.com/vi/${item.videoId}/mqdefault.jpg`}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                        <FiPlay className="text-white" size={32} />
                                    </div>
                                    <span className={`absolute top-2 left-2 px-2 py-0.5 text-xs font-medium rounded-full border ${getTypeColor(item.type)}`}>
                                        {item.type}
                                    </span>
                                    {item.isFeatured && (
                                        <span className="absolute top-2 right-2 px-2 py-0.5 text-xs font-medium rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                            Featured
                                        </span>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className={`text-lg font-bold line-clamp-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                            {item.title}
                                        </h3>
                                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full border flex-shrink-0 ${getStatusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        {item.clientName} • {item.companyName}
                                    </p>

                                    {/* Rating */}
                                    <div className="flex items-center gap-1 mt-2">
                                        {[...Array(5)].map((_, i) => (
                                            <FiStar
                                                key={i}
                                                size={14}
                                                className={i < item.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}
                                            />
                                        ))}
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {item.status !== 'approved' && (
                                            <button
                                                onClick={() => handleStatusChange(item._id, 'approved')}
                                                className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors"
                                            >
                                                <FiCheck size={12} /> Approve
                                            </button>
                                        )}
                                        {item.status !== 'rejected' && (
                                            <button
                                                onClick={() => handleStatusChange(item._id, 'rejected')}
                                                className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                                            >
                                                <FiX size={12} /> Reject
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleToggleFeatured(item._id)}
                                            className={`inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full transition-colors ${item.isFeatured
                                                ? 'bg-amber-500/20 text-amber-400'
                                                : 'bg-slate-500/10 text-slate-400 hover:bg-slate-500/20'
                                                }`}
                                        >
                                            <FiStar size={12} /> {item.isFeatured ? 'Unfeatured' : 'Feature'}
                                        </button>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex md:flex-col gap-2 justify-end">
                                    <a
                                        href={`https://www.youtube.com/watch?v=${item.videoId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`p-2.5 rounded-lg transition-colors ${isDark
                                            ? 'hover:bg-slate-700 text-slate-400 hover:text-white'
                                            : 'hover:bg-slate-100 text-slate-500 hover:text-slate-700'
                                            }`}
                                        title="Watch Video"
                                    >
                                        <FiEye size={18} />
                                    </a>
                                    <button
                                        onClick={() => openEditModal(item)}
                                        className={`p-2.5 rounded-lg transition-colors ${isDark
                                            ? 'hover:bg-blue-500/20 text-blue-400'
                                            : 'hover:bg-blue-50 text-blue-500'
                                            }`}
                                        title="Edit"
                                    >
                                        <FiEdit size={18} />
                                    </button>
                                    <button
                                        onClick={() => setDeleteModal({ show: true, id: item._id, title: item.title })}
                                        className={`p-2.5 rounded-lg transition-colors ${isDark
                                            ? 'hover:bg-red-500/20 text-red-400'
                                            : 'hover:bg-red-50 text-red-500'
                                            }`}
                                        title="Delete"
                                    >
                                        <FiTrash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${isDark
                            ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'
                            }`}
                    >
                        <FiChevronLeft size={18} />
                    </button>
                    <span className={`px-4 py-2 rounded-lg ${isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900 border border-slate-200'}`}>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${isDark
                            ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'
                            }`}
                    >
                        <FiChevronRight size={18} />
                    </button>
                </div>
            )}

            {/* Create Modal */}
            {createModal && <FormModal isEdit={false} onSubmit={handleCreate} />}

            {/* Edit Modal */}
            {editModal.show && <FormModal isEdit={true} onSubmit={handleUpdate} />}

            {/* Delete Confirmation Modal */}
            {deleteModal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className={`w-full max-w-md p-6 rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                        <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Delete Testimonial?</h3>
                        <p className={`mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Are you sure you want to delete &quot;{deleteModal.title}&quot;? This action cannot be undone.
                        </p>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setDeleteModal({ show: false, id: null, title: '' })}
                                className={`flex-1 py-2.5 rounded-xl font-medium transition-colors ${isDark
                                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 py-2.5 rounded-xl font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
