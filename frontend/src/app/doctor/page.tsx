"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { doctorProfileApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function TherapistsPage() {
  const [therapists, setTherapists] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    search: "",
    language: "",
    gender: "",
    minExperience: "",
    maxFee: "",
    isAcceptingNewPatients: "",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 6;

  const router = useRouter();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const fetchTherapists = async () => {
    try {
      const data = await doctorProfileApi.getTherapists({
        ...filters,
        page: page.toString(),
        limit: LIMIT.toString(),
      });
      setTherapists(data.therapists);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to fetch therapists", error);
    }
  };

  useEffect(() => {
    fetchTherapists();
  }, [page]);

  const handleApplyFilters = () => {
    setPage(1);
    fetchTherapists();
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto px-4 py-12">
      {/* Sidebar Filters */}
      <aside className="w-full h-fit md:w-1/3 lg:w-1/4 bg-white rounded-2xl shadow-md p-6 space-y-4 border border-emerald-100">
        <h2 className="text-lg font-semibold text-emerald-800">
          Filter Therapists
        </h2>
        <Input
          type="text"
          name="search"
          placeholder="Search by name or specialization"
          value={filters.search}
          onChange={handleChange}
        />
        <Input
          type="text"
          name="language"
          placeholder="Language (e.g. en)"
          value={filters.language}
          onChange={handleChange}
        />
        <select
          name="gender"
          value={filters.gender}
          onChange={handleChange}
          className="border border-emerald-200 rounded px-3 py-2 w-full text-gray-700"
        >
          <option value="">Any Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <Input
          type="number"
          name="minExperience"
          placeholder="Min Experience"
          value={filters.minExperience}
          onChange={handleChange}
        />
        <Input
          type="number"
          name="maxFee"
          placeholder="Max Fee"
          value={filters.maxFee}
          onChange={handleChange}
        />
        <select
          name="isAcceptingNewPatients"
          value={filters.isAcceptingNewPatients}
          onChange={handleChange}
          className="border border-emerald-200 rounded px-3 py-2 w-full text-gray-700"
        >
          <option value="">Accepting New Patients?</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
        <Button
          onClick={handleApplyFilters}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          Apply Filters
        </Button>
      </aside>

      {/* Therapist Cards */}
      <section className="w-full md:w-2/3 lg:w-3/4 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {therapists.map((therapist: any) => (
            <Card
              key={therapist.id}
              className="cursor-pointer border border-emerald-100 hover:shadow-lg transition-shadow duration-300 h-[420px] flex flex-col justify-center"
              onClick={() => router.push(`/doctor/${therapist.id}`)}
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-4">
                  <img
                    src={therapist.avatarUrl || "/avatar.png"}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {therapist.fullName}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {therapist.specialization}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm line-clamp-3">
                  {therapist.bio}
                </p>
                <p className="text-gray-600 text-sm">
                  {therapist.yearsOfExperience} years experience — $
                  {Number(therapist.consultationFee)?.toFixed(2)} fee
                </p>
                <p className="text-sm text-yellow-600">
                  ⭐{" "}
                  {therapist.averageRating
                    ? therapist.averageRating.toFixed(1)
                    : "No reviews yet"}
                </p>
                <p className="text-sm">
                  Languages: {therapist.languages?.join(", ")}
                </p>
                {therapist.isAcceptingNewPatients && (
                  <p className="text-green-600 text-sm">
                    Accepting new patients
                  </p>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevent card click event
                    router.push(`/doctor/${therapist.id}/book`);
                  }}
                  className="w-full cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white text-center px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Book Appointment
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/chat?with=${therapist.id}`);
                  }}
                  className="w-full cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white text-center px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Send message
                </button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-4">
            <Button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="bg-emerald-600 text-white"
            >
              Prev
            </Button>
            <span className="text-gray-700">
              Page {page} of {totalPages}
            </span>
            <Button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="bg-emerald-600 text-white"
            >
              Next
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
