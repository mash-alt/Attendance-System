import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { TeacherLiveAttendance } from '../components/attendance/TeacherLiveAttendance';
import { StudentQRExperience } from '../components/attendance/StudentQRExperience';
import { attendanceService } from '../services/attendanceService';
import { AttendanceSession } from '../types';

export function AttendanceGateway() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { user, loading: authLoading } = useAuth();
  const [session, setSession] = useState<AttendanceSession | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      const unsub = attendanceService.subscribeToSession(sessionId, (s) => {
        setSession(s);
        setSessionLoading(false);
      });
      return () => unsub();
    }
  }, [sessionId]);

  if (authLoading || sessionLoading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-brand-primary animate-pulse">Loading...</div>;
  }

  if (!session) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-red-500">Session not found or has ended.</div>;
  }

  // If user is logged in, show Teacher view (assuming they are the teacher for MVP)
  if (user) {
    return <TeacherLiveAttendance session={session} />;
  }

  // Otherwise show Student QR Flow
  return <StudentQRExperience session={session} />;
}
