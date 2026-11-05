'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTheme } from '@/providers/ThemeProvider';
import {
    FiPlus, FiEdit3, FiImage, FiType, FiLayout, FiPhone, FiSettings,
    FiChevronDown, FiChevronRight, FiCheck, FiClock, FiLoader, FiTrash2,
    FiUpload, FiX, FiSend, FiAlertCircle, FiCheckCircle, FiEye
} from 'react-icons/fi';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const editTypes = [
    { value: 'text', label: 'Text Change', icon: FiType, color: 'text-blue-500' },
    { value: 'image', label: 'Image Change', icon: FiImage, color: 'text-green-500' },
    { value: 'design', label: 'Design Change', icon: FiLayout, color: 'text-purple-500' },
    { value: 'contact', label: 'Contact Info', icon: FiPhone, color: 'text-orange-500' },
    { value: 'functionality', label: 'Functionality', icon: FiSettings, color: 'text-pink-500' },
    { value: 'other', label: 'Other', icon: FiEdit3, color: 'text-slate-500' },
];

const priorityOptions = [
    { value: 'low', label: 'Low', color: 'bg-slate-500' },
    { value: 'medium', label: 'Medium', color: 'bg-blue-500' },
    { value: 'high', label: 'High', color: 'bg-orange-500' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-500' },
];

export default function CustomizationRequestPage() {
    const { isDark } = useTheme();
    const searchParams = useSearchParams();

    const [activeTab, setActiveTab] = useState('create'); // create | history
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [myRequests, setMyRequests] = useState([]);

    // Pre-selected from URL params
    const [selectedOrderId, setSelectedOrderId] = useState('');
    const [selectedWebsiteId, setSelectedWebsiteId] = useState('');
    const [selectedWebsiteTitle, setSelectedWebsiteTitle] = useState('');
    const [selectedWebsiteImage, setSelectedWebsiteImage] = useState('');

    const [priority, setPriority] = useState('medium');
    const [requestItems, setRequestItems] = useState([
        { sectionName: '', editType: 'text', description: '', images: [], newValue: '' }
    ]);
    const [expandedRequest, setExpandedRequest] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Get URL params on mount
    useEffect(() => {
        const orderId = searchParams.get('orderId');
        const websiteId = searchParams.get('websiteId');
        const websiteTitle = searchParams.get('websiteTitle');
        const websiteImage = searchParams.get('websiteImage');

        if (orderId) setSelectedOrderId(orderId);
        if (websiteId) setSelectedWebsiteId(websiteId);
        if (websiteTitle) setSelectedWebsiteTitle(decodeURIComponent(websiteTitle));
        if (websiteImage) setSelectedWebsiteImage(decodeURIComponent(websiteImage));
    }, [searchParams]);

    // Fetch my requests
    useEffect(() => {
        fetchMyRequests();
    }, []);

    const fetchMyRequests = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_URL}/customization/my-requests`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMyRequests(res.data.data || []);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const addRequestItem = () => {
        setRequestItems([...requestItems, { sectionName: '', editType: 'text', description: '', images: [], newValue: '' }]);
    };

    const removeRequestItem = (index) => {
        if (requestItems.length > 1) {
            setRequestItems(requestItems.filter((_, i) => i !== index));
        }
    };

    const updateRequestItem = (index, field, value) => {
        const updated = [...requestItems];
        updated[index][field] = value;
        setRequestItems(updated);
    };

    const handleImageUpload = async (index, files) => {
        const token = localStorage.getItem('token');
        const formData = new FormData();

        for (let file of files) {
            formData.append('images', file);
        }

        try {
            const res = await axios.post(`${API_URL}/upload/multiple`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            const urls = res.data.data?.map(img => img.url) || [];
            const updated = [...requestItems];
            updated[index].images = [...(updated[index].images || []), ...urls];
            setRequestItems(updated);
            setMessage({ type: 'success', text: 'Image uploaded successfully!' });
        } catch (error) {
            console.error('Upload failed:', error.response?.data || error);

            let errorText = 'Failed to upload image';
            if (error.response?.data?.message) {
                errorText = error.response.data.message;
            } else if (error.response?.data?.errorMessages?.length > 0) {
                errorText = error.response.data.errorMessages.map(e => e.message).join(', ');
            } else if (error.message) {
                errorText = error.message;
            }

            setMessage({ type: 'error', text: errorText });
        }
    };

    const removeImage = (itemIndex, imageIndex) => {
        const updated = [...requestItems];
        updated[itemIndex].images = updated[itemIndex].images.filter((_, i) => i !== imageIndex);
        setRequestItems(updated);
    };

    const handleSubmit = async () => {
        if (!selectedOrderId || !selectedWebsiteId) {
            setMessage({ type: 'error', text: 'Website information is missing. Please go back and try again.' });
            return;
        }

        // Validate request items
        const validItems = requestItems.filter(item => item.sectionName.trim());
        if (validItems.length === 0) {
            setMessage({ type: 'error', text: 'Please add at least one section name' });
            return;
        }

        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/customization/my-requests`, {
                orderId: selectedOrderId,
                websiteId: selectedWebsiteId,
                websiteTitle: selectedWebsiteTitle,
                priority,
                requestItems: validItems
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage({ type: 'success', text: 'Request submitted successfully!' });

            // Reset form
            setRequestItems([{ sectionName: '', editType: 'text', description: '', images: [], newValue: '' }]);
            setPriority('medium');

            // Refresh requests and switch to history
            fetchMyRequests();
            setActiveTab('history');
        } catch (error) {
            console.error('Customization request error:', error.response?.data);

            // Build detailed error message
            let errorText = 'Failed to submit request';

            if (error.response?.data) {
                const { message, errorMessages } = error.response.data;

                if (errorMessages && Array.isArray(errorMessages) && errorMessages.length > 0) {
                    // Show detailed field errors
                    const fieldErrors = errorMessages
                        .map(e => e.message || e.path)
                        .filter(Boolean)
                        .join(', ');
                    errorText = `Validation Error: ${fieldErrors}`;
                } else if (message) {
                    errorText = message;
                }
            } else if (error.message) {
                errorText = error.message;
            }

            setMessage({ type: 'error', text: errorText });
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', label: 'Pending' },
            'in-progress': { bg: 'bg-blue-500/10', text: 'text-blue-500', label: 'In Progress' },
            completed: { bg: 'bg-green-500/10', text: 'text-green-500', label: 'Completed' }
        };
        const s = styles[status] || styles.pending;
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
                {s.label}
            </span>
        );
    };

    return (
        <div className={`min-h-screen p-6 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
            {/* Header */}
            <div className="mb-8">
                <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    Website Customization Request
                </h1>
                <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Request changes or updates to your purchased website
                </p>
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

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveTab('create')}
                    className={`px-5 py-2.5 rounded-xl font-medium transition-all ${activeTab === 'create'
                        ? 'bg-gradient-to-r from-[#FD9A00] to-[#f97316] text-white shadow-lg shadow-orange-500/20'
                        : isDark
                            ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            : 'bg-white text-slate-600 hover:bg-slate-100'
                        }`}
                >
                    <FiPlus className="inline mr-2" />
                    New Request
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`px-5 py-2.5 rounded-xl font-medium transition-all ${activeTab === 'history'
                        ? 'bg-gradient-to-r from-[#FD9A00] to-[#f97316] text-white shadow-lg shadow-orange-500/20'
                        : isDark
                            ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            : 'bg-white text-slate-600 hover:bg-slate-100'
                        }`}
                >
                    <FiClock className="inline mr-2" />
                    My Requests ({myRequests.length})
                </button>
            </div>

            {/* Create Request Tab */}
            {activeTab === 'create' && (
                <div className="space-y-6">
                    {/* Selected Website Info */}
                    {selectedWebsiteId ? (
                        <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                            <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                <span className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FD9A00] to-[#f97316] text-white flex items-center justify-center text-sm">1</span>
                                Selected Website
                            </h3>

                            <div className={`p-4 rounded-xl border-2 border-[#FD9A00] bg-[#FD9A00]/5 flex items-center gap-4`}>
                                <img
                                    src={selectedWebsiteImage || '/images/placeholder.png'}
                                    alt={selectedWebsiteTitle}
                                    className="w-16 h-16 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                    <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                        {selectedWebsiteTitle || 'Selected Website'}
                                    </h4>
                                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                        Ready for customization request
                                    </p>
                                </div>
                                <FiCheck className="text-[#FD9A00] text-xl" />
                            </div>
                        </div>
                    ) : (
                        <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                            <div className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                <FiAlertCircle size={40} className="mx-auto mb-3 opacity-50" />
                                <p>No website selected</p>
                                <p className="text-sm mt-2">Please go to <strong>My Websites</strong> and click "Customize Request" on the website you want to modify.</p>
                            </div>
                        </div>
                    )}

                    {/* Request Items */}
                    {selectedWebsiteId && (
                        <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                            <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                <span className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FD9A00] to-[#f97316] text-white flex items-center justify-center text-sm">2</span>
                                Describe Changes
                            </h3>

                            {/* Priority Selection */}
                            <div className="mb-6">
                                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                    Priority
                                </label>
                                <div className="flex gap-2 flex-wrap">
                                    {priorityOptions.map((p) => (
                                        <button
                                            key={p.value}
                                            onClick={() => setPriority(p.value)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${priority === p.value
                                                ? `${p.color} text-white`
                                                : isDark
                                                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                }`}
                                        >
                                            {p.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Request Items */}
                            <div className="space-y-4">
                                {requestItems.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`p-5 rounded-xl border ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <span className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                                Item #{index + 1}
                                            </span>
                                            {requestItems.length > 1 && (
                                                <button
                                                    onClick={() => removeRequestItem(index)}
                                                    className="text-red-500 hover:text-red-400 p-1"
                                                >
                                                    <FiTrash2 size={18} />
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid gap-4">
                                            {/* Section Name */}
                                            <div>
                                                <label className={`block text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                                    Section Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={item.sectionName}
                                                    onChange={(e) => updateRequestItem(index, 'sectionName', e.target.value)}
                                                    placeholder="e.g., Header, Footer, Hero Section, About Us"
                                                    className={`w-full px-4 py-3 rounded-xl border transition-all ${isDark
                                                        ? 'bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-[#FD9A00]'
                                                        : 'bg-white border-slate-300 text-slate-800 placeholder:text-slate-400 focus:border-[#FD9A00]'
                                                        }`}
                                                />
                                            </div>

                                            {/* Edit Type */}
                                            <div>
                                                <label className={`block text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                                    Type of Change
                                                </label>
                                                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                                                    {editTypes.map((type) => {
                                                        const Icon = type.icon;
                                                        return (
                                                            <button
                                                                key={type.value}
                                                                onClick={() => updateRequestItem(index, 'editType', type.value)}
                                                                className={`p-3 rounded-lg text-center transition-all ${item.editType === type.value
                                                                    ? 'bg-[#FD9A00]/10 border-2 border-[#FD9A00]'
                                                                    : isDark
                                                                        ? 'bg-slate-800 border-2 border-transparent hover:border-slate-600'
                                                                        : 'bg-white border-2 border-transparent hover:border-slate-300'
                                                                    }`}
                                                            >
                                                                <Icon className={`mx-auto mb-1 ${type.color}`} size={20} />
                                                                <span className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                                                    {type.label}
                                                                </span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* New Value */}
                                            <div>
                                                <label className={`block text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                                    New Value / Text
                                                </label>
                                                <input
                                                    type="text"
                                                    value={item.newValue}
                                                    onChange={(e) => updateRequestItem(index, 'newValue', e.target.value)}
                                                    placeholder="Enter the new text or value"
                                                    className={`w-full px-4 py-3 rounded-xl border transition-all ${isDark
                                                        ? 'bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-[#FD9A00]'
                                                        : 'bg-white border-slate-300 text-slate-800 placeholder:text-slate-400 focus:border-[#FD9A00]'
                                                        }`}
                                                />
                                            </div>

                                            {/* Description */}
                                            <div>
                                                <label className={`block text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                                    Detailed Description
                                                </label>
                                                <textarea
                                                    value={item.description}
                                                    onChange={(e) => updateRequestItem(index, 'description', e.target.value)}
                                                    placeholder="Describe what you want to change in detail..."
                                                    rows={3}
                                                    className={`w-full px-4 py-3 rounded-xl border transition-all resize-none ${isDark
                                                        ? 'bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-[#FD9A00]'
                                                        : 'bg-white border-slate-300 text-slate-800 placeholder:text-slate-400 focus:border-[#FD9A00]'
                                                        }`}
                                                />
                                            </div>

                                            {/* Image Upload */}
                                            <div>
                                                <label className={`block text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                                    Reference Images (Optional)
                                                </label>
                                                <div className="flex flex-wrap gap-3">
                                                    {item.images?.map((img, imgIndex) => (
                                                        <div key={imgIndex} className="relative group">
                                                            <img src={img} alt="" className="w-20 h-20 object-cover rounded-lg" />
                                                            <button
                                                                onClick={() => removeImage(index, imgIndex)}
                                                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <FiX size={12} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <label className={`w-20 h-20 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${isDark
                                                        ? 'border-slate-600 hover:border-[#FD9A00] text-slate-500'
                                                        : 'border-slate-300 hover:border-[#FD9A00] text-slate-400'
                                                        }`}>
                                                        <FiUpload size={20} />
                                                        <span className="text-xs mt-1">Upload</span>
                                                        <input
                                                            type="file"
                                                            multiple
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={(e) => handleImageUpload(index, e.target.files)}
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Add More Button */}
                                <button
                                    onClick={addRequestItem}
                                    className={`w-full py-3 rounded-xl border-2 border-dashed transition-all flex items-center justify-center gap-2 ${isDark
                                        ? 'border-slate-600 text-slate-400 hover:border-[#FD9A00] hover:text-[#FD9A00]'
                                        : 'border-slate-300 text-slate-500 hover:border-[#FD9A00] hover:text-[#FD9A00]'
                                        }`}
                                >
                                    <FiPlus size={20} />
                                    Add Another Item
                                </button>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="mt-6 w-full py-4 rounded-xl bg-gradient-to-r from-[#FD9A00] to-[#f97316] text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-orange-500/20 transition-all disabled:opacity-50"
                            >
                                {submitting ? (
                                    <>
                                        <FiLoader className="animate-spin" size={20} />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <FiSend size={20} />
                                        Submit Request
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-12">
                            <FiLoader className="animate-spin mx-auto text-[#FD9A00]" size={40} />
                        </div>
                    ) : myRequests.length === 0 ? (
                        <div className={`text-center py-12 rounded-2xl ${isDark ? 'bg-slate-800/50' : 'bg-white'}`}>
                            <FiClock size={50} className={`mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                            <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                You don't have any requests yet
                            </p>
                        </div>
                    ) : (
                        myRequests.map((request) => (
                            <div
                                key={request._id}
                                className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}
                            >
                                {/* Request Header */}
                                <button
                                    onClick={() => setExpandedRequest(expandedRequest === request._id ? null : request._id)}
                                    className={`w-full p-5 text-left flex items-center gap-4 ${isDark ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50'}`}
                                >
                                    <img
                                        src={request.website?.images?.[0] || '/images/placeholder.png'}
                                        alt=""
                                        className="w-14 h-14 rounded-xl object-cover"
                                    />
                                    <div className="flex-1">
                                        <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                            {request.websiteTitle}
                                        </h4>
                                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                            {request.requestItems?.length || 0} items • {new Date(request.createdAt).toLocaleDateString('en-US')}
                                        </p>
                                    </div>
                                    {getStatusBadge(request.overallStatus)}
                                    {expandedRequest === request._id ? <FiChevronDown /> : <FiChevronRight />}
                                </button>

                                {/* Expanded Content */}
                                {expandedRequest === request._id && (
                                    <div className={`px-5 pb-5 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                                        {/* Progress */}
                                        <div className="py-4">
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Progress</span>
                                                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                                                    {request.requestItems?.filter(i => i.isCompleted).length || 0}/{request.requestItems?.length || 0} completed
                                                </span>
                                            </div>
                                            <div className={`h-2 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-[#FD9A00] to-[#22c55e] transition-all"
                                                    style={{
                                                        width: `${(request.requestItems?.filter(i => i.isCompleted).length / request.requestItems?.length) * 100 || 0}%`
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Items */}
                                        <div className="space-y-3">
                                            {request.requestItems?.map((item, idx) => (
                                                <div
                                                    key={item._id || idx}
                                                    className={`p-4 rounded-xl flex items-start gap-3 ${item.isCompleted
                                                        ? isDark ? 'bg-green-500/10' : 'bg-green-50'
                                                        : isDark ? 'bg-slate-900/50' : 'bg-slate-50'
                                                        }`}
                                                >
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${item.isCompleted
                                                        ? 'bg-green-500 text-white'
                                                        : isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-300 text-slate-500'
                                                        }`}>
                                                        {item.isCompleted ? <FiCheck size={14} /> : item.itemNumber}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                                                {item.sectionName}
                                                            </span>
                                                            <span className={`text-xs px-2 py-0.5 rounded ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'}`}>
                                                                {editTypes.find(t => t.value === item.editType)?.label || item.editType}
                                                            </span>
                                                        </div>
                                                        {item.newValue && (
                                                            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                                                New: {item.newValue}
                                                            </p>
                                                        )}
                                                        {item.description && (
                                                            <p className={`text-sm mt-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                                                                {item.description}
                                                            </p>
                                                        )}
                                                        {item.adminNote && (
                                                            <p className={`text-sm mt-2 italic ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                                                                📝 Admin: {item.adminNote}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Admin Message */}
                                        {request.adminMessage && (
                                            <div className={`mt-4 p-4 rounded-xl ${isDark ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                                                <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                                                    <strong>Admin Message:</strong> {request.adminMessage}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
