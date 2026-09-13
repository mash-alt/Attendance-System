import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ClayCard } from '../components/ui/ClayCard';
import { ClayButton } from '../components/ui/ClayButton';
import { BookOpen } from 'lucide-react';
import { isConfigValid } from '../config/firebase';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleLogin = async () => {
    try {
      await login();
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Failed to log in', error);
      alert('Failed to log in. See console for details.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <ClayCard className="w-full max-w-md p-8 md:p-12 flex flex-col items-center text-center gap-8">
        <div className="w-20 h-20 rounded-[28px] bg-white shadow-clay-sm flex items-center justify-center text-brand-primary mb-2">
          <BookOpen size={40} />
        </div>
        
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black">Class<span className="text-brand-secondary">QR</span></h1>
          <p className="text-brand-muted font-medium">Fast QR-based classroom attendance system.</p>
        </div>

        {!isConfigValid ? (
          <div className="bg-red-100/50 text-red-600 p-4 rounded-[20px] shadow-clay-inset w-full text-sm font-medium">
            Firebase configuration is missing. Please add credentials to your environment variables or .env file.
          </div>
        ) : (
          <ClayButton onClick={handleLogin} className="w-full">
            Continue with Google
          </ClayButton>
        )}
      </ClayCard>
    </div>
  );
}
