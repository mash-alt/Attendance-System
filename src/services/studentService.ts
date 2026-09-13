import { db } from '../config/firebase';
import { collection, doc, addDoc, getDoc, getDocs, updateDoc, query, where, setDoc } from 'firebase/firestore';
import { Student, ClassStudent, RegistrationRequest } from '../types';

export const studentService = {
  async findStudentByStudentId(schoolId: string, studentId: string): Promise<Student | null> {
    if (!db) return null;
    const q = query(
      collection(db, 'students'), 
      where('schoolId', '==', schoolId),
      where('studentId', '==', studentId)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() } as Student;
  },

  async requestRegistration(request: Omit<RegistrationRequest, 'id'>): Promise<string> {
    if (!db) throw new Error('Firebase not configured');
    const docRef = await addDoc(collection(db, 'registrationRequests'), request);
    return docRef.id;
  },

  async approveRegistration(requestId: string, classId: string, schoolId: string, studentData: Omit<Student, 'id'|'createdAt'>): Promise<void> {
    if (!db) throw new Error('Firebase not configured');
    
    // Check if student exists
    let student = await this.findStudentByStudentId(schoolId, studentData.studentId);
    let studentDocId = student?.id;
    
    if (!studentDocId) {
      // Create new student
      const newStudentRef = doc(collection(db, 'students'));
      studentDocId = newStudentRef.id;
      await setDoc(newStudentRef, {
        id: studentDocId,
        ...studentData,
        createdAt: Date.now()
      });
    }

    // Add to class
    const classStudentRef = doc(collection(db, 'classStudents'));
    await setDoc(classStudentRef, {
      id: classStudentRef.id,
      classId,
      studentId: studentDocId,
      enrollmentStatus: 'active',
      createdAt: Date.now()
    });

    // Update request
    await updateDoc(doc(db, 'registrationRequests', requestId), {
      status: 'approved'
    });
  },

  async addStudentToClass(classId: string, schoolId: string, fullName: string, studentIdStr: string): Promise<void> {
    if (!db) throw new Error('Firebase not configured');
    let student = await this.findStudentByStudentId(schoolId, studentIdStr);
    let studentDocId = student?.id;

    if (!studentDocId) {
      const newStudentRef = doc(collection(db, 'students'));
      studentDocId = newStudentRef.id;
      await setDoc(newStudentRef, {
        id: studentDocId,
        schoolId,
        studentId: studentIdStr,
        fullName,
        registrationStatus: 'approved',
        createdAt: Date.now()
      });
    }

    const classStudentRef = doc(collection(db, 'classStudents'));
    await setDoc(classStudentRef, {
      id: classStudentRef.id,
      classId,
      studentId: studentDocId,
      enrollmentStatus: 'active',
      createdAt: Date.now()
    });
  }
};
