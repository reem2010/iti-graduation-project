'use client';

import { useEffect, useState } from 'react';
import { authApi, patientProfileApi } from '@/lib/api';
import { User } from '@/types';
import { useParams } from 'next/navigation';

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
  const params = useParams();
  const id = params?.id;

  const [form, setForm] = useState<PatientFormData>({
    emergencyContactName: '',
    emergencyContactPhone: '',
    insuranceProvider: '',
    insurancePolicyNumber: '',
  });

  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      setError('Invalid user ID');
      setLoading(false);
      return;
    }

    const userId = parseInt(id, 10);

    const fetchData = async () => {
      try {
        setLoading(true);
        const userRes = await authApi.getUserById(userId);
        setUserInfo(userRes);

        if (userRes.role !== 'patient') {
          throw new Error('Only patients can access this page');
        }

        const patientRes = await patientProfileApi.getPatientProfileById(userId);
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

    fetchData();
  }, [id]);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-siraj-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg max-w-2xl mx-auto">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="bg-card rounded-xl shadow-sm border border-border p-6 md:p-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center overflow-hidden border-2 border-siraj-emerald-400/20">
              {userInfo?.avatarUrl ? (
                <img 
                  src={userInfo.avatarUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-siraj-emerald-600">
                  {userInfo?.firstName?.charAt(0)}{userInfo?.lastName?.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-siraj-emerald-700">
                {userInfo?.firstName} {userInfo?.lastName}
              </h1>
              <p className="text-siraj-gray-500 mt-1">
                Patient Profile
              </p>
            </div>
          </div>
        </div>

        {/* User Information Section */}
        <div className="bg-siraj-gray-50 rounded-lg p-6 border border-siraj-gray-200 mb-6">
          <h2 className="text-xl font-bold text-siraj-emerald-700 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Personal Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-siraj-gray-500">Email</p>
              <p className="font-medium text-siraj-gray-800">
                {userInfo?.email || 'Not provided'}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-siraj-gray-500">Phone</p>
              <p className="font-medium text-siraj-gray-800">
                {userInfo?.phone || 'Not provided'}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-siraj-gray-500">Date of Birth</p>
              <p className="font-medium text-siraj-gray-800">
                {userInfo?.dateOfBirth ? new Date(userInfo.dateOfBirth).toLocaleDateString() : 'Not provided'}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-siraj-gray-500">Gender</p>
              <p className="font-medium text-siraj-gray-800 capitalize">
                {userInfo?.gender || 'Not provided'}
              </p>
            </div>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-siraj-gray-700">Emergency Contact Name</label>
                <input
                  name="emergencyContactName"
                  value={form.emergencyContactName}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-siraj-gray-300 rounded-lg bg-siraj-gray-50 text-siraj-gray-800 focus:ring-2 focus:ring-siraj-emerald-500"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-siraj-gray-700">Emergency Contact Phone</label>
                <input
                  name="emergencyContactPhone"
                  value={form.emergencyContactPhone}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-siraj-gray-300 rounded-lg bg-siraj-gray-50 text-siraj-gray-800 focus:ring-2 focus:ring-siraj-emerald-500"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-siraj-gray-700">Insurance Provider</label>
                <input
                  name="insuranceProvider"
                  value={form.insuranceProvider}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-siraj-gray-300 rounded-lg bg-siraj-gray-50 text-siraj-gray-800 focus:ring-2 focus:ring-siraj-emerald-500"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-siraj-gray-700">Policy Number</label>
                <input
                  name="insurancePolicyNumber"
                  value={form.insurancePolicyNumber}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-siraj-gray-300 rounded-lg bg-siraj-gray-50 text-siraj-gray-800 focus:ring-2 focus:ring-siraj-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 border border-siraj-gray-300 bg-siraj-gray-50 hover:bg-siraj-gray-100 text-siraj-gray-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2.5 bg-siraj-emerald-600 text-white rounded-lg hover:bg-siraj-emerald-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Emergency Contact Section */}
            <div className="bg-siraj-gray-50 rounded-lg p-6 border border-siraj-gray-200">
              <h2 className="text-xl font-bold text-siraj-emerald-700 mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                Emergency Contact
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-siraj-gray-500">Name</p>
                  <p className="font-medium text-siraj-gray-800">
                    {patientProfile?.emergencyContactName || 'Not provided'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-siraj-gray-500">Phone</p>
                  <p className="font-medium text-siraj-gray-800">
                    {patientProfile?.emergencyContactPhone || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>

            {/* Insurance Section */}
            <div className="bg-siraj-gray-50 rounded-lg p-6 border border-siraj-gray-200">
              <h2 className="text-xl font-bold text-siraj-emerald-700 mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                Insurance Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-siraj-gray-500">Provider</p>
                  <p className="font-medium text-siraj-gray-800">
                    {patientProfile?.insuranceProvider || 'Not provided'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-siraj-gray-500">Policy Number</p>
                  <p className="font-medium text-siraj-gray-800">
                    {patientProfile?.insurancePolicyNumber || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}