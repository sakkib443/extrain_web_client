import Footer from "@/components/sheard/Footer";
import Navbar from "@/components/sheard/Navbar";
import TopHeader from "@/components/sheard/TopHeader";

export const metadata = {
  title: "Authentication | Extrain Web",
  description: "Login or Register to access your Extrain Web account.",
};

export default function AuthLayout({ children }) {
  return (
    <>
      <TopHeader />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
