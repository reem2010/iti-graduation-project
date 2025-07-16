// app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "@/lib/api";

export default function AdminDashboard() {
    const router = useRouter();
    const [doctors, setDoctors] = useState<any[]>([]);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [appointments, setAppointments] = useState<any[]>([]);

    // Separate filters for each section
    const [doctorFilters, setDoctorFilters] = useState({
        isVerified: undefined as boolean | undefined,
        isActive: undefined as boolean | undefined,
    });

    const [transactionFilters, setTransactionFilters] = useState({
        status: undefined as string | undefined,
    });

    const [appointmentFilters, setAppointmentFilters] = useState({
        status: undefined as string | undefined,
    });

    // Separate pagination for each section
    const [doctorPagination, setDoctorPagination] = useState({
        skip: 0,
        take: 10,
        total: 0,
    });

    const [transactionPagination, setTransactionPagination] = useState({
        skip: 0,
        take: 5,
        total: 0,
    });

    const [appointmentPagination, setAppointmentPagination] = useState({
        skip: 0,
        take: 5,
        total: 0,
    });

    const [loading, setLoading] = useState({
        doctors: true,
        transactions: true,
        appointments: true,
    });

    useEffect(() => {
        const userJson = localStorage.getItem("user");
        if (!userJson) {
            router.push("/auth");
            return;
        }
        const user = JSON.parse(userJson);
        if (user.role !== "admin") {
            router.push("/");
            return;
        }

        fetchDoctors();
        fetchTransactions();
        fetchAppointments();
    }, [router]);

    // Fetch data functions with their own dependencies
    const fetchDoctors = async () => {
        try {
            setLoading(prev => ({ ...prev, doctors: true }));
            const res = await adminApi.getDoctors({
                skip: doctorPagination.skip,
                take: doctorPagination.take,
                isVerified: doctorFilters.isVerified,
                isActive: doctorFilters.isActive,
            });
            setDoctors(res.data);
            setDoctorPagination(prev => ({ ...prev, total: res.total || 0 }));
        } catch (err) {
            console.error("Error fetching doctors", err);
        } finally {
            setLoading(prev => ({ ...prev, doctors: false }));
        }
    };

    const fetchTransactions = async () => {
        try {
            setLoading(prev => ({ ...prev, transactions: true }));
            const res = await adminApi.getTransactions({
                skip: transactionPagination.skip,
                take: transactionPagination.take,
                status: transactionFilters.status,
            });
            setTransactions(res.data);
            setTransactionPagination(prev => ({ ...prev, total: res.total || 0 }));
        } catch (err) {
            console.error("Error fetching transactions", err);
        } finally {
            setLoading(prev => ({ ...prev, transactions: false }));
        }
    };

    const fetchAppointments = async () => {
        try {
            setLoading(prev => ({ ...prev, appointments: true }));
            const res = await adminApi.getAppointments({
                skip: appointmentPagination.skip,
                take: appointmentPagination.take,
                status: appointmentFilters.status,
            });
            setAppointments(res.data);
            setAppointmentPagination(prev => ({ ...prev, total: res.total || 0 }));
        } catch (err) {
            console.error("Error fetching appointments", err);
        } finally {
            setLoading(prev => ({ ...prev, appointments: false }));
        }
    };

    // Effect for doctors
    useEffect(() => {
        fetchDoctors();
    }, [doctorFilters, doctorPagination.skip, doctorPagination.take]);

    // Effect for transactions
    useEffect(() => {
        fetchTransactions();
    }, [transactionFilters, transactionPagination.skip, transactionPagination.take]);

    // Effect for appointments
    useEffect(() => {
        fetchAppointments();
    }, [appointmentFilters, appointmentPagination.skip, appointmentPagination.take]);

    const updateDoctorStatus = async (doctorId: number, update: { isVerified?: boolean; isActive?: boolean }) => {
        try {
            await adminApi.updateDoctorStatus(doctorId, update);
            fetchDoctors();
        } catch (err) {
            console.error("Error updating doctor status", err);
        }
    };

    const handleDoctorFilterChange = (key: keyof typeof doctorFilters, value: boolean | undefined) => {
        setDoctorFilters(prev => ({ ...prev, [key]: value }));
        setDoctorPagination(prev => ({ ...prev, skip: 0 })); // Reset to first page when filters change
    };

    const handleTransactionFilterChange = (value: string | undefined) => {
        setTransactionFilters(prev => ({ ...prev, status: value }));
        setTransactionPagination(prev => ({ ...prev, skip: 0 }));
    };

    const handleAppointmentFilterChange = (value: string | undefined) => {
        setAppointmentFilters(prev => ({ ...prev, status: value }));
        setAppointmentPagination(prev => ({ ...prev, skip: 0 }));
    };

    const allLoading = loading.doctors && loading.transactions && loading.appointments;

    if (allLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600 mb-4"></div>
                    <p className="text-lg font-medium text-green-800">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-green-900 mb-2">Admin Dashboard</h1>
                    <p className="text-green-700">Manage doctors, transactions, and appointments</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Doctors Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-xl border border-green-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
                                <h2 className="text-2xl font-bold text-white flex items-center">
                                    <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Doctors Management
                                </h2>
                            </div>

                            <div className="p-6">
                                {/* Filters */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-green-700 mb-2">Verification Status</label>
                                        <select
                                            className="w-full px-4 py-3 rounded-lg border border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 bg-white"
                                            value={doctorFilters.isVerified?.toString() ?? ""}
                                            onChange={(e) => handleDoctorFilterChange("isVerified", e.target.value === "" ? undefined : e.target.value === "true")}
                                        >
                                            <option value="">All Verification</option>
                                            <option value="true">Verified</option>
                                            <option value="false">Unverified</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-green-700 mb-2">Active Status</label>
                                        <select
                                            className="w-full px-4 py-3 rounded-lg border border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 bg-white"
                                            value={doctorFilters.isActive?.toString() ?? ""}
                                            onChange={(e) => handleDoctorFilterChange("isActive", e.target.value === "" ? undefined : e.target.value === "true")}
                                        >
                                            <option value="">All Status</option>
                                            <option value="true">Active</option>
                                            <option value="false">Inactive</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Doctors List */}
                                {loading.doctors ? (
                                    <div className="flex justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-green-200 border-t-green-600"></div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-3">
                                            {doctors.map((doc) => (
                                                <div key={doc.id} className="bg-green-50 rounded-xl p-4 hover:bg-green-100 transition-all duration-200 border border-green-100">
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                        <div className="flex-1">
                                                            <h3 className="font-semibold text-green-900 text-lg">
                                                                {doc.firstName} {doc.lastName}
                                                            </h3>
                                                            <div className="flex items-center gap-4 mt-1">
                                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${doc.isVerified
                                                                        ? 'bg-green-100 text-green-800'
                                                                        : 'bg-red-100 text-red-800'
                                                                    }`}>
                                                                    {doc.isVerified ? '✅ Verified' : '❌ Unverified'}
                                                                </span>
                                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${doc.isActive
                                                                        ? 'bg-green-100 text-green-800'
                                                                        : 'bg-gray-100 text-gray-800'
                                                                    }`}>
                                                                    {doc.isActive ? '🟢 Active' : '🔴 Inactive'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
                                                                onClick={() => updateDoctorStatus(doc.id, { isVerified: !doc.isVerified })}
                                                            >
                                                                Toggle Verify
                                                            </button>
                                                            <button
                                                                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 text-sm font-medium"
                                                                onClick={() => updateDoctorStatus(doc.id, { isActive: !doc.isActive })}
                                                            >
                                                                Toggle Active
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Pagination */}
                                        <div className="flex justify-between items-center mt-6 pt-4 border-t border-green-100">
                                            <button
                                                className="px-6 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200 font-medium disabled:opacity-50"
                                                onClick={() => setDoctorPagination(prev => ({ ...prev, skip: Math.max(prev.skip - prev.take, 0) }))} // ← هنا
                                                disabled={doctorPagination.skip === 0}
                                            >
                                                Previous
                                            </button>
                                            <span className="text-green-600 font-medium">
                                                Page {Math.floor(doctorPagination.skip / doctorPagination.take) + 1} of {Math.ceil(doctorPagination.total / doctorPagination.take) || 1}
                                            </span>
                                            <button
                                                className="px-6 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200 font-medium disabled:opacity-50"
                                                onClick={() => setDoctorPagination(prev => ({ ...prev, skip: prev.skip + prev.take }))}
                                                disabled={(doctorPagination.skip + doctorPagination.take) >= doctorPagination.total}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Transactions & Appointments */}
                    <div className="space-y-8">
                        {/* Transactions */}
                        <div className="bg-white rounded-2xl shadow-xl border border-green-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-4">
                                <h2 className="text-xl font-bold text-white flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zM14 6a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h8zM6 8a2 2 0 00-2 2v4a2 2 0 002 2h8a2 2 0 002-2v-4a2 2 0 00-2-2H6z" />
                                    </svg>
                                    Transactions
                                </h2>
                            </div>

                            <div className="p-6">
                                <select
                                    className="w-full px-4 py-3 rounded-lg border border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 bg-white mb-4"
                                    value={transactionFilters.status || ""}
                                    onChange={(e) => handleTransactionFilterChange(e.target.value || undefined)}
                                >
                                    <option value="">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="completed">Completed</option>
                                    <option value="failed">Failed</option>
                                </select>

                                {loading.transactions ? (
                                    <div className="flex justify-center py-4">
                                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-green-200 border-t-green-600"></div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-3">
                                            {transactions.map((tx) => (
                                                <div key={tx.id} className="bg-green-50 rounded-lg p-4 border border-green-100">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="font-medium text-green-900">
                                                                {tx.user?.firstName} {tx.user?.lastName}
                                                            </p>
                                                            <p className="text-sm text-green-600 mt-1">
                                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${tx.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                                                        tx.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                                            'bg-red-100 text-red-800'
                                                                    }`}>
                                                                    {tx.status}
                                                                </span>
                                                            </p>
                                                        </div>
                                                        <span className="font-bold text-green-700">${tx.amount}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-green-100">
                                            <button
                                                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200 text-sm font-medium disabled:opacity-50"
                                                onClick={() => setTransactionPagination(prev => ({ ...prev, skip: Math.max(prev.skip - prev.take, 0) }))}
                                                disabled={transactionPagination.skip === 0}
                                            >
                                                Previous
                                            </button>
                                            <span className="text-sm text-green-600">
                                                {Math.min(transactionPagination.skip + 1, transactionPagination.total)}-{Math.min(transactionPagination.skip + transactionPagination.take, transactionPagination.total)} of {transactionPagination.total}
                                            </span>
                                            <button
                                                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200 text-sm font-medium disabled:opacity-50"
                                                onClick={() => setTransactionPagination(prev => ({ ...prev, skip: prev.skip + prev.take }))}
                                                disabled={(transactionPagination.skip + transactionPagination.take) >= transactionPagination.total}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Appointments */}
                        <div className="bg-white rounded-2xl shadow-xl border border-green-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
                                <h2 className="text-xl font-bold text-white flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM4 7h12v9H4V7z" />
                                    </svg>
                                    Appointments
                                </h2>
                            </div>

                            <div className="p-6">
                                <select
                                    className="w-full px-4 py-3 rounded-lg border border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 bg-white mb-4"
                                    value={appointmentFilters.status || ""}
                                    onChange={(e) => handleAppointmentFilterChange(e.target.value || undefined)}
                                >
                                    <option value="">All Status</option>
                                    <option value="scheduled">Scheduled</option>
                                    <option value="completed">Completed</option>
                                    <option value="canceled">Cancelled</option>
                                </select>

                                {loading.appointments ? (
                                    <div className="flex justify-center py-4">
                                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-green-200 border-t-green-600"></div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-3">
                                            {appointments.map((apt) => (
                                                <div key={apt.id} className="bg-green-50 rounded-lg p-4 border border-green-100">
                                                    <div className="space-y-2">
                                                        <p className="font-medium text-green-900">
                                                            {apt.patient?.user?.firstName} with {apt.doctorProfile?.user?.firstName}
                                                        </p>
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${apt.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                                                apt.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                                                                    'bg-red-100 text-red-800'
                                                            }`}>
                                                            {apt.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-green-100">
                                            <button
                                                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200 text-sm font-medium disabled:opacity-50"
                                                onClick={() => setAppointmentPagination(prev => ({ ...prev, skip: Math.max(prev.skip - prev.take, 0) }))}
                                                disabled={appointmentPagination.skip === 0}
                                            >
                                                Previous
                                            </button>
                                            <span className="text-sm text-green-600">
                                                {Math.min(appointmentPagination.skip + 1, appointmentPagination.total)}-{Math.min(appointmentPagination.skip + appointmentPagination.take, appointmentPagination.total)} of {appointmentPagination.total}
                                            </span>
                                            <button
                                                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200 text-sm font-medium disabled:opacity-50"
                                                onClick={() => setAppointmentPagination(prev => ({ ...prev, skip: prev.skip + prev.take }))}
                                                disabled={(appointmentPagination.skip + appointmentPagination.take) >= appointmentPagination.total}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}