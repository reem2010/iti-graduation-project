"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { doctorProfileApi } from "@/lib/api";

type Therapist = {
  id: number;
  fullName: string;
  avatarUrl: string | null;
  gender: string | null;
  bio: string | null;
  specialization: string;
  yearsOfExperience: number;
  consultationFee: number;
  languages: string[];
  isAcceptingNewPatients: boolean;
  averageRating: number | null;
};

type Filters = {
  search: string;
  language: string;
  gender: string;
  minExperience: string;
  maxFee: string;
  isAcceptingNewPatients: string;
};

export default function TherapistsPage() {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    language: "",
    gender: "",
    minExperience: "",
    maxFee: "",
    isAcceptingNewPatients: "",
  });

  const router = useRouter();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const fetchTherapists = async () => {
    try {
      const data = await doctorProfileApi.getTherapists(filters);
      setTherapists(data);
    } catch (error) {
      console.error("Failed to fetch therapists", error);
    }
  };

  useEffect(() => {
    fetchTherapists();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto p-6">
      {/* Sidebar Filters */}
      <aside className="w-full lg:w-1/4 bg-white rounded-xl shadow-md p-4 space-y-4 border">
        <h2 className="text-lg font-semibold">Filter Therapists</h2>
        <input
          type="text"
          name="search"
          placeholder="Search by name or specialization"
          value={filters.search}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          name="language"
          placeholder="Language (e.g. en)"
          value={filters.language}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <select
          name="gender"
          value={filters.gender}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          <option value="">Any Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <input
          type="number"
          name="minExperience"
          placeholder="Min Experience"
          value={filters.minExperience}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          name="maxFee"
          placeholder="Max Fee"
          value={filters.maxFee}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <select
          name="isAcceptingNewPatients"
          value={filters.isAcceptingNewPatients}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          <option value="">Accepting New Patients?</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
        <button
          onClick={fetchTherapists}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Apply Filters
        </button>
      </aside>

      <section className="w-full lg:w-3/4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {therapists.map((therapist) => (
          <div
            key={therapist.id}
            onClick={() => router.push(`/doctor/${therapist.id}`)}
            className="border rounded-xl p-4 shadow hover:shadow-lg transition cursor-pointer bg-white"
          >
            <div className="flex items-center gap-4 mb-3">
              <img
                src={therapist.avatarUrl || "/default-avatar.png"}
                alt="Avatar"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h2 className="text-lg font-semibold">{therapist.fullName}</h2>
                <p className="text-sm text-gray-600">
                  {therapist.specialization}
                </p>
              </div>
            </div>
            <p className="text-gray-700 text-sm mb-2 line-clamp-3">
              {therapist.bio}
            </p>
            <p className="text-gray-600 text-sm">
              {therapist.yearsOfExperience} years experience — $
              {Number(therapist.consultationFee).toFixed(2)} fee
            </p>
            <p className="text-sm text-yellow-600 mt-1">
              ⭐{" "}
              {therapist.averageRating !== null
                ? therapist.averageRating.toFixed(1)
                : "No reviews yet"}
            </p>
            <p className="text-sm mt-1">
              Languages: {therapist.languages.join(", ")}
            </p>
            {therapist.isAcceptingNewPatients && (
              <p className="text-green-600 text-sm mt-1">
                Accepting new patients
              </p>
            )}
            <button className="cursor-pointer mt-4 w-full bg-emerald-600 text-white py-1 rounded hover:bg-emerald-700 transition">
              Book Appointment
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
