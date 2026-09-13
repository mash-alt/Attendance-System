import { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, Users, FileText, Settings, LogOut, BookOpen, CreditCard } from 'lucide-react';
import { cn } from '../../utils/cn';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: BookOpen, label: 'Classes', path: '/classes' },
  { icon: FileText, label: 'Reports', path: '/reports' },
  { icon: Settings, label: 'Settings', path: '/settings' },
  { icon: CreditCard, label: 'Billing', path: '/billing' },
];

export function Layout({ children }: { children: ReactNode }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex w-full max-w-7xl mx-auto p-4 md:p-6 gap-6 relative">
      {/* Sidebar for Desktop, Bottom Nav for Mobile could be added later. We use a responsive sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0">
        <div className="sticky top-6 flex flex-col gap-8">
          <div className="px-4">
            <h1 className="text-2xl font-black text-brand-primary tracking-tight">Class<span className="text-brand-secondary">QR</span></h1>
          </div>

          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all',
                    isActive
                      ? 'bg-white shadow-clay-sm text-brand-primary'
                      : 'text-brand-muted hover:bg-white/40'
                  )
                }
              >
                <item.icon size={20} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto px-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 text-brand-muted hover:text-red-500 font-bold transition-colors py-3"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-full overflow-hidden flex flex-col pb-24 md:pb-0">
        {children}
      </main>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#F4F1FA]/90 backdrop-blur-lg border-t border-white/50 p-4 z-50 rounded-t-3xl shadow-[0_-10px_40px_rgba(160,150,180,0.15)] flex justify-between items-center px-6">
        {navItems.slice(0, 4).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 p-2 rounded-xl transition-all',
                isActive ? 'text-brand-primary scale-110' : 'text-brand-muted'
              )
            }
          >
            <item.icon size={24} />
          </NavLink>
        ))}
      </div>
    </div>
  );
}
