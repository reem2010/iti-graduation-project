"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut, MessageCircle, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";

export default function Header() {
  const router = useRouter();

  const { user, setUser, loading, unreadCount } = useAuth();

  if (loading) return null;

  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.replace("/auth");
  };

  return (
    <div className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-emerald-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="w-15 h-15 rounded-lg flex items-center justify-center">
              <Image
                src={"/siraj_logo.svg"}
                alt="Logo"
                width={52}
                height={52}
                className="rounded-lg"
              />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-900 bg-clip-text text-transparent">
              SIRAJ
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8">
            <a
              href="/#services"
              className="text-gray-700 hover:text-emerald-700 transition-colors"
            >
              Services
            </a>
            <a
              href="/#how-it-works"
              className="text-gray-700 hover:text-emerald-700 transition-colors"
            >
              How It Works
            </a>
            <a
              href="/#testimonials"
              className="text-gray-700 hover:text-emerald-700 transition-colors"
            >
              Testimonials
            </a>
            <Link
              href="/articles"
              className="text-gray-700 hover:text-emerald-700 transition-colors"
            >
              Blogs
            </Link>
            <Link
              href="/doctor"
              className="text-gray-700 hover:text-emerald-700 transition-colors"
            >
              Therapists
            </Link>
          </nav>

          {/* Auth buttons or user icons */}
          <div className="flex items-center space-x-4">
            {!loading && user ? (
              <nav className="hidden md:flex space-x-6 items-center">
                <div className="relative">
                  <Link
                    href="/chat"
                    className="text-gray-700 hover:text-emerald-700 transition-colors"
                  >
                    <MessageCircle color="#2ecc71" size={24} />
                  </Link>

                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-xs text-white bg-red-600 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>

                <Link
                  href={
                    String(user.role) === "doctor"
                      ? "/doctor/profile"
                      : "/patient/profile"
                  }
                  className="text-gray-700 hover:text-emerald-700 transition-colors"
                >
                  <User color="#2ecc71" size={24} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  <LogOut color="#2ecc71" size={24} />
                </button>
              </nav>
            ) : (
              !loading && (
                <Button className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg">
                  <Link href="/auth">Get Started</Link>
                </Button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
