"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut, MessageCircle, User, Menu } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import { useState } from "react";
import NotificationBell from './NotificationBell';

export default function Header() {
  const router = useRouter();
  const { user, setUser, loading, unreadCount } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

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
          <Link
            href={String(user?.role) !== "admin" ? "/" : "#"}
            className="flex items-center cursor-pointer"
            onClick={() => setMenuOpen(false)}
          >
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

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden hover:text-emerald-700 transition-colors cursor-pointer"
          >
            <Menu size={28} color="#059669" />
          </button>

          {String(user?.role) !== "admin" && (
            <nav className="hidden lg:flex space-x-8">
              <Link
                href="/#services"
                className="text-gray-700 hover:text-emerald-700 transition-colors cursor-pointer"
              >
                Services
              </Link>
              <Link
                href="/#how-it-works"
                className="text-gray-700 hover:text-emerald-700 transition-colors cursor-pointer"
              >
                How It Works
              </Link>
              <Link
                href="/#testimonials"
                className="text-gray-700 hover:text-emerald-700 transition-colors cursor-pointer"
              >
                Testimonials
              </Link>
              <Link
                href="/articles"
                className="text-gray-700 hover:text-emerald-700 transition-colors cursor-pointer"
              >
                Blogs
              </Link>
              <Link
                href="/doctor"
                className="text-gray-700 hover:text-emerald-700 transition-colors cursor-pointer"
              >
                Therapists
              </Link>
            </nav>
          )}

          <div className="hidden lg:flex items-center space-x-4">
            {!loading && user ? (
              <nav className="flex space-x-1 items-center">
                {String(user?.role) !== "admin" && (
                  <>
                    <Link
                      href="/chat"
                      className="relative text-gray-700 hover:text-emerald-700 transition-colors cursor-pointer p-2 rounded-full hover:bg-emerald-50"
                    >
                      <MessageCircle color="#059669" size={20} />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-xs text-white bg-red-600 rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </Link>
                    <NotificationBell />
                    <Link
                      href={
                        String(user.role) === "doctor"
                          ? "/doctor/profile"
                          : "/patient/profile"
                      }
                      className="text-gray-700 hover:text-emerald-700 transition-colors cursor-pointer p-2 rounded-full hover:bg-emerald-50"
                    >
                      <User color="#059669" size={20} />
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-emerald-700 transition-colors cursor-pointer p-2 rounded-full hover:bg-emerald-50"
                >
                  <LogOut color="#059669" size={20} />
                </button>
              </nav>
            ) : (
              <Button className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg">
                <Link href="/auth" className="cursor-pointer">
                  Get Started
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden flex flex-col space-y-4 py-4">
            {String(user?.role) !== "admin" && (
              <>
                <Link
                  href="/#services"
                  onClick={() => setMenuOpen(false)}
                  className="text-gray-700 hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  Services
                </Link>
                <Link
                  href="/#how-it-works"
                  onClick={() => setMenuOpen(false)}
                  className="text-gray-700 hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  How It Works
                </Link>
                <Link
                  href="/#testimonials"
                  onClick={() => setMenuOpen(false)}
                  className="text-gray-700 hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  Testimonials
                </Link>
                <Link
                  href="/articles"
                  onClick={() => setMenuOpen(false)}
                  className="text-gray-700 hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  Blogs
                </Link>
                <Link
                  href="/doctor"
                  onClick={() => setMenuOpen(false)}
                  className="text-gray-700 hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  Therapists
                </Link>
              </>
            )}

            {!loading && user ? (
              <>
                {String(user?.role) !== "admin" && (
                  <Link
                    href="/chat"
                    onClick={() => setMenuOpen(false)}
                    className="text-gray-700 hover:text-emerald-700 transition-colors cursor-pointer"
                  >
                    Messages {unreadCount > 0 && `(${unreadCount})`}
                  </Link>
                )}
                <Link
                  href={
                    String(user.role) === "doctor"
                      ? "/doctor/profile"
                      : "/patient/profile"
                  }
                  onClick={() => setMenuOpen(false)}
                  className="text-gray-700 hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="text-gray-700 hover:text-emerald-700 transition-colors text-left cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                onClick={() => setMenuOpen(false)}
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg px-4 py-2 rounded text-center cursor-pointer"
              >
                Get Started
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
