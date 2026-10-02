// Content for the two service pages (/digital-marketing and /media-content).
// Both are rendered by components/ServicePage/ServicePage.jsx — edit text here, not in the component.
// Every text has an English and a Bangla (…Bn) version. Icons are react-icons/lu names, mapped in the component.

const unsplash = (id, w = 1200) => `https://images.unsplash.com/${id}?w=${w}&q=80`;

export const DIGITAL_MARKETING = {
    slug: "digital-marketing",
    label: "Digital marketing",
    labelBn: "ডিজিটাল মার্কেটিং",
    // headline: line1 is solid white, line2 is outlined with one orange letter (accentIndex)
    line1: "GROW",
    line2: "ONLINE",
    accentIndex: 2,
    intro: "SEO, social media and paid ads that bring real customers — planned around your business and measured every month.",
    introBn: "SEO, সোশ্যাল মিডিয়া ও পেইড অ্যাড — যা আসল কাস্টমার আনে। আপনার ব্যবসা অনুযায়ী পরিকল্পনা, আর প্রতি মাসে ফলাফলের হিসাব।",
    image: unsplash("photo-1551288049-bebda4e38f71"),
    imageAlt: "Marketing analytics dashboard",
    badge: { value: "ROI", text: "Every campaign is tracked", textBn: "প্রতিটি ক্যাম্পেইন ট্র্যাক করা হয়" },
    servicesTitle: ["Marketing That", "Brings Customers"],
    servicesTitleBn: ["যে মার্কেটিং", "কাস্টমার আনে"],
    services: [
        { icon: "megaphone", title: "Facebook & Instagram Ads", titleBn: "ফেসবুক ও ইনস্টাগ্রাম অ্যাড", desc: "Targeted campaigns that reach the people most likely to buy, with creatives that stop the scroll.", descBn: "সঠিক মানুষের কাছে টার্গেটেড ক্যাম্পেইন, আর এমন ক্রিয়েটিভ যা স্ক্রল থামায়।" },
        { icon: "search", title: "Search Engine Optimization", titleBn: "সার্চ ইঞ্জিন অপটিমাইজেশন (SEO)", desc: "On-page, technical and local SEO so customers find you on Google when they search.", descBn: "অন-পেজ, টেকনিক্যাল ও লোকাল SEO — যাতে গুগলে খুঁজলেই কাস্টমার আপনাকে পায়।" },
        { icon: "target", title: "Google Ads", titleBn: "গুগল অ্যাড", desc: "Search and display ads that appear exactly when someone is looking for what you sell.", descBn: "সার্চ ও ডিসপ্লে অ্যাড — কেউ আপনার পণ্য খোঁজার মুহূর্তেই দেখা যায়।" },
        { icon: "share", title: "Social Media Management", titleBn: "সোশ্যাল মিডিয়া ম্যানেজমেন্ট", desc: "Content calendar, posting and page management that keep your brand active and trusted.", descBn: "কন্টেন্ট ক্যালেন্ডার, পোস্টিং ও পেজ ম্যানেজমেন্ট — ব্র্যান্ডকে সক্রিয় ও বিশ্বস্ত রাখে।" },
        { icon: "crosshair", title: "Pixel & Conversion Tracking", titleBn: "পিক্সেল ও কনভার্সন ট্র্যাকিং", desc: "Meta Pixel, Conversions API and Google Analytics set up so every sale is measured.", descBn: "Meta Pixel, Conversions API ও Google Analytics সেটআপ — প্রতিটি বিক্রি মাপা যায়।" },
        { icon: "chart", title: "Reports & Strategy", titleBn: "রিপোর্ট ও স্ট্র্যাটেজি", desc: "Clear monthly reports and a plan for the next month — what worked, what to change.", descBn: "পরিষ্কার মাসিক রিপোর্ট ও পরের মাসের প্ল্যান — কী কাজ করেছে, কী বদলাতে হবে।" },
    ],
    // Pricing packages (BDT). period is shown after the price; popular = highlighted card.
    // features: [English, Bangla]
    packagesNote: "Ad budget (the money paid to Facebook / Google) is separate and paid by you directly.",
    packagesNoteBn: "অ্যাড বাজেট (ফেসবুক / গুগলকে দেওয়া টাকা) আলাদা — সরাসরি আপনি পরিশোধ করবেন।",
    packages: [
        {
            name: "Basic", nameBn: "বেসিক", price: 9999, period: "one-time", periodBn: "এককালীন",
            tagline: "Get your business ready online", taglineBn: "ব্যবসাকে অনলাইনে প্রস্তুত করুন",
            features: [
                ["Facebook page creation & setup", "ফেসবুক পেজ তৈরি ও সেটআপ"],
                ["Profile & cover photo design", "প্রোফাইল ও কভার ফটো ডিজাইন"],
                ["Page optimization (about, CTA button, username)", "পেজ অপটিমাইজেশন (About, CTA বাটন, ইউজারনেম)"],
                ["10 social media post designs", "১০টি সোশ্যাল মিডিয়া পোস্ট ডিজাইন"],
                ["Meta Pixel installation", "Meta Pixel ইনস্টলেশন"],
                ["Google Business Profile setup", "Google Business Profile সেটআপ"],
                ["Basic on-page SEO (up to 5 pages)", "বেসিক অন-পেজ SEO (৫টি পেজ পর্যন্ত)"],
            ],
        },
        {
            name: "Premium", nameBn: "প্রিমিয়াম", price: 24999, period: "/ month", periodBn: "/ মাস", popular: true,
            tagline: "Steady growth every month", taglineBn: "প্রতি মাসে নিয়মিত গ্রোথ",
            features: [
                ["Everything in Basic", "বেসিকের সবকিছু"],
                ["20 post designs + captions per month", "মাসে ২০টি পোস্ট ডিজাইন ও ক্যাপশন"],
                ["Facebook & Instagram ads management", "ফেসবুক ও ইনস্টাগ্রাম অ্যাড ম্যানেজমেন্ট"],
                ["Audience research & targeting", "অডিয়েন্স রিসার্চ ও টার্গেটিং"],
                ["SEO for 15 keywords", "১৫টি কি-ওয়ার্ডে SEO"],
                ["Inbox & comment auto-reply setup", "ইনবক্স ও কমেন্ট অটো-রিপ্লাই সেটআপ"],
                ["Monthly performance report", "মাসিক পারফরম্যান্স রিপোর্ট"],
            ],
        },
        {
            name: "Advanced", nameBn: "অ্যাডভান্সড", price: 49999, period: "/ month", periodBn: "/ মাস",
            tagline: "A full-scale marketing team", taglineBn: "পূর্ণাঙ্গ মার্কেটিং টিম",
            features: [
                ["Everything in Premium", "প্রিমিয়ামের সবকিছু"],
                ["30 post designs + 4 reels per month", "মাসে ৩০টি পোস্ট ডিজাইন ও ৪টি রিলস"],
                ["Google Ads (Search & Display)", "গুগল অ্যাড (সার্চ ও ডিসপ্লে)"],
                ["Conversions API & full-funnel tracking", "Conversions API ও পূর্ণ ফানেল ট্র্যাকিং"],
                ["SEO for 30 keywords + backlinks", "৩০টি কি-ওয়ার্ডে SEO ও ব্যাকলিংক"],
                ["Retargeting & A/B testing", "রিটার্গেটিং ও A/B টেস্টিং"],
                ["Weekly report + dedicated manager", "সাপ্তাহিক রিপোর্ট ও ডেডিকেটেড ম্যানেজার"],
            ],
        },
    ],
    steps: [
        { title: "Audit", titleBn: "অডিট", desc: "We study your business, competitors and current pages.", descBn: "আপনার ব্যবসা, প্রতিযোগী ও বর্তমান পেজ বিশ্লেষণ করি।" },
        { title: "Plan", titleBn: "পরিকল্পনা", desc: "Audience, budget and channels — agreed with you.", descBn: "অডিয়েন্স, বাজেট ও চ্যানেল — আপনার সাথে মিলিয়ে ঠিক করি।" },
        { title: "Launch", titleBn: "লঞ্চ", desc: "Tracking set up, creatives made, campaigns go live.", descBn: "ট্র্যাকিং সেটআপ, ক্রিয়েটিভ তৈরি, ক্যাম্পেইন চালু।" },
        { title: "Optimize", titleBn: "অপটিমাইজ", desc: "We test, cut what doesn't work and scale what does.", descBn: "টেস্ট করি, যা কাজ করে না বাদ দিই, যা কাজ করে বাড়াই।" },
    ],
    ctaTitle: ["Ready to Get", "More Customers?"],
    ctaTitleBn: ["আরও কাস্টমার", "পেতে প্রস্তুত?"],
    whatsappText: "Hello Extrain Web! I want to know about your digital marketing service.",
};

