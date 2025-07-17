"use client";

import { useSearchParams } from "next/navigation";

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url");

  if (!url) {
    return (
      <p className="text-center text-red-500 mt-10">No payment URL provided.</p>
    );
  }

  return (
    <div className=" flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Complete Your Payment
      </h1>
      <iframe
        src={url}
        className="w-full max-w-2xl h-[1000px] border-2 border-gray-300 rounded-lg shadow outline-0"
      ></iframe>
    </div>
  );
}
