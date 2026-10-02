import ServicePage from "@/components/ServicePage/ServicePage";
import { MEDIA_CONTENT } from "@/data/servicePages";

export const metadata = {
    title: "Media & Content Production in Bangladesh | Photography, Video & Design",
    description:
        "Extrain Web's media & content service: product photography, video production, reels, graphic design, copywriting and brand identity for businesses in Bangladesh.",
    alternates: { canonical: "https://extrainweb.com/media-content" },
    openGraph: {
        title: "Media & Content | Extrain Web",
        description: "Photography, video, graphics and copy that tell your story.",
        url: "https://extrainweb.com/media-content",
        images: [{ url: "/images/logo.png", width: 1200, height: 630, alt: "Extrain Web Media & Content" }],
    },
};

export default function MediaContentPage() {
    return <ServicePage data={MEDIA_CONTENT} />;
}
