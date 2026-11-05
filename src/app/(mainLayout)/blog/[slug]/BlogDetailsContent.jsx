"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiArrowLeft, FiClock, FiEye, FiHeart, FiMessageCircle, FiShare2, FiTag, FiPlay, FiCheck, FiCopy, FiTwitter, FiFacebook, FiLinkedin, FiBookOpen, FiArrowRight, FiBookmark
} from 'react-icons/fi';
import { API_BASE_URL } from '@/config/api';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';

export default function BlogDetailsContent({ initialBlog }) {
    const router = useRouter();
    const user = useSelector(state => state.auth?.user);
    const { language } = useLanguage();

    const [blog, setBlog] = useState(initialBlog);
    const [relatedBlogs, setRelatedBlogs] = useState(initialBlog?.relatedBlogs || []);
    const [comments, setComments] = useState([]);
    const [isLiked, setIsLiked] = useState(initialBlog?.isLiked || false);
    const [likeCount, setLikeCount] = useState(initialBlog?.likeCount || 0);
    const [commentText, setCommentText] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [copied, setCopied] = useState(false);
    const [readProgress, setReadProgress] = useState(0);

    const text = {
        blog: language === 'bn' ? 'ব্লগ' : 'Blog',
        min: language === 'bn' ? 'মিনিট' : 'min',
        views: language === 'bn' ? 'ভিউ' : 'views',
        summary: language === 'bn' ? 'সারসংক্ষেপ' : 'Summary',
        comments: language === 'bn' ? 'মন্তব্য' : 'Comments',
        writeComment: language === 'bn' ? 'আপনার মতামত লিখুন...' : 'Write your comment...',
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            setReadProgress((scrollTop / docHeight) * 100);
        };
        window.addEventListener('scroll', handleScroll);

        // Fetch comments
        if (blog?._id) {
            fetch(`${API_BASE_URL}/blogs/${blog._id}/comments`)
                .then(res => res.json())
                .then(data => { if (data.success) setComments(data.data || []); });
        }

        return () => window.removeEventListener('scroll', handleScroll);
    }, [blog?._id]);

    const handleLike = async () => {
        if (!user) { toast.error('Please login'); return; }
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`${API_BASE_URL}/blogs/${blog._id}/toggle-like`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                setIsLiked(data.data.isLiked);
                setLikeCount(data.data.likeCount);
            }
        } catch (error) { toast.error('Failed to like'); }
    };

    if (!blog) return null;

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950">
            <div className="fixed top-0 left-0 right-0 h-1 z-50">
                <div style={{ width: `${readProgress}%` }} className="h-full bg-teal-500" />
            </div>

            <div className="relative h-[40vh] overflow-hidden">
                <Image src={blog.thumbnail || "/images/logo.png"} alt={blog.title} fill className="object-cover" priority />
                <div className="absolute inset-0 bg-black/60" />
                <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-12">
                    <Link href="/blog" className="absolute top-8 left-8 flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                        <FiArrowLeft /> {text.blog}
                    </Link>
                    <div className="max-w-4xl">
                        <div className="flex gap-2 mb-4">
                            <span className="px-3 py-1 bg-teal-500 text-white text-xs font-bold rounded-full">{blog.category?.name}</span>
                            <span className="px-3 py-1 bg-white/20 text-white text-xs rounded-full flex items-center gap-1"><FiClock /> {blog.readingTime} {text.min}</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 outfit">{blog.title}</h1>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold">{blog.author?.firstName?.[0]}</div>
                            <div className="text-white">
                                <p className="font-bold">{blog.author?.firstName} {blog.author?.lastName}</p>
                                <p className="text-xs opacity-80">{new Date(blog.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <article className="lg:col-span-8">
                        <div className="prose prose-lg dark:prose-invert max-w-none 
                            prose-headings:font-outfit prose-headings:text-slate-900
                            prose-p:text-slate-600 dark:prose-p:text-slate-300
                            prose-a:text-teal-600"
                            dangerouslySetInnerHTML={{ __html: blog.content }}
                        />

                        {/* Tags */}
                        {blog.tags?.length > 0 && (
                            <div className="mt-12 pt-8 border-t flex flex-wrap gap-2">
                                {blog.tags.map((tag, i) => (
                                    <span key={i} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm font-medium">#{tag}</span>
                                ))}
                            </div>
                        )}

                        {/* Reviews/Comments could go here */}
                    </article>

                    <aside className="lg:col-span-4">
                        <div className="sticky top-24 space-y-8">
                            {/* Author Card, Related Posts, etc. */}
                            <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl">
                                <h3 className="text-xl font-bold mb-4">{text.summary}</h3>
                                <p className="text-slate-500 italic">"{blog.excerpt}"</p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
