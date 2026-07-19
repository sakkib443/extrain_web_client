"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
    LuBot,
    LuSend,
    LuX,
    LuMessageCircle,
    LuSparkles,
    LuExternalLink,
    LuMinus,
    LuChevronDown,
    LuTrash2,
} from "react-icons/lu";

const PHONE = "+8801711946614";
const WA = "https://wa.me/8801711946614";
const EMAIL = "info.extrainweb@gmail.com";

// ── Local rule-based response engine (no backend needed) ───────────────────
const CATS = [
    { slug: "ecommerce", en: "E-Commerce", bn: "ই-কমার্স" },
    { slug: "business", en: "Business", bn: "বিজনেস" },
    { slug: "portfolio", en: "Portfolio", bn: "পোর্টফোলিও" },
    { slug: "blog", en: "Blog & News", bn: "ব্লগ ও নিউজ" },
    { slug: "restaurant", en: "Restaurant", bn: "রেস্টুরেন্ট" },
    { slug: "real-estate", en: "Real Estate", bn: "রিয়েল এস্টেট" },
    { slug: "healthcare", en: "Healthcare", bn: "হেলথকেয়ার" },
];

const has = (t, words) => words.some((w) => t.includes(w));

function getBotResponse(raw, lang) {
    const t = (raw || "").toLowerCase().trim();
    const bn = lang === "bn";

    // Greeting
    if (has(t, ["hi", "hello", "hey", "assalam", "salam", "হাই", "হ্যালো", "আসসালাম", "সালাম", "কেমন আছ"])) {
        return {
            message: bn
                ? "ওয়ালাইকুম আসসালাম! 😊\nExtrain Web-এ আপনাকে স্বাগতম। আমি কীভাবে সাহায্য করতে পারি?"
                : "Hello there! 😊\nWelcome to Extrain Web. How can I help you today?",
            quickReplies: bn
                ? ["আমাদের সার্ভিস", "প্রাইসিং", "ক্যাটাগরি", "যোগাযোগ"]
                : ["Our Services", "Pricing", "Categories", "Contact"],
        };
    }

    // Pricing
    if (has(t, ["price", "pricing", "cost", "fee", "package", "charge", "প্রাইস", "প্রাইসিং", "দাম", "খরচ", "কত", "প্যাকেজ", "ফি"])) {
        return {
            message: bn
                ? "আমাদের ওয়েবসাইট প্যাকেজ শুরু **৳১২,৫০০** থেকে 💰\n\n• **বেসিক** — ছোট শুরুর জন্য\n• **স্ট্যান্ডার্ড** — সবচেয়ে জনপ্রিয়\n• **প্রিমিয়াম** — পূর্ণাঙ্গ সমাধান\n\nপ্রতিটা ক্যাটাগরির আলাদা প্যাকেজ ও দাম আছে — নিচের লিংকে দেখুন।"
                : "Our website packages start from **৳12,500** 💰\n\n• **Basic** — to get started\n• **Standard** — most popular\n• **Premium** — full solution\n\nEach category has its own packages & pricing — see below.",
            quickReplies: bn ? ["ই-কমার্স প্রাইসিং", "যোগাযোগ"] : ["E-Commerce Pricing", "Contact"],
            links: [
                { text: bn ? "ই-কমার্স প্যাকেজ" : "E-Commerce packages", url: "/category/ecommerce#pricing" },
                { text: bn ? "সব ক্যাটাগরি" : "All categories", url: "/#" },
            ],
        };
    }

    // Categories
    if (has(t, ["categor", "type", "ক্যাটাগরি", "ধরন", "কি কি", "types"])) {
        return {
            message: bn
                ? "আমরা ৭টি ক্যাটাগরিতে ওয়েবসাইট বানাই 🎯\nযেকোনোটিতে ক্লিক করে বিস্তারিত ও প্রাইসিং দেখুন:"
                : "We build websites in 7 categories 🎯\nTap any one to see details & pricing:",
            quickReplies: [],
            links: CATS.map((c) => ({ text: bn ? c.bn : c.en, url: `/category/${c.slug}` })),
        };
    }

    // E-commerce
    if (has(t, ["ecommerce", "e-commerce", "shop", "store", "online shop", "ই-কমার্স", "দোকান", "অনলাইন শপ"])) {
        return {
            message: bn
                ? "ই-কমার্স ওয়েবসাইট 🛒\nপ্রোডাক্ট ক্যাটালগ, কার্ট, নিরাপদ চেকআউট, বিকাশ/নগদ/COD পেমেন্ট — সব নিয়ে সম্পূর্ণ অনলাইন স্টোর। শুরু ৳১৫,০০০ থেকে।"
                : "E-Commerce Website 🛒\nFull online store with product catalog, cart, secure checkout, bKash/Nagad/COD payments. Starts from ৳15,000.",
            links: [{ text: bn ? "ই-কমার্স দেখুন" : "View E-Commerce", url: "/category/ecommerce" }],
        };
    }

    // Templates / websites
    if (has(t, ["template", "theme", "website", "site", "design", "টেমপ্লেট", "থিম", "ওয়েবসাইট", "সাইট", "ডিজাইন"])) {
        return {
            message: bn
                ? "আমাদের রেডিমেড **ওয়েবসাইট টেমপ্লেট** কালেকশন দেখুন — পছন্দ করে সাথে সাথে কিনুন, অথবা কাস্টম ডিজাইন করিয়ে নিন।"
                : "Browse our ready-made **website templates** — pick & buy instantly, or get a custom design.",
            quickReplies: bn ? ["ক্যাটাগরি", "প্রাইসিং"] : ["Categories", "Pricing"],
            links: [{ text: bn ? "সব টেমপ্লেট" : "All templates", url: "/website" }],
        };
    }

    // Order / buy
    if (has(t, ["order", "buy", "purchase", "checkout", "অর্ডার", "কিনব", "কিনতে", "কেনা"])) {
        return {
            message: bn
                ? "অর্ডার করা সহজ 🛍️\n১. টেমপ্লেট পছন্দ করে কার্টে যোগ করুন\n২. চেকআউটে পেমেন্ট দিন (বিকাশ/নগদ/কার্ড)\n\nকাস্টম প্রজেক্টের জন্য সরাসরি WhatsApp-এ যোগাযোগ করুন।"
                : "Ordering is easy 🛍️\n1. Pick a template & add to cart\n2. Pay at checkout (bKash/Nagad/card)\n\nFor custom projects, reach us on WhatsApp.",
            links: [{ text: "WhatsApp", url: WA }],
        };
    }

    // Contact
    if (has(t, ["contact", "phone", "call", "number", "email", "mail", "whatsapp", "reach", "যোগাযোগ", "ফোন", "নাম্বার", "নম্বর", "কল", "ইমেইল", "হোয়াটস"])) {
        return {
            message: bn
                ? `যেকোনো প্রয়োজনে যোগাযোগ করুন 📞\n\n• **ফোন:** ${PHONE}\n• **ইমেইল:** ${EMAIL}\n• **WhatsApp:** নিচের বাটনে ক্লিক করুন`
                : `Reach us anytime 📞\n\n• **Phone:** ${PHONE}\n• **Email:** ${EMAIL}\n• **WhatsApp:** tap the button below`,
            links: [
                { text: "WhatsApp", url: WA },
                { text: bn ? "কন্টাক্ট পেজ" : "Contact page", url: "/contact" },
            ],
        };
    }

    // About
    if (has(t, ["about", "who are you", "what is extrain", "তুমি কে", "আপনি কে", "সম্পর্কে", "extrain"])) {
        return {
            message: bn
                ? "আমি **Extrain Web**-এর সহকারী 🤖\nExtrain Web বাংলাদেশের একটি প্রিমিয়াম ওয়েবসাইট ও ডিজিটাল প্রোডাক্ট মার্কেটপ্লেস — রেডিমেড টেমপ্লেট ও কাস্টম ওয়েবসাইট ডেভেলপমেন্ট সার্ভিস দেয়।"
                : "I'm **Extrain Web**'s assistant 🤖\nExtrain Web is a premium website & digital product marketplace in Bangladesh — ready-made templates and custom website development services.",
            quickReplies: bn ? ["আমাদের সার্ভিস", "ক্যাটাগরি"] : ["Our Services", "Categories"],
        };
    }

    // Services / generic help
    if (has(t, ["service", "help", "what do you", "provide", "offer", "develop", "সার্ভিস", "সাহায্য", "কি কর", "বানা", "সেবা"])) {
        return {
            message: bn
                ? "আমরা যা দিই 🚀\n• রেডিমেড ওয়েবসাইট টেমপ্লেট\n• কাস্টম ওয়েবসাইট ডেভেলপমেন্ট\n• ৭টি ক্যাটাগরি (ই-কমার্স, বিজনেস, পোর্টফোলিও, ব্লগ...)\n\nকোনটি সম্পর্কে জানতে চান?"
                : "What we offer 🚀\n• Ready-made website templates\n• Custom website development\n• 7 categories (E-Commerce, Business, Portfolio, Blog...)\n\nWhich one would you like to know about?",
            quickReplies: bn ? ["ক্যাটাগরি", "প্রাইসিং", "যোগাযোগ"] : ["Categories", "Pricing", "Contact"],
        };
    }

    // Thanks
    if (has(t, ["thank", "thanks", "ধন্যবাদ", "thnx", "tnx"])) {
        return {
            message: bn ? "আপনাকেও ধন্যবাদ! 😊 আর কিছু লাগলে বলবেন।" : "You're welcome! 😊 Let me know if you need anything else.",
            quickReplies: bn ? ["ক্যাটাগরি", "যোগাযোগ"] : ["Categories", "Contact"],
        };
    }

    // Fallback
    return {
        message: bn
            ? "দুঃখিত, ঠিক বুঝতে পারিনি 🙏\nআমি ওয়েবসাইট সার্ভিস, ক্যাটাগরি, প্রাইসিং বা যোগাযোগ নিয়ে সাহায্য করতে পারি। অথবা সরাসরি আমাদের টিমের সাথে কথা বলুন:"
            : "Sorry, I didn't quite get that 🙏\nI can help with website services, categories, pricing or contact. Or talk to our team directly:",
        quickReplies: bn ? ["আমাদের সার্ভিস", "প্রাইসিং", "ক্যাটাগরি"] : ["Our Services", "Pricing", "Categories"],
        links: [{ text: "WhatsApp", url: WA }],
    };
}

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [hasNewMessage, setHasNewMessage] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const { language } = useLanguage();
    const isBn = language === "bn";

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, scrollToBottom]);

    useEffect(() => {
        if (isOpen && !isMinimized && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen, isMinimized]);

    useEffect(() => {
        if (!isOpen) {
            const timer = setTimeout(() => setHasNewMessage(true), 5000);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const pushBot = (resp, delay = 700) => {
        setIsTyping(true);
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    role: "bot",
                    content: resp.message,
                    quickReplies: resp.quickReplies || [],
                    links: resp.links || [],
                    timestamp: new Date(),
                },
            ]);
            setIsTyping(false);
        }, delay);
    };

    const loadWelcome = () => {
        if (messages.length > 0) return;
        pushBot(
            {
                message: isBn
                    ? "আসসালামু আলাইকুম! 👋\nআমি **Extrain Web**-এর সহকারী।\n\nওয়েবসাইট, টেমপ্লেট, প্রাইসিং বা যেকোনো প্রশ্নে আমি সাহায্য করতে পারি!"
                    : "Hello! 👋\nI'm **Extrain Web**'s assistant.\n\nI can help you with websites, templates, pricing, or any question!",
                quickReplies: isBn
                    ? ["আমাদের সার্ভিস", "প্রাইসিং", "ক্যাটাগরি", "যোগাযোগ"]
                    : ["Our Services", "Pricing", "Categories", "Contact"],
            },
            500
        );
    };

    const sendMessage = (text) => {
        const userMessage = (text ?? inputValue).trim();
        if (!userMessage || isTyping) return;
        setMessages((prev) => [...prev, { role: "user", content: userMessage, timestamp: new Date() }]);
        setInputValue("");
        const resp = getBotResponse(userMessage, language);
        const delay = Math.min(Math.max(resp.message.length * 7, 500), 1800);
        pushBot(resp, delay);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage();
    };

    const clearHistory = () => {
        setMessages([]);
        setTimeout(loadWelcome, 200);
    };

    const toggleChat = () => {
        if (!isOpen) {
            setIsOpen(true);
            setIsMinimized(false);
            setHasNewMessage(false);
            loadWelcome();
        } else {
            setIsOpen(false);
        }
    };

    const renderMessage = (content) => {
        if (!content) return null;
        return content.split("\n").map((line, i) => {
            let processed = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
            if (processed.startsWith("• ") || processed.startsWith("- ")) {
                processed = `<span class="ebot-bullet">›</span> ${processed.substring(2)}`;
            }
            const numMatch = processed.match(/^(\d+)\.\s/);
            if (numMatch) {
                processed = `<span class="ebot-num">${numMatch[1]}.</span> ${processed.substring(numMatch[0].length)}`;
            }
            return <span key={i} className="ebot-line" dangerouslySetInnerHTML={{ __html: processed }} />;
        });
    };

    const suggestions = isBn
        ? [
              { label: "🌐 আমাদের সার্ভিস", msg: "আপনাদের সার্ভিস কি কি?" },
              { label: "💰 প্রাইসিং", msg: "প্রাইসিং কেমন?" },
              { label: "🗂️ ক্যাটাগরি", msg: "ক্যাটাগরি দেখান" },
              { label: "🛒 ই-কমার্স", msg: "ই-কমার্স ওয়েবসাইট" },
              { label: "📞 যোগাযোগ", msg: "যোগাযোগের তথ্য দিন" },
          ]
        : [
              { label: "🌐 Services", msg: "What services do you offer?" },
              { label: "💰 Pricing", msg: "Tell me about pricing" },
              { label: "🗂️ Categories", msg: "Show me categories" },
              { label: "🛒 E-Commerce", msg: "ecommerce website" },
              { label: "📞 Contact", msg: "Give me contact info" },
          ];

    return (
        <>
            {/* ─── Chat Window ─── */}
            <div className={`ebot-window ${isOpen ? "ebot-window-open" : ""} ${isMinimized ? "ebot-window-min" : ""}`}>
                <div className="ebot-header" onClick={() => isMinimized && setIsMinimized(false)}>
                    <div className="ebot-header-left">
                        <div className="ebot-avatar">
                            <LuBot size={20} />
                            <span className="ebot-online-dot" />
                        </div>
                        <div className="ebot-header-info">
                            <h3 className="ebot-header-title">Extrain Web</h3>
                            <p className="ebot-header-status">
                                <span className="ebot-status-dot" />
                                {isBn ? "অনলাইন • সহকারী" : "Online • Assistant"}
                            </p>
                        </div>
                    </div>
                    <div className="ebot-header-actions">
                        {messages.length > 1 && (
                            <button onClick={(e) => { e.stopPropagation(); clearHistory(); }} className="ebot-header-btn" title="Clear">
                                <LuTrash2 size={14} />
                            </button>
                        )}
                        <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} className="ebot-header-btn" title="Minimize">
                            {isMinimized ? <LuChevronDown size={16} /> : <LuMinus size={16} />}
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="ebot-header-btn" title="Close">
                            <LuX size={16} />
                        </button>
                    </div>
                </div>

                {!isMinimized && (
                    <>
                        <div className="ebot-messages">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`ebot-msg ${msg.role === "user" ? "ebot-msg-user" : "ebot-msg-bot"}`}>
                                    {msg.role === "bot" && (
                                        <div className="ebot-msg-avatar"><LuBot size={14} /></div>
                                    )}
                                    <div className={`ebot-bubble ${msg.role === "user" ? "ebot-bubble-user" : "ebot-bubble-bot"}`}>
                                        <div className="ebot-bubble-content">{renderMessage(msg.content)}</div>
                                        {msg.links?.length > 0 && (
                                            <div className="ebot-links">
                                                {msg.links.map((link, li) => (
                                                    <a key={li} href={link.url} className="ebot-link-btn" target={link.url.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                                                        <LuExternalLink size={12} />
                                                        {link.text}
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                        <span className="ebot-time">
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {messages.length > 0 &&
                                messages[messages.length - 1].role === "bot" &&
                                messages[messages.length - 1].quickReplies?.length > 0 &&
                                !isTyping && (
                                    <div className="ebot-quick-replies">
                                        {messages[messages.length - 1].quickReplies.map((reply, ri) => (
                                            <button key={ri} onClick={() => sendMessage(reply)} className="ebot-quick-btn">
                                                {reply}
                                            </button>
                                        ))}
                                    </div>
                                )}

                            {isTyping && (
                                <div className="ebot-msg ebot-msg-bot">
                                    <div className="ebot-msg-avatar"><LuBot size={14} /></div>
                                    <div className="ebot-bubble ebot-bubble-bot ebot-typing-bubble">
                                        <div className="ebot-typing"><span /><span /><span /></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="ebot-suggestions">
                            {suggestions.map((item, i) => (
                                <button key={i} type="button" className="ebot-chip" onClick={() => sendMessage(item.msg)} disabled={isTyping}>
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} className="ebot-input-area">
                            <div className="ebot-input-wrapper">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder={isBn ? "আপনার প্রশ্ন লিখুন..." : "Type your message..."}
                                    className="ebot-input"
                                    disabled={isTyping}
                                />
                                <button type="submit" disabled={!inputValue.trim() || isTyping} className="ebot-send-btn">
                                    <LuSend size={16} />
                                </button>
                            </div>
                            <p className="ebot-powered">
                                <LuSparkles size={10} />
                                {isBn ? "Extrain Web সহকারী" : "Extrain Web Assistant"}
                            </p>
                        </form>
                    </>
                )}
            </div>

            {/* ─── Floating Chat Button ─── */}
            {!isOpen && (
                <button onClick={toggleChat} className="ebot-fab" aria-label="Chat with us">
                    <span className="ebot-fab-pulse" />
                    {hasNewMessage && <span className="ebot-fab-badge">1</span>}
                    <span className="ebot-fab-icon"><LuMessageCircle size={24} /></span>
                    <span className="ebot-fab-tooltip">{isBn ? "চ্যাট করুন!" : "Chat with us!"}</span>
                </button>
            )}

            {/* ─── Styles ─── */}
            <style jsx global>{`
                .ebot-fab { position: fixed; bottom: 24px; right: 24px; z-index: 998; width: 56px; height: 56px; border-radius: 50%; border: none; cursor: pointer; background: linear-gradient(135deg, #FD9A00, #e07f00); color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(253, 154, 0, 0.4), 0 2px 8px rgba(0,0,0,0.15); transition: all .3s cubic-bezier(.4,0,.2,1); }
                .ebot-fab:hover { transform: scale(1.1); box-shadow: 0 6px 28px rgba(253,154,0,.55); }
                .ebot-fab-icon { display: flex; align-items: center; justify-content: center; }
                .ebot-fab-pulse { position: absolute; inset: -3px; border-radius: 50%; background: #FD9A00; opacity: 0; animation: ebotPulse 2s ease-out infinite; }
                @keyframes ebotPulse { 0% { opacity: .45; transform: scale(1); } 100% { opacity: 0; transform: scale(1.4); } }
                .ebot-fab-badge { position: absolute; top: -2px; right: -2px; width: 20px; height: 20px; border-radius: 50%; background: #0CB2A9; color: #1a1a00; font-size: 11px; font-weight: 800; display: flex; align-items: center; justify-content: center; border: 2px solid white; animation: ebotBounce 1s ease infinite; }
                @keyframes ebotBounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
                .ebot-fab-tooltip { position: absolute; right: 68px; white-space: nowrap; background: white; color: #333; font-size: 13px; font-weight: 600; padding: 7px 13px; border-radius: 20px; box-shadow: 0 4px 16px rgba(0,0,0,.12); opacity: 0; transform: translateX(10px); transition: all .3s; pointer-events: none; }
                .ebot-fab:hover .ebot-fab-tooltip { opacity: 1; transform: translateX(0); }

                .ebot-window { position: fixed; bottom: 92px; right: 24px; z-index: 1000; width: 370px; max-height: 560px; background: white; border-radius: 20px; box-shadow: 0 12px 48px rgba(0,0,0,.16), 0 4px 16px rgba(0,0,0,.08); display: flex; flex-direction: column; overflow: hidden; transform: scale(.85) translateY(20px); opacity: 0; pointer-events: none; transition: all .35s cubic-bezier(.4,0,.2,1); transform-origin: bottom right; }
                .ebot-window-open { transform: scale(1) translateY(0); opacity: 1; pointer-events: all; }
                .ebot-window-min { max-height: 60px; }

                .ebot-header { background: linear-gradient(135deg, #FD9A00, #e07f00); padding: 13px 15px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; user-select: none; flex-shrink: 0; }
                .ebot-header-left { display: flex; align-items: center; gap: 10px; }
                .ebot-avatar { width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,.25); display: flex; align-items: center; justify-content: center; color: white; position: relative; flex-shrink: 0; }
                .ebot-online-dot { position: absolute; bottom: 0; right: 0; width: 10px; height: 10px; background: #0CB2A9; border-radius: 50%; border: 2px solid #FD9A00; }
                .ebot-header-info { color: white; }
                .ebot-header-title { font-size: 14px; font-weight: 700; margin: 0; line-height: 1.2; }
                .ebot-header-status { font-size: 11px; margin: 2px 0 0; opacity: .92; display: flex; align-items: center; gap: 4px; }
                .ebot-status-dot { width: 6px; height: 6px; background: #0CB2A9; border-radius: 50%; display: inline-block; animation: ebotBlink 2s ease infinite; }
                @keyframes ebotBlink { 0%,100% { opacity: 1; } 50% { opacity: .4; } }
                .ebot-header-actions { display: flex; gap: 4px; }
                .ebot-header-btn { width: 28px; height: 28px; border: none; border-radius: 50%; background: rgba(255,255,255,.2); color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background .2s; }
                .ebot-header-btn:hover { background: rgba(255,255,255,.35); }

                .ebot-messages { flex: 1; overflow-y: auto; padding: 16px 14px; display: flex; flex-direction: column; gap: 8px; min-height: 280px; max-height: 350px; background: #fafaf7; scroll-behavior: smooth; }
                .ebot-messages::-webkit-scrollbar { width: 4px; }
                .ebot-messages::-webkit-scrollbar-thumb { background: #e0c9a0; border-radius: 10px; }
                .ebot-msg { display: flex; gap: 8px; animation: ebotIn .3s ease-out; }
                @keyframes ebotIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
                .ebot-msg-user { justify-content: flex-end; }
                .ebot-msg-bot { justify-content: flex-start; }
                .ebot-msg-avatar { width: 24px; height: 24px; border-radius: 50%; background: linear-gradient(135deg, #FD9A00, #e07f00); display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0; margin-top: 2px; }
                .ebot-bubble { max-width: 82%; padding: 10px 13px; border-radius: 16px; position: relative; word-wrap: break-word; }
                .ebot-bubble-user { background: linear-gradient(135deg, #FD9A00, #e07f00); color: white; border-bottom-right-radius: 4px; box-shadow: 0 1px 4px rgba(253,154,0,.3); }
                .ebot-bubble-bot { background: white; color: #1f2937; border-bottom-left-radius: 4px; box-shadow: 0 1px 6px rgba(0,0,0,.06); border: 1px solid #eee; }
                .ebot-bubble-content { font-size: 13.5px; line-height: 1.55; }
                .ebot-bubble-content .ebot-line { display: block; }
                .ebot-bubble-content .ebot-line:empty { height: 6px; }
                .ebot-bubble-content .ebot-bullet, .ebot-bubble-content .ebot-num { color: #FD9A00; font-weight: 700; margin-right: 4px; }
                .ebot-bubble-bot .ebot-bubble-content strong { color: #b45309; }
                .ebot-time { font-size: 10px; opacity: .5; display: block; margin-top: 4px; text-align: right; }
                .ebot-links { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
                .ebot-link-btn { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; background: #fff7ed; color: #b45309; text-decoration: none; transition: all .2s; border: 1px solid #fed7aa; }
                .ebot-link-btn:hover { background: #FD9A00; color: white; border-color: #FD9A00; }

                .ebot-quick-replies { display: flex; flex-wrap: wrap; gap: 6px; padding: 2px 4px 4px; animation: ebotIn .4s ease-out; }
                .ebot-quick-btn { padding: 6px 13px; border-radius: 18px; border: 1.5px solid #FD9A00; background: white; color: #b45309; font-size: 12px; font-weight: 600; cursor: pointer; transition: all .2s; white-space: nowrap; }
                .ebot-quick-btn:hover { background: #FD9A00; color: white; transform: translateY(-1px); box-shadow: 0 2px 8px rgba(253,154,0,.3); }

                .ebot-typing-bubble { padding: 12px 16px !important; }
                .ebot-typing { display: flex; gap: 4px; align-items: center; }
                .ebot-typing span { width: 7px; height: 7px; border-radius: 50%; background: #FD9A00; animation: ebotDot 1.4s ease-in-out infinite; }
                .ebot-typing span:nth-child(2) { animation-delay: .2s; }
                .ebot-typing span:nth-child(3) { animation-delay: .4s; }
                @keyframes ebotDot { 0%,60%,100% { transform: translateY(0); opacity: .4; } 30% { transform: translateY(-6px); opacity: 1; } }

                .ebot-suggestions { display: flex; gap: 6px; padding: 8px 14px; overflow-x: auto; border-top: 1px solid #f0f0f0; background: #fbfbf9; flex-shrink: 0; scrollbar-width: none; }
                .ebot-suggestions::-webkit-scrollbar { display: none; }
                .ebot-chip { flex-shrink: 0; padding: 5px 10px; border-radius: 16px; border: 1px solid #ececdf; background: white; color: #374151; font-size: 11px; cursor: pointer; transition: all .2s; white-space: nowrap; }
                .ebot-chip:hover { background: #FD9A00; color: white; border-color: #FD9A00; }
                .ebot-chip:disabled { opacity: .5; pointer-events: none; }

                .ebot-input-area { padding: 10px 14px; border-top: 1px solid #eee; background: white; flex-shrink: 0; }
                .ebot-input-wrapper { display: flex; align-items: center; gap: 8px; background: #f3f4f6; border-radius: 24px; padding: 4px 4px 4px 16px; border: 1.5px solid transparent; transition: all .2s; }
                .ebot-input-wrapper:focus-within { border-color: #FD9A00; box-shadow: 0 0 0 3px rgba(253,154,0,.1); background: white; }
                .ebot-input { flex: 1; border: none; background: transparent; outline: none; font-size: 13.5px; color: #1f2937; }
                .ebot-input::placeholder { color: #9ca3af; }
                .ebot-send-btn { width: 34px; height: 34px; border-radius: 50%; border: none; background: linear-gradient(135deg, #FD9A00, #e07f00); color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all .2s; flex-shrink: 0; }
                .ebot-send-btn:hover:not(:disabled) { transform: scale(1.05); box-shadow: 0 2px 8px rgba(253,154,0,.4); }
                .ebot-send-btn:disabled { opacity: .4; cursor: not-allowed; }
                .ebot-powered { text-align: center; font-size: 10px; color: #9ca3af; margin: 6px 0 0; display: flex; align-items: center; justify-content: center; gap: 4px; }

                @media (max-width: 480px) {
                    .ebot-window { right: 0; bottom: 0; left: 0; width: 100%; max-height: 100dvh; border-radius: 0; transform: translateY(100%); }
                    .ebot-window-open { transform: translateY(0); }
                    .ebot-messages { min-height: calc(100dvh - 210px); max-height: calc(100dvh - 210px); }
                    .ebot-fab { bottom: 16px; right: 16px; }
                    .ebot-fab-tooltip { display: none; }
                }
            `}</style>
        </>
    );
};

export default ChatBot;
