"use client";

import { useEffect, useState } from "react";
import { authApi, patientProfileApi } from "@/lib/api";
import { User } from "@/types";

interface PatientFormData {
  emergencyContactName: string;
  emergencyContactPhone: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
}

interface UserFormData {
  firstName: string;
  lastName: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
}

export default function PatientProfilePage() {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [patientProfile, setPatientProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingPatient, setIsEditingPatient] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);

  const [patientForm, setPatientForm] = useState<PatientFormData>({
    emergencyContactName: "",
    emergencyContactPhone: "",
    insuranceProvider: "",
    insurancePolicyNumber: "",
  });

  const [userForm, setUserForm] = useState<UserFormData>({
    firstName: "",
    lastName: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const userRes = await authApi.getUser();
      setUserInfo(userRes);
      if (userRes.role !== "patient") {
        throw new Error("Only patients can access this page");
      }
      const patientRes = await patientProfileApi.getPatientProfile();
      setPatientProfile(patientRes.data);
      
      // Set patient form data
      setPatientForm({
        emergencyContactName: patientRes.data.emergencyContactName || "",
        emergencyContactPhone: patientRes.data.emergencyContactPhone || "",
        insuranceProvider: patientRes.data.insuranceProvider || "",
        insurancePolicyNumber: patientRes.data.insurancePolicyNumber || "",
      });

      // Set user form data
      setUserForm({
        firstName: userRes.firstName || "",
        lastName: userRes.lastName || "",
        phone: userRes.phone || "",
        gender: userRes.gender || "",
        dateOfBirth: userRes.dateOfBirth 
          ? new Date(userRes.dateOfBirth).toISOString().split('T')[0] 
          : "",
      });
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePatientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPatientForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUserForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      await patientProfileApi.updatePatientProfile(patientForm);
      await fetchData();
      setIsEditingPatient(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update patient profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      
      // Prepare data for API - remove empty fields and format date
      const updateData: any = {};
      
      if (userForm.firstName.trim()) updateData.firstName = userForm.firstName.trim();
      if (userForm.lastName.trim()) updateData.lastName = userForm.lastName.trim();
      if (userForm.phone.trim()) updateData.phone = userForm.phone.trim();
      if (userForm.gender) updateData.gender = userForm.gender;
      if (userForm.dateOfBirth) {
        // Convert date string to proper Date object for API
        updateData.dateOfBirth = new Date(userForm.dateOfBirth);
      }
      
      console.log("Sending user update data:", updateData);
      
      await authApi.updateUser(updateData);
      await fetchData();
      setIsEditingUser(false);
    } catch (err: any) {
      console.error("User update error:", err);
      setError(err.response?.data?.message || err.message || "Failed to update personal information");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-siraj-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-200 text-red-700 p-4 rounded-lg max-w-2xl mx-auto">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="bg-siraj-white rounded-xl shadow-sm border border-siraj-gray-200 p-6 md:p-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-siraj-gray-100 flex items-center justify-center overflow-hidden border-2 border-siraj-emerald-500/20">
              {userInfo?.avatarUrl ? (
                <img
                  src={userInfo.avatarUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-siraj-emerald-600">
                  {userInfo?.firstName?.charAt(0)}
                  {userInfo?.lastName?.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-siraj-emerald-600">
                {userInfo?.firstName} {userInfo?.lastName}
              </h1>
              <p className="text-siraj-gray-500 mt-1">Patient Profile</p>
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="bg-siraj-gray-50 rounded-lg p-6 border border-siraj-gray-200 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-siraj-emerald-600 flex items-center gap-2">
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
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Personal Information
            </h2>
            
            {!isEditingUser && (
              <button
                onClick={() => setIsEditingUser(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-siraj-emerald-600 text-siraj-white rounded-lg hover:bg-siraj-emerald-700 transition-colors text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Edit
              </button>
            )}
          </div>

          {isEditingUser ? (
            <form onSubmit={handleUserSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-siraj-gray-800">
                    First Name
                  </label>
                  <input
                    name="firstName"
                    value={userForm.firstName}
                    onChange={handleUserChange}
                    className="w-full p-2.5 border border-siraj-gray-300 rounded-lg bg-siraj-white text-siraj-gray-900 focus:ring-2 focus:ring-siraj-emerald-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-siraj-gray-800">
                    Last Name
                  </label>
                  <input
                    name="lastName"
                    value={userForm.lastName}
                    onChange={handleUserChange}
                    className="w-full p-2.5 border border-siraj-gray-300 rounded-lg bg-siraj-white text-siraj-gray-900 focus:ring-2 focus:ring-siraj-emerald-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-siraj-gray-800">
                    Phone
                  </label>
                  <input
                    name="phone"
                    value={userForm.phone}
                    onChange={handleUserChange}
                    className="w-full p-2.5 border border-siraj-gray-300 rounded-lg bg-siraj-white text-siraj-gray-900 focus:ring-2 focus:ring-siraj-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-siraj-gray-800">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={userForm.gender}
                    onChange={handleUserChange}
                    className="w-full p-2.5 border border-siraj-gray-300 rounded-lg bg-siraj-white text-siraj-gray-900 focus:ring-2 focus:ring-siraj-emerald-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-siraj-gray-800">
                    Date of Birth
                  </label>
                  <input
                    name="dateOfBirth"
                    type="date"
                    value={userForm.dateOfBirth}
                    onChange={handleUserChange}
                    className="w-full p-2.5 border border-siraj-gray-300 rounded-lg bg-siraj-white text-siraj-gray-900 focus:ring-2 focus:ring-siraj-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditingUser(false)}
                  className="px-4 py-2 border border-siraj-gray-300 bg-siraj-white hover:bg-siraj-gray-100 text-siraj-gray-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-siraj-emerald-600 text-siraj-white rounded-lg hover:bg-siraj-emerald-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-siraj-gray-600">Email</p>
                <p className="font-medium text-siraj-gray-900">
                  {userInfo?.email || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-siraj-gray-600">Phone</p>
                <p className="font-medium text-siraj-gray-900">
                  {userInfo?.phone || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-siraj-gray-600">
                  Date of Birth
                </p>
                <p className="font-medium text-siraj-gray-900">
                  {userInfo?.dateOfBirth
                    ? new Date(userInfo.dateOfBirth).toLocaleDateString()
                    : "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-siraj-gray-600">
                  Gender
                </p>
                <p className="font-medium text-siraj-gray-900 capitalize">
                  {userInfo?.gender || "Not provided"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Emergency Contact Section */}
        <div className="bg-siraj-gray-50 rounded-lg p-6 border border-siraj-gray-200 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-siraj-emerald-600 flex items-center gap-2">
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
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              Emergency Contact
            </h2>
            
            {!isEditingPatient && (
              <button
                onClick={() => setIsEditingPatient(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-siraj-emerald-600 text-siraj-white rounded-lg hover:bg-siraj-emerald-700 transition-colors text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Edit
              </button>
            )}
          </div>

          {isEditingPatient ? (
            <form onSubmit={handlePatientSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-siraj-gray-800">
                    Emergency Contact Name
                  </label>
                  <input
                    name="emergencyContactName"
                    value={patientForm.emergencyContactName}
                    onChange={handlePatientChange}
                    className="w-full p-2.5 border border-siraj-gray-300 rounded-lg bg-siraj-white text-siraj-gray-900 focus:ring-2 focus:ring-siraj-emerald-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-siraj-gray-800">
                    Emergency Contact Phone
                  </label>
                  <input
                    name="emergencyContactPhone"
                    value={patientForm.emergencyContactPhone}
                    onChange={handlePatientChange}
                    className="w-full p-2.5 border border-siraj-gray-300 rounded-lg bg-siraj-white text-siraj-gray-900 focus:ring-2 focus:ring-siraj-emerald-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-siraj-gray-800">
                    Insurance Provider
                  </label>
                  <input
                    name="insuranceProvider"
                    value={patientForm.insuranceProvider}
                    onChange={handlePatientChange}
                    className="w-full p-2.5 border border-siraj-gray-300 rounded-lg bg-siraj-white text-siraj-gray-900 focus:ring-2 focus:ring-siraj-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-siraj-gray-800">
                    Policy Number
                  </label>
                  <input
                    name="insurancePolicyNumber"
                    value={patientForm.insurancePolicyNumber}
                    onChange={handlePatientChange}
                    className="w-full p-2.5 border border-siraj-gray-300 rounded-lg bg-siraj-white text-siraj-gray-900 focus:ring-2 focus:ring-siraj-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditingPatient(false)}
                  className="px-4 py-2 border border-siraj-gray-300 bg-siraj-white hover:bg-siraj-gray-100 text-siraj-gray-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-siraj-emerald-600 text-siraj-white rounded-lg hover:bg-siraj-emerald-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-siraj-gray-600">
                  Name
                </p>
                <p className="font-medium text-siraj-gray-900">
                  {patientProfile?.emergencyContactName || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-siraj-gray-600">
                  Phone
                </p>
                <p className="font-medium text-siraj-gray-900">
                  {patientProfile?.emergencyContactPhone || "Not provided"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Insurance Section */}
        <div className="bg-siraj-gray-50 rounded-lg p-6 border border-siraj-gray-200">
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
            Insurance Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-siraj-gray-600">
                Provider
              </p>
              <p className="font-medium text-siraj-gray-900">
                {patientProfile?.insuranceProvider || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-siraj-gray-600">
                Policy Number
              </p>
              <p className="font-medium text-siraj-gray-900">
                {patientProfile?.insurancePolicyNumber || "Not provided"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}