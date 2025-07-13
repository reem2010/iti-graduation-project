"use client";

import { doctorProfileApi, authApi } from "@/lib/api";
import { DoctorProfile, UpdateDoctorProfileDto, User } from "@/types";
import { Edit, Save } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function DoctorProfileDetails() {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null);
  const [currentProfileForm, setCurrentProfileForm] = useState<UpdateDoctorProfileDto>({
    title: "",
    specialization: "",
    yearsOfExperience: 0,
    consultationFee: 0,
    languages: [],
    isAcceptingNewPatients: true,
  });
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // Fetch user + doctor profile
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const [user, profileRes] = await Promise.all([
          authApi.getUser(),
          doctorProfileApi.getDoctorProfile(),
        ]);

        setCurrentUserId(user.id);
        setDoctorProfile(profileRes);
        setCurrentProfileForm({
          title: profileRes?.title || "",
          specialization: profileRes?.specialization || "",
          yearsOfExperience: profileRes?.yearsOfExperience || 0,
          consultationFee: profileRes?.consultationFee || 0,
          languages: profileRes?.languages || [],
          isAcceptingNewPatients: profileRes?.isAcceptingNewPatients ?? true,
        });
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

  const isOwner = currentUserId === doctorProfile?.userId;

  const handleLanguagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCurrentProfileForm((prev) => ({
      ...prev,
      languages: value
        .split(",")
        .map((lang) => lang.trim())
        .filter((lang) => lang !== ""),
    }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanedForm = {
      ...currentProfileForm,
      consultationFee: Number(currentProfileForm.consultationFee),
      yearsOfExperience: Number(currentProfileForm.yearsOfExperience),
    };

    try {
      setLoading(true);
      await doctorProfileApi.updateDoctorProfile(cleanedForm);
      const refreshedProfile = await doctorProfileApi.getDoctorProfile();
      setDoctorProfile(refreshedProfile);
      setIsEditingProfile(false);
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      setError(
        err.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked } = e.target;
    const newValue =
      type === "checkbox"
        ? checked
        : name === "yearsOfExperience" || name === "consultationFee"
        ? parseFloat(value)
        : value;

    setCurrentProfileForm({
      ...currentProfileForm,
      [name]: newValue,
    });
  };

  return (
    <section className="bg-siraj-white p-6 rounded-xl shadow-sm border border-siraj-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-siraj-emerald-600">Doctor Profile Details</h2>
        
        {isOwner && (
          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isEditingProfile
                ? "bg-red-100 text-red-600 hover:bg-red-200"
                : "bg-siraj-emerald-600 text-siraj-white hover:bg-siraj-emerald-700"
            }`}
          >
            <Edit className="w-4 h-4" />
            <span className="text-sm font-medium">
              {isEditingProfile ? "Cancel" : "Edit Profile"}
            </span>
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-100 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {isEditingProfile && isOwner ? (
        <form onSubmit={handleProfileSubmit} className="space-y-6 p-6 bg-siraj-gray-50 rounded-xl border border-siraj-gray-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-siraj-gray-800">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={currentProfileForm.title || ""}
                onChange={handleProfileChange}
                className="w-full p-2.5 border border-siraj-gray-300 rounded-lg bg-siraj-white text-siraj-gray-900 focus:ring-2 focus:ring-siraj-emerald-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="specialization" className="block text-sm font-medium text-siraj-gray-800">
                Specialization
              </label>
              <input
                type="text"
                id="specialization"
                name="specialization"
                value={currentProfileForm.specialization || ""}
                onChange={handleProfileChange}
                className="w-full p-2.5 border border-siraj-gray-300 rounded-lg bg-siraj-white text-siraj-gray-900 focus:ring-2 focus:ring-siraj-emerald-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-siraj-gray-800">
                Years of Experience
              </label>
              <input
                type="number"
                id="yearsOfExperience"
                name="yearsOfExperience"
                value={currentProfileForm.yearsOfExperience || ""}
                onChange={handleProfileChange}
                className="w-full p-2.5 border border-siraj-gray-300 rounded-lg bg-siraj-white text-siraj-gray-900 focus:ring-2 focus:ring-siraj-emerald-500"
                min="0"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="consultationFee" className="block text-sm font-medium text-siraj-gray-800">
                Consultation Fee
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-siraj-gray-500">$</span>
                <input
                  type="number"
                  id="consultationFee"
                  name="consultationFee"
                  step="0.01"
                  value={currentProfileForm.consultationFee || ""}
                  onChange={handleProfileChange}
                  className="w-full pl-8 p-2.5 border border-siraj-gray-300 rounded-lg bg-siraj-white text-siraj-gray-900 focus:ring-2 focus:ring-siraj-emerald-500"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="languages" className="block text-sm font-medium text-siraj-gray-800">
                Languages (comma-separated)
              </label>
              <input
                type="text"
                id="languages"
                name="languages"
                value={currentProfileForm.languages?.join(", ") || ""}
                onChange={handleLanguagesChange}
                className="w-full p-2.5 border border-siraj-gray-300 rounded-lg bg-siraj-white text-siraj-gray-900 focus:ring-2 focus:ring-siraj-emerald-500"
                required
              />
            </div>

            <div className="flex items-center space-x-3 md:col-span-2">
              <input
                type="checkbox"
                id="isAcceptingNewPatients"
                name="isAcceptingNewPatients"
                checked={currentProfileForm.isAcceptingNewPatients || false}
                onChange={handleProfileChange}
                className="h-5 w-5 text-siraj-emerald-600 border-siraj-gray-300 rounded focus:ring-siraj-emerald-500"
              />
              <label htmlFor="isAcceptingNewPatients" className="text-sm font-medium text-siraj-gray-800">
                Accepting New Patients
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-siraj-emerald-600 text-siraj-white rounded-lg hover:bg-siraj-emerald-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span className="text-sm font-medium">Save Profile</span>
          </button>
        </form>
      ) : doctorProfile ? (
        <div className="space-y-4 p-6 bg-siraj-gray-50 rounded-xl border border-siraj-gray-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-siraj-gray-600">Title</p>
              <p className="text-base font-medium text-siraj-gray-900">
                {doctorProfile.title || "N/A"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-siraj-gray-600">Specialization</p>
              <p className="text-base font-medium text-siraj-gray-900">
                {doctorProfile.specialization || "N/A"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-siraj-gray-600">Years of Experience</p>
              <p className="text-base font-medium text-siraj-gray-900">
                {doctorProfile.yearsOfExperience || "N/A"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-siraj-gray-600">Consultation Fee</p>
              <p className="text-base font-medium text-siraj-gray-900">
                {doctorProfile.consultationFee ? `$${doctorProfile.consultationFee}` : "N/A"}
              </p>
            </div>

            <div className="space-y-1 md:col-span-2">
              <p className="text-sm font-medium text-siraj-gray-600">Languages</p>
              <p className="text-base font-medium text-siraj-gray-900">
                {doctorProfile.languages?.join(", ") || "N/A"}
              </p>
            </div>

            <div className="space-y-1 md:col-span-2">
              <p className="text-sm font-medium text-siraj-gray-600">Accepting New Patients</p>
              <p className="text-base font-medium text-siraj-gray-900">
                {doctorProfile.isAcceptingNewPatients ? (
                  <span className="text-siraj-emerald-600">Yes</span>
                ) : (
                  <span className="text-red-600">No</span>
                )}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 text-center text-siraj-gray-500 bg-siraj-gray-50 rounded-xl border border-siraj-gray-200">
          Doctor profile not found. Please create one.
        </div>
      )}
    </section>
  );
}