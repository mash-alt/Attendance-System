import { db } from '../config/firebase';
import { collection, doc, addDoc, getDoc, getDocs, updateDoc, query, where, orderBy } from 'firebase/firestore';
import { Class, Student, ClassStudent, RegistrationRequest } from '../types';

const CLASSES_COLLECTION = 'classes';
const CLASS_STUDENTS_COLLECTION = 'classStudents';
const STUDENTS_COLLECTION = 'students';
const REG_REQUESTS_COLLECTION = 'registrationRequests';

export const classService = {
  async getClassesByTeacher(teacherId: string): Promise<Class[]> {
    if (!db) return [];
    const q = query(
      collection(db, CLASSES_COLLECTION),
      where('teacherId', '==', teacherId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Class));
  },

  async getClass(classId: string): Promise<Class | null> {
    if (!db) return null;
    const snap = await getDoc(doc(db, CLASSES_COLLECTION, classId));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Class;
  },

  async createClass(classData: Omit<Class, 'id'>): Promise<string> {
    if (!db) throw new Error('Firebase not configured');
    const docRef = await addDoc(collection(db, CLASSES_COLLECTION), classData);
    return docRef.id;
  },

  async updateClass(classId: string, classData: Partial<Class>): Promise<void> {
    if (!db) throw new Error('Firebase not configured');
    await updateDoc(doc(db, CLASSES_COLLECTION, classId), classData);
  },
  
  async getStudentsInClass(classId: string): Promise<(Student & { enrollmentStatus: string })[]> {
    if (!db) return [];
    const q = query(collection(db, CLASS_STUDENTS_COLLECTION), where('classId', '==', classId));
    const snap = await getDocs(q);
    const relations = snap.docs.map(d => d.data() as ClassStudent);
    
    if (relations.length === 0) return [];
    
    // In Phase 1, we fetch all students and filter locally for simplicity, 
    // or fetch by IDs if <= 10. Since it's a demo, let's fetch all and filter.
    const studentIds = relations.map(r => r.studentId);
    
    // Chunking array if needed, but for MVP let's assume < 30
    const studentsQ = query(collection(db, STUDENTS_COLLECTION), where('id', 'in', studentIds.slice(0, 30)));
    const studentsSnap = await getDocs(studentsQ);
    
    const studentsMap = new Map(studentsSnap.docs.map(d => [d.id, d.data() as Student]));
    
    return relations.map(r => {
      const s = studentsMap.get(r.studentId);
      return s ? { ...s, id: r.studentId, enrollmentStatus: r.enrollmentStatus } : null;
    }).filter(Boolean) as any;
  },
  
  async getPendingRequests(classId: string): Promise<RegistrationRequest[]> {
    if (!db) return [];
    const q = query(
      collection(db, REG_REQUESTS_COLLECTION), 
      where('classId', '==', classId),
      where('status', '==', 'pending')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as RegistrationRequest));
  }
};
