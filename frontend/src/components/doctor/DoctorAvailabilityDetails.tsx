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
        const [user, availabilityRes] = await Promise.all([
          authApi.getUser(),
          doctorAvailabilityApi.getDoctorAvailabilities(),
        ]);
        setCurrentUserId(user.id);
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
        dayOfWeek: parseInt(dayOfWeek),
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
        dayOfWeek: parseInt(dayOfWeek),
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
    <section className="bg-card p-6 rounded-xl shadow-sm border border-border">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-primary">
          Time Availability
        </h2>
        
        {isOwner && (
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
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isEditingAvailability && currentAvailabilityForm.id === null
                ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
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
        <div className="mb-6 p-3 bg-destructive/10 border border-destructive rounded-lg text-destructive">
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
          className="mb-8 p-6 bg-background rounded-xl border border-border shadow-sm"
        >
          <h3 className="text-lg font-semibold text-primary mb-4">
            {currentAvailabilityForm.id
              ? "Edit Availability"
              : "Add New Availability"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-1">
              <label
                htmlFor="dayOfWeek"
                className="block text-sm font-medium text-foreground"
              >
                Day of Week
              </label>
              <select
                id="dayOfWeek"
                name="dayOfWeek"
                value={currentAvailabilityForm.dayOfWeek}
                onChange={handleAvailabilityChange}
                className="w-full p-2.5 border border-input rounded-lg bg-card text-foreground focus:ring-2 focus:ring-ring focus:border-ring"
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
                  className="block text-sm font-medium text-foreground"
                >
                  Start Time
                </label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={currentAvailabilityForm.startTime}
                  onChange={handleAvailabilityChange}
                  className="w-full p-2.5 border border-input rounded-lg bg-card text-foreground focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="endTime"
                  className="block text-sm font-medium text-foreground"
                >
                  End Time
                </label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={currentAvailabilityForm.endTime}
                  onChange={handleAvailabilityChange}
                  className="w-full p-2.5 border border-input rounded-lg bg-card text-foreground focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="validFrom"
                className="block text-sm font-medium text-foreground"
              >
                Valid From
              </label>
              <input
                type="date"
                id="validFrom"
                name="validFrom"
                value={currentAvailabilityForm.validFrom}
                onChange={handleAvailabilityChange}
                className="w-full p-2.5 border border-input rounded-lg bg-card text-foreground focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="validUntil"
                className="block text-sm font-medium text-foreground"
              >
                Valid Until (Optional)
              </label>
              <input
                type="date"
                id="validUntil"
                name="validUntil"
                value={currentAvailabilityForm.validUntil || ""}
                onChange={handleAvailabilityChange}
                className="w-full p-2.5 border border-input rounded-lg bg-card text-foreground focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
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
                    dayOfWeek: "",
                    startTime: "",
                    endTime: "",
                    validFrom: "",
                    validUntil: "",
                  });
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-input bg-background hover:bg-accent text-foreground rounded-lg transition-colors"
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
          <div className="text-muted-foreground">Loading availabilities...</div>
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
      className="p-5 bg-background rounded-xl border border-border shadow-sm"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-primary"></span>
            <h4 className="font-medium text-primary">
              {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][avail.dayOfWeek]}
            </h4>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-foreground">Time:</span>
              <span>
                {avail.startTime.substring(11, 16)} - {avail.endTime.substring(11, 16)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-foreground">Valid:</span>
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
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-input bg-background hover:bg-accent text-foreground rounded-lg transition-colors"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => handleDeleteAvailability(avail.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg transition-colors"
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
        <div className="p-6 text-center text-muted-foreground bg-background rounded-xl border border-border">
          No availability records found.
        </div>
      )}
    </section>
  );
}