// Home page "Meet Our Members" cards (components/Home/TeamSection.jsx).
//
// Photos are the real team photos (public/team/member-1..4.webp, pre-cropped to the card's 4:4.3 frame).
// Roles are still placeholders — update them as needed.
// To add someone new: put the photo in  public/team/  then write  photo: "/team/name.webp"
// Without a photo the card shows the person's initials. Links (linkedin / facebook / email) are optional;
// only the ones you fill in appear as icons.
//
// { id, name, role, roleBn, photo, pos?, linkedin?, facebook?, email? }
//   pos — which part of the photo stays in view when the card crops it, "x% y%" (default top-centre, for faces)

export const TEAM = [
    {
        id: "bdm",
        name: "Shakib Al Hasan",
        role: "Business Development Manager",
        roleBn: "বিজনেস ডেভেলপমেন্ট ম্যানেজার",
        photo: "/team/member-1.webp",
        linkedin: "",
        facebook: "",
        email: "",
    },
    {
        id: "pm",
        name: "Sayed Bin Sabit",
        role: "Project Manager",
        roleBn: "প্রজেক্ট ম্যানেজার",
        photo: "/team/member-2.webp",
        linkedin: "",
        facebook: "",
        email: "",
    },
    {
        id: "dev1",
        name: "Siam Ahmed",
        role: "Developer",
        roleBn: "ডেভেলপার",
        photo: "/team/member-3.webp",
        linkedin: "",
        facebook: "",
        email: "",
    },
    {
        id: "dev2",
        name: "Abu Taleb Khan",
        role: "Developer",
        roleBn: "ডেভেলপার",
        photo: "/team/member-4.webp",
        linkedin: "",
        facebook: "",
        email: "",
    },
];
