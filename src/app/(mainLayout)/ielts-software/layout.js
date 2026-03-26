import { generateMetadata as seoGenerateMetadata, commonKeywords } from '@/lib/seo';

export async function generateMetadata() {
    return seoGenerateMetadata({
        title: "Best IELTS Practice Software Bangladesh | British Council Mock Test Software - Extrain Web",
        description: "বাংলাদেশের সেরা IELTS practice software। British Council-এর আসল ইন্টারফেসে Listening, Reading, Writing ও Speaking mock test দিন। AI auto marking, Admin Dashboard, Student Panel সহ সম্পূর্ণ সমাধান। কোচিং সেন্টারের জন্য আদর্শ। Extrain Web — Top IELTS software development company in Dhaka, Bangladesh.",
        keywords: [
            ...commonKeywords.brand,
            ...commonKeywords.bestKeywords,

            // PRIMARY target keywords
            "IELTS software Bangladesh",
            "IELTS software company Bangladesh",
            "IELTS mock test software",
            "IELTS practice software",
            "best IELTS software Bangladesh",
            "IELTS software development company",
            "IELTS software Dhaka",
            "IELTS coaching software Bangladesh",

            // Software development related
            "software development company Bangladesh",
            "software company Dhaka",
            "best software company Bangladesh",
            "custom software development Dhaka",
            "education software development Bangladesh",
            "edtech software Bangladesh",
            "coaching center software Bangladesh",

            // IELTS specific
            "British Council IELTS software",
            "IELTS computer based test practice",
            "IELTS mock test online Bangladesh",
            "IELTS exam preparation software",
            "IELTS auto marking software",
            "IELTS AI assessment software",
            "IELTS reading test software",
            "IELTS listening test software",
            "IELTS writing assessment AI",
            "IELTS speaking practice AI",
            "IELTS band score calculator",

            // Bangla keywords
            "আইইএলটিএস সফটওয়্যার বাংলাদেশ",
            "আইইএলটিএস প্র্যাক্টিস সফটওয়্যার",
            "আইইএলটিএস মক টেস্ট সফটওয়্যার",
            "IELTS কোচিং সফটওয়্যার",
            "সফটওয়্যার ডেভেলপমেন্ট কোম্পানি বাংলাদেশ",
            "ব্রিটিশ কাউন্সিল আইইএলটিএস সফটওয়্যার",
            "আইইএলটিএস সফটওয়্যার ঢাকা",

            // Long-tail
            "IELTS software for coaching center",
            "buy IELTS software Bangladesh",
            "IELTS mock test software price Bangladesh",
            "IELTS software with admin panel",
            "IELTS software with AI marking",
            "IELTS software white label",
            "IELTS institute management software",
            "online IELTS test platform Bangladesh",
        ],
        canonicalUrl: 'https://extrainweb.com/ielts-software',
    });
}

