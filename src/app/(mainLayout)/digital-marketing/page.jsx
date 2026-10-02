import ServicePage from "@/components/ServicePage/ServicePage";
import { DIGITAL_MARKETING } from "@/data/servicePages";

export const metadata = {
    title: "Digital Marketing Agency in Bangladesh | Facebook Ads, SEO & Google Ads",
    description:
        "Extrain Web's digital marketing service: Facebook & Instagram ads, SEO, Google Ads, social media management and conversion tracking for businesses in Bangladesh.",
    alternates: { canonical: "https://extrainweb.com/digital-marketing" },
    openGraph: {
        title: "Digital Marketing | Extrain Web",
        description: "SEO, social media and paid ads that bring real customers.",
        url: "https://extrainweb.com/digital-marketing",
        images: [{ url: "/images/logo.png", width: 1200, height: 630, alt: "Extrain Web Digital Marketing" }],
    },
};

export default function DigitalMarketingPage() {
    return <ServicePage data={DIGITAL_MARKETING} />;
}
