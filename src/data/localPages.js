// Content for the two local landing pages:
//   /web-development-company-badda                → "website development company in Badda", "web development company in Merul Badda"
//   /web-development-company-dhaka                → "web development company in Dhaka"
//   /web-development-company-near-brac-university → "best web development company beside BRAC University"
// (Home page → "website design company in Bangladesh"; /category/ecommerce → "ecommerce website development in Dhaka")
// Rendered by components/LocalPage/LocalLanding.jsx. Edit text here, not in the component.
// Keep every claim true — Google and customers both check.

export const LOCAL_PAGES = {
    badda: {
        slug: "web-development-company-badda",
        heroLines: ["Best Web Development Company in Badda", "Website & Software Development Agency in Merul Badda, Dhaka"], // the two lines under the home-style headline (inside the H1)
        place: "Badda",
        metaTitle: "Website Development Company in Badda, Merul Badda | Extrain Web",
        metaDescription:
            "Looking for a website development company in Badda? Extrain Web is a web development company in Merul Badda (Pragati Tower). Websites, e-commerce and software. Call +880 1711-946614.",
        eyebrow: "Merul Badda · Dhaka 1212",
        h1: "Website & Web Development Company in Merul Badda, Dhaka",
        intro:
            "Extrain Web is a website development company in Badda — our team works from Pragati Tower in Merul Badda. Businesses in Badda, Rampura, Banasree, Aftabnagar and Gulshan come to our office, sit with our team and get a fast, mobile-friendly website that brings them customers.",
        introBn:
            "এক্সট্রেইন ওয়েব মেরুল বাড্ডার একটি ওয়েব ডেভেলপমেন্ট ও ওয়েবসাইট ডিজাইন কোম্পানি। বাড্ডা, রামপুরা, বনশ্রী, আফতাবনগর ও গুলশানের ব্যবসাগুলো আমাদের অফিসে এসে সরাসরি কথা বলে নিজের ওয়েবসাইট বানিয়ে নেয়।",
        whyTitle: "Why businesses in Badda choose us",
        why: [
            { title: "An office you can walk into", desc: "We are in Pragati Tower on Pragati Sarani, Merul Badda — a few minutes from Notun Bazar, Rampura and Gulshan. Come and discuss your website face to face." },
            { title: "Modern, fast websites", desc: "We build with Next.js and Node.js — the same technology large global brands use — so your site loads fast on mobile data and is ready for Google." },
            { title: "Local payments built in", desc: "Online stores take bKash, Nagad, Rocket, card or cash on delivery, so your customers in Dhaka can pay the way they already do." },
            { title: "Support on WhatsApp", desc: "After launch you reach the same team on WhatsApp or by phone. Small changes, questions and updates are handled quickly." },
        ],
        areasTitle: "Web development company in Merul Badda — areas we serve",
        areas: ["Merul Badda", "Uttar Badda", "Madhya Badda", "Notun Bazar", "Rampura", "Banasree", "Aftabnagar", "Hatirjheel", "Gulshan", "Baridhara", "Bashundhara R/A"],
        faqs: [
            { q: "Where is your office in Badda?", a: "Our office is at Pragati Tower, Kha-214/E, Pragati Sarani, Merul Badda, Dhaka 1212. We are open every day, 10 AM to 8 PM. Please call +880 1711-946614 before you come." },
            { q: "How much does a website cost in Badda?", a: "It depends on what you need. A business or portfolio website costs less than an online store with payments and stock management. Our e-commerce websites start from ৳12,500. Send us your requirements on WhatsApp and we will give you an exact price." },
            { q: "How long does it take to build a website?", a: "A ready-made template website can be live within a few days. A custom business website or online store usually takes two to four weeks, depending on the pages and features." },
            { q: "Will my website show up on Google?", a: "Every site we build is SEO-ready: fast loading, mobile-friendly, proper titles and descriptions, a sitemap and Google Search Console setup. We also offer ongoing SEO and Google Business Profile setup." },
            { q: "Do you only work with businesses in Badda?", a: "No. Our office is in Badda, but we build websites for clients all over Dhaka and Bangladesh, and we work online with clients abroad too." },
        ],
        related: [
            { href: "/web-development-company-near-brac-university", label: "Web development company near BRAC University" },
            { href: "/web-development-company-dhaka", label: "Web development company in Dhaka" },
        ],
    },

    dhaka: {
        slug: "web-development-company-dhaka",
        heroLines: ["Best Web Development Company in Dhaka", "Website & Software Development Agency in Bangladesh"], // the two lines under the home-style headline (inside the H1)
        place: "Dhaka",
        metaTitle: "Best Web Development Company in Dhaka | Extrain Web",
        metaDescription:
            "Extrain Web is a web development company in Dhaka. Custom websites, e-commerce, business software and SEO for companies across Dhaka and Bangladesh. Free quote: +880 1711-946614.",
        eyebrow: "Dhaka · Bangladesh",
        h1: "Web Development Company in Dhaka",
        intro:
            "Since 2023 Extrain Web has built websites, online stores and business software for companies across Dhaka — from shops and coaching centres to real-estate and corporate companies. One team designs, builds, launches and supports your site.",
        introBn:
            "২০২৩ সাল থেকে এক্সট্রেইন ওয়েব ঢাকার বিভিন্ন ব্যবসার জন্য ওয়েবসাইট, অনলাইন শপ ও বিজনেস সফটওয়্যার বানাচ্ছে। ডিজাইন থেকে শুরু করে লঞ্চ ও সাপোর্ট — সব এক টিম করে।",
        whyTitle: "What you get from a Dhaka web development team",
        why: [
            { title: "Custom design, not a copy", desc: "Your website is designed around your brand and your customers, and it looks right on every phone, tablet and laptop." },
            { title: "Built to be found on Google", desc: "Fast pages, clean code, proper headings, structured data and a sitemap — the technical SEO is done before your site goes live." },
            { title: "Selling online made simple", desc: "E-commerce with cart, order management, stock alerts and bKash / Nagad / card / cash-on-delivery payments." },
            { title: "Ready templates when time is short", desc: "Need to launch this week? Pick one of our ready-made websites and we set it up with your content and domain." },
        ],
        areasTitle: "We work with businesses all over Dhaka",
        areas: ["Gulshan", "Banani", "Badda", "Rampura", "Uttara", "Mirpur", "Dhanmondi", "Mohammadpur", "Motijheel", "Tejgaon", "Bashundhara R/A", "Old Dhaka"],
        faqs: [
            { q: "Which is the best web development company in Dhaka?", a: "The best company is the one that understands your business and supports you after launch. Look at their past work, ask about technology, speed and SEO, and check how quickly they answer. You are welcome to see our work and talk to our team before you decide." },
            { q: "How much does a website cost in Dhaka?", a: "Prices depend on the number of pages and features. Our e-commerce websites start from ৳12,500, and we give a fixed quote after hearing your requirements — there are no hidden charges." },
            { q: "Do you also handle domain, hosting and SEO?", a: "Yes. We can register your domain, set up hosting, and run SEO, Google Business Profile and Facebook / Google ads, so everything is handled in one place." },
            { q: "Can I update the website myself?", a: "Yes. Most sites come with an admin dashboard where you can change text, photos, products and prices without any coding." },
            { q: "Where is your office?", a: "Pragati Tower, Kha-214/E, Pragati Sarani, Merul Badda, Dhaka 1212 — open every day, 10 AM to 8 PM." },
        ],
        related: [
            { href: "/web-development-company-badda", label: "Website development company in Badda" },
            { href: "/category/ecommerce", label: "E-commerce website development in Dhaka" },
        ],
    },

    bangladesh: {
        slug: "web-development-company-bangladesh",
        heroLines: ["Best Web Development Company in Bangladesh", "Website & Software Development Agency — Serving All of Bangladesh"], // the two lines under the home-style headline (inside the H1)
        place: "Bangladesh",
        metaTitle: "Best Web Development Company & Agency in Bangladesh | Extrain Web",
        metaDescription:
            "Looking for the best web development company in Bangladesh? Extrain Web builds custom websites, e-commerce and software for businesses in every division — Dhaka, Chattogram, Sylhet, Rajshahi, Khulna and more. Call +880 1711-946614.",
        eyebrow: "All of Bangladesh · Online & in person",
        h1: "Web Development Agency for Businesses Across Bangladesh",
        intro:
            "Extrain Web is a custom website and software development agency based in Merul Badda, Dhaka, working with businesses all over Bangladesh. Wherever you are — Chattogram, Sylhet, Rajshahi, Khulna, Barishal, Rangpur, Mymensingh or a district town — we plan, design and build your website with you on Google Meet, WhatsApp and phone, and hand it over ready to sell.",
        introBn:
            "এক্সট্রেইন ওয়েব ঢাকার মেরুল বাড্ডা থেকে সারা বাংলাদেশের ব্যবসার জন্য কাস্টম ওয়েবসাইট ও সফটওয়্যার বানায়। চট্টগ্রাম, সিলেট, রাজশাহী, খুলনা, বরিশাল, রংপুর, ময়মনসিংহ বা যেকোনো জেলা থেকে — Google Meet, WhatsApp ও ফোনে কথা বলে আমরা আপনার ওয়েবসাইট তৈরি করে দিই।",
        whyTitle: "Why businesses across Bangladesh work with us",
        why: [
            { title: "Work with us from anywhere", desc: "Meetings on Google Meet, updates on WhatsApp and a clear plan for every step — you don't need to travel to Dhaka to get a professional website." },
            { title: "Built for Bangladeshi customers", desc: "Bangla and English content, bKash, Nagad, card and cash on delivery, and delivery charges inside and outside Dhaka — set up the way your customers buy." },
            { title: "Custom, not copy-paste", desc: "Every website and software is designed around your business, your brand and your customers, then built with modern technology like Next.js and Node.js." },
            { title: "SEO from day one", desc: "Fast mobile pages, proper titles, structured data, a sitemap, Search Console and Google Business Profile setup — so customers in your area can find you." },
        ],
        areasTitle: "We build websites for businesses in every division",
        areas: ["Dhaka", "Chattogram", "Sylhet", "Rajshahi", "Khulna", "Barishal", "Rangpur", "Mymensingh", "Gazipur", "Narayanganj", "Cumilla", "Bogura"],
        faqs: [
            { q: "Which is the best web development company in Bangladesh?", a: "The best company for you is the one that understands your business, shows real live work, explains its technology and price clearly, and supports you after launch. Compare a few agencies on these points — and you are welcome to see our work and talk to our team before you decide." },
            { q: "Do you work with clients outside Dhaka?", a: "Yes. Our office is in Merul Badda, Dhaka, and we work with businesses all over Bangladesh. Most of the planning happens on Google Meet and WhatsApp, and you can visit our office whenever you are in Dhaka." },
            { q: "How much does a website cost in Bangladesh?", a: "It depends on the pages and features. Our business website packages start from ৳12,000 and e-commerce websites from ৳12,500. Read our guide to website development cost in Bangladesh, or send your requirements on WhatsApp for an exact quote." },
            { q: "Can you build custom software, not only websites?", a: "Yes. We build web software and dashboards for businesses — for example order and stock management, coaching-centre software and admin panels — designed around how your team works." },
            { q: "How do meetings and payments work if I am not in Dhaka?", a: "We meet on Google Meet (every day, 10 AM to 8 PM), share designs and progress online, and agree a clear payment plan before work starts." },
        ],
        related: [
            { href: "/web-development-company-dhaka", label: "Web development company in Dhaka" },
            { href: "/blog/website-development-cost-in-bangladesh-2026", label: "Website development cost in Bangladesh" },
        ],
    },

    brac: {
        slug: "web-development-company-near-brac-university",
        heroLines: ["Best Web Development Company Beside BRAC University", "Website & Software Agency in Merul Badda, Dhaka"], // the two lines under the home-style headline (inside the H1)
        place: "Merul Badda",
        metaTitle: "Best Web Development Company Beside BRAC University | Extrain Web",
        metaDescription:
            "Extrain Web is a web development company beside BRAC University's Merul Badda campus, in Pragati Tower on Pragati Sarani. Websites for startups, clubs and businesses. Call +880 1711-946614.",
        eyebrow: "Near BRAC University · Merul Badda",
        h1: "Web Development Company Beside BRAC University, Merul Badda",
        intro:
            "Our office is in Pragati Tower on Pragati Sarani — a short walk from BRAC University's Merul Badda campus. Students, teachers, campus clubs, young startups and the shops and offices around the university come to us for websites, online stores and software.",
        introBn:
            "আমাদের অফিস প্রগতি সরণির প্রগতি টাওয়ারে — ব্র্যাক ইউনিভার্সিটির মেরুল বাড্ডা ক্যাম্পাস থেকে হাঁটা দূরত্বে। শিক্ষার্থী, শিক্ষক, ক্লাব, নতুন স্টার্টআপ আর আশেপাশের দোকান ও অফিস আমাদের কাছে ওয়েবসাইট, অনলাইন শপ ও সফটওয়্যার বানায়।",
        whyTitle: "Why people around BRAC University work with us",
        why: [
            { title: "Walk over between classes", desc: "No long trips across Dhaka traffic — come to Pragati Tower, sit with the developers and plan your website in person." },
            { title: "Startup-friendly websites", desc: "Launch an idea fast with a ready-made website or a simple custom site, then grow it into a full product when you are ready." },
            { title: "Portfolio & club websites", desc: "Personal portfolio sites for graduates and job seekers, and websites for clubs, events and research groups." },
            { title: "Real technology, real support", desc: "Next.js and Node.js websites that load fast and rank on Google — with support on WhatsApp after launch." },
        ],
        areasTitle: "Around BRAC University we serve",
        areas: ["BRAC University area", "Merul Badda", "Pragati Sarani", "Aftabnagar", "Rampura", "Banasree", "Notun Bazar", "Uttar Badda", "Gulshan", "Bashundhara R/A"],
        faqs: [
            { q: "How far is your office from BRAC University?", a: "Very close. We are in Pragati Tower, Kha-214/E, Pragati Sarani, Merul Badda — a short walk from BRAC University's Merul Badda campus. Call +880 1711-946614 and we will guide you." },
            { q: "Do you build websites for students and student startups?", a: "Yes. We build portfolio websites, startup landing pages, e-commerce stores and web apps, and we can start small and grow the site as your idea grows." },
            { q: "Can you build a website for a university club or event?", a: "Yes — event pages, registration forms, club websites and galleries. Tell us the date of your event and we will plan the timeline around it." },
            { q: "How much does a website cost?", a: "It depends on the pages and features. Our e-commerce websites start from ৳12,500 and simpler sites can cost less. Send your idea on WhatsApp for an exact quote." },
            { q: "When is the office open?", a: "Every day, including Friday — 10 AM to 8 PM." },
        ],
        related: [
            { href: "/web-development-company-badda", label: "Website development company in Badda" },
            { href: "/web-development-company-dhaka", label: "Web development company in Dhaka" },
        ],
    },
};

