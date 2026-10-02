// Companies shown in the home page "Our Clients" section (components/Home/ClientsSection.jsx).
//
// The section has two rows:
//   TOP    — up to 3 main clients as big cards with a photo (the ones marked  featured: true)
//   BOTTOM — every other client, in a scrolling strip
//
// Two sources are merged there, duplicates removed by name:
//   1. this file — companies you add by hand
//   2. approved testimonials from the admin dashboard (their "company name" is picked up automatically,
//      and they go to the scrolling strip)
//
// Each entry:  { name, nameBn?, note?, noteBn?, logo?, image?, pos?, featured? }
//   image — photo for the big top card. Put the file in  public/clients/  and write  image: "/clients/your-photo.webp"
//   pos   — which part of the photo stays in view when the card crops it, as "x% y%" (default "50% 50%").
//           A low y keeps the top of the photo (heads, signs), a high y keeps the bottom.
//   logo  — square company logo, shown before the name on the big card and in the strip pills. Put the file in
//           public/clients/ and write  logo: "/clients/your-logo.png"  (it sits on a white tile, so any logo is
//           readable). Without a logo a square with the company's first letter is shown instead.
//   note  — small line under the name, for example "Founder" or "IELTS Training Centre" (optional).
export const CLIENTS = [
    { name: "Professor Dr. Abu Sufian", image: "/clients/professor-dr-abu-sufian.webp", pos: "50% 18%", featured: true },
    { name: "Best IELTS BD", image: "/clients/best-ielts-bd.webp", pos: "50% 58%", featured: true },
    { name: "Mizan's Care", image: "/clients/mizans-care.webp", pos: "50% 12%", featured: true },
];
