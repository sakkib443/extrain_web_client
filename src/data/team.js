// Home page "Meet Our Members" cards (components/Home/TeamSection.jsx).
//
// DEMO DATA: the four names and the stock portraits (Unsplash) below are placeholders.
// To use a real person: change name / role, and put the photo in  public/team/  then write
//   photo: "/team/rakib.jpg"
// Without a photo the card shows the person's initials. Links (linkedin / facebook / email) are optional;
// only the ones you fill in appear as icons.
//
// { id, name, role, roleBn, photo, pos?, linkedin?, facebook?, email? }
//   pos — which part of the photo stays in view when the card crops it, "x% y%" (default top-centre, for faces)
const demo = (id, w = 700) => `https://images.unsplash.com/${id}?w=${w}&h=${Math.round(w * 1.04)}&fit=crop&crop=faces&q=80`;

export const TEAM = [
    {
        id: "bdm",
        name: "Rakib Hasan",
        role: "Business Development Manager",
        roleBn: "বিজনেস ডেভেলপমেন্ট ম্যানেজার",
        photo: demo("photo-1519085360753-af0119f7cbe7"),
        linkedin: "",
        facebook: "",
        email: "",
    },
    {
        id: "pm",
        name: "Nusrat Jahan",
        role: "Project Manager",
        roleBn: "প্রজেক্ট ম্যানেজার",
        photo: demo("photo-1573496359142-b8d87734a5a2"),
        linkedin: "",
        facebook: "",
        email: "",
    },
    {
        id: "dev1",
        name: "Tanvir Ahmed",
        role: "Developer",
        roleBn: "ডেভেলপার",
        photo: demo("photo-1560250097-0b93528c311a"),
        linkedin: "",
        facebook: "",
        email: "",
    },
    {
        id: "dev2",
        name: "Sadia Islam",
        role: "Developer",
        roleBn: "ডেভেলপার",
        photo: demo("photo-1438761681033-6461ffad8d80"),
        linkedin: "",
        facebook: "",
        email: "",
    },
];