export const MEDIA_CONTENT = {
    slug: "media-content",
    label: "Media & content",
    labelBn: "মিডিয়া ও কন্টেন্ট",
    line1: "TELL YOUR",
    line2: "STORY",
    accentIndex: 2,
    intro: "Photography, video, graphics and copy that show your brand at its best — made for web, social and ads.",
    introBn: "ফটোগ্রাফি, ভিডিও, গ্রাফিক্স ও লেখা — যা আপনার ব্র্যান্ডকে সেরাভাবে তুলে ধরে। ওয়েব, সোশ্যাল ও অ্যাডের জন্য তৈরি।",
    image: unsplash("photo-1492691527719-9d1e07e534b4"),
    imageAlt: "Camera and video production setup",
    badge: { value: "4K", text: "Video & photo production", textBn: "ভিডিও ও ফটো প্রোডাকশন" },
    servicesTitle: ["Content That", "People Remember"],
    servicesTitleBn: ["যে কন্টেন্ট", "মানুষ মনে রাখে"],
    services: [
        { icon: "camera", title: "Product Photography", titleBn: "প্রোডাক্ট ফটোগ্রাফি", desc: "Clean, high-quality photos of your products for your website, catalogue and ads.", descBn: "ওয়েবসাইট, ক্যাটালগ ও অ্যাডের জন্য পরিষ্কার, হাই-কোয়ালিটি প্রোডাক্ট ছবি।" },
        { icon: "video", title: "Video Production", titleBn: "ভিডিও প্রোডাকশন", desc: "Brand films, product videos and promos — from script and shoot to final edit.", descBn: "ব্র্যান্ড ফিল্ম, প্রোডাক্ট ভিডিও ও প্রোমো — স্ক্রিপ্ট ও শুট থেকে ফাইনাল এডিট পর্যন্ত।" },
        { icon: "clapper", title: "Reels & Short Videos", titleBn: "রিলস ও শর্ট ভিডিও", desc: "Vertical videos made for Facebook, Instagram, TikTok and YouTube Shorts.", descBn: "ফেসবুক, ইনস্টাগ্রাম, টিকটক ও ইউটিউব শর্টসের জন্য ভার্টিক্যাল ভিডিও।" },
        { icon: "palette", title: "Graphic Design", titleBn: "গ্রাফিক ডিজাইন", desc: "Social posts, ad creatives, banners and print designs that match your brand.", descBn: "সোশ্যাল পোস্ট, অ্যাড ক্রিয়েটিভ, ব্যানার ও প্রিন্ট ডিজাইন — আপনার ব্র্যান্ডের সাথে মিলিয়ে।" },
        { icon: "pen", title: "Copywriting", titleBn: "কপিরাইটিং", desc: "Website text, ad copy and captions in Bangla and English that make people act.", descBn: "বাংলা ও ইংরেজিতে ওয়েবসাইট টেক্সট, অ্যাড কপি ও ক্যাপশন — যা মানুষকে কাজে উৎসাহ দেয়।" },
        { icon: "brand", title: "Brand Identity", titleBn: "ব্র্যান্ড আইডেন্টিটি", desc: "Logo, colours and brand guide so everything you publish looks consistent.", descBn: "লোগো, রং ও ব্র্যান্ড গাইড — যাতে আপনার সব কন্টেন্ট একই রকম দেখায়।" },
    ],
    packagesNote: "Shoots take place inside Dhaka. Prices include editing and delivery in every size you need.",
    packagesNoteBn: "শুট ঢাকার ভেতরে। দামের মধ্যে এডিটিং ও প্রয়োজনীয় সব সাইজে ডেলিভারি অন্তর্ভুক্ত।",
    packages: [
        {
            name: "Basic", nameBn: "বেসিক", price: 7999, period: "/ project", periodBn: "/ প্রজেক্ট",
            tagline: "Fresh visuals to start with", taglineBn: "শুরু করার জন্য নতুন ভিজ্যুয়াল",
            features: [
                ["15 edited product photos", "১৫টি এডিটেড প্রোডাক্ট ছবি"],
                ["10 social media post designs", "১০টি সোশ্যাল মিডিয়া পোস্ট ডিজাইন"],
                ["1 short reel (up to 30 sec)", "১টি শর্ট রিল (৩০ সেকেন্ড পর্যন্ত)"],
                ["Profile & cover design", "প্রোফাইল ও কভার ডিজাইন"],
                ["2 rounds of revisions", "২ বার রিভিশন"],
            ],
        },
        {
            name: "Premium", nameBn: "প্রিমিয়াম", price: 19999, period: "/ project", periodBn: "/ প্রজেক্ট", popular: true,
            tagline: "A month of complete content", taglineBn: "এক মাসের সম্পূর্ণ কন্টেন্ট",
            features: [
                ["40 edited product photos", "৪০টি এডিটেড প্রোডাক্ট ছবি"],
                ["20 social media post designs", "২০টি সোশ্যাল মিডিয়া পোস্ট ডিজাইন"],
                ["4 reels / short videos", "৪টি রিলস / শর্ট ভিডিও"],
                ["1 product video (up to 60 sec)", "১টি প্রোডাক্ট ভিডিও (৬০ সেকেন্ড পর্যন্ত)"],
                ["Captions & ad copy (Bangla + English)", "ক্যাপশন ও অ্যাড কপি (বাংলা ও ইংরেজি)"],
                ["3 rounds of revisions", "৩ বার রিভিশন"],
            ],
        },
        {
            name: "Advanced", nameBn: "অ্যাডভান্সড", price: 39999, period: "/ project", periodBn: "/ প্রজেক্ট",
            tagline: "A full brand content shoot", taglineBn: "পূর্ণাঙ্গ ব্র্যান্ড কন্টেন্ট শুট",
            features: [
                ["80 photos incl. lifestyle / model shoot", "৮০টি ছবি (লাইফস্টাইল / মডেল শুটসহ)"],
                ["30 social media post designs", "৩০টি সোশ্যাল মিডিয়া পোস্ট ডিজাইন"],
                ["8 reels / short videos", "৮টি রিলস / শর্ট ভিডিও"],
                ["1 brand video (up to 2 min)", "১টি ব্র্যান্ড ভিডিও (২ মিনিট পর্যন্ত)"],
                ["Logo refresh & brand guide", "লোগো রিফ্রেশ ও ব্র্যান্ড গাইড"],
                ["Website & ad copywriting", "ওয়েবসাইট ও অ্যাড কপিরাইটিং"],
                ["Unlimited revisions (within scope)", "আনলিমিটেড রিভিশন (নির্ধারিত কাজের মধ্যে)"],
            ],
        },
    ],
    steps: [
        { title: "Brief", titleBn: "ব্রিফ", desc: "You tell us the goal, audience and where it will be used.", descBn: "লক্ষ্য, অডিয়েন্স ও কোথায় ব্যবহার হবে — আপনি জানান।" },
        { title: "Concept", titleBn: "কনসেপ্ট", desc: "Ideas, script or mood board — approved before we shoot.", descBn: "আইডিয়া, স্ক্রিপ্ট বা মুড বোর্ড — শুটের আগে অনুমোদন।" },
        { title: "Production", titleBn: "প্রোডাকশন", desc: "Shoot, design and writing by our creative team.", descBn: "আমাদের ক্রিয়েটিভ টিমের শুট, ডিজাইন ও লেখা।" },
        { title: "Delivery", titleBn: "ডেলিভারি", desc: "Edited, revised and delivered in every size you need.", descBn: "এডিট, রিভিশন শেষে প্রয়োজনীয় সব সাইজে ডেলিভারি।" },
    ],
    ctaTitle: ["Let's Create", "Something Great"],
    ctaTitleBn: ["চলুন দারুণ কিছু", "তৈরি করি"],
    whatsappText: "Hello Extrain Web! I want to know about your media & content service.",
};
