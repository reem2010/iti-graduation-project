"use client";

import { useEffect, useState } from "react";
import { appointmentApi } from "@/lib/api";

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  type Appointment = {
    id: string;
    startTime: string;
    endTime: string;
    status: string;
    meetingUrl?: string;
    patient?: {
        user: {
            firstName: string;
            lastName: string;
     }
    };
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await appointmentApi.getDoctorAppointments();
        console.log(data);
        setAppointments(data || []);
      } catch (err) {
        console.error("Failed to fetch appointments", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const cancelAppointment = async (id: string) => {
    try {
      await appointmentApi.cancelAppointment(+id); // implement in your API
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === id ? { ...appt, status: "cancelled" } : appt
        )
      );
    } catch (err) {
      console.error("Failed to cancel appointment", err);
    }
  };

  if (loading) return <p>Loading appointments...</p>;

  return (
    <div className="space-y-4">
      {appointments.length === 0 ? (
        <p className="text-siraj-gray-500">No appointments found.</p>
      ) : (
        appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="border border-siraj-gray-200 rounded-2xl p-4 bg-siraj-gray-50 space-y-2"
          >
            <div className="text-siraj-gray-900 font-semibold">
            {appointment.patient?.user?.firstName} {appointment.patient?.user?.lastName}

            </div>
            <div className="text-siraj-gray-600 text-sm">
              Date: {new Date(appointment.startTime).toLocaleString()} —{" "}
              {new Date(appointment.endTime).toLocaleTimeString()}
            </div>
            <div className="text-siraj-gray-600 text-sm">
              Status: {appointment.status}
            </div>

            <div className="flex gap-3 mt-2">
              {appointment.meetingUrl && appointment.status === "scheduled" && (
                <a
                  href={appointment.meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-siraj-emerald-600 text-white px-3 py-1 rounded hover:bg-siraj-emerald-700 text-sm"
                >
                  Join Zoom Meeting
                </a>
              )}

              {appointment.status === "scheduled" && (
                <button
                  onClick={() => cancelAppointment(appointment.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                >
                  Cancel Appointment
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
