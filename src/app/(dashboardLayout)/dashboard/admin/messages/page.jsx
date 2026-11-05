'use client';

import React, { useState } from 'react';
import { FiMail, FiSearch, FiStar, FiTrash2, FiArchive, FiSend, FiInbox, FiEdit } from 'react-icons/fi';
import { useTheme } from '@/providers/ThemeProvider';

const mockMessages = [
    { id: 1, from: 'John Doe', email: 'john@example.com', subject: 'Course Inquiry', preview: 'Hi, I wanted to ask about the Web Development course...', time: '2h ago', unread: true, starred: true },
    { id: 2, from: 'Sarah Smith', email: 'sarah@example.com', subject: 'Payment Issue', preview: 'I\'m having trouble with my payment for the subscription...', time: '5h ago', unread: true, starred: false },
    { id: 3, from: 'Mike Johnson', email: 'mike@example.com', subject: 'Certificate Request', preview: 'I completed the course but haven\'t received my certificate...', time: '1d ago', unread: false, starred: false },
    { id: 4, from: 'Emily Brown', email: 'emily@example.com', subject: 'Feedback', preview: 'Great platform! I really enjoyed the React course...', time: '2d ago', unread: false, starred: true },
];

export default function AdminMessagesPage() {
    const { isDark } = useTheme();
    const [messages, setMessages] = useState(mockMessages);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [filter, setFilter] = useState('all');

    const cardClass = `rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-gray-200'}`;

    const filteredMessages = messages.filter(msg => {
        if (filter === 'unread') return msg.unread;
        if (filter === 'starred') return msg.starred;
        return true;
    });

    const toggleStar = (id) => {
        setMessages(msgs => msgs.map(m => m.id === id ? { ...m, starred: !m.starred } : m));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className={`${cardClass} p-6`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FD9A00] to-[#2dd4bf] flex items-center justify-center text-white shadow-lg">
                            <FiMail size={28} />
                        </div>
                        <div>
                            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Messages</h1>
                            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                {messages.filter(m => m.unread).length} unread messages
                            </p>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FD9A00] to-[#2dd4bf] text-white rounded-xl font-bold hover:shadow-lg transition-all">
                        <FiEdit size={16} />
                        Compose
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Message List */}
                <div className={`lg:col-span-1 ${cardClass} overflow-hidden`}>
                    {/* Filters */}
                    <div className={`p-4 border-b ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
                        <div className="flex gap-2">
                            {[
                                { id: 'all', label: 'All', icon: FiInbox },
                                { id: 'unread', label: 'Unread', icon: FiMail },
                                { id: 'starred', label: 'Starred', icon: FiStar },
                            ].map(f => (
                                <button
                                    key={f.id}
                                    onClick={() => setFilter(f.id)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === f.id
                                        ? 'bg-[#FD9A00] text-white'
                                        : isDark ? 'bg-slate-700 text-slate-400 hover:bg-slate-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    <f.icon size={12} />
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="divide-y divide-gray-100 dark:divide-slate-700 max-h-[500px] overflow-y-auto">
                        {filteredMessages.map(msg => (
                            <div
                                key={msg.id}
                                onClick={() => setSelectedMessage(msg)}
                                className={`p-4 cursor-pointer transition-all ${selectedMessage?.id === msg.id
                                    ? isDark ? 'bg-[#FD9A00]/10' : 'bg-[#FD9A00]/5'
                                    : isDark ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'
                                    } ${msg.unread ? 'font-semibold' : ''}`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold ${msg.unread
                                        ? 'bg-gradient-to-br from-[#FD9A00] to-[#2dd4bf]'
                                        : isDark ? 'bg-slate-600' : 'bg-gray-300'
                                        }`}>
                                        {msg.from[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className={`text-sm truncate ${isDark ? 'text-white' : 'text-gray-800'}`}>{msg.from}</p>
                                            <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{msg.time}</span>
                                        </div>
                                        <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>{msg.subject}</p>
                                        <p className={`text-xs truncate mt-1 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>{msg.preview}</p>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); toggleStar(msg.id); }}
                                        className={msg.starred ? 'text-[#FD9A00]' : isDark ? 'text-slate-600' : 'text-gray-300'}
                                    >
                                        <FiStar size={16} fill={msg.starred ? 'currentColor' : 'none'} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Message Detail */}
                <div className={`lg:col-span-2 ${cardClass} p-6`}>
                    {selectedMessage ? (
                        <div>
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>{selectedMessage.subject}</h2>
                                    <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                                        From: {selectedMessage.from} &lt;{selectedMessage.email}&gt;
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button className={`p-2 rounded-lg ${isDark ? 'bg-slate-700 text-slate-400 hover:text-white' : 'bg-gray-100 text-gray-500 hover:text-gray-800'}`}>
                                        <FiArchive size={16} />
                                    </button>
                                    <button className={`p-2 rounded-lg ${isDark ? 'bg-slate-700 text-red-400 hover:bg-red-500/20' : 'bg-gray-100 text-red-500 hover:bg-red-50'}`}>
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className={`p-5 rounded-xl mb-6 ${isDark ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                                <p className={`leading-relaxed ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                                    {selectedMessage.preview}
                                    <br /><br />
                                    This is a sample message content. In a real application, this would show the full message body fetched from the backend API.
                                    <br /><br />
                                    Best regards,<br />
                                    {selectedMessage.from}
                                </p>
                            </div>

                            {/* Reply Box */}
                            <div>
                                <textarea
                                    placeholder="Write your reply..."
                                    rows={4}
                                    className={`w-full p-4 rounded-xl border resize-none ${isDark
                                        ? 'bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500'
                                        : 'bg-gray-50 border-gray-200 text-gray-800'
                                        } focus:border-[#FD9A00] outline-none`}
                                />
                                <div className="flex justify-end mt-3">
                                    <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FD9A00] to-[#2dd4bf] text-white rounded-xl font-bold hover:shadow-lg transition-all">
                                        <FiSend size={16} />
                                        Send Reply
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center py-20">
                            <div className="text-center">
                                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}>
                                    <FiMail size={32} className={isDark ? 'text-slate-500' : 'text-gray-400'} />
                                </div>
                                <p className={`font-medium ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Select a message to read</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
