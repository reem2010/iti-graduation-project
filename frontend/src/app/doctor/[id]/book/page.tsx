"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doctorAvailabilityApi, authApi } from "@/lib/api";
import { startOfWeek } from "date-fns";

type Slot = {
  startTime: string;
  endTime: string;
};

type DoctorBasic = {
  fullName: string;
  avatarUrl: string | null;
  specialization: string;
  consultationFee?: number;
};

type SlotsByDay = {
  [day: string]: Slot[];
};

function groupSlotsByDay(slots: Slot[]): SlotsByDay {
  return slots.reduce((acc: SlotsByDay, slot) => {
    const day = new Date(slot.startTime).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });

    if (!acc[day]) acc[day] = [];
    acc[day].push(slot);

    return acc;
  }, {});
}

export default function BookingPage() {
  const router = useRouter();
  const { id } = useParams();

  const [slots, setSlots] = useState<Slot[]>([]);
  const [doctor, setDoctor] = useState<DoctorBasic | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchSlotsAndDoctor = async () => {
    try {
      if (!id) return;

      const doctorId = parseInt(id as string, 10);

      const [slotsData, doctorData] = await Promise.all([
        doctorAvailabilityApi.getWeeklySlots(doctorId),
        authApi.getUserById(doctorId),
      ]);

      setSlots(slotsData);
      setDoctor({
        fullName: `${doctorData.firstName} ${doctorData.lastName}`,
        avatarUrl: doctorData.avatarUrl,
        specialization: doctorData.doctorProfile?.specialization || "General",
        consultationFee: doctorData.doctorProfile?.consultationFee || 0,
      });
    } catch (err) {
      console.error("Failed to fetch booking data", err);
    }
  };

  const groupedSlots = groupSlotsByDay(slots);
  const days = Object.keys(groupedSlots);

  const bookAppointment = async () => {
    if (!selectedSlot) return;

    setLoading(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: Number(id),
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
        }),
      });

      if (res.ok) {
        setSuccessMessage("✅ Appointment booked successfully!");
        setSelectedSlot(null);
        setSelectedDay(null);
      } else {
        const err = await res.json();
        alert(`Booking failed: ${err.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlotsAndDoctor();
  }, [id]);

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Book a Session</h1>

      {doctor && (
        <div className="flex items-center gap-4 mb-6 border-b pb-4">
          <img
            src={doctor.avatarUrl || "/default-avatar.png"}
            alt="Doctor avatar"
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h2 className="text-xl font-bold">{doctor.fullName}</h2>
            <p className="text-gray-600">{doctor.specialization}</p>
            <p className="text-gray-800">
              <strong>Fee:</strong> ${doctor.consultationFee?.toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {days.length === 0 ? (
        <p className="text-gray-600">No available slots this week.</p>
      ) : (
        <div className="space-y-6">
          {/* Day dropdown */}
          <div>
            <label className="block font-medium mb-1">Choose a day</label>
            <select
              value={selectedDay || ""}
              onChange={(e) => {
                setSelectedDay(e.target.value);
                setSelectedSlot(null);
              }}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="" disabled>
                -- Select Day --
              </option>
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          {/* Time slots dropdown */}
          {selectedDay && (
            <div>
              <label className="block font-medium mb-1">Choose a time</label>
              <select
                value={selectedSlot?.startTime || ""}
                onChange={(e) => {
                  const slot = groupedSlots[selectedDay!].find(
                    (s) => s.startTime === e.target.value
                  );
                  setSelectedSlot(slot || null);
                }}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="" disabled>
                  -- Select Time Slot --
                </option>
                {groupedSlots[selectedDay].map((slot) => (
                  <option key={slot.startTime} value={slot.startTime}>
                    {new Date(slot.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    -{" "}
                    {new Date(slot.endTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Confirm button */}
          {selectedSlot && (
            <div className="mt-4">
              <button
                onClick={bookAppointment}
                className="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700"
                disabled={loading}
              >
                {loading ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          )}

          {/* Success message */}
          {successMessage && (
            <p className="text-green-600 font-medium mt-4">{successMessage}</p>
          )}
        </div>
      )}
    </div>
  );
}
