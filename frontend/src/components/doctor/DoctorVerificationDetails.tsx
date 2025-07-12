import { doctorVerificationApi } from "@/lib/api";
import { DoctorVerification, UpdateDoctorVerificationDto } from "@/types";
import { Edit, Save, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import FileUploader from "../FileUploader";

export default function DoctorVerificationDetails() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [doctorVerification, setDoctorVerification] =
    useState<DoctorVerification | null>(null);
  const [isEditingVerification, setIsEditingVerification] = useState(false);

  const [currentVerificationForm, setCurrentVerificationForm] =
    useState<UpdateDoctorVerificationDto>({
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
        const verificationRes =
          await doctorVerificationApi.getDoctorVerification();
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
          additionalCertificates: Array.isArray(
            verificationRes?.additionalCertificates
          )
            ? verificationRes.additionalCertificates
            : [],
        });
      } catch (err: any) {
        console.error("Failed to fetch data:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load doctor profile. Please ensure you are logged in and have a doctor profile."
        );
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleVerificationChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
      await doctorVerificationApi.updateDoctorVerification(
        currentVerificationForm
      );
      const refreshedVerification =
        await doctorVerificationApi.getDoctorVerification();
      setDoctorVerification(refreshedVerification);
      setIsEditingVerification(false);
    } catch (err: any) {
      console.error("Failed to update verification:", err);
      setError(
        err.response?.data?.message ||
          "Failed to update verification. Please try again."
      );
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
    <section className="bg-blue-50 p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-blue-700">
          Verification Status
        </h2>
        <button
          onClick={() => setIsEditingVerification(!isEditingVerification)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
        >
          <Edit className="w-4 h-4" />
          <span>{isEditingVerification ? "Cancel" : "Edit Verification"}</span>
        </button>
      </div>

      {isEditingVerification ? (
        <form onSubmit={handleVerificationSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="licenseNumber"
              value={currentVerificationForm.licenseNumber}
              onChange={handleVerificationChange}
              className="p-2 border rounded"
              placeholder="License Number"
            />
            <input
              name="degree"
              value={currentVerificationForm.degree}
              onChange={handleVerificationChange}
              className="p-2 border rounded"
              placeholder="Degree"
            />
            <input
              name="university"
              value={currentVerificationForm.university}
              onChange={handleVerificationChange}
              className="p-2 border rounded"
              placeholder="University"
            />
            <input
              name="graduationYear"
              type="number"
              value={currentVerificationForm.graduationYear}
              onChange={handleVerificationChange}
              className="p-2 border rounded"
              placeholder="Graduation Year"
              min={1900}
              max={new Date().getFullYear()}
            />
            <input
              name="specialization"
              value={currentVerificationForm.specialization}
              onChange={handleVerificationChange}
              className="p-2 border rounded"
              placeholder="Specialization"
            />
          </div>

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

          <div className="space-y-2">
            <FileUploader
              label="Add Certificate"
              onUploadComplete={handleAddCertificate}
              accept=".pdf,image/*"
            />
            {Array.isArray(currentVerificationForm.additionalCertificates) &&
              currentVerificationForm.additionalCertificates.map(
                (cert, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 bg-gray-100 rounded"
                  >
                    <a
                      href={cert}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Certificate {index + 1}
                    </a>
                    <button
                      type="button"
                      onClick={() => handleRemoveCertificate(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )
              )}
          </div>

          <button
            type="submit"
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Save className="w-4 h-4" />
            <span>Save Verification</span>
          </button>

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      ) : doctorVerification ? (
        <div className="space-y-2 text-gray-700">
          <p>
            <strong>License Number:</strong> {doctorVerification.licenseNumber}
          </p>
          <p>
            <strong>Degree:</strong> {doctorVerification.degree}
          </p>
          <p>
            <strong>University:</strong> {doctorVerification.university}
          </p>
          <p>
            <strong>Graduation Year:</strong>{" "}
            {doctorVerification.graduationYear}
          </p>
          <p>
            <strong>Specialization:</strong> {doctorVerification.specialization}
          </p>
          <p>
            <strong>License Photo:</strong>{" "}
            {doctorVerification.licensePhotoUrl ? (
              <a
                href={doctorVerification.licensePhotoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View
              </a>
            ) : (
              "N/A"
            )}
          </p>
          <p>
            <strong>ID Proof:</strong>{" "}
            {doctorVerification.idProofUrl ? (
              <a
                href={doctorVerification.idProofUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View
              </a>
            ) : (
              "N/A"
            )}
          </p>
          <p>
            <strong>CV:</strong>{" "}
            {doctorVerification.cvUrl ? (
              <a
                href={doctorVerification.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View
              </a>
            ) : (
              "N/A"
            )}
          </p>
          <p>
            <strong>Certificates:</strong>
          </p>
          <ul className="list-disc ml-6">
            {Array.isArray(doctorVerification.additionalCertificates) &&
              doctorVerification.additionalCertificates.map((cert, index) => (
                <li key={index}>
                  <a
                    href={cert}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Certificate {index + 1}
                  </a>
                </li>
              ))}
          </ul>
        </div>
      ) : (
        <p className="text-gray-600">No verification data available.</p>
      )}
    </section>
  );
}
