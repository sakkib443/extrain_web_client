'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import {
    FiCheck, FiClock, FiLoader, FiSearch, FiRefreshCw,
    FiUser, FiMail, FiPhone, FiImage, FiType, FiLayout, FiSettings,
    FiEdit3, FiMessageSquare, FiCheckCircle, FiAlertCircle, FiX,
    FiChevronDown, FiChevronRight, FiCode, FiCopy, FiGlobe, FiPackage
} from 'react-icons/fi';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const editTypes = [
    { value: 'text', label: 'Text', icon: FiType, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { value: 'image', label: 'Image', icon: FiImage, color: 'text-green-500', bg: 'bg-green-500/10' },
    { value: 'design', label: 'Design', icon: FiLayout, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { value: 'contact', label: 'Contact', icon: FiPhone, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { value: 'functionality', label: 'Functionality', icon: FiSettings, color: 'text-pink-500', bg: 'bg-pink-500/10' },
    { value: 'other', label: 'Other', icon: FiEdit3, color: 'text-slate-500', bg: 'bg-slate-500/10' },
];

const statusFilters = [
    { value: '', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
];

const priorityColors = {
    low: 'bg-slate-500',
    medium: 'bg-blue-500',
    high: 'bg-orange-500',
    urgent: 'bg-red-500'
};

export default function AdminCustomizationPage() {
    const { isDark } = useTheme();
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState([]);
    const [stats, setStats] = useState({ pending: 0, inProgress: 0, completed: 0, total: 0 });
    const [statusFilter, setStatusFilter] = useState('');
    const [search, setSearch] = useState('');
    const [expandedWebsite, setExpandedWebsite] = useState(null);
    const [expandedRequest, setExpandedRequest] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [updatingItem, setUpdatingItem] = useState(null);
    const [openDevPrompt, setOpenDevPrompt] = useState(null); // Track which item's dev prompt is open

    // Group requests by website
    const groupedByWebsite = useMemo(() => {
        const groups = {};
        requests.forEach(request => {
            const websiteId = request.website?._id || request.website || 'unknown';
            if (!groups[websiteId]) {
                groups[websiteId] = {
                    websiteId,
                    websiteTitle: request.websiteTitle,
                    websiteImage: request.website?.images?.[0] || '/images/placeholder.png',
                    requests: [],
                    totalItems: 0,
                    completedItems: 0,
                    pendingCount: 0,
                    inProgressCount: 0,
                    completedCount: 0
                };
            }
            groups[websiteId].requests.push(request);
            const itemsCount = request.requestItems?.length || 0;
            const completedCount = request.requestItems?.filter(i => i.isCompleted).length || 0;
            groups[websiteId].totalItems += itemsCount;
            groups[websiteId].completedItems += completedCount;

            if (request.overallStatus === 'pending') groups[websiteId].pendingCount++;
            else if (request.overallStatus === 'in-progress') groups[websiteId].inProgressCount++;
            else groups[websiteId].completedCount++;
        });
        return Object.values(groups);
    }, [requests]);

    useEffect(() => {
        fetchRequests();
    }, [statusFilter, search]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const params = new URLSearchParams();
            if (statusFilter) params.append('status', statusFilter);
            if (search) params.append('search', search);

            const res = await axios.get(`${API_URL}/customization/admin/all?${params}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Handle both old and new response formats
            const responseData = res.data.data;
            if (responseData?.requests) {
                // New format: data = { requests, stats }
                setRequests(responseData.requests || []);
                setStats(responseData.stats || { pending: 0, inProgress: 0, completed: 0, total: 0 });
            } else {
                // Old format: data = requests array
                setRequests(responseData || []);
                setStats(res.data.meta?.stats || { pending: 0, inProgress: 0, completed: 0, total: 0 });
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
            setMessage({ type: 'error', text: 'Failed to load data' });
        } finally {
            setLoading(false);
        }
    };

    const toggleItemCompletion = async (requestId, itemId, currentStatus) => {
        setUpdatingItem(`${requestId}-${itemId}`);
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${API_URL}/customization/admin/${requestId}/toggle-item`, {
                itemId,
                isCompleted: !currentStatus
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            fetchRequests();
            setMessage({ type: 'success', text: currentStatus ? 'Item marked as incomplete' : 'Item marked as complete' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update' });
        } finally {
            setUpdatingItem(null);
        }
    };

    const completeAllItems = async (requestId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${API_URL}/customization/admin/${requestId}/complete-all`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchRequests();
            setMessage({ type: 'success', text: 'All items marked as complete!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update' });
        }
    };

    // Generate developer prompt for a single item
    const generateItemPrompt = (item, request, websiteTitle) => {
        let prompt = `## Change Request for: ${websiteTitle}\n\n`;
        prompt += `**Section:** ${item.sectionName}\n`;
        prompt += `**Type:** ${item.editType}\n`;
        prompt += `**Status:** ${item.isCompleted ? '✅ Completed' : '⏳ Pending'}\n\n`;

        if (item.newValue) {
            prompt += `### New Value:\n\`\`\`\n${item.newValue}\n\`\`\`\n\n`;
        }

        if (item.description) {
            prompt += `### Description:\n${item.description}\n\n`;
        }

        if (item.images?.length > 0) {
            prompt += `### Reference Images:\n`;
            item.images.forEach((img, i) => {
                prompt += `- Image ${i + 1}: ${img}\n`;
            });
            prompt += `\n`;
        }

        prompt += `---\n`;
        prompt += `**Requested by:** ${request.user?.firstName || ''} ${request.user?.lastName || ''}\n`;
        prompt += `**Email:** ${request.user?.email || 'N/A'}\n`;
        prompt += `**Priority:** ${request.priority}\n`;

        return prompt;
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setMessage({ type: 'success', text: 'Copied to clipboard!' });
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', icon: FiClock },
            'in-progress': { bg: 'bg-blue-500/10', text: 'text-blue-500', icon: FiLoader },
            completed: { bg: 'bg-green-500/10', text: 'text-green-500', icon: FiCheckCircle }
        };
        const s = styles[status] || styles.pending;
        const Icon = s.icon;
        return (
            <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${s.bg} ${s.text}`}>
                <Icon size={14} className={status === 'in-progress' ? 'animate-spin' : ''} />
                {status === 'pending' ? 'Pending' : status === 'in-progress' ? 'In Progress' : 'Completed'}
            </span>
        );
    };

    const getEditTypeInfo = (type) => editTypes.find(t => t.value === type) || editTypes[5];

    return (
        <div className={`min-h-screen p-6 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
            {/* Header */}
            <div className="mb-6">
                <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    Customization Requests
                </h1>
                <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Grouped by website - Click item's 🔧 button for AI prompt
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Websites</p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{groupedByWebsite.length}</p>
                </div>
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Total</p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{stats.total}</p>
                </div>
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Pending</p>
                    <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
                </div>
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>In Progress</p>
                    <p className="text-2xl font-bold text-blue-500">{stats.inProgress}</p>
                </div>
                <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Completed</p>
                    <p className="text-2xl font-bold text-green-500">{stats.completed}</p>
                </div>
            </div>

            {/* Message */}
            {message.text && (
                <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success'
                    ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                    : 'bg-red-500/10 text-red-500 border border-red-500/20'
                    }`}>
                    {message.type === 'success' ? <FiCheckCircle size={20} /> : <FiAlertCircle size={20} />}
                    <span>{message.text}</span>
                    <button onClick={() => setMessage({ type: '', text: '' })} className="ml-auto">
                        <FiX size={18} />
                    </button>
                </div>
            )}

            {/* Filters */}
            <div className={`p-4 rounded-2xl border mb-6 flex flex-wrap gap-4 items-center ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex-1 min-w-[200px]">
                    <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
                        <FiSearch className={isDark ? 'text-slate-400' : 'text-slate-500'} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search websites..."
                            className={`bg-transparent border-none outline-none w-full ${isDark ? 'text-white placeholder:text-slate-500' : 'text-slate-800 placeholder:text-slate-400'}`}
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    {statusFilters.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setStatusFilter(f.value)}
                            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${statusFilter === f.value
                                ? 'bg-gradient-to-r from-[#FD9A00] to-[#f97316] text-white'
                                : isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
                <button
                    onClick={fetchRequests}
                    className={`p-2.5 rounded-xl transition-all ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                >
                    <FiRefreshCw size={20} />
                </button>
            </div>

            {/* Website Groups */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-16">
                        <FiLoader className="animate-spin mx-auto text-[#FD9A00]" size={40} />
                        <p className={`mt-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Loading...</p>
                    </div>
                ) : groupedByWebsite.length === 0 ? (
                    <div className={`text-center py-16 rounded-2xl ${isDark ? 'bg-slate-800/50' : 'bg-white'}`}>
                        <FiMessageSquare size={50} className={`mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                        <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'}`}>No requests found</p>
                    </div>
                ) : (
                    groupedByWebsite.map((websiteGroup) => {
                        const progress = websiteGroup.totalItems > 0 ? (websiteGroup.completedItems / websiteGroup.totalItems) * 100 : 0;
                        const isExpanded = expandedWebsite === websiteGroup.websiteId;

                        return (
                            <div
                                key={websiteGroup.websiteId}
                                className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}
                            >
                                {/* Website Header */}
                                <div
                                    className={`p-5 cursor-pointer ${isDark ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50'}`}
                                    onClick={() => setExpandedWebsite(isExpanded ? null : websiteGroup.websiteId)}
                                >
                                    <div className="flex items-center gap-4">
                                        <img src={websiteGroup.websiteImage} alt="" className="w-16 h-16 rounded-xl object-cover" />
                                        <div className="flex-1">
                                            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                                {websiteGroup.websiteTitle}
                                            </h3>
                                            <div className={`flex items-center gap-3 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                                <span>{websiteGroup.requests.length} requests</span>
                                                <span>•</span>
                                                <span>{websiteGroup.totalItems} changes</span>
                                                <span>•</span>
                                                <span className="text-green-500">{websiteGroup.completedItems} done</span>
                                            </div>
                                            <div className={`mt-2 h-2 rounded-full w-full max-w-xs ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                                                <div className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400" style={{ width: `${progress}%` }} />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {websiteGroup.pendingCount > 0 && (
                                                <span className="px-2 py-1 rounded-lg text-xs font-bold bg-yellow-500/10 text-yellow-500">
                                                    {websiteGroup.pendingCount} pending
                                                </span>
                                            )}
                                            {isExpanded ? <FiChevronDown size={24} /> : <FiChevronRight size={24} />}
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded - Requests */}
                                {isExpanded && (
                                    <div className={`border-t p-4 space-y-4 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                                        {websiteGroup.requests.map((request, reqIdx) => {
                                            const completedCount = request.requestItems?.filter(i => i.isCompleted).length || 0;
                                            const totalCount = request.requestItems?.length || 0;
                                            const isRequestExpanded = expandedRequest === request._id;

                                            return (
                                                <div key={request._id} className={`rounded-xl border ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                                    {/* Request Header */}
                                                    <div
                                                        className={`p-4 cursor-pointer flex items-center gap-4 ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-100'}`}
                                                        onClick={() => setExpandedRequest(isRequestExpanded ? null : request._id)}
                                                    >
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${request.overallStatus === 'completed' ? 'bg-green-500 text-white' : isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'}`}>
                                                            {request.overallStatus === 'completed' ? <FiCheck /> : reqIdx + 1}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className={`flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                                                <FiUser size={14} />
                                                                <span className="font-medium">{request.user?.firstName} {request.user?.lastName}</span>
                                                                <span className={`w-2 h-2 rounded-full ${priorityColors[request.priority]}`} />
                                                            </div>
                                                            <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                                                {completedCount}/{totalCount} items
                                                            </p>
                                                        </div>
                                                        {getStatusBadge(request.overallStatus)}
                                                        {isRequestExpanded ? <FiChevronDown /> : <FiChevronRight />}
                                                    </div>

                                                    {/* Request Items */}
                                                    {isRequestExpanded && (
                                                        <div className={`px-4 pb-4 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                                                            {/* Quick Actions */}
                                                            <div className="py-3 flex flex-wrap gap-2">
                                                                <button
                                                                    onClick={() => completeAllItems(request._id)}
                                                                    disabled={request.overallStatus === 'completed'}
                                                                    className="px-3 py-1.5 rounded-lg bg-green-500 text-white text-sm font-medium flex items-center gap-2 hover:bg-green-600 disabled:opacity-50"
                                                                >
                                                                    <FiCheckCircle size={14} />
                                                                    Complete All
                                                                </button>
                                                                {request.user?.email && (
                                                                    <a href={`mailto:${request.user.email}`} className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'}`}>
                                                                        <FiMail size={14} />
                                                                        Email
                                                                    </a>
                                                                )}
                                                            </div>

                                                            {/* Items List */}
                                                            <div className="space-y-3">
                                                                {request.requestItems?.map((item, idx) => {
                                                                    const typeInfo = getEditTypeInfo(item.editType);
                                                                    const TypeIcon = typeInfo.icon;
                                                                    const isUpdating = updatingItem === `${request._id}-${item._id}`;
                                                                    const itemKey = `${request._id}-${item._id}`;
                                                                    const isDevOpen = openDevPrompt === itemKey;

                                                                    return (
                                                                        <div key={item._id || idx}>
                                                                            {/* Item Row */}
                                                                            <div className={`p-3 rounded-lg ${item.isCompleted ? 'bg-green-500/10 border border-green-500/20' : isDark ? 'bg-slate-800' : 'bg-white border border-slate-200'}`}>
                                                                                <div className="flex items-start gap-3">
                                                                                    {/* Checkbox */}
                                                                                    <button
                                                                                        onClick={() => toggleItemCompletion(request._id, item._id, item.isCompleted)}
                                                                                        disabled={isUpdating}
                                                                                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${item.isCompleted ? 'bg-green-500 text-white' : isDark ? 'bg-slate-700 text-slate-400 border border-slate-600' : 'bg-slate-100 text-slate-400 border border-slate-300'}`}
                                                                                    >
                                                                                        {isUpdating ? <FiLoader className="animate-spin" size={14} /> : item.isCompleted ? <FiCheck size={14} /> : idx + 1}
                                                                                    </button>

                                                                                    {/* Content */}
                                                                                    <div className="flex-1 min-w-0">
                                                                                        <div className="flex items-center gap-2 mb-1">
                                                                                            <span className={`font-medium ${item.isCompleted ? 'line-through opacity-60' : ''} ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                                                                                {item.sectionName}
                                                                                            </span>
                                                                                            <span className={`px-2 py-0.5 rounded text-xs ${typeInfo.bg} ${typeInfo.color}`}>
                                                                                                {typeInfo.label}
                                                                                            </span>
                                                                                        </div>
                                                                                        {item.newValue && (
                                                                                            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                                                                                <strong>New:</strong> {item.newValue}
                                                                                            </p>
                                                                                        )}
                                                                                        {item.description && (
                                                                                            <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{item.description}</p>
                                                                                        )}
                                                                                        {item.images?.length > 0 && (
                                                                                            <div className="flex gap-2 mt-2">
                                                                                                {item.images.map((img, i) => (
                                                                                                    <a key={i} href={img} target="_blank" rel="noopener noreferrer">
                                                                                                        <img src={img} alt="" className="w-12 h-12 rounded object-cover hover:opacity-75" />
                                                                                                    </a>
                                                                                                ))}
                                                                                            </div>
                                                                                        )}
                                                                                    </div>

                                                                                    {/* Dev Button - Right Side */}
                                                                                    <button
                                                                                        onClick={() => setOpenDevPrompt(isDevOpen ? null : itemKey)}
                                                                                        className={`px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shrink-0 transition-all ${isDevOpen
                                                                                            ? 'bg-violet-600 text-white'
                                                                                            : isDark
                                                                                                ? 'bg-violet-900/40 text-violet-300 hover:bg-violet-800/50 border border-violet-700'
                                                                                                : 'bg-violet-50 text-violet-600 hover:bg-violet-100 border border-violet-300'
                                                                                            }`}
                                                                                    >
                                                                                        <FiCode size={16} />
                                                                                        🔧
                                                                                    </button>
                                                                                </div>
                                                                            </div>

                                                                            {/* Dev Prompt Box - Opens below the item */}
                                                                            {isDevOpen && (
                                                                                <div className={`mt-2 p-4 rounded-lg border-2 border-dashed ${isDark ? 'bg-violet-900/20 border-violet-700' : 'bg-violet-50 border-violet-300'}`}>
                                                                                    <div className="flex items-center justify-between mb-3">
                                                                                        <h4 className={`font-bold flex items-center gap-2 ${isDark ? 'text-violet-300' : 'text-violet-700'}`}>
                                                                                            <FiCode size={18} />
                                                                                            Developer Prompt
                                                                                        </h4>
                                                                                        <button
                                                                                            onClick={() => copyToClipboard(generateItemPrompt(item, request, websiteGroup.websiteTitle))}
                                                                                            className="px-3 py-1.5 rounded-lg bg-violet-600 text-white text-sm font-medium flex items-center gap-2 hover:bg-violet-700"
                                                                                        >
                                                                                            <FiCopy size={14} />
                                                                                            Copy
                                                                                        </button>
                                                                                    </div>
                                                                                    <pre className={`p-3 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap font-mono ${isDark ? 'bg-slate-900 text-slate-300' : 'bg-white text-slate-700 border border-violet-200'}`}>
                                                                                        {generateItemPrompt(item, request, websiteGroup.websiteTitle)}
                                                                                    </pre>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
