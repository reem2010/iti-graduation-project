"use client";

import { useEffect } from "react";
import { appointmentApi} from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";


export default function PaymentPage() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url");
  const router = useRouter();
  const appointmentId = searchParams.get("appointmentId");

  useEffect(() => {
  if (!appointmentId) return;

  const interval = setInterval(async () => {
    const res = await appointmentApi.getPaymentStatus(Number(appointmentId));
    if (res?.data?.isPaymentCompleted) {
      toast.success("Payment successful!");
      clearInterval(interval);
      router.replace("/appointments");
    }
  }, 5000);

  return () => clearInterval(interval);
}, [appointmentId,router]);


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
