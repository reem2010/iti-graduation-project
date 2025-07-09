'use client';
import { authApi, patientProfileApi } from '@/lib/api';
import { User } from '@/types';
import { useEffect, useState } from 'react';

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
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isEditingPatient, setIsEditingPatient] = useState(false);
  

  // User edit form state
  const [userEditForm, setUserEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    avatarUrl: '',
    gender: '',
    preferredLanguage: 'en',
    timezone: '',
    bio: '',
    isVerified: false,
    isActive: true,
    dateOfBirth: '',
  });

  // Patient edit form state
  const [patientEditForm, setPatientEditForm] = useState<PatientFormData>({
    emergencyContactName: '',
    emergencyContactPhone: '',
    insuranceProvider: '',
    insurancePolicyNumber: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch user info
      const userRes = await authApi.getUser();
      setUserInfo(userRes);
      setUserEditForm({
        firstName: userRes.firstName || '',
        lastName: userRes.lastName || '',
        email: userRes.email || '',
        phone: userRes.phone || '',
        avatarUrl: userRes.avatarUrl || '',
        gender: userRes.gender || '',
        preferredLanguage: userRes.preferredLanguage || 'en',
        timezone: userRes.timezone || '',
        bio: userRes.bio || '',
        isVerified: userRes.isVerified ?? false,
        isActive: userRes.isActive ?? true,
        dateOfBirth: userRes.dateOfBirth
          ? new Date(userRes.dateOfBirth).toISOString().split('T')[0]
          : '',
      });

      // Fetch patient profile
      const patientRes = await patientProfileApi.getPatientProfile();
      console.log('Fetched Patient Profile:', patientRes);
      setPatientProfile(patientRes.data);
      setPatientEditForm({
        emergencyContactName: patientRes?.data.emergencyContactName || '',
        emergencyContactPhone: patientRes?.data.emergencyContactPhone || '',
        insuranceProvider: patientRes?.data.insuranceProvider || '',
        insurancePolicyNumber: patientRes?.data.insurancePolicyNumber || '',
      });
      console.log('Patient Profile:', patientRes);

    } catch (err: any) {
      console.error('Failed to fetch data:', err);
      setError(
        err.response?.data?.message ||
          'Failed to load patient profile. Please ensure you are logged in.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUserChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target;

    const newValue =
      type === 'checkbox'
        ? checked
        : name === 'isVerified' || name === 'isActive'
        ? Boolean(value)
        : name === 'dateOfBirth'
        ? value
        : value;

    setUserEditForm(prev => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handlePatientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPatientEditForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanedUserData = {
      firstName: userEditForm.firstName.trim(),
      lastName: userEditForm.lastName.trim(),
      email: userEditForm.email,
      phone: userEditForm.phone?.trim() || '',
      avatarUrl: userEditForm.avatarUrl?.trim() || undefined,
      gender: userEditForm.gender?.trim() || undefined,
      preferredLanguage: userEditForm.preferredLanguage?.trim() || 'en',
      timezone: userEditForm.timezone?.trim() || undefined,
      bio: userEditForm.bio?.trim() || undefined,
      isVerified: Boolean(userEditForm.isVerified),
      isActive: Boolean(userEditForm.isActive),
      dateOfBirth: userEditForm.dateOfBirth
        ? new Date(userEditForm.dateOfBirth).toISOString()
        : undefined,
    };

    try {
      setLoading(true);
      await authApi.updateUser(cleanedUserData);
      await fetchData(); // Refresh all data
      setIsEditingUser(false);
    } catch (err: any) {
      console.error('Failed to update user:', err);
      setError(
        err.response?.data?.message ||
          'Failed to update user. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      const updatedPatient = await patientProfileApi.updatePatientProfile(patientEditForm);
      console.log('Updated Patient Profile:', updatedPatient);
      // Update both the patient profile and form state
      setPatientProfile(updatedPatient.data);
      setPatientEditForm({
        emergencyContactName: updatedPatient.data.emergencyContactName || '',
        emergencyContactPhone: updatedPatient.data.emergencyContactPhone || '',
        insuranceProvider: updatedPatient.data.insuranceProvider || '',
        insurancePolicyNumber: updatedPatient.data.insurancePolicyNumber || '',
      });
      
      setIsEditingPatient(false);
    } catch (err: any) {
      console.error('Failed to update patient profile:', err);
      setError(
        err.response?.data?.message ||
          'Failed to update patient profile. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-8">
      {/* Personal Information Section */}
      <section className="bg-indigo-50 p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-indigo-600">Personal Information</h2>
          <button
            onClick={() => setIsEditingUser(!isEditingUser)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
          >
            {isEditingUser ? 'Cancel' : 'Edit Info'}
          </button>
        </div>

        {isEditingUser ? (
          <form onSubmit={handleUpdateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <input
              name="firstName"
              value={userEditForm.firstName}
              onChange={handleUserChange}
              required
              placeholder="First Name"
              className="p-2 border rounded"
            />
            <input
              name="lastName"
              value={userEditForm.lastName}
              onChange={handleUserChange}
              required
              placeholder="Last Name"
              className="p-2 border rounded"
            />
            <input
              name="email"
              value={userEditForm.email}
              onChange={handleUserChange}
              required
              placeholder="Email"
              className="p-2 border rounded"
              type="email"
            />
            <input
              name="phone"
              value={userEditForm.phone}
              onChange={handleUserChange}
              placeholder="Phone"
              className="p-2 border rounded"
            />
            <input
              name="dateOfBirth"
              type="date"
              value={userEditForm.dateOfBirth}
              onChange={handleUserChange}
              className="p-2 border rounded"
            />
            <select
              name="gender"
              value={userEditForm.gender}
              onChange={handleUserChange}
              className="p-2 border rounded"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            
            <div className="col-span-2 flex justify-end gap-4 mt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <p>
              <strong>Name:</strong> {userInfo?.firstName} {userInfo?.lastName}
            </p>
            <p>
              <strong>Email:</strong> {userInfo?.email}
            </p>
            <p>
              <strong>Phone:</strong> {userInfo?.phone || 'N/A'}
            </p>
            <p>
              <strong>Date of Birth:</strong> {userInfo?.dateOfBirth ? new Date(userInfo.dateOfBirth).toLocaleDateString() : 'N/A'}
            </p>
            <p>
              <strong>Gender:</strong> {userInfo?.gender || 'N/A'}
            </p>
          </div>
        )}
      </section>

      {/* Patient Information Section */}
      <section className="bg-indigo-50 p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-indigo-600">Patient Information</h2>
          <button
            onClick={() => setIsEditingPatient(!isEditingPatient)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {isEditingPatient ? 'Cancel' : 'Edit Patient Info'}
          </button>
        </div>

        {isEditingPatient ? (
          <form onSubmit={handleUpdatePatient} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <input
              name="emergencyContactName"
              value={patientEditForm.emergencyContactName}
              onChange={handlePatientChange}
              placeholder="Emergency Contact Name"
              className="p-2 border rounded"
            />
            <input
              name="emergencyContactPhone"
              value={patientEditForm.emergencyContactPhone}
              onChange={handlePatientChange}
              placeholder="Emergency Contact Phone"
              className="p-2 border rounded"
            />
            <input
              name="insuranceProvider"
              value={patientEditForm.insuranceProvider}
              onChange={handlePatientChange}
              placeholder="Insurance Provider"
              className="p-2 border rounded"
            />
            <input
              name="insurancePolicyNumber"
              value={patientEditForm.insurancePolicyNumber}
              onChange={handlePatientChange}
              placeholder="Insurance Policy Number"
              className="p-2 border rounded"
            />
            
            <div className="col-span-2 flex justify-end gap-4 mt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <p>
              <strong>Emergency Contact:</strong> {patientProfile?.emergencyContactName || 'N/A'}
            </p>
            <p>
              <strong>Emergency Phone:</strong> {patientProfile?.emergencyContactPhone || 'N/A'}
            </p>
            <p>
              <strong>Insurance Provider:</strong> {patientProfile?.insuranceProvider || 'N/A'}
            </p>
            <p>
              <strong>Policy Number:</strong> {patientProfile?.insurancePolicyNumber || 'N/A'}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}