"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import useAuthStore from "@/context/AuthContext";
import { selectUserIsLogged } from "@/context/auth/selectors";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const UserIslogged = useAuthStore(selectUserIsLogged);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav
        className={`fixed top-2 sm:top-7 left-2 right-2 sm:left-12 sm:right-12 z-[999] transition-all duration-700 py-3 sm:py-2 rounded-full ${
          isScrolled
            ? "bg-white shadow-md py-3 sm:py-2"
            : "bg-transparent py-5 sm:py-10"
        }`}
      >
        <div className="flex items-center justify-around px-4 sm:px-6 transition-all duration-300">
          {/* Mobile Menu Button */}

          <button
            onClick={toggleMobileMenu}
            className={`lg:hidden p-2 rounded-lg hover:bg-gray-100  transition-all duration-300
            ${isScrolled ? "px-5" : ""}`}
            aria-label="Toggle mobile menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Auth Buttons - Hidden on mobile */}
          <div className="hidden lg:flex items-center gap-x-5">
            {/* Show when logged in */}
            {UserIslogged && (
              <>
                <Link
                  href="/dashboard"
                  className="relative text-sm font-medium text-black hover:text-[#ff8c24] transition-colors duration-300 cursor-pointer group"
                >
                  لوحة التحكم
                  <span className="absolute bottom-[-5px] right-0 w-0 h-0.5 bg-[#ff8c24] transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                </Link>
                <button
                  onClick={() => logout()}
                  className="relative text-sm font-medium text-black hover:text-red-600 transition-colors duration-300 cursor-pointer group"
                >
                  تسجيل خروج
                  <span className="absolute bottom-[-5px] right-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                </button>
              </>
            )}

            {/* Show when not logged in */}
            {!UserIslogged && (
              <>
                <Link
                  href="/register"
                  className="relative text-sm font-medium text-black hover:text-[#ff8c24] transition-colors duration-300 cursor-pointer group"
                >
                  تسجيل
                  <span className="absolute bottom-[-5px] right-0 w-0 h-0.5 bg-[#ff8c24] transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                </Link>
                <Link
                  href="/login"
                  className="relative text-sm font-medium text-black hover:text-[#ff8c24] transition-colors duration-300 cursor-pointer group"
                >
                  تسجيل دخول
                  <span className="absolute bottom-[-5px] right-0 w-0 h-0.5 bg-[#ff8c24] transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                </Link>
              </>
            )}
          </div>

          {/* Center - Logo */}
          <div className="shrink-0 py-3">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={150}
              height={150}
              className="object-contain"
            />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-x-5">
            <Link
              href="/#home"
              className="relative text-black hover:text-[#ff8c24] transition-colors duration-300 group"
            >
              الصفحة الرئيسية
              <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-[#ff8c24] transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
            </Link>
            <Link
              href="/#about"
              className="relative text-black hover:text-[#ff8c24] transition-colors duration-300 group"
            >
              نبذة عن
              <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-[#ff8c24] transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
            </Link>
            <Link
              href="/#pricing"
              className="relative text-black hover:text-[#ff8c24] transition-colors duration-300 group"
            >
              الباقات
              <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-[#ff8c24] transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
            </Link>
            <Link
              href="/#features"
              className="relative text-black hover:text-[#ff8c24] transition-colors duration-300 group"
            >
              الميزات
              <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-[#ff8c24] transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
            </Link>
          </div>

          {/* Placeholder for mobile menu button alignment */}
          <div className="lg:hidden w-10"></div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={toggleMobileMenu}
          ></div>
          <div className="fixed inset-0 bg-white">
            <div className="flex flex-col h-full">
              {/* Mobile Menu Header */}

              {/* Mobile Navigation Links - Full Width Centered */}
              <div className="flex-1 flex items-center justify-center">
                <nav className="space-y-8 text-center  ">
                  <Link
                    href="/#home"
                    className="block text-2xl font-medium text-black hover:text-[#ff8c24] transition-colors duration-300 py-4"
                    onClick={toggleMobileMenu}
                  >
                    الصفحة الرئيسية
                  </Link>
                  <Link
                    href="/#about"
                    className="block text-2xl font-medium text-black hover:text-[#ff8c24] transition-colors duration-300 py-4"
                    onClick={toggleMobileMenu}
                  >
                    نبذة عن
                  </Link>
                  <Link
                    href="/#pricing"
                    className="block text-2xl font-medium text-black hover:text-[#ff8c24] transition-colors duration-300 py-4"
                    onClick={toggleMobileMenu}
                  >
                    الباقات
                  </Link>
                  <Link
                    href="/#features"
                    className="block text-2xl font-medium text-black hover:text-[#ff8c24] transition-colors duration-300 py-4"
                    onClick={toggleMobileMenu}
                  >
                    الميزات
                  </Link>
                </nav>
              </div>

              {/* Mobile Auth Buttons */}
              <div className="px-6 py-6 border-t">
                <div className="flex flex-col items-center space-y-6">
                  {/* Show when logged in */}
                  {UserIslogged && (
                    <>
                      <Link
                        href="/dashboard"
                        className="relative text-lg font-medium text-black hover:text-[#ff8c24] transition-colors duration-300 cursor-pointer group"
                        onClick={toggleMobileMenu}
                      >
                        لوحة التحكم
                        <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-[#ff8c24] transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                      </Link>
                      <button
                        className="relative text-lg font-medium text-black hover:text-red-600 transition-colors duration-300 cursor-pointer group"
                        onClick={() => {
                          logout();
                          toggleMobileMenu();
                        }}
                      >
                        تسجيل خروج
                        <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                      </button>
                    </>
                  )}

                  {/* Show when not logged in */}
                  {!UserIslogged && (
                    <>
                      <Link
                        href="/register"
                        className="relative text-lg font-medium text-black hover:text-[#ff8c24] transition-colors duration-300 cursor-pointer group"
                        onClick={toggleMobileMenu}
                      >
                        تسجيل
                        <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-[#ff8c24] transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                      </Link>
                      <Link
                        href="/login"
                        className="relative text-lg font-medium text-black hover:text-[#ff8c24] transition-colors duration-300 cursor-pointer group"
                        onClick={toggleMobileMenu}
                      >
                        تسجيل دخول
                        <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-[#ff8c24] transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
