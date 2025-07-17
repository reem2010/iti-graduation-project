"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-gradient-to-br from-emerald-50 to-white">
      <div className="text-center p-10 rounded-2xl bg-white/70 backdrop-blur-sm shadow-sm border border-emerald-100 max-w-lg">
        <div className="w-16 h-16 mx-auto mb-8 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center shadow-sm">
          <img src={"/siraj_logo.svg"}></img>
        </div>

        <h1 className="text-xl font-semibold text-emerald-800 mb-3">
          Siraj can not find that  for you
        </h1>
        <div className="space-y-3">
          <Link
            href="/"
            className="inline-block w-full px-6 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-all duration-300 ease-out shadow-sm hover:shadow-md"
          >
            Take Me Home
          </Link>
        </div>
      </div>
    </div>
  );
}
