'use client';

import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiSave, FiCamera, FiShield, FiKey } from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';
import toast from 'react-hot-toast';

export default function AdminProfilePage() {
    const { isDark } = useTheme();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
    });

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsed = JSON.parse(userData);
            setUser(parsed);
            setFormData({
                firstName: parsed.firstName || '',
                lastName: parsed.lastName || '',
                email: parsed.email || '',
                phone: parsed.phone || '',
                address: parsed.address || '',
            });
        }
    }, []);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // TODO: API call to update profile
        setTimeout(() => {
            const updatedUser = { ...user, ...formData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            toast.success('Profile updated successfully!');
            setLoading(false);
        }, 1000);
    };

    const cardClass = `rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-gray-200'}`;
    const inputClass = `w-full px-4 py-3 rounded-xl border outline-none transition-all ${isDark
        ? 'bg-slate-700/50 border-slate-600 text-white focus:border-[#FD9A00]'
        : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-[#FD9A00]'
        }`;
    const labelClass = `block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className={`${cardClass} p-6`}>
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FD9A00] to-[#2dd4bf] flex items-center justify-center text-white shadow-lg">
                        <FiUser size={28} />
                    </div>
                    <div>
                        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>My Profile</h1>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Manage your account settings</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Photo Card */}
                <div className={`${cardClass} p-6`}>
                    <div className="text-center">
                        <div className="relative inline-block">
                            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#FD9A00] to-[#2dd4bf] flex items-center justify-center text-white text-5xl font-bold shadow-xl">
                                {user?.firstName?.[0] || 'A'}
                            </div>
                            <button className="absolute bottom-2 right-2 w-10 h-10 rounded-xl bg-[#FD9A00] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                <FiCamera size={18} />
                            </button>
                        </div>
                        <h3 className={`text-xl font-bold mt-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                            {user?.firstName} {user?.lastName}
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{user?.role || 'Super Admin'}</p>

                        <div className={`mt-4 p-3 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                            <div className="flex items-center justify-center gap-2 text-[#FD9A00]">
                                <FiShield size={16} />
                                <span className="text-sm font-medium">Verified Account</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Form */}
                <div className={`lg:col-span-2 ${cardClass} p-6`}>
                    <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>Personal Information</h3>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className={labelClass}>First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className={inputClass}
                                    placeholder="Enter first name"
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className={inputClass}
                                    placeholder="Enter last name"
                                />
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>
                                <FiMail className="inline mr-2" size={14} />
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`${inputClass} bg-gray-100 cursor-not-allowed`}
                                disabled
                            />
                        </div>

                        <div>
                            <label className={labelClass}>
                                <FiPhone className="inline mr-2" size={14} />
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="Enter phone number"
                            />
                        </div>

                        <div>
                            <label className={labelClass}>
                                <FiMapPin className="inline mr-2" size={14} />
                                Address
                            </label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows={3}
                                className={`${inputClass} resize-none`}
                                placeholder="Enter your address"
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FD9A00] to-[#2dd4bf] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-[#FD9A00]/30 transition-all disabled:opacity-50"
                            >
                                <FiSave size={18} />
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                type="button"
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${isDark
                                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <FiKey size={18} />
                                Change Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
