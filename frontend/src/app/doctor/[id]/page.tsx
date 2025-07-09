// app/public-doctor-profile/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { DoctorVerification, DoctorAvailability, User } from '@/types';
import { doctorVerificationApi, doctorAvailabilityApi, authApi } from '@/lib/api';

export default function PublicDoctorProfilePage() {
  const { id } = useParams();
  const doctorId = parseInt(id as string);

  const [verification, setVerification] = useState<DoctorVerification | null>(null);
  const [availability, setAvailability] = useState<DoctorAvailability[]>([]);
  const [doctorUser, setDoctorUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDoctorData() {
      try {
        setLoading(true);
        setError(null);

        const [verificationRes, availabilityRes, userRes] = await Promise.all([
          doctorVerificationApi.getDoctorVerificationByDoctorId(doctorId),
          doctorAvailabilityApi.getDoctorAvailabilitesByDoctorId(doctorId),
          authApi.getUserById(doctorId)
        ]);
        console.log('Verification:', verificationRes);
        console.log('Availability:', availabilityRes);
        console.log('User:', userRes);

        setVerification(verificationRes);
        setAvailability(availabilityRes);
        setDoctorUser(userRes);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load doctor profile.');
      } finally {
        setLoading(false);
      }
    }

    if (!isNaN(doctorId)) fetchDoctorData();
  }, [doctorId]);

  if (loading) return <p className="text-gray-600">Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!verification) return <p className="text-gray-600">Doctor verification not found.</p>;

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
        Public Doctor Profile
      </h2>

      {doctorUser && (
        <div className="mb-6">
          <p><strong>Name:</strong> {doctorUser.firstName} {doctorUser.lastName}</p>
          <p><strong>Email:</strong> {doctorUser.email}</p>
        </div>
      )}

      <div className="space-y-2 text-gray-700">
        <p><strong>License Number:</strong> {verification.licenseNumber || 'N/A'}</p>
        <p><strong>Degree:</strong> {verification.degree || 'N/A'}</p>
        <p><strong>University:</strong> {verification.university || 'N/A'}</p>
        <p><strong>Graduation Year:</strong> {verification.graduationYear || 'N/A'}</p>
        <p><strong>Specialization:</strong> {verification.specialization || 'N/A'}</p>
        <p>
          <strong>License Photo:</strong>{' '}
          {verification.licensePhotoUrl ? (
            <a
              href={verification.licensePhotoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View
            </a>
          ) : 'N/A'}
        </p>
        <p>
          <strong>ID Proof:</strong>{' '}
          {verification.idProofUrl ? (
            <a
              href={verification.idProofUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View
            </a>
          ) : 'N/A'}
        </p>
        <p>
          <strong>CV:</strong>{' '}
          {verification.cvUrl ? (
            <a
              href={verification.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View
            </a>
          ) : 'N/A'}
        </p>
        <p><strong>Certificates:</strong></p>
        <ul className="list-disc ml-6">
          {verification.additionalCertificates && verification.additionalCertificates.length > 0 ? (
            verification.additionalCertificates.map((cert, index) => (
              <li key={index}>
                <a
                  href={cert}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Certificate {index + 1}
                </a>
              </li>
            ))
          ) : (
            <li>N/A</li>
          )}
        </ul>
      </div>

      {availability && availability.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-indigo-600 mb-2">Available Time Slots</h3>
          <ul className="list-disc ml-6 text-gray-800">
            {availability.map((slot, idx) => (
              <li key={idx}>
                Day {slot.dayOfWeek}: {slot.startTime} - {slot.endTime}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
