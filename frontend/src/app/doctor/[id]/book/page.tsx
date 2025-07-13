"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  appointmentApi,
  doctorAvailabilityApi,
  doctorProfileApi,
} from "@/lib/api";

type Slot = {
  startTime: string;
  endTime: string;
};

type DoctorBasic = {
  fullName: string;
  avatarUrl: string | null;
  specialization: string;
  consultationFee?: number;
  averageRating?: number | null;
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
        doctorProfileApi.getDoctorProfileById(doctorId),
      ]);
      setSlots(slotsData);
      setDoctor({
        fullName: doctorData.fullName,
        avatarUrl: doctorData.avatarUrl,
        specialization: doctorData.specialization || "General",
        consultationFee: doctorData.consultationFee || 0,
        averageRating: doctorData.averageRating,
      });
    } catch (err) {
      console.error("Failed to fetch booking data", err);
    }
  };

  const groupedSlots = groupSlotsByDay(slots);
  const days = Object.keys(groupedSlots);

  const bookAppointment = async () => {
    if (!selectedSlot || !doctor) return;

    setLoading(true);
    try {
      const gatewayId =
        method === "card"
          ? Number(process.env.NEXT_PUBLIC_PAYMOB_CARD_ID)
          : Number(process.env.NEXT_PUBLIC_PAYMOB_WALLET_ID);

      await appointmentApi.createAppointment({
        doctorId: Number(id),
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        price: doctor.consultationFee ?? 0,
        paymentGatewayId: gatewayId,
      });

      setSuccessMessage("✅ Appointment booked successfully!");
      setSelectedSlot(null);
      setSelectedDay(null);
    } catch (err: any) {
      console.error("Booking error:", err);
      alert(
        `Booking failed: ${err?.response?.data?.message || "Unknown error"}`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlotsAndDoctor();
  }, [id]);
  const [method, setMethod] = useState("card");
  return (
    <div className="min-h-screen flex justify-center items-center w-full">
      <div className="max-w-2xl mx-auto px-6 py-10 bg-white rounded-3xl shadow-lg w-[490px]">
        <h1 className="text-3xl font-bold text-emerald-700 mb-8 text-center">
          Book a Therapy Session
        </h1>

        {doctor && (
          <div className="flex items-center gap-5 mb-8 border-b-2 border-emerald-500 pb-4">
            <img
              src={doctor.avatarUrl || "/avatar1.png"}
              alt="Doctor avatar"
              className="w-16 h-16 rounded-full object-cover  "
            />
            <div className="flex justify-between items-start w-full">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {doctor.fullName}
                </h2>
                <p className="text-sm text-gray-500">{doctor.specialization}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-700">
                  <strong>Fee:</strong> $
                  {Number(doctor.consultationFee).toFixed(2)}
                </p>
                {doctor.averageRating !== null && (
                  <p className="text-yellow-600 text-sm mt-1">
                    ⭐ {doctor.averageRating?.toFixed(1)} / 5
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {days.length === 0 ? (
          <p className="text-gray-500 text-center">
            No available slots this week.
          </p>
        ) : (
          <div className="space-y-6">
            {/* Day Selector */}
            <div>
              <label className="block font-medium text-gray-800 mb-1">
                Choose a day
              </label>
              <select
                value={selectedDay || ""}
                onChange={(e) => {
                  setSelectedDay(e.target.value);
                  setSelectedSlot(null);
                }}
                className="w-full border border-emerald-300 px-3 py-2 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
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

            {/* Time Selector */}
            {selectedDay && (
              <div>
                <label className="block font-medium text-gray-800 mb-1">
                  Choose a time
                </label>
                <select
                  value={selectedSlot?.startTime || ""}
                  onChange={(e) => {
                    const slot = groupedSlots[selectedDay!].find(
                      (s) => s.startTime === e.target.value
                    );
                    setSelectedSlot(slot || null);
                  }}
                  className="w-full border border-emerald-300 px-3 py-2 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
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
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Choose Payment Method
              </label>

              <div className="flex flex-col gap-2">
                <label
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${
                    method === "card"
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={method === "card"}
                    onChange={(e) => setMethod(e.target.value)}
                    className="accent-emerald-600"
                  />
                  <span className="text-sm text-gray-800">
                    💳 Credit / Debit Card
                  </span>
                </label>

                <label
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${
                    method === "wallet"
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="wallet"
                    checked={method === "wallet"}
                    onChange={(e) => setMethod(e.target.value)}
                    className="accent-emerald-600"
                  />
                  <span className="text-sm text-gray-800">
                    📱 Mobile Wallet
                  </span>
                </label>
              </div>
            </div>

            {/* Confirm Button */}
            {selectedSlot && (
              <div className="mt-4">
                <button
                  onClick={bookAppointment}
                  className="w-full cursor-pointer bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Booking..." : "Confirm Appointment"}
                </button>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="text-green-600 font-semibold mt-4 text-center">
                {successMessage}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
