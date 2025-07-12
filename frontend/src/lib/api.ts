// lib/api.ts
import {
  ApiResponse,
  CreateDoctorAvailabilityDto,
  CreateDoctorProfileDto,
  CreateDoctorVerificationDto,
  DoctorAvailability,
  DoctorProfile,
  DoctorVerification,
  UpdateDoctorAvailabilityDto,
  UpdateDoctorProfileDto,
  UpdateDoctorVerificationDto,
  User,
} from "@/types";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  getUser: async () => {
    const response = await api.get("/user");
    return response.data;
  },
  updateUser: async (data: any) => {
    const response = await api.put("/user", data);
    return response.data;
  },
  getUserById: async (userId: number) => {
    const response = await api.get(`/user/${userId}`);
    return response.data;
  },
  updateUserById: async (userId: number, data: any) => {
    const response = await api.put(`/user/${userId}`, data);
    return response.data;
  },
  deleteUser: async () => {
    await api.delete("/user");
  },
};

// Doctor Profile API
export const doctorProfileApi = {
  getDoctorProfile: async (): Promise<DoctorProfile> => {
    const response = await api.get<ApiResponse<DoctorProfile>>("/doctors");
    // The backend response structure seems to return 'profile' or 'data' for DoctorProfile
    return response.data.profile || response.data.data!;
  },

  createDoctorProfile: async (
    data: CreateDoctorProfileDto
  ): Promise<DoctorProfile> => {
    const response = await api.post<ApiResponse<DoctorProfile>>(
      "/doctors",
      data
    );
    return response.data.data!;
  },

  updateDoctorProfile: async (
    data: UpdateDoctorProfileDto
  ): Promise<DoctorProfile> => {
    const response = await api.put<ApiResponse<DoctorProfile>>(
      "/doctors",
      data
    );
    return response.data.data!;
  },

  deleteDoctorProfile: async (): Promise<void> => {
    await api.delete("/doctors");
  },
  getTherapists: async (filters: Record<string, string>) => {
    const queryParams = new URLSearchParams();
    for (const key in filters) {
      if (filters[key]) {
        queryParams.append(key, filters[key]);
      }
    }
    const response = await api.get(`/therapists?${queryParams.toString()}`);
    return response.data;
  },
};

// Doctor Verification API
export const doctorVerificationApi = {
  getDoctorVerification: async (): Promise<DoctorVerification> => {
    const response = await api.get<ApiResponse<DoctorVerification>>(
      "/doctor-verification"
    );
    return response.data.data!;
  },
  getDoctorVerificationByDoctorId: async (doctorId: number) => {
    const res = await api.get(`/doctor-verification/doctor/${doctorId}`);
    return res.data;
  },

  createDoctorVerification: async (
    data: CreateDoctorVerificationDto
  ): Promise<DoctorVerification> => {
    const response = await api.post<ApiResponse<DoctorVerification>>(
      "/doctor-verification",
      data
    );
    return response.data.data!;
  },

  updateDoctorVerification: async (
    data: UpdateDoctorVerificationDto
  ): Promise<DoctorVerification> => {
    const response = await api.put<ApiResponse<DoctorVerification>>(
      "/doctor-verification",
      data
    );
    return response.data.data!;
  },

  deleteDoctorVerification: async (): Promise<void> => {
    await api.delete("/doctor-verification");
  },
};

// Doctor Availability API
export const doctorAvailabilityApi = {
  getDoctorAvailabilities: async (): Promise<DoctorAvailability[]> => {
    const response = await api.get<ApiResponse<DoctorAvailability[]>>(
      "/doctor-availability"
    );
    return response.data.data!;
  },

  getDoctorAvailabilitesByDoctorId(doctorId: number) {
    return api
      .get<ApiResponse<DoctorAvailability[]>>(
        `/doctor-availability/doctor/${doctorId}`
      )
      .then((res) => res.data.data);
  },
  createDoctorAvailability: async (
    data: CreateDoctorAvailabilityDto
  ): Promise<DoctorAvailability> => {
    const response = await api.post<ApiResponse<DoctorAvailability>>(
      "/doctor-availability",
      data
    );
    return response.data.data!;
  },

  updateDoctorAvailability: async (
    id: number,
    data: UpdateDoctorAvailabilityDto
  ): Promise<DoctorAvailability> => {
    const response = await api.put<ApiResponse<DoctorAvailability>>(
      `/doctor-availability/${id}`,
      data
    );
    return response.data.data!;
  },

  deleteDoctorAvailability: async (id: number): Promise<void> => {
    await api.delete(`/doctor-availability/${id}`);
  },
};

export const patientProfileApi = {
  getPatientProfile: async () => {
    const response = await api.get("/patients");
    return response.data;
  },

  createPatientProfile: async (data: any) => {
    const response = await api.post("/patients", data);
    return response.data;
  },

  updatePatientProfile: async (data: any) => {
    const response = await api.put("/patients", data);
    return response.data;
  },

  deletePatientProfile: async (): Promise<void> => {
    await api.delete("/patients");
  },
  getPatientProfileById: async (userId: number) => {
    const response = await api.get(`/patients/${userId}`);
    return response.data;
  },
};

// Export all individual API services for easier import

export default api; // Export the axios instance as default if needed elsewhere
