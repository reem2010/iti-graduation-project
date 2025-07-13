"use client";
import { authApi } from "@/lib/api";
import { User } from "@/types";
import React, { useEffect, useState } from "react";

export default function PersonalInfo() {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [userEditForm, setUserEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    avatarUrl: "",
    gender: "",
    preferredLanguage: "en",
    timezone: "",
    bio: "",
    isVerified: false,
    isActive: true,
    dateOfBirth: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const user = await authApi.getUser(); 
        setCurrentUser(user);
        setUserInfo(user); 
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            "Failed to load personal info. Please ensure you are logged in."
        );
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (userInfo) {
      setUserEditForm({
        firstName: userInfo.firstName || "",
        lastName: userInfo.lastName || "",
        email: userInfo.email || "",
        phone: userInfo.phone || "",
        avatarUrl: userInfo.avatarUrl || "",
        gender: userInfo.gender || "",
        preferredLanguage: userInfo.preferredLanguage || "en",
        timezone: userInfo.timezone || "",
        bio: userInfo.bio || "",
        isVerified: userInfo.isVerified ?? false,
        isActive: userInfo.isActive ?? true,
        dateOfBirth: userInfo.dateOfBirth
          ? new Date(userInfo.dateOfBirth).toISOString().split("T")[0]
          : "",
      });
    }
  }, [userInfo]);

  const isOwner = currentUser?.id === userInfo?.id;

  const handleUserChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type, checked } = e.target;

    const newValue =
      type === "checkbox"
        ? checked
        : name === "isVerified" || name === "isActive"
        ? Boolean(value)
        : name === "dateOfBirth"
        ? value
        : value;

    setUserEditForm({
      ...userEditForm,
      [name]: newValue,
    });
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const cleanedUserData = {
        firstName: userEditForm.firstName.trim(),
        lastName: userEditForm.lastName.trim(),
        email: userEditForm.email.trim(),
        phone: userEditForm.phone.trim(),
        avatarUrl: userEditForm.avatarUrl.trim() || undefined,
        gender: userEditForm.gender.trim() || undefined,
        preferredLanguage: userEditForm.preferredLanguage.trim(),
        timezone: userEditForm.timezone.trim() || undefined,
        bio: userEditForm.bio.trim() || undefined,
        isVerified: Boolean(userEditForm.isVerified),
        isActive: Boolean(userEditForm.isActive),
        dateOfBirth: userEditForm.dateOfBirth
          ? new Date(userEditForm.dateOfBirth).toISOString()
          : undefined,
      };

      await authApi.updateUser(cleanedUserData);
      setUserInfo((prev) => ({ ...prev!, ...cleanedUserData }));
      setIsEditingUser(false);
    } catch (err: any) {
      console.error("Failed to update user:", err);
      setError(err.response?.data?.message || "Failed to update user.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      setLoading(true);
      await authApi.deleteUser();
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-siraj-white p-6 rounded-xl shadow-sm border border-siraj-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-siraj-emerald-600">Personal Information</h2>
        
        {isOwner && (
          <button
            onClick={() => setIsEditingUser(!isEditingUser)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isEditingUser
                ? "bg-red-100 text-red-600 hover:bg-red-200"
                : "bg-siraj-emerald-600 text-siraj-white hover:bg-siraj-emerald-700"
            }`}
          >
            {isEditingUser ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            )}
            <span className="text-sm font-medium">
              {isEditingUser ? "Cancel" : "Edit Info"}
            </span>
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-100 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {isEditingUser && isOwner ? (
        <form onSubmit={handleUpdateUser} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-siraj-gray-800">First Name</label>
              <input
                name="firstName"
                value={userEditForm.firstName}
                onChange={handleUserChange}
                className="w-full p-2.5 border border-siraj-gray-300 rounded-lg bg-siraj-white text-siraj-gray-900 focus:ring-2 focus:ring-siraj-emerald-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-siraj-gray-800">Last Name</label>
              <input
                name="lastName"
                value={userEditForm.lastName}
                onChange={handleUserChange}
                className="w-full p-2.5 border border-siraj-gray-300 rounded-lg bg-siraj-white text-siraj-gray-900 focus:ring-2 focus:ring-siraj-emerald-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-siraj-gray-800">Email</label>
              <input
                type="email"
                name="email"
                value={userEditForm.email}
                onChange={handleUserChange}
                className="w-full p-2.5 border border-siraj-gray-300 rounded-lg bg-siraj-white text-siraj-gray-900 focus:ring-2 focus:ring-siraj-emerald-500"
                required
                disabled
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-siraj-gray-800">Phone</label>
              <input
                name="phone"
                value={userEditForm.phone || ""}
                onChange={handleUserChange}
                className="w-full p-2.5 border border-siraj-gray-300 rounded-lg bg-siraj-white text-siraj-gray-900 focus:ring-2 focus:ring-siraj-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-siraj-gray-800">Gender</label>
              <select
                name="gender"
                value={userEditForm.gender || ""}
                onChange={handleUserChange}
                className="w-full p-2.5 border border-siraj-gray-300 rounded-lg bg-siraj-white text-siraj-gray-900 focus:ring-2 focus:ring-siraj-emerald-500"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-siraj-gray-800">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={userEditForm.dateOfBirth || ""}
                onChange={handleUserChange}
                className="w-full p-2.5 border border-siraj-gray-300 rounded-lg bg-siraj-white text-siraj-gray-900 focus:ring-2 focus:ring-siraj-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-siraj-gray-800">Preferred Language</label>
              <select
                name="preferredLanguage"
                value={userEditForm.preferredLanguage || "en"}
                onChange={handleUserChange}
                className="w-full p-2.5 border border-siraj-gray-300 rounded-lg bg-siraj-white text-siraj-gray-900 focus:ring-2 focus:ring-siraj-emerald-500"
              >
                <option value="en">English</option>
                <option value="ar">Arabic</option>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-siraj-gray-800">Timezone</label>
              <input
                name="timezone"
                value={userEditForm.timezone || ""}
                onChange={handleUserChange}
                className="w-full p-2.5 border border-siraj-gray-300 rounded-lg bg-siraj-white text-siraj-gray-900 focus:ring-2 focus:ring-siraj-emerald-500"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-siraj-gray-800">Bio</label>
              <textarea
                name="bio"
                value={userEditForm.bio || ""}
                onChange={handleUserChange}
                rows={3}
                className="w-full p-2.5 border border-siraj-gray-300 rounded-lg bg-siraj-white text-siraj-gray-900 focus:ring-2 focus:ring-siraj-emerald-500"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-siraj-emerald-600 text-siraj-white rounded-lg hover:bg-siraj-emerald-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              <span className="text-sm font-medium">Save Changes</span>
            </button>

            <button
              type="button"
              onClick={handleDeleteUser}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
              <span className="text-sm font-medium">Delete Account</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4 p-6 bg-siraj-gray-50 rounded-xl border border-siraj-gray-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-siraj-gray-600">Full Name</p>
              <p className="text-base font-medium text-siraj-gray-900">
                {userInfo?.firstName} {userInfo?.lastName}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-siraj-gray-600">Email</p>
              <p className="text-base font-medium text-siraj-gray-900">
                {userInfo?.email}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-siraj-gray-600">Role</p>
              <p className="text-base font-medium text-siraj-gray-900 capitalize">
                {userInfo?.role}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-siraj-gray-600">Phone</p>
              <p className="text-base font-medium text-siraj-gray-900">
                {userInfo?.phone || "N/A"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-siraj-gray-600">Gender</p>
              <p className="text-base font-medium text-siraj-gray-900 capitalize">
                {userInfo?.gender || "N/A"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-siraj-gray-600">Date of Birth</p>
              <p className="text-base font-medium text-siraj-gray-900">
                {userInfo?.dateOfBirth ? new Date(userInfo.dateOfBirth).toLocaleDateString() : "N/A"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-siraj-gray-600">Language</p>
              <p className="text-base font-medium text-siraj-gray-900">
                {userInfo?.preferredLanguage === "en" ? "English" : 
                 userInfo?.preferredLanguage === "ar" ? "Arabic" : 
                 userInfo?.preferredLanguage === "fr" ? "French" : 
                 userInfo?.preferredLanguage === "es" ? "Spanish" : "N/A"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-siraj-gray-600">Timezone</p>
              <p className="text-base font-medium text-siraj-gray-900">
                {userInfo?.timezone || "N/A"}
              </p>
            </div>

            <div className="space-y-1 md:col-span-2">
              <p className="text-sm font-medium text-siraj-gray-600">Bio</p>
              <p className="text-base font-medium text-siraj-gray-900">
                {userInfo?.bio || "N/A"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-siraj-gray-600">Verified</p>
              <p className="text-base font-medium text-siraj-gray-900">
                {userInfo?.isVerified ? (
                  <span className="text-siraj-emerald-600">Yes</span>
                ) : (
                  <span className="text-red-600">No</span>
                )}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-siraj-gray-600">Status</p>
              <p className="text-base font-medium text-siraj-gray-900">
                {userInfo?.isActive ? (
                  <span className="text-siraj-emerald-600">Active</span>
                ) : (
                  <span className="text-red-600">Inactive</span>
                )}
              </p>
            </div>

            <div className="space-y-1 md:col-span-2">
              <p className="text-sm font-medium text-siraj-gray-600">Last Login</p>
              <p className="text-base font-medium text-siraj-gray-900">
                {userInfo?.lastLogin ? new Date(userInfo.lastLogin).toLocaleString() : "N/A"}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}