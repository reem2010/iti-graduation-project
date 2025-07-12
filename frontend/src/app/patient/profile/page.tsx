'use client';

import { useEffect, useState } from 'react';
import { authApi, patientProfileApi } from '@/lib/api';
import { User } from '@/types';

interface PatientFormData {
  emergencyContactName: string;
  emergencyContactPhone: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
}

export default function PatientProfilePage() {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [patientProfile, setPatientProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState<PatientFormData>({
    emergencyContactName: '',
    emergencyContactPhone: '',
    insuranceProvider: '',
    insurancePolicyNumber: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const userRes = await authApi.getUser();
      setUserInfo(userRes);
      if (userRes.role !== 'patient') {
        throw new Error('Only patients can access this page');
      }
      const patientRes = await patientProfileApi.getPatientProfile();
      setPatientProfile(patientRes.data);
      setForm({
        emergencyContactName: patientRes.data.emergencyContactName || '',
        emergencyContactPhone: patientRes.data.emergencyContactPhone || '',
        insuranceProvider: patientRes.data.insuranceProvider || '',
        insurancePolicyNumber: patientRes.data.insurancePolicyNumber || '',
      });
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      await patientProfileApi.updatePatientProfile(form);
      await fetchData();
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-semibold text-indigo-600">Patient Profile</h1>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            name="emergencyContactName"
            value={form.emergencyContactName}
            onChange={handleChange}
            placeholder="Emergency Contact Name"
            className="border p-2 rounded"
          />
          <input
            name="emergencyContactPhone"
            value={form.emergencyContactPhone}
            onChange={handleChange}
            placeholder="Emergency Contact Phone"
            className="border p-2 rounded"
          />
          <input
            name="insuranceProvider"
            value={form.insuranceProvider}
            onChange={handleChange}
            placeholder="Insurance Provider"
            className="border p-2 rounded"
          />
          <input
            name="insurancePolicyNumber"
            value={form.insurancePolicyNumber}
            onChange={handleChange}
            placeholder="Policy Number"
            className="border p-2 rounded"
          />
          <div className="flex justify-end gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="grid gap-2">
          <p><strong>Emergency Contact:</strong> {patientProfile?.emergencyContactName || 'N/A'}</p>
          <p><strong>Phone:</strong> {patientProfile?.emergencyContactPhone || 'N/A'}</p>
          <p><strong>Insurance Provider:</strong> {patientProfile?.insuranceProvider || 'N/A'}</p>
          <p><strong>Policy Number:</strong> {patientProfile?.insurancePolicyNumber || 'N/A'}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}
