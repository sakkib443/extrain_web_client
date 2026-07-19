"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MdOutlineRemoveRedEye, MdOutlineVisibilityOff } from "react-icons/md";
import { FiUser, FiMail, FiPhone, FiLock, FiCheck, FiAward, FiUsers, FiBookOpen } from "react-icons/fi";
import { FaGoogle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { API_BASE_URL } from "@/config/api";

const Register = () => {
  const router = useRouter();
  const { language } = useLanguage();
  const bengaliClass = language === "bn" ? "hind-siliguri" : "";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const p = formData.password || "";
    let score = 0;
    if (p.length >= 8) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    setPasswordStrength(score);
  }, [formData.password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
          role: "student",
          status: "active",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // রেজিস্টারের সাথে সাথে auto-login — আলাদা login লাগবে না
      const token = data?.data?.token || data?.data?.tokens?.accessToken;
      const userData = data?.data?.user;
      const searchParams = new URLSearchParams(window.location.search);
      const redirect = searchParams.get('redirect');

      if (token && userData) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        if (redirect && !redirect.includes('/login') && !redirect.includes('/register')) {
          router.push(redirect);
        } else {
          router.push(userData.role === "admin" ? "/dashboard/admin" : "/dashboard/user");
        }
      } else {
        // token না পেলে fallback হিসেবে login পেজে
        router.push(`/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Send Google user data to our backend
      const res = await fetch(`${API_BASE_URL}/auth/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          firstName: user.displayName?.split(" ")[0] || "Google",
          lastName: user.displayName?.split(" ").slice(1).join(" ") || "User",
          avatar: user.photoURL,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Google login failed");
      }

      const token = data?.data?.token || data?.data?.tokens?.accessToken;
      const userData = data?.data?.user;

      if (token && userData) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));

        // Use same redirect logic as standard login
        const searchParams = new URLSearchParams(window.location.search);
        const redirectParam = searchParams.get('redirect');
        const storedRedirect = sessionStorage.getItem('redirectPath');
        const finalRedirect = redirectParam || storedRedirect;
        sessionStorage.removeItem('redirectPath');

        if (finalRedirect && !finalRedirect.includes('/login') && !finalRedirect.includes('/register')) {
          router.push(finalRedirect);
        } else {
          router.push(userData.role === "admin" ? "/dashboard/admin" : "/dashboard/user");
        }
      }
    } catch (err) {
      console.error("Google Login Error:", err);
      setError(err.message === "Firebase: Error (auth/popup-closed-by-user)."
        ? "Google login cancelled"
        : "Failed to login with Google");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: FiBookOpen, text: language === "bn" ? "৫০+ প্রফেশনাল কোর্স" : "50+ Professional Courses" },
    { icon: FiUsers, text: language === "bn" ? "৪,২০০+ সফল শিক্ষার্থী" : "4,200+ Successful Students" },
    { icon: FiAward, text: language === "bn" ? "ইন্ডাস্ট্রি সার্টিফিকেট" : "Industry Certificates" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#e8f9f9] py-12">
      <div className="container mx-auto px-4 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">

            {/* Left Side - Info Section */}
            <div className="lg:col-span-2 bg-gradient-to-br from-[#FD9A00] to-[#38a89d] p-8 lg:p-12 text-white relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 right-10 w-40 h-40 border-2 border-white rounded-full"></div>
                <div className="absolute bottom-20 left-10 w-24 h-24 border-2 border-white rounded-full"></div>
                <div className="absolute top-1/2 right-1/4 w-16 h-16 border-2 border-white rounded-full"></div>
              </div>

              <div className="relative z-10">
                {/* Welcome Message */}
                <div className="mb-10">
                  <h2 className={`text-3xl font-bold mb-3 outfit ${bengaliClass}`}>
                    {language === "bn" ? "আপনার ক্যারিয়ার শুরু করুন" : "Start Your Career Journey"}
                  </h2>
                  <p className={`text-white/80 text-sm leading-relaxed ${bengaliClass}`}>
                    {language === "bn"
                      ? "একটি অ্যাকাউন্ট তৈরি করুন এবং প্রিমিয়াম কোর্স, লাইভ ক্লাস এবং ক্যারিয়ার সাপোর্ট অ্যাক্সেস করুন।"
                      : "Create an account and get access to premium courses, live classes, and career support."}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                          <Icon size={18} />
                        </div>
                        <span className={`text-sm font-medium ${bengaliClass}`}>{feature.text}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Stats */}
                <div className="mt-10 pt-8 border-t border-white/20">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-3xl font-bold outfit">92%</p>
                      <p className={`text-xs text-white/70 ${bengaliClass}`}>
                        {language === "bn" ? "প্লেসমেন্ট রেট" : "Placement Rate"}
                      </p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold outfit">4.9★</p>
                      <p className={`text-xs text-white/70 ${bengaliClass}`}>
                        {language === "bn" ? "শিক্ষার্থী রেটিং" : "Student Rating"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form Section */}
            <div className="lg:col-span-3 p-8 lg:p-12">
              <div className="max-w-md mx-auto">
                <div className="mb-8">
                  <h3 className={`text-2xl font-bold text-gray-800 mb-2 outfit ${bengaliClass}`}>
                    {language === "bn" ? "অ্যাকাউন্ট তৈরি করুন" : "Create Account"}
                  </h3>
                  <p className={`text-gray-500 text-sm ${bengaliClass}`}>
                    {language === "bn" ? "শুধু এক মিনিট সময় লাগবে!" : "It only takes a minute!"}
                  </p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <FiUser className="absolute left-4 top-3.5 text-gray-400" size={18} />
                      <input
                        name="firstName"
                        placeholder={language === "bn" ? "প্রথম নাম" : "First name"}
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-[#FD9A00] focus:ring-2 focus:ring-[#FD9A00]/20 outline-none transition ${bengaliClass}`}
                      />
                    </div>
                    <div className="relative">
                      <FiUser className="absolute left-4 top-3.5 text-gray-400" size={18} />
                      <input
                        name="lastName"
                        placeholder={language === "bn" ? "শেষ নাম" : "Last name"}
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-[#FD9A00] focus:ring-2 focus:ring-[#FD9A00]/20 outline-none transition ${bengaliClass}`}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <FiMail className="absolute left-4 top-3.5 text-gray-400" size={18} />
                    <input
                      name="email"
                      type="email"
                      placeholder={language === "bn" ? "ইমেইল এড্রেস" : "Email address"}
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-[#FD9A00] focus:ring-2 focus:ring-[#FD9A00]/20 outline-none transition ${bengaliClass}`}
                    />
                  </div>

                  {/* Phone */}
                  <div className="relative">
                    <FiPhone className="absolute left-4 top-3.5 text-gray-400" size={18} />
                    <input
                      name="phoneNumber"
                      placeholder={language === "bn" ? "ফোন নম্বর (ঐচ্ছিক)" : "Phone number (optional)"}
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-[#FD9A00] focus:ring-2 focus:ring-[#FD9A00]/20 outline-none transition ${bengaliClass}`}
                    />
                  </div>

                  {/* Password Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="relative">
                        <FiLock className="absolute left-4 top-3.5 text-gray-400" size={18} />
                        <input
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder={language === "bn" ? "পাসওয়ার্ড" : "Password"}
                          value={formData.password}
                          onChange={handleChange}
                          required
                          className={`w-full pl-11 pr-10 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-[#FD9A00] focus:ring-2 focus:ring-[#FD9A00]/20 outline-none transition ${bengaliClass}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3.5 text-gray-400 hover:text-[#FD9A00] transition"
                        >
                          {showPassword ? <MdOutlineVisibilityOff size={18} /> : <MdOutlineRemoveRedEye size={18} />}
                        </button>
                      </div>
                      {/* Password Strength */}
                      <div className="mt-2">
                        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${passwordStrength === 0 ? "w-0" :
                              passwordStrength === 1 ? "w-1/3 bg-red-400" :
                                passwordStrength === 2 ? "w-2/3 bg-yellow-400" :
                                  "w-full bg-green-500"
                              }`}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <FiLock className="absolute left-4 top-3.5 text-gray-400" size={18} />
                      <input
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder={language === "bn" ? "পাসওয়ার্ড নিশ্চিত করুন" : "Confirm password"}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className={`w-full pl-11 pr-10 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-[#FD9A00] focus:ring-2 focus:ring-[#FD9A00]/20 outline-none transition ${bengaliClass}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3.5 text-gray-400 hover:text-[#FD9A00] transition"
                      >
                        {showConfirmPassword ? <MdOutlineVisibilityOff size={18} /> : <MdOutlineRemoveRedEye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-red-600 text-sm text-center">{error}</p>
                    </div>
                  )}

                  {/* Terms */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${termsAccepted ? 'bg-[#FD9A00] border-[#FD9A00]' : 'border-gray-300'}`}>
                      {termsAccepted && <FiCheck className="text-white" size={12} />}
                    </div>
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="hidden"
                    />
                    <span className={`text-sm text-gray-600 ${bengaliClass}`}>
                      {language === "bn" ? "আমি " : "I agree to the "}
                      <Link href="/terms" className="text-[#FD9A00] font-medium hover:underline">
                        {language === "bn" ? "শর্তাবলী" : "Terms & Conditions"}
                      </Link>
                      {language === "bn" ? " এবং " : " and "}
                      <Link href="/privacy" className="text-[#FD9A00] font-medium hover:underline">
                        {language === "bn" ? "গোপনীয়তা নীতি" : "Privacy Policy"}
                      </Link>
                      {language === "bn" ? " মেনে নিচ্ছি।" : "."}
                    </span>
                  </label>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || !termsAccepted}
                    className={`w-full py-3.5 rounded-xl text-white font-semibold shadow-lg transition text-base ${loading || !termsAccepted
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#FD9A00] to-[#38a89d] hover:shadow-xl hover:-translate-y-0.5"
                      } ${bengaliClass}`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                        {language === "bn" ? "তৈরি হচ্ছে..." : "Creating..."}
                      </span>
                    ) : (
                      language === "bn" ? "অ্যাকাউন্ট তৈরি করুন" : "Create Account"
                    )}
                  </button>

                  {/* Divider */}
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-100"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-4 text-gray-400 font-medium">
                        {language === "bn" ? "অথবা" : "Or continue with"}
                      </span>
                    </div>
                  </div>

                  {/* Google Login Button */}
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all group disabled:opacity-50"
                  >
                    <FaGoogle className="text-red-500 group-hover:scale-110 transition-transform" size={18} />
                    <span className={`text-sm font-semibold text-gray-700 ${bengaliClass}`}>
                      {language === "bn" ? "গুগল দিয়ে সাইন আপ" : "Sign up with Google"}
                    </span>
                  </button>

                  {/* Login Link */}
                  <p className={`text-sm text-gray-500 text-center ${bengaliClass}`}>
                    {language === "bn" ? "আগে থেকেই অ্যাকাউন্ট আছে? " : "Already have an account? "}
                    <Link href="/login" className="text-[#FD9A00] font-semibold hover:underline">
                      {language === "bn" ? "লগইন করুন" : "Sign in"}
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
