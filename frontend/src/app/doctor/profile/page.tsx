"use client";

import { useState, useEffect } from "react";
import DoctorProfileDetails from "@/components/doctor/DoctorProfileDetails";
import DoctorVerificationDetails from "@/components/doctor/DoctorVerificationDetails";
import PersonalInfo from "@/components/doctor/PersonalInfo";
import DoctorAvailabilityDetails from "@/components/doctor/DoctorAvailabilityDetails";
import { authApi } from "@/lib/api";
import { User } from "@/types";

export default function DoctorProfilePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<User | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const user = await authApi.getUser();
        setUserInfo(user);
      } catch (err: any) {
        console.error("Failed to fetch data:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load doctor profile. Please ensure you are logged in."
        );
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8 space-y-8">
        <h1 className="text-4xl font-bold text-center text-indigo-700 mb-8">
          Doctor Profile
        </h1>

        {loading && (
          <div className="flex items-center justify-center min-h-[100px]">
            <div className="text-xl font-semibold text-gray-700">
              Loading doctor profile...
            </div>
          </div>
        )}

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {!loading && !error && userInfo?.role === "doctor" && (
          <>
            <PersonalInfo  />
            <DoctorProfileDetails  />
            <DoctorVerificationDetails  />
            <DoctorAvailabilityDetails  />
          </>
        )}

        {!loading && !error && userInfo?.role !== "doctor" && (
          <div className="text-center text-gray-600 text-lg py-10">
            <p className="mb-4">
              Hello {userInfo?.firstName || "there"}, this section is for doctors only.
            </p>
            <p className="text-gray-500">
              If you're a doctor and need to set up your profile, please contact support or switch to a doctor account.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
