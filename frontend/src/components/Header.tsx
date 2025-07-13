"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageCircle, Sparkles, User } from "lucide-react";
import { useEffect, useState } from "react";
import { authApi } from "@/lib/api";
import Image from "next/image";

export default function Header() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authApi.getUser();
        // Only set user if the response is valid
        if (res && res.id) {
          setUser(res);
        } else {
          setUser(null);
        }
      } catch (error) {
        // User not logged in or request failed
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-emerald-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="w-15 h-15 rounded-lg flex items-center justify-center">
              <Image src={"/siraj_logo.svg"} alt="Logo" width={52} height={52} className="rounded-lg" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-900 bg-clip-text text-transparent">
              Siraj
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/articles"
              className="text-gray-700 hover:text-emerald-700 transition-colors"
            >
              Blog
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
                <Link
                  href="/chat"
                  className="text-gray-700 hover:text-emerald-700 transition-colors"
                >
                  <MessageCircle color="#2ecc71" size={24} />
                </Link>
                <Link
                  href="/profile"
                  className="text-gray-700 hover:text-emerald-700 transition-colors"
                >
                  <User color="#2ecc71" size={24} />
                </Link>
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
