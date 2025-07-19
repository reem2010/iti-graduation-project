"use client";

import { useEffect, useState } from "react";
import { reportsApi } from "@/lib/api";
import { Edit } from "lucide-react";
import toast from "react-hot-toast";

interface Report {
  diagnosis: string;
  prescription: string;
  notes: string;
  documents: string[] | null;
}

interface PatientReport {
  patientId: string;
  patientName: string;
  patientPhone: string;
  reports: Report[];
}

export default function PatientReports() {
  const [data, setData] = useState<PatientReport[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await reportsApi.getAllReports();
        setData(res);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);
  const handleEditReport = async () => {
    toast.success("Edited");
  };
  return (
    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold text-green-700 tracking-wide">
          Patient Reports
        </h2>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center p-8 text-gray-500">
          Loading Reports...
        </div>
      )}

      {!loading && data && data.length === 0 && (
        <p className="text-gray-500">No reports found.</p>
      )}

      {!loading && data && data.length > 0 && (
        <div className="space-y-6">
          {data.map((patient) => (
            <div
              key={patient.patientId}
              className="p-5 bg-gray-50 rounded-xl border border-gray-100 shadow-sm"
            >
              <div className="mb-4">
                <p className="text-green-800 font-medium">
                  {patient.patientName}{" "}
                </p>
              </div>

              <div className="space-y-4">
                {patient.reports.map((report, index) => (
                  <div
                    key={index}
                    className=" relative p-4 rounded-lg shadow-sm"
                  >
                    <div className="flex gap-2 absolute bottom-4 right-4">
                      <button
                        onClick={() => handleEditReport()}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-siraj-gray-300 bg-siraj-white hover:bg-siraj-gray-100 text-siraj-gray-800 rounded-lg transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    </div>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold text-gray-800">
                        Diagnosis:
                      </span>{" "}
                      {report.diagnosis}
                    </p>
                    {report.prescription && (
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold text-gray-800">
                          Prescription:
                        </span>{" "}
                        {report.prescription}
                      </p>
                    )}
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold text-gray-800">
                        Notes:
                      </span>{" "}
                      {report.notes}
                    </p>
                    {report.documents && report.documents.length > 0 ? (
                      <div className="mt-2">
                        <p className="font-medium text-sm text-gray-800 mb-1">
                          Documents:
                        </p>
                        <ul className="list-disc list-inside text-sm text-blue-600">
                          {report.documents.map((doc, i) => (
                            <li key={i}>
                              <a
                                href={doc}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline"
                              >
                                View Document {i + 1}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic mt-2">
                        No documents provided
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
