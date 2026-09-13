import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ClayCard } from '../components/ui/ClayCard';
import { ClayButton } from '../components/ui/ClayButton';
import { Class } from '../types';
import { classService } from '../services/classService';
import { Users, Plus, Clock, MoreVertical, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CreateClassModal } from '../components/classes/CreateClassModal';

export function Classes() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const navigate = useNavigate();

  const loadClasses = async () => {
    if (user) {
      setLoading(true);
      const data = await classService.getClassesByTeacher(user.uid);
      setClasses(data);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, [user]);

  if (loading) return <div className="p-8 text-center text-brand-muted font-bold animate-pulse">Loading classes...</div>;

  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black">Classes</h1>
          <p className="text-brand-muted font-medium">Manage your class sections and schedules.</p>
        </div>
        <ClayButton onClick={() => setShowCreate(true)} className="gap-2">
          <Plus size={20} />
          <span className="hidden md:inline">Create Class</span>
        </ClayButton>
      </div>

      {classes.length === 0 ? (
        <ClayCard className="p-12 flex flex-col items-center justify-center text-center gap-4 border-2 border-dashed border-brand-muted/20 bg-transparent shadow-none flex-1">
          <div className="w-16 h-16 rounded-full bg-white/50 flex items-center justify-center text-brand-muted">
            <BookOpen size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold">No classes yet</h3>
            <p className="text-brand-muted font-medium mt-2 max-w-sm">You haven't created any classes. Create your first class to start recording attendance.</p>
          </div>
          <ClayButton onClick={() => setShowCreate(true)} className="mt-4">Create Class</ClayButton>
        </ClayCard>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map(c => (
            <ClayCard key={c.id} className="p-6 flex flex-col gap-4 relative group">
              <div className="absolute top-4 right-4 text-brand-muted opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 hover:bg-white/50 rounded-full transition-colors"><MoreVertical size={20} /></button>
              </div>
              <div className="flex flex-col pr-8">
                <h3 className="text-2xl font-bold line-clamp-1">{c.className}</h3>
                <p className="text-brand-muted font-medium">{c.subject} &middot; {c.section}</p>
              </div>
              
              <div className="flex flex-col gap-2 mt-2">
                <div className="bg-[#EBE7F5] rounded-[16px] p-3 text-sm font-bold text-brand-muted shadow-clay-inset flex items-center gap-3">
                  <Clock size={18} className="text-brand-primary" />
                  {c.schedule}
                </div>
                <div className="bg-[#EBE7F5] rounded-[16px] p-3 text-sm font-bold text-brand-muted shadow-clay-inset flex items-center gap-3">
                  <Users size={18} className="text-brand-secondary" />
                  -- Students
                </div>
              </div>
              
              <div className="mt-4 flex gap-3">
                <ClayButton className="flex-1" onClick={() => navigate(`/classes/${c.id}`)}>Manage</ClayButton>
              </div>
            </ClayCard>
          ))}
        </div>
      )}

      {showCreate && (
        <CreateClassModal 
          onClose={() => setShowCreate(false)} 
          onSuccess={() => {
            setShowCreate(false);
            loadClasses();
          }} 
        />
      )}
    </div>
  );
}
