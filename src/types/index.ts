export interface School {
  id: string;
  name: string;
  address: string;
  defaultAttendanceRadius: number;
  defaultQrExpirationSeconds: number;
  exportFormat: string;
  subscriptionStatus: string;
  trialStartedAt: number;
  trialEndsAt: number;
  createdAt: number;
}

export interface Teacher {
  id: string;
  schoolId: string;
  name: string;
  email: string;
  role: 'teacher' | 'admin';
  createdAt: number;
}

export interface Class {
  id: string;
  schoolId: string;
  teacherId: string;
  className: string;
  subject: string;
  section: string;
  schedule: string;
  campusLatitude?: number;
  campusLongitude?: number;
  attendanceRadius: number;
  qrExpirationSeconds: number;
  lateGracePeriodMinutes: number;
  requireOutScan: boolean;
  archived: boolean;
  createdAt: number;
}

export interface Student {
  id: string;
  schoolId: string;
  studentId: string; // The physical ID number like 2026-00123
  fullName: string;
  registrationStatus: 'pending' | 'approved' | 'rejected';
  createdAt: number;
}

export interface ClassStudent {
  id: string;
  classId: string;
  studentId: string;
  enrollmentStatus: 'active' | 'dropped';
  createdAt: number;
}

export interface AttendanceSession {
  id: string;
  classId: string;
  attendanceDate: string; // YYYY-MM-DD
  status: 'active' | 'ended';
  inStartTime: number;
  inEndTime: number;
  outStartTime?: number;
  outEndTime?: number;
  allowedRadius: number;
  latitude?: number;
  longitude?: number;
  currentInQrToken?: string;
  currentOutQrToken?: string;
  qrExpirationSeconds: number;
  createdAt: number;
  endedAt?: number;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  classId: string;
  studentId: string;
  inTime?: number;
  outTime?: number;
  inLatitude?: number;
  inLongitude?: number;
  outLatitude?: number;
  outLongitude?: number;
  inDistance?: number;
  outDistance?: number;
  inDeviceIdentifier?: string;
  outDeviceIdentifier?: string;
  status: 'Present' | 'Late' | 'Incomplete' | 'Absent' | 'For Review' | 'Excused';
  locationFlag?: boolean;
  deviceFlag?: boolean;
  remarks?: string;
  manuallyEdited: boolean;
  updatedBy?: string; // teacher id if edited manually
  createdAt: number;
  updatedAt: number;
}

export interface RegistrationRequest {
  id: string;
  classId: string;
  requestedStudentId: string;
  fullName: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: number;
}

export interface Subscription {
  id: string;
  schoolId: string;
  plan: 'trial' | 'teacher' | 'school';
  status: 'active' | 'expired' | 'canceled';
  trialStartedAt?: number;
  trialEndsAt?: number;
  subscriptionStartedAt?: number;
  subscriptionEndsAt?: number;
}
