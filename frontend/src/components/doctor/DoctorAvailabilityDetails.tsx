import { doctorAvailabilityApi, authApi } from "@/lib/api";
import { CreateDoctorAvailabilityDto, DoctorAvailability } from "@/types";
import { Edit, Plus, Save, Trash2, X } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function DoctorAvailabilityDetails() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [doctorAvailability, setDoctorAvailability] = useState<
    DoctorAvailability[]
  >([]);
  const [isEditingAvailability, setIsEditingAvailability] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const [currentAvailabilityForm, setCurrentAvailabilityForm] = useState<
    CreateDoctorAvailabilityDto & { id: number | null }
  >({
    id: null,
    dayOfWeek: 0,
    startTime: "",
    endTime: "",
    validFrom: "",
    validUntil: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const user = await authApi.getUser();
        setCurrentUserId(user.id);
        const availabilityRes = await doctorAvailabilityApi.getDoctorAvailabilitesByDoctorId(user.id);
        setDoctorAvailability(availabilityRes ?? []);
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

  const isOwner = currentUserId !== null;

  const handleAvailabilityChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setCurrentAvailabilityForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { dayOfWeek, startTime, endTime, validFrom, validUntil } =
      currentAvailabilityForm;

      console.log("dayOfWeek:", dayOfWeek);
      console.log("startTime:", startTime);
      console.log("endTime:", endTime);
      console.log("validFrom:", validFrom);
      console.log("validUntil:", validUntil);



    if (startTime >= endTime) {
      setError("Start Time must be before End Time.");
      return;
    }

    if (validUntil && new Date(validFrom) > new Date(validUntil)) {
      setError("Valid Until must be after Valid From.");
      return;
    }

    try {
      setLoading(true);

      const isoStartTime = new Date(
        `${validFrom}T${startTime}:00`
      ).toISOString();
      const isoEndTime = new Date(`${validFrom}T${endTime}:00`).toISOString();

      const payload = {
        dayOfWeek: dayOfWeek, // keep as string
        isRecurring: true,
        startTime: isoStartTime,
        endTime: isoEndTime,
        validFrom,
        validUntil: validUntil || undefined,
      };

      const newAvailability =
        await doctorAvailabilityApi.createDoctorAvailability(payload);
      setDoctorAvailability((prev) => [...prev, newAvailability]);

      setCurrentAvailabilityForm({
        id: null,
        dayOfWeek: 0,
        startTime: "",
        endTime: "",
        validFrom: "",
        validUntil: "",
      });

      setIsEditingAvailability(false);
    } catch (err: any) {
      console.error("Error adding availability:", err);
      setError(err.response?.data?.message || "Failed to add availability.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditAvailabilityClick = (availability: DoctorAvailability) => {
    setCurrentAvailabilityForm({
      id: availability.id,
      dayOfWeek: availability.dayOfWeek,
      startTime: availability.startTime.substring(11, 16),
      endTime: availability.endTime.substring(11, 16),
      validFrom: new Date(availability.validFrom).toISOString().split("T")[0],
      validUntil: availability.validUntil
        ? new Date(availability.validUntil).toISOString().split("T")[0]
        : "",
    });
    setIsEditingAvailability(true);
  };

  const handleUpdateAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { id, dayOfWeek, startTime, endTime, validFrom, validUntil } =
      currentAvailabilityForm;

    if (id === null) {
      setError("Invalid availability ID.");
      return;
    }

    

    if (startTime >= endTime) {
      setError("Start Time must be before End Time.");
      return;
    }

    if (validUntil && new Date(validFrom) > new Date(validUntil)) {
      setError("Valid Until must be after Valid From.");
      return;
    }

    try {
      setLoading(true);

      const isoStartTime = new Date(
        `${validFrom}T${startTime}:00`
      ).toISOString();
      const isoEndTime = new Date(`${validFrom}T${endTime}:00`).toISOString();

      const updated = await doctorAvailabilityApi.updateDoctorAvailability(id, {
        dayOfWeek: dayOfWeek, // keep as string
        startTime: isoStartTime,
        endTime: isoEndTime,
        validFrom,
        validUntil: validUntil || undefined,
      });
      setDoctorAvailability((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );

      setCurrentAvailabilityForm({
        id: null,
        dayOfWeek: 0,
        startTime: "",
        endTime: "",
        validFrom: "",
        validUntil: "",
      });

      setIsEditingAvailability(false);
    } catch (err: any) {
      console.error("Failed to update availability:", err);
      setError(err.response?.data?.message || "Failed to update availability.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAvailability = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await doctorAvailabilityApi.deleteDoctorAvailability(id);
      setDoctorAvailability((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      console.error("Failed to delete availability:", err);
      setError(err.response?.data?.message || "Failed to delete availability.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-siraj-white p-6 rounded-xl shadow-sm border border-siraj-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-siraj-emerald-600">
          Time Availability
        </h2>

        {isOwner && (
          <button
            onClick={() => {
              setIsEditingAvailability(!isEditingAvailability);
              setCurrentAvailabilityForm({
                id: null,
                dayOfWeek: 0,
                startTime: "",
                endTime: "",
                validFrom: "",
                validUntil: "",
              });
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isEditingAvailability && currentAvailabilityForm.id === null
                ? "bg-red-100 text-red-600 hover:bg-red-200"
                : "bg-siraj-emerald-600 text-siraj-white hover:bg-siraj-emerald-700"
            }`}
          >
            {isEditingAvailability && currentAvailabilityForm.id === null ? (
              <X className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {isEditingAvailability && currentAvailabilityForm.id === null
                ? "Cancel"
                : "Add Availability"}
            </span>
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-100 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {isEditingAvailability && (
        <form
          onSubmit={
            currentAvailabilityForm.id
              ? handleUpdateAvailability
              : handleAddAvailability
          }
          className="mb-8 p-6 bg-siraj-gray-50 rounded-xl border border-siraj-gray-200 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-siraj-emerald-600 mb-4">
            {currentAvailabilityForm.id
              ? "Edit Availability"
              : "Add New Availability"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-1">
              <label
                htmlFor="dayOfWeek"
                className="block text-sm font-medium text-siraj-gray-800"
              >
                Day of Week
              </label>
              <select
                id="dayOfWeek"
                name="dayOfWeek"
                value={currentAvailabilityForm.dayOfWeek}
                onChange={handleAvailabilityChange}
                className="w-full p-2.5 border border-siraj-gray-300 rounded-lg bg-siraj-white text-siraj-gray-900 focus:ring-2 focus:ring-siraj-emerald-500 focus:border-siraj-emerald-500"
                required
              >
                <option value="">Select Day</option>
                <option value="0">Sunday</option>
                <option value="1">Monday</option>
                <option value="2">Tuesday</option>
                <option value="3">Wednesday</option>
                <option value="4">Thursday</option>
                <option value="5">Friday</option>
                <option value="6">Saturday</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label
                  htmlFor="startTime"
                  className="block text-sm font-medium text-siraj-gray-800"
                >
                  Start Time
                </label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={currentAvailabilityForm.startTime}
                  onChange={handleAvailabilityChange}
                  className="w-full p-2.5 border border-siraj-gray-300 rounded-lg bg-siraj-white text-siraj-gray-900 focus:ring-2 focus:ring-siraj-emerald-500"
                  required
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="endTime"
                  className="block text-sm font-medium text-siraj-gray-800"
                >
                  End Time
                </label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={currentAvailabilityForm.endTime}
                  onChange={handleAvailabilityChange}
                  className="w-full p-2.5 border border-siraj-gray-300 rounded-lg bg-siraj-white text-siraj-gray-900 focus:ring-2 focus:ring-siraj-emerald-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="validFrom"
                className="block text-sm font-medium text-siraj-gray-800"
              >
                Valid From
              </label>
              <input
                type="date"
                id="validFrom"
                name="validFrom"
                value={currentAvailabilityForm.validFrom}
                onChange={handleAvailabilityChange}
                className="w-full p-2.5 border border-siraj-gray-300 rounded-lg bg-siraj-white text-siraj-gray-900 focus:ring-2 focus:ring-siraj-emerald-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="validUntil"
                className="block text-sm font-medium text-siraj-gray-800"
              >
                Valid Until (Optional)
              </label>
              <input
                type="date"
                id="validUntil"
                name="validUntil"
                value={currentAvailabilityForm.validUntil || ""}
                onChange={handleAvailabilityChange}
                className="w-full p-2.5 border border-siraj-gray-300 rounded-lg bg-siraj-white text-siraj-gray-900 focus:ring-2 focus:ring-siraj-emerald-500"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-siraj-emerald-600 text-siraj-white rounded-lg hover:bg-siraj-emerald-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span className="text-sm font-medium">
                {currentAvailabilityForm.id
                  ? "Update Availability"
                  : "Add Availability"}
              </span>
            </button>

            {currentAvailabilityForm.id && (
              <button
                type="button"
                onClick={() => {
                  setIsEditingAvailability(false);
                  setCurrentAvailabilityForm({
                    id: null,
                    dayOfWeek: 0,
                    startTime: "",
                    endTime: "",
                    validFrom: "",
                    validUntil: "",
                  });
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-siraj-gray-300 bg-siraj-white hover:bg-siraj-gray-100 text-siraj-gray-800 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                <span className="text-sm font-medium">Cancel</span>
              </button>
            )}
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center items-center p-8">
          <div className="text-siraj-gray-500">Loading availabilities...</div>
        </div>
      ) : doctorAvailability.length > 0 ? (
        <div className="space-y-4">
          {doctorAvailability
            .filter(
              (avail) =>
                avail &&
                typeof avail.dayOfWeek === "number" &&
                avail.dayOfWeek >= 0 &&
                avail.dayOfWeek <= 6
            )
            .map((avail) => (
              <div
                key={avail.id}
                className="p-5 bg-siraj-gray-50 rounded-xl border border-siraj-gray-200 shadow-sm"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-siraj-emerald-500"></span>
                      <h4 className="font-medium text-siraj-emerald-600">
                        {
                          [
                            "Sunday",
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                            "Saturday",
                          ][Number(avail.dayOfWeek)]
                        }
                      </h4>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-siraj-gray-600">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-siraj-gray-800">
                          Time:
                        </span>
                        <span>
                          {avail.startTime.substring(11, 16)} -{" "}
                          {avail.endTime.substring(11, 16)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-siraj-gray-800">
                          Valid:
                        </span>
                        <span>
                          {new Date(avail.validFrom).toLocaleDateString()} -{" "}
                          {avail.validUntil
                            ? new Date(avail.validUntil).toLocaleDateString()
                            : "Ongoing"}
                        </span>
                      </div>
                    </div>
                  </div>
                  {isOwner && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditAvailabilityClick(avail)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-siraj-gray-300 bg-siraj-white hover:bg-siraj-gray-100 text-siraj-gray-800 rounded-lg transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteAvailability(avail.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="p-6 text-center text-siraj-gray-500 bg-siraj-gray-50 rounded-xl border border-siraj-gray-200">
          No availability records found.
        </div>
      )}
    </section>
  );
}
