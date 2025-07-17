"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DoctorVerification, DoctorAvailability, User } from "@/types";
import {
  doctorVerificationApi,
  doctorAvailabilityApi,
  authApi,
} from "@/lib/api";
import { useAuth } from "@/contexts/authContext";

export default function PublicDoctorProfilePage() {
  const { id } = useParams();
  const doctorId = parseInt(id as string);
  const { user } = useAuth();

  const [verification, setVerification] = useState<DoctorVerification | null>(
    null
  );
  const [availability, setAvailability] = useState<DoctorAvailability[]>([]);
  const [doctorUser, setDoctorUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    async function fetchDoctorData() {
      try {
        setLoading(true);
        setError(null);

        const [verificationRes, availabilityRes, userRes] = await Promise.all([
          doctorVerificationApi.getDoctorVerificationByDoctorId(doctorId),
          doctorAvailabilityApi.getDoctorAvailabilitesByDoctorId(doctorId),
          authApi.getUserById(doctorId),
        ]);

        setVerification(verificationRes);
        setAvailability(availabilityRes ?? []);
        setDoctorUser(userRes);
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Failed to load doctor profile."
        );
      } finally {
        setLoading(false);
      }
    }

    if (!isNaN(doctorId)) fetchDoctorData();
  }, [doctorId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-siraj-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-200 text-red-700 p-4 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  if (!verification) {
    return (
      <div className="text-center p-8 text-siraj-gray-500">
        <p>Doctor verification not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="bg-siraj-white rounded-xl shadow-sm border border-siraj-gray-200 p-6 md:p-8">
        {/* Doctor Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-siraj-gray-100 flex items-center justify-center overflow-hidden border-2 border-siraj-emerald-500/20">
            {doctorUser?.avatarUrl ? (
              <img
                src={doctorUser.avatarUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl font-bold text-siraj-emerald-600">
                {doctorUser?.firstName?.charAt(0)}
                {doctorUser?.lastName?.charAt(0)}
              </span>
            )}
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-siraj-emerald-600">
              Dr. {doctorUser?.firstName} {doctorUser?.lastName}
            </h1>
            <p className="text-siraj-gray-500 mt-1">
              {verification.specialization || "Medical Professional"}
            </p>
          </div>

          <div className="ml-auto">
            <button
              onClick={() => router.push(`/chat?with=${doctorUser?.id}`)}
              className="px-4 py-2 bg-siraj-emerald-600 text-white rounded-lg hover:bg-siraj-emerald-700 transition-colors"
            >
              Send message
            </button>
          </div>
        </div>

        {/* Verification Details */}
        <div className="space-y-6">
          <section className="bg-siraj-gray-50 rounded-lg p-6 border border-siraj-gray-200">
            <h2 className="text-xl font-bold text-siraj-emerald-600 mb-4 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              Professional Verification
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-siraj-gray-900">
              <div>
                <p className="text-sm font-medium text-siraj-gray-600">
                  License Number
                </p>
                <p className="font-medium">
                  {verification.licenseNumber || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-siraj-gray-600">
                  Degree
                </p>
                <p className="font-medium">{verification.degree || "N/A"}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-siraj-gray-600">
                  University
                </p>
                <p className="font-medium">
                  {verification.university || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-siraj-gray-600">
                  Graduation Year
                </p>
                <p className="font-medium">
                  {verification.graduationYear || "N/A"}
                </p>
              </div>

              <div className="md:col-span-2">
                <p className="text-sm font-medium text-siraj-gray-600">
                  Specialization
                </p>
                <p className="font-medium">
                  {verification.specialization || "N/A"}
                </p>
              </div>
            </div>

            {/* Documents Section */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-siraj-emerald-600 mb-3">
                Documents
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {verification.licensePhotoUrl && (
                  <a
                    href={verification.licensePhotoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-siraj-gray-100 rounded-lg hover:bg-siraj-gray-200 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                      ></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                    <span>License Photo</span>
                  </a>
                )}

                {verification.idProofUrl && (
                  <a
                    href={verification.idProofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-siraj-gray-100 rounded-lg hover:bg-siraj-gray-200 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    <span>ID Proof</span>
                  </a>
                )}

                {verification.cvUrl && (
                  <a
                    href={verification.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-siraj-gray-100 rounded-lg hover:bg-siraj-gray-200 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    <span>Curriculum Vitae</span>
                  </a>
                )}
              </div>

              {verification.additionalCertificates &&
                verification.additionalCertificates.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-md font-medium text-siraj-emerald-600 mb-2">
                      Additional Certificates
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {verification.additionalCertificates.map(
                        (cert: string, index: number) => (
                          <a
                            key={index}
                            href={cert}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 bg-siraj-gray-100 rounded-lg hover:bg-siraj-gray-200 transition-colors"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                              <polyline points="14 2 14 8 20 8"></polyline>
                            </svg>
                            <span>Certificate {index + 1}</span>
                          </a>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
          </section>

          {/* Availability Section */}
          {availability.length > 0 && (
            <section className="bg-siraj-gray-50 rounded-lg p-6 border border-siraj-gray-200">
              <h2 className="text-xl font-bold text-siraj-emerald-600 mb-4 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Availability Schedule
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availability.map((slot, idx) => (
                  <div
                    key={idx}
                    className="bg-siraj-white p-4 rounded-lg border border-siraj-gray-200"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-3 h-3 rounded-full bg-siraj-emerald-500"></span>
                      <h3 className="font-medium text-siraj-emerald-600">
                        {
                          [
                            "Sunday",
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                            "Saturday",
                          ][Number(slot.dayOfWeek)]
                        }
                      </h3>
                    </div>
                    <p className="text-siraj-gray-900">
                      {slot.startTime.substring(11, 16)} -{" "}
                      {slot.endTime.substring(11, 16)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
