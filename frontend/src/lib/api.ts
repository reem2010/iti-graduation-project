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
} from "@/types";
import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

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
  login: async (data: { email: string; password: string }) => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },
  register: async (data: {
    email: string;
    password: string;
    role: "patient" | "doctor" | "admin";
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    gender?: string;
    phone?: string;
    bio?: string;
  }) => {
    console.log("API call to register with data:", data);
    console.log("API base URL:", API_BASE_URL);
    const response = await api.post("/auth/register", data);
    console.log("API response:", response);
    return response.data;
  },
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

  getDoctorProfileById: async (id: number) => {
    const response = await api.get(`/doctors/${id}`);
    return response.data.profile;
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
  getWeeklySlots: async (doctorId: number) => {
    const res = await api.get(`/doctor-availability/${doctorId}/slots`);
    return res.data;
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
      "/doctor-availability/add",
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

export const appointmentApi = {
  createAppointment: async (data: {
    doctorId: number;
    startTime: string;
    endTime: string;
    price: number;
    paymentGatewayId: number;
  }) => {
    const response = await api.post("/appointments", data);
    return response.data;
  },

  getMyAppointments: async () => {
    const response = await api.get("/appointments/my-appointments");
    return response.data.appointments || response.data.data;
  },

  cancelAppointment: async (appointmentId: number, cancelReason?: string) => {
    const response = await api.delete(`/appointments/${appointmentId}`, {
      data: { cancelReason: cancelReason || "User cancelled" }
    });
    return response.data;
  },
  // Mark an appointment as completed
  completeAppointment: async (appointmentId: number) => {
    const response = await api.patch(`/appointments/${appointmentId}/complete`);
    return response.data;
  },

  getAppointmentsByStatus: async (status: string) => {
    const response = await api.get(`/appointments?status=${status}`);
    return response.data;
  },
  updateAppointmentStatus: async (appointmentId: number, status: string) => {
    const response = await api.patch(`/appointments/${appointmentId}/status`, {
      status,
    });
    return response.data;
  },
  getDoctorAppointments: async () => {
  const response = await api.get("/appointments/my-appointments?role=doctor");
  return response.data.appointments || response.data.data;
},
};

// Messages API
export const messagesApi = {
  createMessage: async (data: any): Promise<any> => {
    const response = await api.post("/messages", data);
    return response.data;
  },

  getUserStatus: async (userId: number): Promise<{ online: boolean }> => {
    const response = await api.get(`/messages/user-status/${userId}`);
    return response.data;
  },

  getUserChats: async (): Promise<any> => {
    const response = await api.get("/messages");
    return response.data;
  },

  getUnreadMessages: async (senderId: number): Promise<any[]> => {
    const response = await api.get(`/messages/unread/${senderId}`);
    return response.data;
  },

  getUnreadCount: async (): Promise<string> => {
    const response = await api.get("/messages/unreadCount");
    return response.data.unreadCount;
  },

  getConversation: async (
    senderId: number,
    recipientId: number
  ): Promise<any[]> => {
    const response = await api.get(`/messages/${senderId}/${recipientId}`);
    return response.data;
  },

  clearUnreadMessages: async (senderId: number): Promise<void> => {
    await api.patch(`/messages/unread/clear/${senderId}`);
  },
};

//Article API
export const articleApi = {
  createArticle: async (data: { content: string; media?: string }) => {
    const response = await api.post("/article", data);
    return response.data;
  },

  updateArticle: async (
    articleId: number | string,
    data: {
      content: string;
      media?: string;
    }
  ) => {
    const response = await api.put(`/article/${articleId}`, data);
    return response.data;
  },

  deleteArticle: async (articleId: number | string) => {
    await api.delete(`/article/${articleId}`);
  },

  getArticleById: async (articleId: number | string) => {
    const response = await api.get(`/article/${articleId}`);
    return response.data;
  },

  getAllArticles: async () => {
    const response = await api.get(`/article`);
    return response.data;
  },
};

export const adminApi = {
  getDoctors: async (params: {
    skip?: number;
    take?: number;
    isActive?: boolean;
    isVerified?: boolean;
  }) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
    const response = await api.get(`/admin/doctors?${queryParams.toString()}`);
    return response.data;
  },

  updateDoctorStatus: async (
    doctorId: number,
    update: { isVerified?: boolean; isActive?: boolean }
  ) => {
    const response = await api.patch(
      `/admin/doctors/${doctorId}/status`,
      update
    );
    return response.data;
  },

  getTransactions: async (params: {
    skip?: number;
    take?: number;
    status?: string;
  }) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
    const response = await api.get(
      `/admin/transactions?${queryParams.toString()}`
    );
    return response.data;
  },

  getAppointments: async (params: {
    skip?: number;
    take?: number;
    status?: string;
  }) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
    const response = await api.get(
      `/admin/appointments?${queryParams.toString()}`
    );
    return response.data;
  },
};

// Export all individual API services for easier import

export default api;
