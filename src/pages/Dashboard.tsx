import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ClayCard } from '../components/ui/ClayCard';
import { ClayButton } from '../components/ui/ClayButton';
import { Class } from '../types';
import { classService } from '../services/classService';
import { Users, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      classService.getClassesByTeacher(user.uid).then(data => {
        setClasses(data);
        setLoading(false);
      });
    }
  }, [user]);

  if (loading) {
    return <div className="p-8 text-center text-brand-muted font-bold animate-pulse">Loading dashboard...</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black">Good morning, {user?.displayName?.split(' ')[0] || 'Teacher'}</h1>
        <p className="text-brand-muted text-lg font-medium">Here's today's attendance overview.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <StatCard icon={BookIcon} label="Classes Today" value={classes.length} />
        <StatCard icon={CheckCircle2} label="Present" value="--" color="text-emerald-500" />
        <StatCard icon={Clock} label="Late" value="--" color="text-amber-500" />
        <StatCard icon={AlertCircle} label="Needs Review" value="--" color="text-red-500" />
      </div>

      {/* Today's Classes */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <h2 className="text-2xl font-bold">Your Classes</h2>
          <ClayButton variant="ghost" onClick={() => navigate('/classes')}>View All</ClayButton>
        </div>
        
        {classes.length === 0 ? (
          <ClayCard className="p-12 flex flex-col items-center justify-center text-center gap-4 border-2 border-dashed border-brand-muted/20 bg-transparent shadow-none">
            <div className="w-16 h-16 rounded-full bg-white/50 flex items-center justify-center text-brand-muted">
              <Users size={32} />
            </div>
            <div>
              <h3 className="text-lg font-bold">No classes yet</h3>
              <p className="text-brand-muted">Create your first class to start recording attendance.</p>
            </div>
            <ClayButton onClick={() => navigate('/classes')}>Create Class</ClayButton>
          </ClayCard>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.slice(0, 3).map(c => (
              <ClayCard key={c.id} className="p-6 flex flex-col gap-4">
                <div className="flex flex-col">
                  <h3 className="text-xl font-bold line-clamp-1">{c.className}</h3>
                  <p className="text-brand-muted font-medium">{c.subject} &middot; {c.section}</p>
                </div>
                <div className="bg-[#EBE7F5] rounded-[16px] p-3 text-sm font-bold text-brand-muted shadow-clay-inset flex items-center gap-2">
                  <Clock size={16} />
                  {c.schedule}
                </div>
                <div className="mt-auto pt-4 flex gap-2">
                  <ClayButton className="flex-1" onClick={() => navigate(`/classes/${c.id}`)}>Open</ClayButton>
                  <ClayButton variant="secondary" className="flex-1" onClick={() => navigate(`/classes/${c.id}/attendance`)}>Start</ClayButton>
                </div>
              </ClayCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color = "text-brand-primary" }: any) {
  return (
    <ClayCard className="p-6 flex flex-col gap-4">
      <div className={`w-12 h-12 rounded-[20px] bg-white shadow-clay-sm flex items-center justify-center ${color}`}>
        <Icon size={24} />
      </div>
      <div className="flex flex-col">
        <span className="text-3xl font-black">{value}</span>
        <span className="text-sm font-bold text-brand-muted">{label}</span>
      </div>
    </ClayCard>
  );
}

function BookIcon(props: any) {
  return <Users {...props} />;
}
