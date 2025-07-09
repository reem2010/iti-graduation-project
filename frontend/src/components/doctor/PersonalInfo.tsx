"use client";
import { authApi } from "@/lib/api";
import { User } from "@/types";
import React, { useEffect, useState } from "react";

export default function PersonalInfo() {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null); // 👈 المستخدم اللي عامل تسجيل دخول فعلاً
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
        const user = await authApi.getUser(); // 👈 المستخدم الحالي
        setCurrentUser(user); // 👈 تخزينه علشان نعرف هو صاحب البروفايل ولا لا
        setUserInfo(user); // 👈 لأنك بتعرض معلومات نفس المستخدم هنا
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

  const isOwner = currentUser?.id === userInfo?.id; // 👈 هل المستخدم الحالي هو صاحب البروفايل؟

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
    <section className="bg-indigo-50 p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-indigo-600">
          Personal Information
        </h2>
        {isOwner && (
          <button
            onClick={() => setIsEditingUser(!isEditingUser)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
          >
            {isEditingUser ? "Cancel" : "Edit Info"}
          </button>
        )}
      </div>

      {error && (
        <p className="text-red-500 mb-4 font-medium">{error}</p>
      )}

      {isEditingUser && isOwner ? (
        <form
          onSubmit={handleUpdateUser}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700"
        >
          <input name="firstName" value={userEditForm.firstName} onChange={handleUserChange} className="p-2 border rounded" />
          <input name="lastName" value={userEditForm.lastName} onChange={handleUserChange} className="p-2 border rounded" />
          <input name="phone" value={userEditForm.phone || ""} onChange={handleUserChange} className="p-2 border rounded" />
          <select name="gender" value={userEditForm.gender || ""} onChange={handleUserChange} className="p-2 border rounded">
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <input type="date" name="dateOfBirth" value={userEditForm.dateOfBirth || ""} onChange={handleUserChange} className="p-2 border rounded" />
          <input name="preferredLanguage" value={userEditForm.preferredLanguage || ""} onChange={handleUserChange} className="p-2 border rounded" />
          <input name="timezone" value={userEditForm.timezone || ""} onChange={handleUserChange} className="p-2 border rounded" />
          <textarea name="bio" value={userEditForm.bio || ""} onChange={handleUserChange} className="p-2 border rounded col-span-2" />
          <div className="col-span-2 flex justify-end gap-4 mt-4">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
            <button type="button" onClick={handleDeleteUser} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p><strong>Name:</strong> {userInfo?.firstName} {userInfo?.lastName}</p>
          <p><strong>Email:</strong> {userInfo?.email}</p>
          <p><strong>Role:</strong> {userInfo?.role}</p>
          <p><strong>Phone:</strong> {userInfo?.phone || "N/A"}</p>
          <p><strong>Gender:</strong> {userInfo?.gender || "N/A"}</p>
          <p><strong>Date of Birth:</strong> {userInfo?.dateOfBirth ? new Date(userInfo.dateOfBirth).toLocaleDateString() : "N/A"}</p>
          <p><strong>Language:</strong> {userInfo?.preferredLanguage || "N/A"}</p>
          <p><strong>Timezone:</strong> {userInfo?.timezone || "N/A"}</p>
          <p><strong>Bio:</strong> {userInfo?.bio || "N/A"}</p>
          <p><strong>Verified:</strong> {userInfo?.isVerified ? "Yes" : "No"}</p>
          <p><strong>Active:</strong> {userInfo?.isActive ? "Yes" : "No"}</p>
          <p><strong>Last Login:</strong> {userInfo?.lastLogin ? new Date(userInfo.lastLogin).toLocaleString() : "N/A"}</p>
        </div>
      )}
    </section>
  );
}
