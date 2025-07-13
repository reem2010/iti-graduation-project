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
  const [activeTab, setActiveTab] = useState<'profile' | 'availability' | 'verification'>('profile');

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
    <div className="min-h-screen bg-gradient-to-br from-siraj-gray-50 to-siraj-gray-100">
      {/* Header with background pattern */}
      <div className="relative bg-siraj-white shadow-sm border-b border-siraj-gray-200">
        <div className="absolute inset-0 bg-gradient-to-r from-siraj-emerald-500/5 to-siraj-emerald-300/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-siraj-emerald-500/10 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-siraj-emerald-600">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/>
                  <path d="M12 5L8 21l4-7 4 7-4-16"/>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-siraj-gray-900">
                  Doctor Profile
                </h1>
                <p className="text-siraj-gray-500 mt-1 text-lg">
                  Manage your professional information and availability
                </p>
              </div>
            </div>
            
            {!loading && !error && userInfo?.role === "doctor" && (
              <div className="flex gap-1 bg-siraj-gray-100 p-1.5 rounded-2xl shadow-inner border border-siraj-gray-200">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    activeTab === 'profile' 
                      ? 'bg-siraj-emerald-600 text-siraj-white shadow-lg transform scale-105' 
                      : 'text-siraj-gray-600 hover:bg-siraj-gray-200 hover:text-siraj-gray-900'
                  }`}
                >
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('verification')}
                  className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    activeTab === 'verification' 
                      ? 'bg-siraj-emerald-600 text-siraj-white shadow-lg transform scale-105' 
                      : 'text-siraj-gray-600 hover:bg-siraj-gray-200 hover:text-siraj-gray-900'
                  }`}
                >
                  Verification
                </button>
                <button
                  onClick={() => setActiveTab('availability')}
                  className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    activeTab === 'availability' 
                      ? 'bg-siraj-emerald-600 text-siraj-white shadow-lg transform scale-105' 
                      : 'text-siraj-gray-600 hover:bg-siraj-gray-200 hover:text-siraj-gray-900'
                  }`}
                >
                  Availability
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="bg-siraj-white rounded-3xl shadow-xl border border-siraj-gray-200 p-12">
              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-siraj-gray-200 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-siraj-emerald-500 rounded-full animate-spin"></div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-siraj-gray-900 mb-2">
                    Loading Profile
                  </h3>
                  <p className="text-siraj-gray-500">
                    Please wait while we fetch your information...
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-8">
            <div className="bg-red-100 border border-red-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-200 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-red-700 mb-1">
                    Unable to Load Profile
                  </h4>
                  <p className="text-red-600/80">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Doctor Content */}
        {!loading && !error && userInfo?.role === "doctor" && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Enhanced Personal Info Sidebar - Wider */}
            <div className="lg:col-span-2">
              <div className="bg-siraj-white rounded-3xl shadow-xl border border-siraj-gray-200 p-8 sticky top-8 transition-all duration-300 hover:shadow-2xl">
                <div className="text-center mb-8">
                  <div className="relative inline-block mb-6">
                    <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-siraj-emerald-500 to-siraj-emerald-400 flex items-center justify-center overflow-hidden border-4 border-siraj-white shadow-lg">
                      {userInfo.avatarUrl ? (
                        <img 
                          src={userInfo.avatarUrl} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl font-bold text-siraj-white">
                          {userInfo.firstName?.charAt(0)}{userInfo.lastName?.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-siraj-emerald-600 rounded-full border-4 border-siraj-white flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-siraj-white">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-siraj-gray-900 mb-3">
                    Dr. {userInfo.firstName} {userInfo.lastName}
                  </h2>
                  <p className="text-siraj-gray-500 text-sm bg-siraj-gray-100 rounded-full px-4 py-2 inline-block mb-4">
                    {userInfo.email}
                  </p>
                </div>
                
                <div className="border-t border-siraj-gray-200">
                  <div className="space-y-6">
                    <PersonalInfo />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Main Content Area */}
            <div className="lg:col-span-3 space-y-8">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  <div className="bg-siraj-white rounded-3xl shadow-xl border border-siraj-gray-200 p-8 transition-all duration-300 hover:shadow-2xl">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-siraj-emerald-500/10 rounded-2xl">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-siraj-emerald-600">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-siraj-gray-900">
                          Professional Details
                        </h2>
                        <p className="text-siraj-gray-500 mt-1">
                          Manage your medical credentials and specializations
                        </p>
                      </div>
                    </div>
                    <DoctorProfileDetails />
                  </div>
                  
                  <div className="bg-siraj-white rounded-3xl shadow-xl border border-siraj-gray-200 p-8 transition-all duration-300 hover:shadow-2xl">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-siraj-emerald-500/10 rounded-2xl">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-siraj-emerald-600">
                          <path d="M12 20h9"></path>
                          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-siraj-gray-900">
                          Professional Biography
                        </h2>
                        <p className="text-siraj-gray-500 mt-1">
                          Share your experience and medical journey
                        </p>
                      </div>
                    </div>
                    <div className="bg-siraj-gray-50 rounded-2xl p-6">
                      {userInfo.bio ? (
                        <div className="prose max-w-none">
                          <p className="whitespace-pre-line text-siraj-gray-800 leading-relaxed">
                            {userInfo.bio}
                          </p>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-siraj-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-siraj-gray-400">
                              <path d="M12 20h9"></path>
                              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                            </svg>
                          </div>
                          <p className="text-siraj-gray-500 italic">
                            No biography added yet. Add your professional story to help patients connect with you.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Verification Tab */}
              {activeTab === 'verification' && (
                <div className="bg-siraj-white rounded-3xl shadow-xl border border-siraj-gray-200 p-8 transition-all duration-300 hover:shadow-2xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-siraj-emerald-500/10 rounded-2xl">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-siraj-emerald-600">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-siraj-gray-900">
                        Verification Documents
                      </h2>
                      <p className="text-siraj-gray-500 mt-1">
                        Upload and manage your professional certifications
                      </p>
                    </div>
                  </div>
                  <DoctorVerificationDetails />
                </div>
              )}
              
              {/* Availability Tab */}
              {activeTab === 'availability' && (
                <div className="bg-siraj-white rounded-3xl shadow-xl border border-siraj-gray-200 p-8 transition-all duration-300 hover:shadow-2xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-siraj-emerald-500/10 rounded-2xl">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-siraj-emerald-600">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-siraj-gray-900">
                        Availability Schedule
                      </h2>
                      <p className="text-siraj-gray-500 mt-1">
                        Set your working hours and appointment availability
                      </p>
                    </div>
                  </div>
                  <DoctorAvailabilityDetails />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Enhanced Non-Doctor Content */}
        {!loading && !error && userInfo?.role !== "doctor" && (
          <div className="flex items-center justify-center min-h-[500px]">
            <div className="bg-siraj-white rounded-3xl shadow-xl border border-siraj-gray-200 p-12 text-center max-w-lg mx-auto">
              <div className="relative mb-8">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-siraj-emerald-500 to-siraj-emerald-400 rounded-3xl flex items-center justify-center text-siraj-white shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full border-4 border-siraj-white flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-siraj-white">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-siraj-gray-900 mb-3">
                Hello {userInfo?.firstName || "there"}! 👋
              </h2>
              <p className="text-siraj-gray-500 mb-8 text-lg leading-relaxed">
                This section is exclusively for <span className="font-semibold text-siraj-emerald-600">verified doctors</span> to manage their professional profiles and patient appointments.
              </p>
              
              <div className="bg-siraj-gray-50 rounded-2xl p-6 mb-8">
                <h3 className="font-semibold text-siraj-gray-900 mb-2">Need Help?</h3>
                <p className="text-siraj-gray-500 text-sm">
                  Contact our support team if you're a doctor and need access to this section.
                </p>
              </div>
              
              <button className="px-8 py-4 bg-gradient-to-r from-siraj-emerald-500 to-siraj-emerald-400 text-siraj-white rounded-2xl hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center gap-3 font-semibold">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                Contact Support
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}