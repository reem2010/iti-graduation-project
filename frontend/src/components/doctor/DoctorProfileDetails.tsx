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
    <section className="bg-card p-6 rounded-xl shadow-sm border border-border">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-primary">Doctor Profile Details</h2>
        
        {isOwner && (
          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isEditingProfile
                ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
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
        <div className="mb-6 p-3 bg-destructive/10 border border-destructive rounded-lg text-destructive">
          {error}
        </div>
      )}

      {isEditingProfile && isOwner ? (
        <form onSubmit={handleProfileSubmit} className="space-y-6 p-6 bg-background rounded-xl border border-border shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-foreground">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={currentProfileForm.title || ""}
                onChange={handleProfileChange}
                className="w-full p-2.5 border border-input rounded-lg bg-card text-foreground focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="specialization" className="block text-sm font-medium text-foreground">
                Specialization
              </label>
              <input
                type="text"
                id="specialization"
                name="specialization"
                value={currentProfileForm.specialization || ""}
                onChange={handleProfileChange}
                className="w-full p-2.5 border border-input rounded-lg bg-card text-foreground focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-foreground">
                Years of Experience
              </label>
              <input
                type="number"
                id="yearsOfExperience"
                name="yearsOfExperience"
                value={currentProfileForm.yearsOfExperience || ""}
                onChange={handleProfileChange}
                className="w-full p-2.5 border border-input rounded-lg bg-card text-foreground focus:ring-2 focus:ring-ring"
                min="0"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="consultationFee" className="block text-sm font-medium text-foreground">
                Consultation Fee
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                <input
                  type="number"
                  id="consultationFee"
                  name="consultationFee"
                  step="0.01"
                  value={currentProfileForm.consultationFee || ""}
                  onChange={handleProfileChange}
                  className="w-full pl-8 p-2.5 border border-input rounded-lg bg-card text-foreground focus:ring-2 focus:ring-ring"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="languages" className="block text-sm font-medium text-foreground">
                Languages (comma-separated)
              </label>
              <input
                type="text"
                id="languages"
                name="languages"
                value={currentProfileForm.languages?.join(", ") || ""}
                onChange={handleLanguagesChange}
                className="w-full p-2.5 border border-input rounded-lg bg-card text-foreground focus:ring-2 focus:ring-ring"
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
                className="h-5 w-5 text-primary border-input rounded focus:ring-primary"
              />
              <label htmlFor="isAcceptingNewPatients" className="text-sm font-medium text-foreground">
                Accepting New Patients
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span className="text-sm font-medium">Save Profile</span>
          </button>
        </form>
      ) : doctorProfile ? (
        <div className="space-y-4 p-6 bg-background rounded-xl border border-border shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Title</p>
              <p className="text-base font-medium text-foreground">
                {doctorProfile.title || "N/A"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Specialization</p>
              <p className="text-base font-medium text-foreground">
                {doctorProfile.specialization || "N/A"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Years of Experience</p>
              <p className="text-base font-medium text-foreground">
                {doctorProfile.yearsOfExperience || "N/A"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Consultation Fee</p>
              <p className="text-base font-medium text-foreground">
                {doctorProfile.consultationFee ? `$${doctorProfile.consultationFee}` : "N/A"}
              </p>
            </div>

            <div className="space-y-1 md:col-span-2">
              <p className="text-sm font-medium text-muted-foreground">Languages</p>
              <p className="text-base font-medium text-foreground">
                {doctorProfile.languages?.join(", ") || "N/A"}
              </p>
            </div>

            <div className="space-y-1 md:col-span-2">
              <p className="text-sm font-medium text-muted-foreground">Accepting New Patients</p>
              <p className="text-base font-medium text-foreground">
                {doctorProfile.isAcceptingNewPatients ? (
                  <span className="text-green-600">Yes</span>
                ) : (
                  <span className="text-destructive">No</span>
                )}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 text-center text-muted-foreground bg-background rounded-xl border border-border">
          Doctor profile not found. Please create one.
        </div>
      )}
    </section>
  );
}