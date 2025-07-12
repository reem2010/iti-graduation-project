"use client";

import { useEffect, useState } from "react";
import { appointmentApi, doctorProfileApi } from "@/lib/api";

interface Appointment {
  id: number;
  doctorName: string;
  startTime: string;
  endTime: string;
  status: string;
  price: number;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const res = await appointmentApi.getMyAppointments();
      setAppointments(res);
    } catch (err) {
      console.error("Failed to load appointments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-center w-full">
      <div className="max-w-3xl w-full mx-auto px-6 py-10 bg-white rounded-3xl shadow-lg">
        <h1 className="text-3xl font-bold text-emerald-700 mb-8 text-center">
          My Appointments
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <p className="text-center text-gray-500">No appointments found.</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="p-4 border-l-4 border-emerald-500 bg-emerald-50 rounded-md shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Dr. {appointment.doctorName}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {new Date(appointment.startTime).toLocaleString()} -{" "}
                      {new Date(appointment.endTime).toLocaleTimeString()}
                    </p>
                    <p className="text-sm text-gray-700">
                      💰 <strong>${appointment.price.toFixed(2)}</strong>
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-emerald-600 text-white">
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
