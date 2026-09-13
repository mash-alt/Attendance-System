import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { subscribeToAuth, loginWithGoogle, logout as signOut } from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>({
    uid: 'mock-user-id',
    displayName: 'Mock Teacher',
    email: 'mock@example.com'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Firebase auth temporarily disabled for inspection
    // const unsubscribe = subscribeToAuth((u) => {
    //   setUser(u);
    //   setLoading(false);
    // });
    // return () => unsubscribe();
  }, []);

  const login = async () => {
    // await loginWithGoogle();
    setUser({
      uid: 'mock-user-id',
      displayName: 'Mock Teacher',
      email: 'mock@example.com'
    });
  };

  const logout = async () => {
    // await signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
