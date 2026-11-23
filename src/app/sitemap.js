// sitemap.xml — every page Google should index, built fresh every hour.
// Only real, indexable pages go here: no cart/checkout/login/dashboard, no pages that redirect.

import { SITE_URL } from "@/config/business";
import { KNOWN_SLUGS } from "@/data/categories";

const API = "https://extrain-web-server.vercel.app/api";

export const revalidate = 3600;

async function fetchList(path) {
  try {
    const res = await fetch(`${API}${path}`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json.data) ? json.data : [];
  } catch {
    return [];
  }
}

export default async function sitemap() {
  const page = (path, priority, changeFrequency = "monthly") => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  });

  const staticPages = [
    page("/", 1.0, "weekly"),
    // local landing pages — the pages that should rank for "web development company in Dhaka / Badda"
    page("/web-development-company-dhaka", 0.95, "monthly"),
    page("/web-development-company-badda", 0.95, "monthly"),
    page("/web-development-company-near-brac-university", 0.9, "monthly"),
    page("/website", 0.9, "weekly"),
    page("/digital-marketing", 0.8),
    page("/media-content", 0.8),
    page("/ielts-software", 0.8),
    page("/about", 0.7),
    page("/contact", 0.8),
    page("/happy-clients", 0.6),
    page("/blog", 0.6, "weekly"),
  ];

  const categoryPages = KNOWN_SLUGS.map((slug) => page(`/category/${slug}`, 0.7));

  const [websites, blogs] = await Promise.all([
    fetchList("/websites?limit=500"),
    fetchList("/blogs?status=published&limit=500"),
  ]);

  const websitePages = websites
    .filter((w) => w.slug || w._id)
    .map((w) => ({
      url: `${SITE_URL}/website/${w.slug || w._id}`,
      lastModified: new Date(w.updatedAt || w.createdAt || Date.now()),
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  const blogPages = blogs
    .filter((b) => b.slug)
    .map((b) => ({
      url: `${SITE_URL}/blog/${b.slug}`,
      lastModified: new Date(b.updatedAt || b.createdAt || Date.now()),
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  return [...staticPages, ...categoryPages, ...websitePages, ...blogPages];
}
