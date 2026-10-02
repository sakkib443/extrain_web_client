// Cloudinary serves any uploaded picture at the size and format you ask for. The product screenshots are stored at full size
// (~400-500 KB PNGs) but shown ~500px wide, so ask for a right-sized, auto-format (WebP/AVIF) copy instead.
// Anything that is not a plain Cloudinary upload URL (or already has a transformation) is returned untouched.
export const optimizeImage = (url, width = 900) => {
    if (typeof url !== "string" || !url.includes("res.cloudinary.com") || !url.includes("/image/upload/")) return url;
    const [head, tail] = url.split("/image/upload/");
    if (new RegExp("^[a-z]{1,3}_[^/]*/", "i").test(tail)) return url; // already transformed (f_auto,w_800/...)
    return `${head}/image/upload/f_auto,q_auto,w_${width},c_limit/${tail}`;
};
