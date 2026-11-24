// ===================================================================
// Extrain Web — the business details Google reads (name, address, phone, hours).
// ONE place only. Google ranks a local business higher when the name, address and phone
// are exactly the same everywhere (website, Google Business Profile, Facebook, directories).
// If the office moves, change ADDRESS below and update the Google Business Profile the same day.
// ===================================================================

import { FACEBOOK_URL } from "@/config/site";

// The live site answers on www (extrainweb.com redirects to it), so every canonical / sitemap URL uses www.
export const SITE_URL = "https://www.extrainweb.com";

export const BUSINESS = {
    name: "Extrain Web",
    alternateName: "Extra in Web",
    founder: "Sheikh Sakibul Hasan",
    foundingDate: "2023",
    phone: "+8801711946614",
    phoneDisplay: "+880 1711-946614",
    whatsapp: "https://wa.me/8801711946614",
    email: "info.extrainweb@gmail.com",
    address: {
        street: "Pragati Tower, Kha-214/E, Pragati Sarani",
        area: "Merul Badda",
        city: "Dhaka",
        postalCode: "1212",
        region: "Dhaka Division",
        country: "BD",
    },
    // Sat–Thu, 11 AM – 8 PM (Friday off) — same as the Google Business Profile
    hours: { days: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"], opens: "11:00", closes: "20:00" },
    hoursText: "Sat – Thu: 11:00 AM – 8:00 PM",
    hoursTextBn: "শনি – বৃহস্পতি: সকাল ১১টা – রাত ৮টা",
    // Only profiles that really exist. Add LinkedIn / YouTube / Google Business Profile links here once they are live.
    sameAs: [FACEBOOK_URL],
};

export const ADDRESS_LINE = `${BUSINESS.address.street}, ${BUSINESS.address.area}, ${BUSINESS.address.city} ${BUSINESS.address.postalCode}`;
export const ADDRESS_LINE_BN = "প্রগতি টাওয়ার, খ-২১৪/ই, প্রগতি সরণি, মেরুল বাড্ডা, ঢাকা ১২১২";
export const MAP_URL = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(`${BUSINESS.name}, ${ADDRESS_LINE}, Bangladesh`);
export const MAP_EMBED_URL = "https://maps.google.com/maps?q=" + encodeURIComponent(ADDRESS_LINE) + "&z=17&output=embed";

// Social-share image (1200×630) and a small logo for Google
export const OG_IMAGE = "/og-image.jpg";
export const LOGO_URL = `${SITE_URL}/logo-schema.png`;
