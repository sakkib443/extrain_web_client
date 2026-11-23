// robots.txt
// /_next/ must NOT be blocked: Google needs the CSS and JavaScript to render the page.
// (It was blocked before, so Google saw the site without its styles and scripts.)

import { SITE_URL } from "@/config/business";

export default function robots() {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/dashboard/", "/api/", "/admin/", "/checkout", "/cart"],
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