export default function IeltsSoftwareLayout({ children }) {
    // FAQ Schema for Google Rich Results
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "বাংলাদেশে সেরা IELTS practice software কোনটি?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Extrain Web-এর IELTS Practice Software বাংলাদেশের সেরা। এটি British Council-এর আসল পরীক্ষার ইন্টারফেস হুবহু অনুসরণ করে। Listening, Reading-এ auto marking, Writing ও Speaking-এ AI assessment, Admin Dashboard, Student Dashboard, Unlimited Mock Test সুবিধা আছে। দাম শুরু ৳42,999 থেকে।"
                }
            },
            {
                "@type": "Question",
                "name": "What is the best IELTS software in Bangladesh?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Extrain Web offers the best IELTS practice software in Bangladesh. It features an exact British Council exam interface, AI-powered auto marking for all 4 modules (Listening, Reading, Writing, Speaking), Admin Dashboard, Student Dashboard, and unlimited mock tests. Pricing starts from BDT 42,999."
                }
            },
            {
                "@type": "Question",
                "name": "Is this official British Council software?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No, it is not the official British Council software. However, it replicates the exact British Council online IELTS exam interface including features like text highlighting, note-taking, theme change, and font size control. It gives students the real exam experience for better preparation."
                }
            },
            {
                "@type": "Question",
                "name": "IELTS software-এর দাম কত?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "তিনটি প্যাকেজ আছে: Starter (৳42,999 এককালীন - ছোট কোচিং সেন্টারের জন্য), Professional (৳80,000 এককালীন - AI auto marking সহ), Enterprise (৳2,50,000 - সম্পূর্ণ white-label solution)। মাসিক সাবস্ক্রিপশন অপশনও আছে ৳1,000/মাস থেকে।"
                }
            },
            {
                "@type": "Question",
                "name": "How does the AI auto marking work?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "For Listening and Reading, the software provides instant auto marking with band scores immediately after the test. For Writing, AI analyzes grammar, vocabulary, coherence, and task achievement. For Speaking, AI checks pronunciation, fluency, and grammar through recorded responses. All results include detailed feedback and explanations."
                }
            },
            {
                "@type": "Question",
                "name": "কোচিং সেন্টারের জন্য কোন প্যাকেজটি ভালো?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "ছোট কোচিং সেন্টারের (50 জন পর্যন্ত) জন্য Starter প্যাকেজ। মাঝারি আকারের ইনস্টিটিউটের জন্য Professional (AI marking সহ)। বড় প্রতিষ্ঠান বা নিজের ব্র্যান্ডে চালাতে চাইলে Enterprise। সব প্যাকেজে Admin Dashboard, Student Dashboard এবং চারটি মডিউল অন্তর্ভুক্ত।"
                }
            },
            {
                "@type": "Question",
                "name": "Can I add custom branding to the IELTS software?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes! Professional plan allows adding your logo. Enterprise plan offers complete white-label solution where the entire software runs under your brand with your domain, logo, and branding. This is ideal for institutes that want a premium branded experience."
                }
            },
            {
                "@type": "Question",
                "name": "IELTS software তৈরি করতে কত দিন সময় লাগে?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Starter ও Professional প্যাকেজ রেডিমেড তাই সেটআপ করতে ২-৩ দিন সময় লাগে। Enterprise (custom white-label) প্যাকেজে ওয়েবসাইট ডেভেলপমেন্ট সহ ২-৪ সপ্তাহ লাগতে পারে। সব প্যাকেজে ফ্রি ট্রেনিং ও সেটআপ সাপোর্ট অন্তর্ভুক্ত।"
                }
            }
        ]
    };

    // Software Application Schema
    const softwareSchema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Extrain Web IELTS Practice Software",
        "alternateName": "IELTS Mock Test Software Bangladesh",
        "applicationCategory": "EducationalApplication",
        "applicationSubCategory": "IELTS Exam Preparation",
        "operatingSystem": "Web Browser",
        "description": "Best IELTS practice software in Bangladesh with exact British Council exam interface, AI-powered auto marking for all 4 modules, Admin Dashboard, Student Dashboard, and unlimited mock tests. Developed by Extrain Web, the top software development company in Dhaka.",
        "offers": {
            "@type": "AggregateOffer",
            "lowPrice": "42999",
            "highPrice": "250000",
            "priceCurrency": "BDT",
            "offerCount": 3
        },
        "provider": {
            "@type": "Organization",
            "name": "Extrain Web",
            "url": "https://extrainweb.com",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "Road - 11, DIT Project, Marul Badda, Badda",
                "addressLocality": "Dhaka",
                "postalCode": "1214",
                "addressCountry": "BD"
            },
            "telephone": "+8801711946614",
            "email": "info.extrainweb@gmail.com"
        },
        "featureList": "British Council Interface, Auto Marking, AI Speaking Assessment, AI Writing Assessment, Admin Dashboard, Student Dashboard, Mock Tests, Practice Module, Band Score Calculator, Batch Management, Progress Reports, White-label Solution",
        "screenshot": "https://extrainweb.com/images/logo.png",
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "50",
            "bestRating": "5"
        }
    };

    // Breadcrumb Schema
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://extrainweb.com" },
            { "@type": "ListItem", "position": 2, "name": "IELTS Software", "item": "https://extrainweb.com/ielts-software" }
        ]
    };

    // LocalBusiness Schema - Dhaka specific
    const localBusinessSchema = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": "Extrain Web - IELTS Software Development Company",
        "description": "Best IELTS software development company in Dhaka, Bangladesh. We build custom IELTS practice software with British Council-style interface, AI marking, and complete institute management system.",
        "url": "https://extrainweb.com/ielts-software",
        "telephone": "+8801711946614",
        "email": "info.extrainweb@gmail.com",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Road - 11, DIT Project, Marul Badda, Badda",
            "addressLocality": "Dhaka",
            "postalCode": "1214",
            "addressRegion": "Dhaka Division",
            "addressCountry": "BD"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "23.7808",
            "longitude": "90.4261"
        },
        "priceRange": "৳42,999 - ৳2,50,000",
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
            "opens": "10:00",
            "closes": "18:00"
        },
        "areaServed": [
            { "@type": "Country", "name": "Bangladesh" },
            { "@type": "City", "name": "Dhaka" }
        ],
        "serviceType": ["IELTS Software Development", "Education Software", "Custom Software Development"]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
            />
            {children}
        </>
    );
}
