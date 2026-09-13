import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const provider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  if (!auth || !db) throw new Error('Firebase is not configured.');
  
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // Check if teacher profile exists
  const teacherRef = doc(db, 'teachers', user.uid);
  const teacherSnap = await getDoc(teacherRef);

  if (!teacherSnap.exists()) {
    // Create new teacher profile
    await setDoc(teacherRef, {
      id: user.uid,
      schoolId: 'demo-school', // Hardcoded for Phase 1
      name: user.displayName || 'Unknown Teacher',
      email: user.email,
      role: 'teacher',
      createdAt: Date.now(),
    });
  }

  return user;
};

export const logout = () => {
  if (!auth) throw new Error('Firebase is not configured.');
  return firebaseSignOut(auth);
};

export const subscribeToAuth = (callback: (user: User | null) => void) => {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};
