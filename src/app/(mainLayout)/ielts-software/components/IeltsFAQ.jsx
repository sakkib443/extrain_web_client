"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { LuChevronDown, LuCircleHelp, LuMessageCircle, LuPlus, LuMinus } from "react-icons/lu";

const IeltsFAQ = () => {
    const { language } = useLanguage();
    const bengaliClass = language === "bn" ? "hind-siliguri" : "";
    const [openItems, setOpenItems] = useState([0]);

    const toggleItem = (index) => {
        setOpenItems(prev => 
            prev.includes(index) 
                ? prev.filter(i => i !== index) 
                : [...prev, index]
        );
    };

    const faqs = [
        {
            question: language === 'bn' ? "এটা কি British Council এর অফিসিয়াল সফটওয়্যার?" : "Is this official British Council software?",
            answer: language === 'bn'
                ? "না, এটি অফিসিয়াল নয়। তবে British Council এর অনলাইন পরীক্ষার ইন্টারফেস হুবহু একই রকম করে তৈরি। Highlight, Note, Theme, Font size সব ফিচার আছে।"
                : "No, but it replicates the exact British Council online exam interface. Includes all features like Highlight, Note, Theme, Font size controls."
        },
        {
            question: language === 'bn' ? "কতজন স্টুডেন্টকে অ্যাক্সেস দিতে পারব?" : "How many students can access?",
            answer: language === 'bn'
                ? "Starter-এ ৫০ জন, Professional-এ ২০০ জন। Enterprise-এ আনলিমিটেড। প্রয়োজনে স্টুডেন্ট সংখ্যা বাড়াতে পারবেন।"
                : "Starter: 50 students, Professional: 200 students, Enterprise: Unlimited. You can upgrade anytime."
        },
        {
            question: language === 'bn' ? "Admin Panel-এ কি কি করতে পারব?" : "What can I do in Admin Panel?",
            answer: language === 'bn'
                ? "সব স্টুডেন্টের রেজাল্ট দেখা, ব্যাচ তৈরি, স্টুডেন্ট ম্যানেজ, Progress report, AI Speaking assessment - সব করতে পারবেন।"
                : "View all student results, create batches, manage students, progress reports, AI Speaking assessment - everything in one place."
        },
        {
            question: language === 'bn' ? "AI Speaking কিভাবে কাজ করে?" : "How does AI Speaking work?",
            answer: language === 'bn'
                ? "স্টুডেন্ট কথা রেকর্ড করলে AI pronunciation, fluency, grammar চেক করে। Auto scoring দেয়। Professional ও Enterprise-এ আছে।"
                : "When students record answers, AI checks pronunciation, fluency, grammar and provides auto scoring. Available in Professional & Enterprise."
        },
        {
            question: language === 'bn' ? "Auto Result/Marking কিভাবে হয়?" : "How does Auto Marking work?",
            answer: language === 'bn'
                ? "Listening ও Reading টেস্টে অটোমেটিক মার্কিং। টেস্ট শেষ হলেই Band Score দেখায়। ভুল উত্তরের ব্যাখ্যাও দেয়।"
                : "Automatic marking for Listening & Reading. Shows Band Score immediately after test. Also provides explanations for wrong answers."
        },
        {
            question: language === 'bn' ? "Custom Branding করা যাবে?" : "Can I add custom branding?",
            answer: language === 'bn'
                ? "Professional-এ আপনার লোগো যোগ করতে পারবেন। Enterprise-এ সম্পূর্ণ White-label করা যায় - আপনার ব্র্যান্ডে চলবে।"
                : "Add your logo in Professional. Full white-label in Enterprise - software runs under your brand."
        },
        {
            question: language === 'bn' ? "কয়জন Admin অ্যাক্সেস পাবে?" : "How many admins can access?",
            answer: language === 'bn'
                ? "Starter-এ ১ জন, Professional-এ ৩ জন, Enterprise-এ আনলিমিটেড Admin account পাবেন।"
                : "Starter: 1 admin, Professional: 3 admins, Enterprise: Unlimited admin accounts."
        },
        {
            question: language === 'bn' ? "ট্রেনিং ও সাপোর্ট কি পাব?" : "What training & support is included?",
            answer: language === 'bn'
                ? "সবাইকে Admin ট্রেনিং দেওয়া হয়। Starter-এ Email, Professional-এ Priority, Enterprise-এ Dedicated support।"
                : "All plans include admin training. Starter: Email support, Professional: Priority support, Enterprise: Dedicated support."
        }
    ];

    // Split FAQs into two columns
    const leftColumn = faqs.filter((_, i) => i % 2 === 0);
    const rightColumn = faqs.filter((_, i) => i % 2 === 1);

    const FAQCard = ({ faq, index, actualIndex }) => {
        const isOpen = openItems.includes(actualIndex);
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`rounded-2xl border transition-all duration-300 ${
                    isOpen 
                        ? 'border-[#FD9A00]/30 bg-[#FD9A00]/5' 
                        : 'border-gray-200 dark:border-white/10 bg-white dark:bg-[#111] hover:border-[#FD9A00]/20'
                }`}
            >
                <button
                    onClick={() => toggleItem(actualIndex)}
                    className="w-full flex items-start gap-4 p-5 text-left"
                >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        isOpen 
                            ? 'bg-[#FD9A00] text-white' 
                            : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400'
                    }`}>
                        {isOpen ? <LuMinus size={16} /> : <LuPlus size={16} />}
                    </div>
                    <div className="flex-1">
                        <h3 className={`font-semibold text-gray-900 dark:text-white ${bengaliClass}`}>
                            {faq.question}
                        </h3>
                        <motion.div
                            initial={false}
                            animate={{ 
                                height: isOpen ? 'auto' : 0,
                                opacity: isOpen ? 1 : 0,
                                marginTop: isOpen ? 12 : 0
                            }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <p className={`text-sm text-gray-600 dark:text-gray-400 leading-relaxed ${bengaliClass}`}>
                                {faq.answer}
                            </p>
                        </motion.div>
                    </div>
                </button>
            </motion.div>
        );
    };

    return (
        <section className="py-20 lg:py-28 bg-white dark:bg-[#0A0A0A]">
            <div className="container mx-auto px-4 lg:px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FD9A00]/10 text-[#FD9A00] text-sm font-semibold mb-4">
                        <LuCircleHelp size={16} />
                        {language === 'bn' ? 'সাধারণ প্রশ্নাবলী' : 'FAQ'}
                    </span>
                    <h2 className={`text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6 ${bengaliClass}`}>
                        {language === 'bn' ? (
                            <>
                                সচরাচর জিজ্ঞাসিত{" "}
                                <span className="text-[#FD9A00]">
                                    প্রশ্নাবলী
                                </span>
                            </>
                        ) : (
                            <>
                                Frequently Asked{" "}
                                <span className="text-[#FD9A00]">
                                    Questions
                                </span>
                            </>
                        )}
                    </h2>
                    <p className={`text-lg text-gray-600 dark:text-gray-400 ${bengaliClass}`}>
                        {language === 'bn'
                            ? 'আপনার মনে যে প্রশ্ন আসতে পারে তার উত্তর এখানে পাবেন'
                            : 'Find answers to common questions about our IELTS software'}
                    </p>
                </motion.div>

                {/* FAQ 2-Column Grid */}
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-4">
                    {/* Left Column */}
                    <div className="space-y-4">
                        {leftColumn.map((faq, index) => (
                            <FAQCard 
                                key={index * 2} 
                                faq={faq} 
                                index={index} 
                                actualIndex={index * 2} 
                            />
                        ))}
                    </div>
                    {/* Right Column */}
                    <div className="space-y-4">
                        {rightColumn.map((faq, index) => (
                            <FAQCard 
                                key={index * 2 + 1} 
                                faq={faq} 
                                index={index} 
                                actualIndex={index * 2 + 1} 
                            />
                        ))}
                    </div>
                </div>

                {/* Contact CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-16 text-center"
                >
                    <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-white/5">
                        <div className="w-14 h-14 rounded-xl bg-[#FD9A00]/10 flex items-center justify-center">
                            <LuMessageCircle size={24} className="text-[#FD9A00]" />
                        </div>
                        <div className="text-center sm:text-left">
                            <p className={`font-bold text-gray-900 dark:text-white ${bengaliClass}`}>
                                {language === 'bn' ? 'আরও প্রশ্ন আছে?' : 'Still have questions?'}
                            </p>
                            <p className={`text-sm text-gray-600 dark:text-gray-400 ${bengaliClass}`}>
                                {language === 'bn' ? 'আমাদের সাথে যোগাযোগ করুন' : 'Contact us for more information'}
                            </p>
                        </div>
                        <a
                            href="/contact"
                            className={`px-6 py-3 bg-[#FD9A00] hover:bg-[#e68a00] text-white font-bold rounded-xl transition-colors ${bengaliClass}`}
                        >
                            {language === 'bn' ? 'যোগাযোগ করুন' : 'Contact Us'}
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default IeltsFAQ;
