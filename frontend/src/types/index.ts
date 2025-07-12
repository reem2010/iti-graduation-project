// types/index.ts

// Enums from your Prisma schema
export enum Role {
  USER = 'USER',
  DOCTOR = 'DOCTOR',
  ADMIN = 'ADMIN',
}

export enum VerificationStatus {
  pending = 'pending',
  approved = 'approved',
  rejected = 'rejected',
}

// Base Interfaces matching Prisma models
export interface User {
  id: number;
  email: string;
  passwordHash: string;
  role: Role;
  createdAt: string; // DateTime will be string in JSON
  updatedAt: string; // DateTime will be string in JSON
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
  dateOfBirth?: string; // DateTime will be string in JSON
  gender?: string;
  preferredLanguage: string;
  timezone?: string;
  bio?: string;
  isVerified: boolean;
  isActive: boolean;
  lastLogin?: string; // DateTime will be string in JSON
  // Relationships are typically not included in direct API responses unless explicitly populated
  // patientProfile?: Patient;
  // doctorProfile?: DoctorProfile;
  // wallet?: Wallet;
  // doctorVerificationsRequested?: DoctorVerification[];
  // doctorVerificationsReviewed?: DoctorVerification[];
  // messagesSent?: Message[];
  // messagesReceived?: Message[];
  // notifications?: Notification[];
  // transactions?: Transaction[];
}

export interface DoctorProfile {
  userId: number;
  title: string;
  specialization: string;
  yearsOfExperience: number;
  consultationFee: number; // Prisma Decimal maps to number in JS
  languages: string[];
  isAcceptingNewPatients: boolean;
  stripeAccountId?: string;
  createdAt: string; // DateTime will be string in JSON
  updatedAt: string; // DateTime will be string in JSON
  // user?: User;
  // articles?: Article[];
  // reviewsReceived?: Review[];
  // appointmentsAsDoctor?: Appointment[];
  // availabilities?: DoctorAvailability[];
}

export interface DoctorVerification {
  id: number;
  userId: number;
  licenseNumber: string;
  licensePhotoUrl: string;
  degree: string;
  university: string;
  graduationYear: number;
  specialization: string; // Specialization related to the verification document
  idProofUrl: string;
  cvUrl?: string;
  additionalCertificates?: any; // Prisma Json type can be any JSON-serializable value
  status: VerificationStatus;
  reviewedBy?: number;
  reviewedAt?: string; // DateTime will be string in JSON
  rejectionReason?: string;
  createdAt: string; // DateTime will be string in JSON
  updatedAt: string; // DateTime will be string in JSON
  // user?: User;
  // reviewer?: User;
}

export interface DoctorAvailability {
  id: number;
  doctorId: number; // Assuming this is userId from DoctorProfile
  dayOfWeek: string;
  startTime: string; // Time string, e.g., "09:00"
  endTime: string;   // Time string, e.g., "17:00"
  validFrom: string; // Date string, e.g., "YYYY-MM-DD" or ISO string
  validUntil?: string; // Date string or ISO string
  createdAt: string; // DateTime will be string in JSON
  updatedAt: string; // DateTime will be string in JSON
  // doctorProfile?: DoctorProfile;
}

// DTOs for API requests (Create/Update)
export type CreateDoctorProfileDto = Omit<DoctorProfile, 'userId' | 'createdAt' | 'updatedAt' | 'id' | 'consultationFee'> & {
  consultationFee: number | string; // Allow string for input, convert to number
};
export type UpdateDoctorProfileDto = Partial<CreateDoctorProfileDto>;

export type CreateDoctorVerificationDto = Omit<DoctorVerification, 'id' | 'status' | 'reviewedBy' | 'reviewedAt' | 'rejectionReason' | 'createdAt' | 'updatedAt'>;
export type UpdateDoctorVerificationDto = Partial<CreateDoctorVerificationDto> & {
  status?: VerificationStatus; // Status can be updated by admin
  rejectionReason?: string;
};

export type CreateDoctorAvailabilityDto = Omit<DoctorAvailability, 'id' | 'doctorId' | 'createdAt' | 'updatedAt'>;
export type UpdateDoctorAvailabilityDto = Partial<CreateDoctorAvailabilityDto>;

// Generic API Response structure
export interface ApiResponse<T> {
  message: string;
  data?: T;
  profile?: T; // Some endpoints might return 'profile' instead of 'data'
}
