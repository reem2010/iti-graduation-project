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
    <section className="bg-green-50 p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-green-700">Doctor Profile Details</h2>
        {isOwner && (
          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
          >
            <Edit className="w-4 h-4" />
            <span>{isEditingProfile ? "Cancel" : "Edit Profile"}</span>
          </button>
        )}
      </div>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      {isEditingProfile && isOwner ? (
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={currentProfileForm.title || ""}
              onChange={handleProfileChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">Specialization</label>
            <input
              type="text"
              id="specialization"
              name="specialization"
              value={currentProfileForm.specialization || ""}
              onChange={handleProfileChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700">Years of Experience</label>
            <input
              type="number"
              id="yearsOfExperience"
              name="yearsOfExperience"
              value={currentProfileForm.yearsOfExperience || ""}
              onChange={handleProfileChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              min="0"
              required
            />
          </div>

          <div>
            <label htmlFor="consultationFee" className="block text-sm font-medium text-gray-700">Consultation Fee</label>
            <input
              type="number"
              id="consultationFee"
              name="consultationFee"
              step="0.01"
              value={currentProfileForm.consultationFee || ""}
              onChange={handleProfileChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              min="0"
              required
            />
          </div>

          <div>
            <label htmlFor="languages" className="block text-sm font-medium text-gray-700">Languages (comma-separated)</label>
            <input
              type="text"
              id="languages"
              name="languages"
              value={currentProfileForm.languages?.join(", ") || ""}
              onChange={handleLanguagesChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isAcceptingNewPatients"
              name="isAcceptingNewPatients"
              checked={currentProfileForm.isAcceptingNewPatients || false}
              onChange={handleProfileChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="isAcceptingNewPatients" className="ml-2 block text-sm font-medium text-gray-700">
              Accepting New Patients
            </label>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </form>
      ) : doctorProfile ? (
        <div className="space-y-2 text-gray-700">
          <p><strong className="font-medium">Title:</strong> {doctorProfile.title || "N/A"}</p>
          <p><strong className="font-medium">Specialization:</strong> {doctorProfile.specialization || "N/A"}</p>
          <p><strong className="font-medium">Years of Experience:</strong> {doctorProfile.yearsOfExperience || "N/A"}</p>
          <p><strong className="font-medium">Consultation Fee:</strong> ${doctorProfile.consultationFee || "N/A"}</p>
          <p><strong className="font-medium">Languages:</strong> {doctorProfile.languages?.join(", ") || "N/A"}</p>
          <p><strong className="font-medium">Accepting New Patients:</strong> {doctorProfile.isAcceptingNewPatients ? "Yes" : "No"}</p>
        </div>
      ) : (
        <p className="text-gray-600">Doctor profile not found. Please create one.</p>
      )}
    </section>
  );
}
