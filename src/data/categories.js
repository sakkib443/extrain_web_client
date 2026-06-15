// ───────────────────────────────────────────────────────────────────────────
// Category landing-page content (English + Bangla).
// Edit text and prices here — each /category/<slug> page reads this.
// `ecommerce` is fully written; other categories use a generic fallback.
// ───────────────────────────────────────────────────────────────────────────

export const CATEGORIES = {
    ecommerce: {
        name: "E-Commerce",
        nameBn: "ই-কমার্স",
        tagline: "Start selling online & grow your revenue",
        taglineBn: "অনলাইনে বিক্রি শুরু করুন, আয় বাড়ান",
        description:
            "Get a professional online store that takes orders 24/7 — even while you sleep. Your customers browse products, add to cart and pay with bKash, Nagad or cash on delivery. More reach, more orders, more sales for your business.",
        descriptionBn:
            "একটি প্রফেশনাল অনলাইন স্টোর পান যা দিন-রাত ২৪ ঘণ্টা অর্ডার নেয় — আপনি ঘুমিয়ে থাকলেও। কাস্টমার পছন্দের পণ্য কার্টে যোগ করে বিকাশ, নগদ বা ক্যাশ অন ডেলিভারিতে পেমেন্ট করবে। বেশি কাস্টমার, বেশি অর্ডার, বেশি বিক্রি — আপনার ব্যবসার জন্য।",
        services: [
            { title: "Show Off Your Products", titleBn: "পণ্য সুন্দরভাবে সাজান", desc: "Display all your products with photos, prices and easy search.", descBn: "ছবি, দাম আর সহজ সার্চসহ আপনার সব পণ্য সুন্দরভাবে দেখান।" },
            { title: "Ordering Made Easy", titleBn: "কাস্টমারের সহজ অর্ডার", desc: "Your customers add to cart and order in just a few taps.", descBn: "আপনার কাস্টমার কয়েক ক্লিকেই কার্টে যোগ করে অর্ডার করবে।" },
            { title: "Get Paid Your Way", titleBn: "যেভাবে খুশি পেমেন্ট নিন", desc: "Accept bKash, Nagad, Rocket, card or cash on delivery.", descBn: "বিকাশ, নগদ, রকেট, কার্ড বা ক্যাশ অন ডেলিভারিতে টাকা নিন।" },
            { title: "Always Know Your Stock", titleBn: "স্টক সবসময় হাতের মুঠোয়", desc: "See what's in stock and get alerts before you run out.", descBn: "কোন পণ্য কত আছে দেখুন, শেষ হওয়ার আগেই অ্যালার্ট পান।" },
            { title: "Looks Great on Mobile", titleBn: "মোবাইলেও দারুণ দেখায়", desc: "Your store looks perfect on every phone, tablet and laptop.", descBn: "ফোন, ট্যাবলেট, ল্যাপটপ — সব জায়গায় আপনার দোকান নিখুঁত দেখাবে।" },
            { title: "Easy to Find on Google", titleBn: "গুগলে সহজে খুঁজে পাওয়া", desc: "Built SEO-ready so new customers can find you online.", descBn: "এসইও-রেডি, তাই নতুন কাস্টমার গুগলে আপনাকে সহজেই খুঁজে পাবে।" },
        ],
        pricing: [
            {
                name: "Basic", nameBn: "বেসিক", price: 12500, originalPrice: 25000,
                summary: "Complete e-commerce solution", summaryBn: "সম্পূর্ণ ই-কমার্স সমাধান",
                features: [], featuresBn: [],
                featuresRich: [
                    {
                        title: "Next.js & Node.js Technology",
                        titleBn: "Next.js ও Node.js প্রযুক্তি",
                        desc: "Same tech used by top global brands worldwide",
                        descBn: "বিশ্বের বড় বড় ইন্টারন্যাশনাল ব্র্যান্ড যা ব্যবহার করে",
                    },
                    {
                        title: "Premium Custom Design",
                        titleBn: "প্রিমিয়াম কাস্টম ডিজাইন",
                        desc: "100% mobile-friendly, stunning on every device",
                        descBn: "১০০% মোবাইল-ফ্রেন্ডলি, সব ডিভাইসে দারুণ দেখায়",
                    },
                    {
                        title: "Rocket Fast & Hack-Proof",
                        titleBn: "রকেট স্পিড ও হ্যাক-প্রুফ",
                        desc: "Built by a nationally certified developer",
                        descBn: "ন্যাশনাল সার্টিফাইড ডেভেলপারের তৈরি নিরাপদ ওয়েবসাইট",
                    },
                    {
                        title: "Free SEO & Speed Optimization",
                        titleBn: "ফ্রি এসইও ও স্পিড অপটিমাইজেশন",
                        desc: "Rank on Google, load in the blink of an eye",
                        descBn: "গুগলে সহজে আসুন, চোখের পলকে লোড হোক",
                    },
                    {
                        title: "Payment Gateway",
                        titleBn: "পেমেন্ট গেটওয়ে",
                        desc: "bKash, Nagad, Rocket & Cash on Delivery",
                        descBn: "বিকাশ, নগদ, রকেট ও ক্যাশ অন ডেলিভারি",
                    },
                    {
                        title: "Auto Order + Instant Notification",
                        titleBn: "অটো অর্ডার + ইনস্ট্যান্ট নোটিফিকেশন",
                        desc: "Customer orders — you get notified instantly",
                        descBn: "কাস্টমার অর্ডার করলেই আপনি সাথে সাথে জানবেন",
                    },
                    {
                        title: "Live Chat Integration",
                        titleBn: "লাইভ চ্যাট ইন্টিগ্রেশন",
                        desc: "Talk to customers via WhatsApp or Messenger",
                        descBn: "WhatsApp বা Messenger-এ সরাসরি কাস্টমারের সাথে কথা বলুন",
                    },
                    {
                        title: "Customer Order Tracking",
                        titleBn: "কাস্টমার অর্ডার ট্র্যাকিং",
                        desc: "Live status: Pending → Shipped → Delivered",
                        descBn: "লাইভ স্ট্যাটাস: Pending → Shipped → Delivered",
                    },
                    {
                        title: "Advanced Admin Dashboard",
                        titleBn: "অ্যাডভান্সড অ্যাডমিন ড্যাশবোর্ড",
                        desc: "Manage everything — zero coding required",
                        descBn: "সব ম্যানেজ করুন — কোনো কোডিং জানা লাগবে না",
                    },
                    {
                        title: "Product & Stock Management",
                        titleBn: "প্রোডাক্ট ও স্টক ম্যানেজমেন্ট",
                        desc: "Upload products, control inventory with ease",
                        descBn: "প্রোডাক্ট আপলোড করুন, স্টক নিয়ন্ত্রণ করুন সহজে",
                    },
                    {
                        title: "Daily & Monthly Revenue Reports",
                        titleBn: "ডেইলি ও মান্থলি রেভিনিউ রিপোর্ট",
                        desc: "See all your earnings at a glance",
                        descBn: "আপনার সব আয় এক নজরে দেখুন",
                    },
                    {
                        title: "Lifetime Technical Support",
                        titleBn: "আজীবন টেকনিক্যাল সাপোর্ট",
                        desc: "We're always here — even after going live",
                        descBn: "লাইভ হওয়ার পরেও সব সময় আপনার পাশে",
                    },
                ],
                popular: false,
            },
            {
                name: "Standard", nameBn: "স্ট্যান্ডার্ড", price: 30000, originalPrice: 60000,
                summary: "For growing online businesses", summaryBn: "বাড়ন্ত অনলাইন ব্যবসার জন্য",
                features: [], featuresBn: [],
                featuresRich: [
                    {
                        title: "Next.js & Node.js Technology",
                        titleBn: "Next.js ও Node.js প্রযুক্তি",
                        desc: "Same tech used by top global brands worldwide",
                        descBn: "বিশ্বের বড় বড় ইন্টারন্যাশনাল ব্র্যান্ড যা ব্যবহার করে",
                    },
                    {
                        title: "Premium Custom Design",
                        titleBn: "প্রিমিয়াম কাস্টম ডিজাইন",
                        desc: "100% mobile-friendly, stunning on every device",
                        descBn: "১০০% মোবাইল-ফ্রেন্ডলি, সব ডিভাইসে দারুণ দেখায়",
                    },
                    {
                        title: "Rocket Fast & Hack-Proof",
                        titleBn: "রকেট স্পিড ও হ্যাক-প্রুফ",
                        desc: "Built by a nationally certified developer",
                        descBn: "ন্যাশনাল সার্টিফাইড ডেভেলপারের তৈরি নিরাপদ ওয়েবসাইট",
                    },
                    {
                        title: "Up to 500 Products",
                        titleBn: "সর্বোচ্চ ৫০০টি প্রোডাক্ট",
                        desc: "Massive catalog — list all your products with ease",
                        descBn: "বিশাল ক্যাটালগ — সহজেই সব পণ্য লিস্ট করুন",
                    },
                    {
                        title: "All Payment Gateways",
                        titleBn: "সব পেমেন্ট গেটওয়ে",
                        desc: "bKash, Nagad, Rocket, Card & COD all in one",
                        descBn: "বিকাশ, নগদ, রকেট, কার্ড ও COD — সব এক চেকআউটে",
                    },
                    {
                        title: "Auto Order + Instant Notification",
                        titleBn: "অটো অর্ডার + ইনস্ট্যান্ট নোটিফিকেশন",
                        desc: "Customer orders — you get notified instantly",
                        descBn: "কাস্টমার অর্ডার করলেই আপনি সাথে সাথে জানবেন",
                    },
                    {
                        title: "Live Chat Integration",
                        titleBn: "লাইভ চ্যাট ইন্টিগ্রেশন",
                        desc: "Talk to customers via WhatsApp or Messenger",
                        descBn: "WhatsApp বা Messenger-এ সরাসরি কাস্টমারের সাথে কথা বলুন",
                    },
                    {
                        title: "Customer Order Tracking",
                        titleBn: "কাস্টমার অর্ডার ট্র্যাকিং",
                        desc: "Live status: Pending → Shipped → Delivered",
                        descBn: "লাইভ স্ট্যাটাস: Pending → Shipped → Delivered",
                    },
                    {
                        title: "Advanced Admin Dashboard",
                        titleBn: "অ্যাডভান্সড অ্যাডমিন ড্যাশবোর্ড",
                        desc: "Manage everything — zero coding required",
                        descBn: "সব ম্যানেজ করুন — কোনো কোডিং জানা লাগবে না",
                    },
                    {
                        title: "Order & Inventory Management",
                        titleBn: "অর্ডার ও ইনভেন্টরি ম্যানেজমেন্ট",
                        desc: "Track every order, auto-update stock levels",
                        descBn: "প্রতিটা অর্ডার ট্র্যাক করুন, স্টক অটো আপডেট হবে",
                    },
                    {
                        title: "Discount & Coupon System",
                        titleBn: "ডিসকাউন্ট ও কুপন সিস্টেম",
                        desc: "Run promotions with custom coupon codes anytime",
                        descBn: "যেকোনো সময় কাস্টম কুপন কোড দিয়ে অফার চালান",
                    },
                    {
                        title: "Customer Accounts",
                        titleBn: "কাস্টমার অ্যাকাউন্ট",
                        desc: "Buyers register, log in and manage their orders",
                        descBn: "কাস্টমার রেজিস্টার করে নিজের অর্ডার নিজেই ম্যানেজ করবে",
                    },
                    {
                        title: "Advanced SEO + Google Analytics",
                        titleBn: "অ্যাডভান্সড এসইও + গুগল অ্যানালিটিক্স",
                        desc: "Better Google ranking + full traffic insights",
                        descBn: "গুগলে আরো উপরে আসুন + পুরো ট্র্যাফিক ডেটা হাতের মুঠোয়",
                    },
                    {
                        title: "Daily & Monthly Revenue Reports",
                        titleBn: "ডেইলি ও মান্থলি রেভিনিউ রিপোর্ট",
                        desc: "See all your earnings at a glance",
                        descBn: "আপনার সব আয় এক নজরে দেখুন",
                    },
                    {
                        title: "3 Months Free Support",
                        titleBn: "৩ মাস ফ্রি সাপোর্ট",
                        desc: "Technical help for 90 days after going live",
                        descBn: "লাইভ হওয়ার পর ৯০ দিন টেকনিক্যাল সাপোর্ট",
                    },
                ],
                popular: true,
            },
            {
                name: "Premium", nameBn: "প্রিমিয়াম", price: 80000,
                summary: "Enterprise-grade complete solution", summaryBn: "এন্টারপ্রাইজ-গ্রেড সম্পূর্ণ সমাধান",
                features: [], featuresBn: [],
                dominoChain: {
                    label: "Full Automation Chain",
                    labelBn: "সম্পূর্ণ অটোমেশন চেইন",
                    desc: "One order triggers everything — hands-free from start to finish",
                    descBn: "একটা অর্ডারেই সব শুরু — শেষ পর্যন্ত সম্পূর্ণ অটোমেটিক",
                    steps: ["Order", "Invoice", "Email", "SMS", "Courier", "Stock", "Revenue"],
                    stepsBn: ["অর্ডার", "ইনভয়েস", "ইমেইল", "SMS", "কুরিয়ার", "স্টক", "রেভিনিউ"],
                },
                featuresRich: [
                    {
                        title: "Next.js & Node.js Technology",
                        titleBn: "Next.js ও Node.js প্রযুক্তি",
                        desc: "Same tech used by top global brands worldwide",
                        descBn: "বিশ্বের বড় বড় ইন্টারন্যাশনাল ব্র্যান্ড যা ব্যবহার করে",
                    },
                    {
                        title: "World-Class Custom Design",
                        titleBn: "ওয়ার্ল্ড-ক্লাস কাস্টম ডিজাইন",
                        desc: "Premium UI built exclusively for your brand identity",
                        descBn: "আপনার ব্র্যান্ডের জন্য একচেটিয়া প্রিমিয়াম UI ডিজাইন",
                    },
                    {
                        title: "Rocket Fast & Hack-Proof",
                        titleBn: "রকেট স্পিড ও হ্যাক-প্রুফ",
                        desc: "CDN, advanced caching & SSL — blazing fast, hacker-proof",
                        descBn: "CDN, অ্যাডভান্সড ক্যাশিং ও SSL — অতি দ্রুত ও হ্যাকার-প্রুফ",
                    },
                    {
                        title: "Unlimited Products",
                        titleBn: "আনলিমিটেড প্রোডাক্ট",
                        desc: "No cap — grow your catalog without any limits",
                        descBn: "কোনো সীমা নেই — যত খুশি পণ্য যোগ করুন",
                    },
                    {
                        title: "All Payment Gateways",
                        titleBn: "সব পেমেন্ট গেটওয়ে",
                        desc: "SSLCommerz, bKash, Nagad, Rocket, Card & COD",
                        descBn: "SSLCommerz, বিকাশ, নগদ, রকেট, কার্ড ও COD — সব",
                    },
                    {
                        title: "Auto Order + Instant Notification",
                        titleBn: "অটো অর্ডার + ইনস্ট্যান্ট নোটিফিকেশন",
                        desc: "Customer orders — you get notified instantly",
                        descBn: "কাস্টমার অর্ডার করলেই আপনি সাথে সাথে জানবেন",
                    },
                    {
                        title: "Live Chat Integration",
                        titleBn: "লাইভ চ্যাট ইন্টিগ্রেশন",
                        desc: "Talk to customers via WhatsApp or Messenger",
                        descBn: "WhatsApp বা Messenger-এ সরাসরি কাস্টমারের সাথে কথা বলুন",
                    },
                    {
                        title: "Customer Order Tracking",
                        titleBn: "কাস্টমার অর্ডার ট্র্যাকিং",
                        desc: "Live status: Pending → Shipped → Delivered",
                        descBn: "লাইভ স্ট্যাটাস: Pending → Shipped → Delivered",
                    },
                    {
                        title: "Advanced Admin Dashboard",
                        titleBn: "অ্যাডভান্সড অ্যাডমিন ড্যাশবোর্ড",
                        desc: "Manage everything — zero coding required",
                        descBn: "সব ম্যানেজ করুন — কোনো কোডিং জানা লাগবে না",
                    },
                    {
                        title: "Order & Inventory Management",
                        titleBn: "অর্ডার ও ইনভেন্টরি ম্যানেজমেন্ট",
                        desc: "Track every order, auto-update stock levels",
                        descBn: "প্রতিটা অর্ডার ট্র্যাক করুন, স্টক অটো আপডেট হবে",
                    },
                    {
                        title: "Discount & Coupon System",
                        titleBn: "ডিসকাউন্ট ও কুপন সিস্টেম",
                        desc: "Run promotions with custom coupon codes anytime",
                        descBn: "যেকোনো সময় কাস্টম কুপন কোড দিয়ে অফার চালান",
                    },
                    {
                        title: "Customer Accounts",
                        titleBn: "কাস্টমার অ্যাকাউন্ট",
                        desc: "Buyers register, log in and manage their orders",
                        descBn: "কাস্টমার রেজিস্টার করে নিজের অর্ডার নিজেই ম্যানেজ করবে",
                    },
                    {
                        title: "Courier Integration",
                        titleBn: "কুরিয়ার ইন্টিগ্রেশন",
                        desc: "Book Pathao, Steadfast & RedX from your admin panel",
                        descBn: "অ্যাডমিন থেকেই পাঠাও, স্টেডফাস্ট ও RedX বুক করুন",
                    },
                    {
                        title: "Auto Invoice + SMS & Email",
                        titleBn: "অটো ইনভয়েস + SMS ও ইমেইল",
                        desc: "PDF invoice auto-sent with email & SMS on every order",
                        descBn: "প্রতি অর্ডারে অটো PDF ইনভয়েস + ইমেইল ও SMS",
                    },
                    {
                        title: "Facebook Pixel + Google Analytics",
                        titleBn: "Facebook Pixel + Google Analytics",
                        desc: "Track every visitor, retarget with ads and grow sales",
                        descBn: "প্রতিটা ভিজিটর ট্র্যাক করুন, বিজ্ঞাপন দিয়ে বিক্রি বাড়ান",
                    },
                    {
                        title: "Abandoned Cart Recovery",
                        titleBn: "অ্যাবান্ডনড কার্ট রিকভারি",
                        desc: "Auto-remind customers who left items without buying",
                        descBn: "কিনতে ভুলে যাওয়া কাস্টমারকে অটো রিমাইন্ড পাঠান",
                    },
                    {
                        title: "Product Reviews & Ratings",
                        titleBn: "প্রোডাক্ট রিভিউ ও রেটিং",
                        desc: "Build trust with real customer reviews on every product",
                        descBn: "রিয়েল কাস্টমার রিভিউ দিয়ে নতুন ক্রেতার আস্থা অর্জন করুন",
                    },
                    {
                        title: "Advanced Revenue Analytics",
                        titleBn: "অ্যাডভান্সড রেভিনিউ অ্যানালিটিক্স",
                        desc: "Daily, weekly, monthly charts — know your business at a glance",
                        descBn: "দৈনিক, সাপ্তাহিক, মাসিক চার্ট — ব্যবসার হাল এক নজরে",
                    },
                    {
                        title: "1 Year Priority Support",
                        titleBn: "১ বছর প্রায়োরিটি সাপোর্ট",
                        desc: "Your calls answered first — dedicated VIP support",
                        descBn: "আপনার কল সবার আগে — ডেডিকেটেড VIP সাপোর্ট",
                    },
                ],
                popular: false,
            },
        ],
    },

    "learning-management": {
        name: "Learning Management",
        nameBn: "লার্নিং ম্যানেজমেন্ট",
        tagline: "Sell your courses online & teach the world",
        taglineBn: "অনলাইনে কোর্স বিক্রি করুন, হাজারো শিক্ষার্থীকে শেখান",
        description:
            "Launch your own online learning platform — upload video courses, enroll students, take quizzes and issue certificates. Students learn anytime, anywhere, and you earn 24/7 while you teach.",
        descriptionBn:
            "নিজের অনলাইন লার্নিং প্ল্যাটফর্ম চালু করুন — ভিডিও কোর্স আপলোড করুন, শিক্ষার্থী এনরোল করুন, কুইজ নিন এবং সার্টিফিকেট দিন। শিক্ষার্থীরা যেকোনো সময়, যেকোনো জায়গা থেকে শিখবে — আর আপনি ২৪ ঘণ্টা আয় করবেন।",
        services: [
            { title: "Upload Courses Easily", titleBn: "সহজে কোর্স আপলোড", desc: "Add your video lessons in minutes — no tech skills needed.", descBn: "মিনিটেই ভিডিও লেসন যোগ করুন — কোনো টেকনিক্যাল জ্ঞান লাগবে না।" },
            { title: "Students Join Themselves", titleBn: "শিক্ষার্থী নিজেই যুক্ত হবে", desc: "Learners sign up, enroll and start learning on their own.", descBn: "শিক্ষার্থী নিজেই সাইনআপ করে এনরোল হয়ে শেখা শুরু করবে।" },
            { title: "Quizzes Grade Themselves", titleBn: "কুইজ নিজেই গ্রেড হবে", desc: "Quizzes grade automatically and show results instantly.", descBn: "কুইজ নিজে থেকেই গ্রেড হয়ে সাথে সাথে রেজাল্ট দেখাবে।" },
            { title: "Certificates on Completion", titleBn: "কোর্স শেষে সার্টিফিকেট", desc: "Students get a certificate automatically when they finish.", descBn: "কোর্স শেষ করলেই শিক্ষার্থী অটো সার্টিফিকেট পাবে।" },
            { title: "See Everyone's Progress", titleBn: "সবার অগ্রগতি দেখুন", desc: "Track who finished what — all at a glance.", descBn: "কে কতটুকু শেষ করেছে, এক নজরে দেখুন।" },
            { title: "Get Paid for Teaching", titleBn: "শেখানোর জন্য আয় করুন", desc: "Sell your courses and get paid via bKash, Nagad or card.", descBn: "বিকাশ, নগদ বা কার্ডে কোর্স বিক্রি করে আয় করুন।" },
        ],
        pricing: [
            {
                name: "Basic", nameBn: "বেসিক", price: 12500, originalPrice: 25000,
                summary: "Complete learning platform", summaryBn: "সম্পূর্ণ লার্নিং প্ল্যাটফর্ম",
                features: [], featuresBn: [],
                featuresRich: [
                    {
                        title: "Next.js & Node.js Technology",
                        titleBn: "Next.js ও Node.js প্রযুক্তি",
                        desc: "Same modern tech used by top global platforms",
                        descBn: "বিশ্বের বড় বড় প্ল্যাটফর্ম যে আধুনিক প্রযুক্তি ব্যবহার করে",
                    },
                    {
                        title: "National Skill Certified Developer",
                        titleBn: "ন্যাশনাল স্কিল সার্টিফাইড ডেভেলপার",
                        desc: "Built by a nationally certified professional developer",
                        descBn: "ন্যাশনাল স্কিল সার্টিফাইড প্রফেশনাল ডেভেলপারের তৈরি",
                    },
                    {
                        title: "Premium Modern Design",
                        titleBn: "প্রিমিয়াম মডার্ন ডিজাইন",
                        desc: "100% mobile-responsive, stunning on every device",
                        descBn: "১০০% মোবাইল-রেসপন্সিভ, সব ডিভাইসে দারুণ দেখায়",
                    },
                    {
                        title: "Free SEO & Speed Optimization",
                        titleBn: "ফ্রি এসইও ও স্পিড অপটিমাইজেশন",
                        desc: "Rank on Google, loads in the blink of an eye",
                        descBn: "গুগলে সহজে আসুন, চোখের পলকে লোড হোক",
                    },
                    {
                        title: "Course Category System",
                        titleBn: "কোর্স ক্যাটাগরি সিস্টেম",
                        desc: "Organize courses by category — easy to browse & find",
                        descBn: "বিষয় অনুযায়ী কোর্স সাজানো — সহজে খুঁজে পাওয়া",
                    },
                    {
                        title: "Course & Course Details Pages",
                        titleBn: "কোর্স ও কোর্স ডিটেলস পেজ",
                        desc: "A detailed page for every course with full info",
                        descBn: "প্রতিটা কোর্সের বিস্তারিত পেজ, সব তথ্যসহ",
                    },
                    {
                        title: "Review & Rating System",
                        titleBn: "রিভিউ ও রেটিং সিস্টেম",
                        desc: "Students leave reviews & ratings to build trust",
                        descBn: "শিক্ষার্থীরা রিভিউ ও রেটিং দিয়ে আস্থা বাড়াবে",
                    },
                    {
                        title: "Add to Cart System",
                        titleBn: "অ্যাড টু কার্ট সিস্টেম",
                        desc: "Students add courses to cart before checkout",
                        descBn: "শিক্ষার্থী পছন্দের কোর্স কার্টে যোগ করবে",
                    },
                    {
                        title: "Manual Payment",
                        titleBn: "ম্যানুয়াল পেমেন্ট",
                        desc: "bKash & Nagad manual payment with easy verification",
                        descBn: "বিকাশ ও নগদে ম্যানুয়াল পেমেন্ট, সহজ ভেরিফিকেশন",
                    },
                    {
                        title: "Advanced Admin Dashboard",
                        titleBn: "অ্যাডভান্সড অ্যাডমিন ড্যাশবোর্ড",
                        desc: "Manage courses, payments & users — zero coding",
                        descBn: "কোর্স, পেমেন্ট, ইউজার সব ম্যানেজ — কোডিং ছাড়াই",
                    },
                    {
                        title: "User Dashboard",
                        titleBn: "ইউজার ড্যাশবোর্ড",
                        desc: "Students see their own courses & payments",
                        descBn: "শিক্ষার্থী নিজের কোর্স ও পেমেন্ট নিজেই দেখবে",
                    },
                    {
                        title: "Blog Section",
                        titleBn: "ব্লগ সেকশন",
                        desc: "Write articles & bring free visitors from Google",
                        descBn: "আর্টিকেল লিখে গুগল থেকে ফ্রি ভিজিটর আনুন",
                    },
                    {
                        title: "All Essential Pages",
                        titleBn: "সব দরকারি পেজ",
                        desc: "Home, About, Contact, Privacy Policy & Terms",
                        descBn: "হোম, এবাউট, কন্টাক্ট, প্রাইভেসি পলিসি ও টার্মস ও কন্ডিশন",
                    },
                    {
                        title: "Free Technical Support",
                        titleBn: "ফ্রি টেকনিক্যাল সাপোর্ট",
                        desc: "We're here to help even after going live",
                        descBn: "লাইভ হওয়ার পরেও আমরা পাশে আছি",
                    },
                ],
                popular: false,
            },
            {
                name: "Standard", nameBn: "স্ট্যান্ডার্ড", price: 25000, originalPrice: 50000,
                summary: "For coaching centers", summaryBn: "কোচিং ও একাডেমির জন্য",
                features: [], featuresBn: [],
                featuresRich: [
                    {
                        title: "Next.js & Node.js Technology",
                        titleBn: "Next.js ও Node.js প্রযুক্তি",
                        desc: "Same modern tech used by top global platforms",
                        descBn: "বিশ্বের বড় বড় প্ল্যাটফর্ম যে আধুনিক প্রযুক্তি ব্যবহার করে",
                    },
                    {
                        title: "National Skill Certified Developer",
                        titleBn: "ন্যাশনাল স্কিল সার্টিফাইড ডেভেলপার",
                        desc: "Built by a nationally certified professional developer",
                        descBn: "ন্যাশনাল স্কিল সার্টিফাইড প্রফেশনাল ডেভেলপারের তৈরি",
                    },
                    {
                        title: "Premium Modern Design",
                        titleBn: "প্রিমিয়াম মডার্ন ডিজাইন",
                        desc: "100% mobile-responsive, stunning on every device",
                        descBn: "১০০% মোবাইল-রেসপন্সিভ, সব ডিভাইসে দারুণ দেখায়",
                    },
                    {
                        title: "Up to 50 Courses",
                        titleBn: "সর্বোচ্চ ৫০টি কোর্স",
                        desc: "Host a large course catalog with ease",
                        descBn: "বড় কোর্স ক্যাটালগ সহজে হোস্ট করুন",
                    },
                    {
                        title: "Secure Video Hosting",
                        titleBn: "সিকিউর ভিডিও হোস্টিং",
                        desc: "Protected video lessons — no easy downloads",
                        descBn: "প্রোটেক্টেড ভিডিও লেসন — সহজে ডাউনলোড হবে না",
                    },
                    {
                        title: "Course Category + Details Pages",
                        titleBn: "কোর্স ক্যাটাগরি ও ডিটেলস পেজ",
                        desc: "Organized categories with rich course pages",
                        descBn: "সাজানো ক্যাটাগরি ও বিস্তারিত কোর্স পেজ",
                    },
                    {
                        title: "Quiz & Exam + Auto-Grading",
                        titleBn: "কুইজ ও পরীক্ষা + অটো-গ্রেডিং",
                        desc: "Quizzes grade themselves and show instant results",
                        descBn: "কুইজ নিজে থেকেই গ্রেড হয়ে সাথে সাথে রেজাল্ট দেখায়",
                    },
                    {
                        title: "Auto Certificate on Completion",
                        titleBn: "অটো সার্টিফিকেট",
                        desc: "Students get a certificate automatically when they finish",
                        descBn: "কোর্স শেষে শিক্ষার্থী অটো সার্টিফিকেট পাবে",
                    },
                    {
                        title: "Student Progress Tracking",
                        titleBn: "স্টুডেন্ট প্রোগ্রেস ট্র্যাকিং",
                        desc: "See who finished what — all at a glance",
                        descBn: "কে কতটুকু শেষ করেছে এক নজরে দেখুন",
                    },
                    {
                        title: "Review, Rating & Cart",
                        titleBn: "রিভিউ, রেটিং ও কার্ট",
                        desc: "Reviews, ratings and add-to-cart built in",
                        descBn: "রিভিউ, রেটিং ও কার্ট সিস্টেম বিল্ট-ইন",
                    },
                    {
                        title: "Manual + Online Payment",
                        titleBn: "ম্যানুয়াল + অনলাইন পেমেন্ট",
                        desc: "bKash, Nagad manual plus online payment",
                        descBn: "বিকাশ, নগদ ম্যানুয়াল সহ অনলাইন পেমেন্ট",
                    },
                    {
                        title: "Instructor Dashboard",
                        titleBn: "ইন্সট্রাক্টর ড্যাশবোর্ড",
                        desc: "Instructors manage their own courses & students",
                        descBn: "ইন্সট্রাক্টর নিজের কোর্স ও শিক্ষার্থী ম্যানেজ করবে",
                    },
                    {
                        title: "Coupons & Discounts",
                        titleBn: "কুপন ও ডিসকাউন্ট",
                        desc: "Run promotions with custom coupon codes",
                        descBn: "কাস্টম কুপন কোড দিয়ে অফার চালান",
                    },
                    {
                        title: "Advanced Admin Dashboard",
                        titleBn: "অ্যাডভান্সড অ্যাডমিন ড্যাশবোর্ড",
                        desc: "Full control over the whole platform",
                        descBn: "পুরো প্ল্যাটফর্মের সম্পূর্ণ নিয়ন্ত্রণ",
                    },
                    {
                        title: "Blog + Advanced SEO",
                        titleBn: "ব্লগ + অ্যাডভান্সড এসইও",
                        desc: "Blog plus advanced SEO for more reach",
                        descBn: "ব্লগ সহ অ্যাডভান্সড এসইও, বেশি ভিজিটর",
                    },
                    {
                        title: "3 Months Free Support",
                        titleBn: "৩ মাস ফ্রি সাপোর্ট",
                        desc: "Technical help for 90 days after going live",
                        descBn: "লাইভ হওয়ার পর ৯০ দিন টেকনিক্যাল সাপোর্ট",
                    },
                ],
                popular: true,
            },
            {
                name: "Premium", nameBn: "প্রিমিয়াম", price: 80000,
                summary: "For institutes & academies", summaryBn: "বড় প্রতিষ্ঠান ও একাডেমির জন্য",
                features: [], featuresBn: [],
                dominoChain: {
                    label: "Full Learning Automation",
                    labelBn: "সম্পূর্ণ লার্নিং অটোমেশন",
                    desc: "One enrollment triggers everything — hands-free from start to finish",
                    descBn: "একটা এনরোলমেন্টেই সব শুরু — শেষ পর্যন্ত সম্পূর্ণ অটোমেটিক",
                    steps: ["Enroll", "Payment", "Access", "Quiz", "Certificate", "Email"],
                    stepsBn: ["এনরোল", "পেমেন্ট", "এক্সেস", "কুইজ", "সার্টিফিকেট", "ইমেইল"],
                },
                featuresRich: [
                    {
                        title: "Next.js & Node.js Technology",
                        titleBn: "Next.js ও Node.js প্রযুক্তি",
                        desc: "Same modern tech used by top global platforms",
                        descBn: "বিশ্বের বড় বড় প্ল্যাটফর্ম যে আধুনিক প্রযুক্তি ব্যবহার করে",
                    },
                    {
                        title: "National Skill Certified Developer",
                        titleBn: "ন্যাশনাল স্কিল সার্টিফাইড ডেভেলপার",
                        desc: "Built by a nationally certified professional developer",
                        descBn: "ন্যাশনাল স্কিল সার্টিফাইড প্রফেশনাল ডেভেলপারের তৈরি",
                    },
                    {
                        title: "World-Class Custom Design",
                        titleBn: "ওয়ার্ল্ড-ক্লাস কাস্টম ডিজাইন",
                        desc: "Premium UI built exclusively for your institute",
                        descBn: "আপনার প্রতিষ্ঠানের জন্য একচেটিয়া প্রিমিয়াম UI ডিজাইন",
                    },
                    {
                        title: "Unlimited Courses",
                        titleBn: "আনলিমিটেড কোর্স",
                        desc: "No cap — add as many courses as you want",
                        descBn: "কোনো সীমা নেই — যত খুশি কোর্স যোগ করুন",
                    },
                    {
                        title: "Secure Video Hosting",
                        titleBn: "সিকিউর ভিডিও হোস্টিং",
                        desc: "Protected, high-quality video streaming",
                        descBn: "প্রোটেক্টেড, হাই-কোয়ালিটি ভিডিও স্ট্রিমিং",
                    },
                    {
                        title: "Live Class Integration",
                        titleBn: "লাইভ ক্লাস ইন্টিগ্রেশন",
                        desc: "Run live classes via Zoom or Google Meet",
                        descBn: "জুম বা গুগল মিটে লাইভ ক্লাস নিন",
                    },
                    {
                        title: "Quiz, Exam + Auto-Grading",
                        titleBn: "কুইজ, পরীক্ষা + অটো-গ্রেডিং",
                        desc: "Full exam system with automatic grading",
                        descBn: "অটো-গ্রেডিংসহ সম্পূর্ণ পরীক্ষা সিস্টেম",
                    },
                    {
                        title: "Auto Branded Certificate",
                        titleBn: "অটো ব্র্যান্ডেড সার্টিফিকেট",
                        desc: "Branded certificates issued automatically",
                        descBn: "ব্র্যান্ডেড সার্টিফিকেট অটো ইস্যু হবে",
                    },
                    {
                        title: "Multi-Instructor Support",
                        titleBn: "মাল্টি-ইন্সট্রাক্টর সাপোর্ট",
                        desc: "Many instructors, each with their own panel",
                        descBn: "অনেক ইন্সট্রাক্টর, প্রত্যেকের আলাদা প্যানেল",
                    },
                    {
                        title: "Progress + Analytics",
                        titleBn: "প্রোগ্রেস + অ্যানালিটিক্স",
                        desc: "Track every student and course's performance",
                        descBn: "প্রতিটা শিক্ষার্থী ও কোর্সের পারফরম্যান্স ট্র্যাক",
                    },
                    {
                        title: "All Payment Gateways",
                        titleBn: "সব পেমেন্ট গেটওয়ে",
                        desc: "SSLCommerz, bKash, Nagad, Rocket & Card",
                        descBn: "এসএসএলকমার্জ, বিকাশ, নগদ, রকেট ও কার্ড",
                    },
                    {
                        title: "SMS & Email Notifications",
                        titleBn: "এসএমএস ও ইমেইল নোটিফিকেশন",
                        desc: "Auto SMS & email on enrollment and more",
                        descBn: "এনরোলমেন্টসহ নানা ইভেন্টে অটো SMS ও ইমেইল",
                    },
                    {
                        title: "Review, Rating & Cart",
                        titleBn: "রিভিউ, রেটিং ও কার্ট",
                        desc: "Full review, rating and cart system",
                        descBn: "সম্পূর্ণ রিভিউ, রেটিং ও কার্ট সিস্টেম",
                    },
                    {
                        title: "Coupons & Discounts",
                        titleBn: "কুপন ও ডিসকাউন্ট",
                        desc: "Unlimited promotions and coupon codes",
                        descBn: "আনলিমিটেড অফার ও কুপন কোড",
                    },
                    {
                        title: "Reports & Revenue Analytics",
                        titleBn: "রিপোর্ট ও রেভিনিউ অ্যানালিটিক্স",
                        desc: "Daily, monthly charts — know your business at a glance",
                        descBn: "দৈনিক, মাসিক চার্ট — ব্যবসার হাল এক নজরে",
                    },
                    {
                        title: "Blog + Advanced SEO",
                        titleBn: "ব্লগ + অ্যাডভান্সড এসইও",
                        desc: "Content marketing built in for free traffic",
                        descBn: "ফ্রি ট্র্যাফিকের জন্য বিল্ট-ইন কন্টেন্ট মার্কেটিং",
                    },
                    {
                        title: "Custom Design & Features",
                        titleBn: "কাস্টম ডিজাইন ও ফিচার",
                        desc: "Tailored features built for your exact needs",
                        descBn: "আপনার প্রয়োজনে তৈরি কাস্টম ফিচার",
                    },
                    {
                        title: "1 Year Priority Support",
                        titleBn: "১ বছর প্রায়োরিটি সাপোর্ট",
                        desc: "Your calls answered first — dedicated VIP support",
                        descBn: "আপনার কল সবার আগে — ডেডিকেটেড VIP সাপোর্ট",
                    },
                ],
                popular: false,
            },
        ],
    },
};

