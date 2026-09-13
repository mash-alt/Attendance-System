import { db } from '../config/firebase';
import { collection, doc, addDoc, getDoc, getDocs, updateDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { AttendanceSession, AttendanceRecord } from '../types';

export const attendanceService = {
  async createSession(sessionData: Omit<AttendanceSession, 'id'>): Promise<string> {
    if (!db) throw new Error('Firebase not configured');
    const docRef = await addDoc(collection(db, 'attendanceSessions'), sessionData);
    return docRef.id;
  },

  async getSession(sessionId: string): Promise<AttendanceSession | null> {
    if (!db) return null;
    const snap = await getDoc(doc(db, 'attendanceSessions', sessionId));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as AttendanceSession;
  },

  async getSessionsByClass(classId: string): Promise<AttendanceSession[]> {
    if (!db) return [];
    const q = query(collection(db, 'attendanceSessions'), where('classId', '==', classId), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as AttendanceSession));
  },

  async endSession(sessionId: string): Promise<void> {
    if (!db) throw new Error('Firebase not configured');
    await updateDoc(doc(db, 'attendanceSessions', sessionId), {
      status: 'ended',
      endedAt: Date.now()
    });
  },

  subscribeToSession(sessionId: string, callback: (session: AttendanceSession | null) => void) {
    if (!db) return () => {};
    return onSnapshot(doc(db, 'attendanceSessions', sessionId), (snap) => {
      if (snap.exists()) {
        callback({ id: snap.id, ...snap.data() } as AttendanceSession);
      } else {
        callback(null);
      }
    });
  },

  subscribeToRecords(sessionId: string, callback: (records: AttendanceRecord[]) => void) {
    if (!db) return () => {};
    const q = query(collection(db, 'attendanceRecords'), where('sessionId', '==', sessionId));
    return onSnapshot(q, (snap) => {
      const records = snap.docs.map(d => ({ id: d.id, ...d.data() } as AttendanceRecord));
      callback(records);
    });
  },

  async recordAttendance(recordData: Omit<AttendanceRecord, 'id'>): Promise<string> {
    if (!db) throw new Error('Firebase not configured');
    
    // Check if record exists for this session and student
    const q = query(
      collection(db, 'attendanceRecords'), 
      where('sessionId', '==', recordData.sessionId),
      where('studentId', '==', recordData.studentId)
    );
    const snap = await getDocs(q);
    
    if (!snap.empty) {
      // Update existing record (e.g. they are scanning OUT)
      const existingId = snap.docs[0].id;
      await updateDoc(doc(db, 'attendanceRecords', existingId), {
        ...recordData,
        updatedAt: Date.now()
      });
      return existingId;
    } else {
      // Create new record
      const docRef = await addDoc(collection(db, 'attendanceRecords'), {
        ...recordData,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      return docRef.id;
    }
  }
};