// The services both pages link to (internal links help Google understand the site)
export const LOCAL_SERVICES = [
    { href: "/category/ecommerce", title: "E-commerce Website", desc: "Online store with cart, orders, stock and bKash / Nagad / card / COD payments." },
    { href: "/website", title: "Business & Ready-Made Websites", desc: "Company, portfolio, real-estate and corporate websites — custom or from a ready template." },
    { href: "/ielts-software", title: "Software Development", desc: "Custom business software and our IELTS practice software for coaching centres." },
    { href: "/digital-marketing", title: "SEO & Digital Marketing", desc: "SEO, Google Business Profile, Facebook and Google ads that bring real customers." },
    { href: "/media-content", title: "Photo, Video & Design", desc: "Product photos, videos, logos and social media design for your brand." },
    { href: "/contact", title: "Domain, Hosting & Support", desc: "Domain, hosting, SSL and support on WhatsApp after your site goes live." },
];

export const LOCAL_STEPS = [
    { title: "Talk to us", desc: "Call, WhatsApp or visit the office. Tell us about your business and what the website must do." },
    { title: "Fixed quote & plan", desc: "You get a clear price, a page list and a timeline before any work starts." },
    { title: "Design & build", desc: "We design, you give feedback, we build and test on mobile and desktop." },
    { title: "Launch & support", desc: "We connect your domain, submit the site to Google and stay on WhatsApp for support." },
];
