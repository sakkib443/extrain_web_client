export const metadata = {
    title: "Place Your Order | Extrain Web",
    description: "Order your website from Extrain Web — fill in the form and we will contact you on WhatsApp.",
    alternates: { canonical: "/confirm-order" },
    robots: { index: false, follow: true }, // an order form, not a page people search for
};

export default function ConfirmOrderLayout({ children }) {
    return children;
}
