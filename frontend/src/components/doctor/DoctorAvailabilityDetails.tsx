import { doctorAvailabilityApi } from "@/lib/api";
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

  const [currentAvailabilityForm, setCurrentAvailabilityForm] = useState<
    CreateDoctorAvailabilityDto & { id: number | null }
  >({
    id: null,
    dayOfWeek: "",
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
        const availabilityRes =
          await doctorAvailabilityApi.getDoctorAvailabilities();
        setDoctorAvailability(availabilityRes);
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

    if (!dayOfWeek || !startTime || !endTime || !validFrom) {
      setError('All fields are required except "Valid Until".');
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

      const payload = {
        dayOfWeek: dayOfWeek, // Assuming dayOfWeek is already in the correct format
        startTime: isoStartTime,
        endTime: isoEndTime,
        validFrom,
        validUntil: validUntil || undefined,
        isRecurring: true,
      };

      const newAvailability =
        await doctorAvailabilityApi.createDoctorAvailability(payload);
      setDoctorAvailability((prev) => [...prev, newAvailability]);

      setCurrentAvailabilityForm({
        id: null,
        dayOfWeek: "",
        startTime: "",
        endTime: "",
        validFrom: "",
        validUntil: "",
      });

      setIsEditingAvailability(false);
    } catch (err: any) {
      console.error("Error adding availability:", err);
      setError(
        err.response?.data?.message ||
          "Failed to add availability. Please ensure all fields are correct."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditAvailabilityClick = (availability: DoctorAvailability) => {
    setCurrentAvailabilityForm({
      id: availability.id,
      dayOfWeek: availability.dayOfWeek,
      startTime: availability.startTime.substring(0, 5),
      endTime: availability.endTime.substring(0, 5),
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

    if (!dayOfWeek || !startTime || !endTime || !validFrom) {
      setError('All fields are required except "Valid Until".');
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
        dayOfWeek: dayOfWeek, // Assuming dayOfWeek is already in the correct format
        startTime: isoStartTime,
        endTime: isoEndTime,
        validFrom,
        validUntil: validUntil || undefined,
        isRecurring: true,
      });

      setDoctorAvailability((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );

      setCurrentAvailabilityForm({
        id: null,
        dayOfWeek: "",
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
    <>
      <section className="bg-purple-50 p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-purple-700">
            Time Availability
          </h2>
          <button
            onClick={() => {
              setIsEditingAvailability(!isEditingAvailability);
              setCurrentAvailabilityForm({
                id: null,
                dayOfWeek: "",
                startTime: "",
                endTime: "",
                validFrom: "",
                validUntil: "",
              });
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>
              {isEditingAvailability && currentAvailabilityForm.id === null
                ? "Cancel Add"
                : "Add Availability"}
            </span>
          </button>
        </div>

        {isEditingAvailability && (
          <form
            onSubmit={
              currentAvailabilityForm.id
                ? handleUpdateAvailability
                : handleAddAvailability
            }
            className="space-y-4 mb-6 p-4 border border-purple-200 rounded-md bg-purple-100"
          >
            <h3 className="text-xl font-semibold text-purple-800">
              {currentAvailabilityForm.id
                ? "Edit Availability"
                : "Add New Availability"}
            </h3>
            <div>
              <label
                htmlFor="dayOfWeek"
                className="block text-sm font-medium text-gray-700"
              >
                Day of Week
              </label>
              <select
                id="dayOfWeek"
                name="dayOfWeek"
                value={currentAvailabilityForm.dayOfWeek}
                onChange={handleAvailabilityChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                required
              >
                <option value="">Select Day</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="startTime"
                  className="block text-sm font-medium text-gray-700"
                >
                  Start Time
                </label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={currentAvailabilityForm.startTime}
                  onChange={handleAvailabilityChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="endTime"
                  className="block text-sm font-medium text-gray-700"
                >
                  End Time
                </label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={currentAvailabilityForm.endTime}
                  onChange={handleAvailabilityChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="validFrom"
                  className="block text-sm font-medium text-gray-700"
                >
                  Valid From
                </label>
                <input
                  type="date"
                  id="validFrom"
                  name="validFrom"
                  value={currentAvailabilityForm.validFrom}
                  onChange={handleAvailabilityChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="validUntil"
                  className="block text-sm font-medium text-gray-700"
                >
                  Valid Until (Optional)
                </label>
                <input
                  type="date"
                  id="validUntil"
                  name="validUntil"
                  value={currentAvailabilityForm.validUntil || ""}
                  onChange={handleAvailabilityChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-200"
            >
              <Save className="w-4 h-4" />
              <span>
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
                    dayOfWeek: "",
                    startTime: "",
                    endTime: "",
                    validFrom: "",
                    validUntil: "",
                  });
                }}
                className="w-full mt-2 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition duration-200"
              >
                <X className="w-4 h-4" />
                <span>Cancel Edit</span>
              </button>
            )}
          </form>
        )}

        {doctorAvailability.length > 0 ? (
          <div className="space-y-4">
            {doctorAvailability.map((avail) => (
              <div
                key={avail.id}
                className="bg-purple-100 p-4 rounded-md shadow-sm flex justify-between items-center"
              >
                <div>
                  <p>
                    <strong className="font-medium">Day:</strong>{" "}
                    {avail.dayOfWeek}
                  </p>
                  <p>
                    <strong className="font-medium">Time:</strong>{" "}
                    {avail.startTime} - {avail.endTime}
                  </p>
                  <p>
                    <strong className="font-medium">Valid:</strong>{" "}
                    {new Date(avail.validFrom).toLocaleDateString()} -{" "}
                    {avail.validUntil
                      ? new Date(avail.validUntil).toLocaleDateString()
                      : "Ongoing"}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditAvailabilityClick(avail)}
                    className="flex items-center space-x-1 px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-200 text-sm"
                  >
                    <Edit className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteAvailability(avail.id)}
                    className="flex items-center space-x-1 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200 text-sm"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No availability records found.</p>
        )}
      </section>
    </>
  );
}
