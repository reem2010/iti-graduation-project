"use client";

import { useEffect, useState } from "react";
import { appointmentApi, doctorProfileApi } from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link";

interface Appointment {
  id: number;
  doctorName: string;
  startTime: string;
  endTime: string;
  status: string;
  doctorId:number;
  meetingUrl:string;
  price: string | number; // Fix for toFixed error
  doctorProfile: {
    title: string;
    specialization: string;
    user: {
      firstName: string;
      lastName: string;
    };
  };
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal,setShowModal]=useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);


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


const confirmCancel=(id:number)=>{
  setSelectedAppointmentId(id);
  setShowModal(true);
}
const cancelAppointment = async (id: number) => {
    if (!selectedAppointmentId) return;

  try {
    await appointmentApi.cancelAppointment(selectedAppointmentId, "Cancelled by user");
    toast.success("Appointment cancelled");
    fetchAppointments();
  } catch (err) {
    console.error("Cancel failed", err);
    toast.error("Failed to cancel appointment");
  } finally {
    setShowModal(false);
    setSelectedAppointmentId(null);
  }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);
console.log("Appointments:", appointments);

  return (
    <div className="min-h-screen flex justify-center items-center w-full">
      <div className="max-w-3xl w-full mx-auto px-6 py-10 bg-white rounded-3xl shadow-lg">
        <h1 className="text-3xl font-bold text-emerald-700 mb-8 text-center">
          My Appointments
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading appointments...</p>
        ) : !Array.isArray(appointments) || appointments.length === 0 ?  (
          <p className="text-center text-gray-500">No appointments found.</p>
        ) : (
          <div className="space-y-4">
            {appointments.filter((appointment) => appointment.status.toLowerCase() !== "cancelled").map((appointment) => (
              <div
                key={appointment.id}
                className="p-4 border-l-4 border-emerald-500 bg-emerald-50 rounded-md shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <Link href={`/doctor/${appointment.doctorId}`}>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {appointment.doctorProfile?.title}{" "}
                      {appointment.doctorProfile?.user?.firstName}{" "}
                      {appointment.doctorProfile?.user?.lastName}
                    </h2>
                    </Link>
                    <p className="text-sm text-gray-600">
                      {new Date(appointment.startTime).toLocaleString()} -{" "}
                      {new Date(appointment.endTime).toLocaleTimeString()}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>${Number(appointment.price).toFixed(2)}</strong>
                    </p>
                  </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium text-white ${
                    appointment.status.toLowerCase() === "scheduled"
                      ? "bg-emerald-600"
                      : appointment.status.toLowerCase() === "cancelled"
                      ? "bg-red-500"
                      : "bg-gray-500"
                  }`}
                  >
                    {appointment.status}
                </span>
                </div>
              {appointment.status.toLowerCase() !== "canceled" && (
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => confirmCancel(appointment.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => window.open(appointment.meetingUrl, "_blank") }
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-md text-sm transition"
                  >
                    Zoom Link
                  </button>
                </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Confirm Cancellation
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Are you sure you want to cancel this appointment?
      </p>
      <div className="flex justify-end gap-3">
        <button
          onClick={() => {
            setShowModal(false);
            setSelectedAppointmentId(null);
          }}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={()=>selectedAppointmentId && cancelAppointment(selectedAppointmentId)}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
)}
  </div>
  );
}


