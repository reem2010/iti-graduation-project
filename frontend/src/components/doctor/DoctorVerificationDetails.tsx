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
          additionalCertificates: verificationRes?.additionalCertificates || [],
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
      const updatedVerification =
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
    <>
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
            <span>
              {isEditingVerification ? "Cancel" : "Edit Verification"}
            </span>
          </button>
        </div>

        {isEditingVerification ? (
          <form onSubmit={handleVerificationSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="licenseNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  License Number
                </label>
                <input
                  type="text"
                  id="licenseNumber"
                  name="licenseNumber"
                  value={currentVerificationForm.licenseNumber || ""}
                  onChange={handleVerificationChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="degree"
                  className="block text-sm font-medium text-gray-700"
                >
                  Degree
                </label>
                <input
                  type="text"
                  id="degree"
                  name="degree"
                  value={currentVerificationForm.degree || ""}
                  onChange={handleVerificationChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="university"
                  className="block text-sm font-medium text-gray-700"
                >
                  University
                </label>
                <input
                  type="text"
                  id="university"
                  name="university"
                  value={currentVerificationForm.university || ""}
                  onChange={handleVerificationChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="graduationYear"
                  className="block text-sm font-medium text-gray-700"
                >
                  Graduation Year
                </label>
                <input
                  type="number"
                  id="graduationYear"
                  name="graduationYear"
                  value={currentVerificationForm.graduationYear || ""}
                  onChange={handleVerificationChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="verificationSpecialization"
                className="block text-sm font-medium text-gray-700"
              >
                Specialization
              </label>
              <input
                type="text"
                id="verificationSpecialization"
                name="specialization"
                value={currentVerificationForm.specialization || ""}
                onChange={handleVerificationChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUploader
                label="License Photo"
                onUploadComplete={(url) =>
                  handleFileUpload("licensePhotoUrl", url)
                }
                accept="image/*"
                currentUrl={currentVerificationForm.licensePhotoUrl}
              />
              <FileUploader
                label="ID Proof"
                onUploadComplete={(url) => handleFileUpload("idProofUrl", url)}
                accept="image/*,.pdf"
                currentUrl={currentVerificationForm.idProofUrl}
              />
            </div>

            <div>
              <FileUploader
                label="CV/Resume"
                onUploadComplete={(url) => handleFileUpload("cvUrl", url)}
                accept=".pdf"
                currentUrl={currentVerificationForm.cvUrl}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Additional Certificates
                </label>
                <div className="flex items-center space-x-2">
                  <FileUploader
                    label="Add Certificate"
                    onUploadComplete={handleAddCertificate}
                    accept=".pdf,image/*"
                  />
                </div>
              </div>

              {currentVerificationForm.additionalCertificates &&
                currentVerificationForm.additionalCertificates.length > 0 && (
                  <div className="space-y-2">
                    {currentVerificationForm.additionalCertificates.map(
                      (cert, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                        >
                          <a
                            href={cert}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm truncate flex-1"
                          >
                            Certificate {index + 1}
                          </a>
                          <button
                            type="button"
                            onClick={() => handleRemoveCertificate(index)}
                            className="ml-2 p-1 text-red-600 hover:text-red-800 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )
                    )}
                  </div>
                )}
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
            >
              <Save className="w-4 h-4" />
              <span>Save Verification</span>
            </button>
          </form>
        ) : doctorVerification ? (
          <div className="space-y-2 text-gray-700">
            <p>
              <strong className="font-medium">License Number:</strong>{" "}
              {doctorVerification.licenseNumber || "N/A"}
            </p>
            <p>
              <strong className="font-medium">License Photo:</strong>
              {doctorVerification.licensePhotoUrl ? (
                <a
                  href={doctorVerification.licensePhotoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View License Photo
                </a>
              ) : (
                "N/A"
              )}
            </p>
            <p>
              <strong className="font-medium">Degree:</strong>{" "}
              {doctorVerification.degree || "N/A"}
            </p>
            <p>
              <strong className="font-medium">University:</strong>{" "}
              {doctorVerification.university || "N/A"}
            </p>
            <p>
              <strong className="font-medium">Graduation Year:</strong>{" "}
              {doctorVerification.graduationYear || "N/A"}
            </p>
            <p>
              <strong className="font-medium">
                Specialization (Verification):
              </strong>{" "}
              {doctorVerification.specialization || "N/A"}
            </p>
            <p>
              <strong className="font-medium">ID Proof:</strong>
              {doctorVerification.idProofUrl ? (
                <a
                  href={doctorVerification.idProofUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View ID Proof
                </a>
              ) : (
                "N/A"
              )}
            </p>
            <p>
              <strong className="font-medium">CV:</strong>
              {doctorVerification.cvUrl ? (
                <a
                  href={doctorVerification.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View CV
                </a>
              ) : (
                "N/A"
              )}
            </p>
            <p>
              <strong className="font-medium">Additional Certificates:</strong>
              {doctorVerification.additionalCertificates &&
              doctorVerification.additionalCertificates.length > 0 ? (
                <div className="ml-4 space-y-1">
                  {doctorVerification.additionalCertificates.map(
                    (cert, index) => (
                      <div key={index}>
                        <a
                          href={cert}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline text-sm"
                        >
                          Certificate {index + 1}
                        </a>
                      </div>
                    )
                  )}
                </div>
              ) : (
                "N/A"
              )}
            </p>
            <p>
              <strong className="font-medium">Status:</strong>
              <span
                className={`ml-2 px-2 py-1 rounded-full text-sm font-semibold ${
                  doctorVerification.status === "approved"
                    ? "bg-green-200 text-green-800"
                    : doctorVerification.status === "pending"
                    ? "bg-yellow-200 text-yellow-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {doctorVerification.status?.toUpperCase() || "N/A"}
              </span>
            </p>
            {doctorVerification.rejectionReason && (
              <p>
                <strong className="font-medium text-red-600">
                  Rejection Reason:
                </strong>{" "}
                {doctorVerification.rejectionReason}
              </p>
            )}
          </div>
        ) : (
          <p className="text-gray-600">No verification data available.</p>
        )}
      </section>
    </>
  );
}
