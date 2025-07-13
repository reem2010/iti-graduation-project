"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
export default function Header() {
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

          <nav className="hidden md:flex space-x-8">
            <Link
              href={"/articles"}
              className="text-gray-700 hover:text-emerald-700 transition-colors"
            >
              Blog
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
            >
              Sign In
            </Button>
            <Button className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
