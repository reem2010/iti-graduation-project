// app/patient/[userId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { patientProfileApi } from '@/lib/api';

export default function PublicPatientProfilePage() {
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [patient, setPatient] = useState<any>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const response = await patientProfileApi.getPatientProfileById(Number(userId));
        setPatient(response.data);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  if (loading) return <div className="p-4">Loading patient profile...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">
        Public Patient Profile
      </h2>
      <div className="space-y-2 text-gray-700">
        <p><strong>Emergency Contact:</strong> {patient.emergencyContactName}</p>
        <p><strong>Emergency Phone:</strong> {patient.emergencyContactPhone}</p>
        <p><strong>Insurance Provider:</strong> {patient.insuranceProvider}</p>
        <p><strong>Policy Number:</strong> {patient.insurancePolicyNumber}</p>
      </div>
    </div>
  );
}
