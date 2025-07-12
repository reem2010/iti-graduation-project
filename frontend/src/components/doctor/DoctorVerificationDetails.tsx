// ✅ DoctorVerificationDetails.tsx
"use client";

import { doctorVerificationApi } from "@/lib/api";
import { DoctorVerification, UpdateDoctorVerificationDto } from "@/types";
import { Edit, Save, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import FileUploader from "../FileUploader";

export default function DoctorVerificationDetails() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [doctorVerification, setDoctorVerification] = useState<DoctorVerification | null>(null);
  const [isEditingVerification, setIsEditingVerification] = useState(false);

  const [currentVerificationForm, setCurrentVerificationForm] = useState<UpdateDoctorVerificationDto>({
    licenseNumber: "",
    licensePhotoUrl: "",
    degree: "",
    university: "",
    graduationYear: 0,
    specialization: "",
    idProofUrl: "",
    cvUrl: "",
    additionalCertificates: [],
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const verificationRes = await doctorVerificationApi.getDoctorVerification();
        setDoctorVerification(verificationRes);
        setCurrentVerificationForm({
          licenseNumber: verificationRes?.licenseNumber || "",
          licensePhotoUrl: verificationRes?.licensePhotoUrl || "",
          degree: verificationRes?.degree || "",
          university: verificationRes?.university || "",
          graduationYear: verificationRes?.graduationYear || 0,
          specialization: verificationRes?.specialization || "",
          idProofUrl: verificationRes?.idProofUrl || "",
          cvUrl: verificationRes?.cvUrl || "",
          additionalCertificates: Array.isArray(verificationRes?.additionalCertificates)
            ? verificationRes.additionalCertificates
            : [],
        });
      } catch (err: any) {
        console.error("Failed to fetch data:", err);
        setError(err.response?.data?.message || "Failed to load doctor profile.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleVerificationChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const newValue = name === "graduationYear" ? parseInt(value) : value;

    setCurrentVerificationForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      await doctorVerificationApi.updateDoctorVerification(currentVerificationForm);
      const refreshedVerification = await doctorVerificationApi.getDoctorVerification();
      setDoctorVerification(refreshedVerification);
      setIsEditingVerification(false);
    } catch (err: any) {
      console.error("Failed to update verification:", err);
      setError(err.response?.data?.message || "Failed to update verification.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (field: string, url: string) => {
    setCurrentVerificationForm((prev) => ({
      ...prev,
      [field]: url,
    }));
  };

  const handleAddCertificate = (url: string) => {
    setCurrentVerificationForm((prev) => ({
      ...prev,
      additionalCertificates: [...(prev.additionalCertificates || []), url],
    }));
  };

  const handleRemoveCertificate = (index: number) => {
    setCurrentVerificationForm((prev) => ({
      ...prev,
      additionalCertificates:
        prev.additionalCertificates?.filter((_, i) => i !== index) || [],
    }));
  };

  return (
    <section className="bg-card p-6 rounded-xl shadow-sm border border-border">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-primary">Verification Status</h2>
        
        <button
          onClick={() => setIsEditingVerification(!isEditingVerification)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            isEditingVerification
              ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          <Edit className="w-4 h-4" />
          <span className="text-sm font-medium">
            {isEditingVerification ? "Cancel" : "Edit Verification"}
          </span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-8">
          <p className="text-muted-foreground">Loading verification data...</p>
        </div>
      ) : error ? (
        <div className="mb-6 p-3 bg-destructive/10 border border-destructive rounded-lg text-destructive">
          {error}
        </div>
      ) : isEditingVerification ? (
        <form onSubmit={handleVerificationSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">License Number</label>
              <input
                name="licenseNumber"
                value={currentVerificationForm.licenseNumber}
                onChange={handleVerificationChange}
                className="w-full p-2.5 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring"
                placeholder="Enter license number"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Degree</label>
              <input
                name="degree"
                value={currentVerificationForm.degree}
                onChange={handleVerificationChange}
                className="w-full p-2.5 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring"
                placeholder="Enter your degree"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">University</label>
              <input
                name="university"
                value={currentVerificationForm.university}
                onChange={handleVerificationChange}
                className="w-full p-2.5 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring"
                placeholder="Enter university name"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Graduation Year</label>
              <input
                name="graduationYear"
                type="number"
                value={currentVerificationForm.graduationYear}
                onChange={handleVerificationChange}
                className="w-full p-2.5 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring"
                placeholder="Enter graduation year"
                min={1900}
                max={new Date().getFullYear()}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-foreground">Specialization</label>
              <input
                name="specialization"
                value={currentVerificationForm.specialization}
                onChange={handleVerificationChange}
                className="w-full p-2.5 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring"
                placeholder="Enter your specialization"
              />
            </div>
          </div>

          <div className="space-y-6">
            <FileUploader 
              label="License Photo" 
              onUploadComplete={(url) => handleFileUpload("licensePhotoUrl", url)} 
              accept="image/*" 
              currentUrl={currentVerificationForm.licensePhotoUrl} 
            />

            <FileUploader 
              label="ID Proof" 
              onUploadComplete={(url) => handleFileUpload("idProofUrl", url)} 
              accept="image/*,.pdf" 
              currentUrl={currentVerificationForm.idProofUrl} 
            />

            <FileUploader 
              label="CV" 
              onUploadComplete={(url) => handleFileUpload("cvUrl", url)} 
              accept=".pdf" 
              currentUrl={currentVerificationForm.cvUrl} 
            />

            <div className="space-y-3">
              <FileUploader 
                label="Add Certificate" 
                onUploadComplete={handleAddCertificate} 
                accept=".pdf,image/*" 
              />
              
              {Array.isArray(currentVerificationForm.additionalCertificates) && 
                currentVerificationForm.additionalCertificates.map((cert, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <a 
                      href={cert} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-primary hover:underline"
                    >
                      Certificate {index + 1}
                    </a>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveCertificate(index)} 
                      className="text-destructive hover:text-destructive/80"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span className="text-sm font-medium">Save Verification</span>
          </button>
        </form>
      ) : doctorVerification ? (
        <div className="space-y-4 p-6 bg-background rounded-xl border border-border shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">License Number</p>
              <p className="text-base font-medium text-foreground">
                {doctorVerification.licenseNumber || "N/A"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Degree</p>
              <p className="text-base font-medium text-foreground">
                {doctorVerification.degree || "N/A"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">University</p>
              <p className="text-base font-medium text-foreground">
                {doctorVerification.university || "N/A"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Graduation Year</p>
              <p className="text-base font-medium text-foreground">
                {doctorVerification.graduationYear || "N/A"}
              </p>
            </div>

            <div className="space-y-1 md:col-span-2">
              <p className="text-sm font-medium text-muted-foreground">Specialization</p>
              <p className="text-base font-medium text-foreground">
                {doctorVerification.specialization || "N/A"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">License Photo</p>
              <p className="text-base font-medium text-foreground">
                {doctorVerification.licensePhotoUrl ? (
                  <a 
                    href={doctorVerification.licensePhotoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary hover:underline"
                  >
                    View License
                  </a>
                ) : "N/A"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">ID Proof</p>
              <p className="text-base font-medium text-foreground">
                {doctorVerification.idProofUrl ? (
                  <a 
                    href={doctorVerification.idProofUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary hover:underline"
                  >
                    View ID Proof
                  </a>
                ) : "N/A"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">CV</p>
              <p className="text-base font-medium text-foreground">
                {doctorVerification.cvUrl ? (
                  <a 
                    href={doctorVerification.cvUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary hover:underline"
                  >
                    View CV
                  </a>
                ) : "N/A"}
              </p>
            </div>

            <div className="space-y-1 md:col-span-2">
              <p className="text-sm font-medium text-muted-foreground">Certificates</p>
              <div className="space-y-2">
                {Array.isArray(doctorVerification.additionalCertificates) && 
                  doctorVerification.additionalCertificates.length > 0 ? (
                  doctorVerification.additionalCertificates.map((cert, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <a 
                        href={cert} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-primary hover:underline"
                      >
                        Certificate {index + 1}
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-foreground">No certificates available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 text-center text-muted-foreground bg-background rounded-xl border border-border">
          No verification data available.
        </div>
      )}
    </section>
  );
}