// Display names for categories that don't have full content yet.
const NAMES = {
    "learning-management": { en: "Learning Management", bn: "লার্নিং ম্যানেজমেন্ট" },
    business: { en: "Business", bn: "বিজনেস" },
    portfolio: { en: "Portfolio", bn: "পোর্টফোলিও" },
    blog: { en: "Blog & News", bn: "ব্লগ ও নিউজ" },
    restaurant: { en: "Restaurant", bn: "রেস্টুরেন্ট" },
    "real-estate": { en: "Real Estate", bn: "রিয়েল এস্টেট" },
    healthcare: { en: "Healthcare", bn: "হেলথকেয়ার" },
};

export const KNOWN_SLUGS = ["ecommerce", ...Object.keys(NAMES)];

// Returns content for a slug. Falls back to a generic (EN+BN) template for un-customized categories.
export function getCategory(slug) {
    if (CATEGORIES[slug]) return { slug, ...CATEGORIES[slug] };

    const map = NAMES[slug];
    const en = map?.en || slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const bn = map?.bn || en;

    return {
        slug,
        name: en,
        nameBn: bn,
        tagline: `Professional ${en} websites`,
        taglineBn: `প্রফেশনাল ${bn} ওয়েবসাইট`,
        description: `Custom ${en} website solutions designed for performance, beautiful UI and a smooth user experience — built to grow your business.`,
        descriptionBn: `পারফরম্যান্স, সুন্দর ডিজাইন এবং স্মুথ ইউজার এক্সপেরিয়েন্সের জন্য তৈরি কাস্টম ${bn} ওয়েবসাইট সমাধান — আপনার ব্যবসা বাড়াতে।`,
        services: [
            { title: "Custom Design", titleBn: "কাস্টম ডিজাইন", desc: "Unique, modern design tailored to your brand.", descBn: "আপনার ব্র্যান্ডের জন্য ইউনিক, আধুনিক ডিজাইন।" },
            { title: "Mobile Responsive", titleBn: "মোবাইল রেসপন্সিভ", desc: "Looks great on every device and screen size.", descBn: "সব ডিভাইস ও স্ক্রিনে দারুণ দেখায়।" },
            { title: "Fast & SEO Ready", titleBn: "দ্রুত ও এসইও রেডি", desc: "Optimized for speed and search engine ranking.", descBn: "স্পিড ও সার্চ র‍্যাঙ্কিংয়ের জন্য অপটিমাইজড।" },
            { title: "Easy to Manage", titleBn: "সহজ ব্যবস্থাপনা", desc: "Simple admin panel to update your content anytime.", descBn: "যেকোনো সময় কন্টেন্ট আপডেটের সহজ অ্যাডমিন প্যানেল।" },
            { title: "Secure & Reliable", titleBn: "নিরাপদ ও নির্ভরযোগ্য", desc: "Built with security best practices and stable hosting.", descBn: "সিকিউরিটি বেস্ট প্র্যাকটিস ও স্থিতিশীল হোস্টিংয়ে তৈরি।" },
            { title: "Dedicated Support", titleBn: "ডেডিকেটেড সাপোর্ট", desc: "Ongoing support and maintenance after launch.", descBn: "লঞ্চের পরও চলমান সাপোর্ট ও মেইনটেন্যান্স।" },
        ],
        pricing: [
            { name: "Basic", nameBn: "বেসিক", price: 12000, summary: "Starter package", summaryBn: "স্টার্টার প্যাকেজ", features: ["Up to 5 pages", "Responsive design", "Basic SEO", "Contact form", "1 month support"], featuresBn: ["সর্বোচ্চ ৫টি পেজ", "রেসপন্সিভ ডিজাইন", "বেসিক এসইও", "কন্টাক্ট ফর্ম", "১ মাস সাপোর্ট"], popular: false },
            { name: "Standard", nameBn: "স্ট্যান্ডার্ড", price: 25000, summary: "Most popular", summaryBn: "সবচেয়ে জনপ্রিয়", features: ["Up to 12 pages", "Admin dashboard", "Advanced SEO", "Custom design", "3 months support"], featuresBn: ["সর্বোচ্চ ১২টি পেজ", "অ্যাডমিন ড্যাশবোর্ড", "অ্যাডভান্সড এসইও", "কাস্টম ডিজাইন", "৩ মাস সাপোর্ট"], popular: true },
            { name: "Premium", nameBn: "প্রিমিয়াম", price: 50000, summary: "Full solution", summaryBn: "সম্পূর্ণ সমাধান", features: ["Unlimited pages", "Custom features", "Premium design", "Priority support", "1 year support"], featuresBn: ["আনলিমিটেড পেজ", "কাস্টম ফিচার", "প্রিমিয়াম ডিজাইন", "প্রায়োরিটি সাপোর্ট", "১ বছর সাপোর্ট"], popular: false },
        ],
    };
}
