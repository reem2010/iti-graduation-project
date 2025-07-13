"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageCircle, Sparkles, User } from "lucide-react";
import { useEffect, useState } from "react";
import { authApi } from "@/lib/api";
export default function Header() {
  const [user, setUser] = useState();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await authApi.getUser();
        setUser(user);
      } catch (err) {
        console.error("Failed to fetch current user:", err);
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <div className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-emerald-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-900 bg-clip-text text-transparent">
              Siraj
            </span>
          </div>

          <div className="md:flex gap-8">
            <nav className="hidden md:flex space-x-8">
              <Link
                href={"/articles"}
                className="text-gray-700 hover:text-emerald-700 transition-colors"
              >
                Blog
              </Link>
            </nav>
            <nav className="hidden md:flex space-x-8">
              <Link
                href={"/doctor"}
                className="text-gray-700 hover:text-emerald-700 transition-colors"
              >
                Therapists
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <nav className="hidden md:flex space-x-8">
                <Link
                  href={"/chat"}
                  className="text-gray-700 hover:text-emerald-700 transition-colors"
                >
                  <MessageCircle color="#2ecc71" size={24} />
                </Link>
                <Link
                  href={"/doctor"}
                  className="text-gray-700 hover:text-emerald-700 transition-colors"
                >
                  <User color="#2ecc71" size={24} />
                </Link>
              </nav>
            ) : (
              <>
                <Button className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg">
                  <Link href="/auth">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
