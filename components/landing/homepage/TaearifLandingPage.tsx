"use client";

import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import TaearifTypesCards from "./components/TaearifTypesCards";
import TeamSection from "./components/TeamSection";
import DashboardSection from "./components/DashboardSection";
import PricingSection from "./components/PricingSection";
import ClientsSection from "./components/ClientsSection";
import FeaturesSectionWordPress from "./components/FeaturesSectionWordPress";
import TestimonialsSection from "./components/TestimonialsSection";
import UpdatesSection from "./components/UpdatesSection";
import WhyUsSection from "./components/WhyUsSection";
import MobileAppSection from "./components/MobileAppSection";
import Footer from "./components/Footer";

export default function TaearifLandingPage() {
  const [dir, setDir] = useState("rtl"); // افتراضي RTL

  useEffect(() => {
    // تحديد الاتجاه بناءً على اللغة من URL
    const pathname = window.location.pathname;
    const isEnglish = pathname.startsWith("/en") || pathname === "/";

    // إذا كان المسار يبدأ بـ /en أو كان المسار الجذر (/) فهو إنجليزي
    setDir(isEnglish ? "ltr" : "rtl");
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <section id="home">
        <HeroSection />
      </section>
      <section id="features">
        <TaearifTypesCards />
      </section>
      {/* <TeamSection /> */}
      <section id="dashboard">
        <DashboardSection />
      </section>
      <section id="pricing">
        <PricingSection />
      </section>
      <section id="clients">
        <ClientsSection />
      </section>
      <section id="features-details">
        <FeaturesSectionWordPress />
      </section>
      <section id="testimonials">
        <TestimonialsSection />
      </section>
      <section id="updates">
        <UpdatesSection />
      </section>
      <section id="about">
        <WhyUsSection />
      </section>
      <section id="mobile">
        <MobileAppSection />
      </section>
      <Footer />
    </div>
  );
}
