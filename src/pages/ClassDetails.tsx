import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClayCard } from '../components/ui/ClayCard';
import { ClayButton } from '../components/ui/ClayButton';
import { ClayBadge } from '../components/ui/ClayBadge';
import { classService } from '../services/classService';
import { Class, Student, RegistrationRequest } from '../types';
import { ArrowLeft, Users, CheckCircle2, UserPlus, Play } from 'lucide-react';
import { StartAttendanceModal } from '../components/attendance/StartAttendanceModal';
import { cn } from '../utils/cn';

export function ClassDetails() {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const [classData, setClassData] = useState<Class | null>(null);
  const [students, setStudents] = useState<(Student & { enrollmentStatus: string })[]>([]);
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'attendance' | 'settings'>('overview');
  const [showStartModal, setShowStartModal] = useState(false);

  useEffect(() => {
    if (classId) {
      loadData();
    }
  }, [classId]);

  const loadData = async () => {
    if (!classId) return;
    setLoading(true);
    const [cData, sData, rData] = await Promise.all([
      classService.getClass(classId),
      classService.getStudentsInClass(classId),
      classService.getPendingRequests(classId)
    ]);
    setClassData(cData);
    setStudents(sData);
    setRequests(rData);
    setLoading(false);
  };

  if (loading) return <div className="p-8 text-center text-brand-muted font-bold animate-pulse">Loading class details...</div>;
  if (!classData) return <div className="p-8 text-center text-red-500 font-bold">Class not found.</div>;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'students', label: 'Students' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex flex-col gap-4">
        <button onClick={() => navigate('/classes')} className="flex items-center gap-2 text-brand-muted hover:text-brand-primary w-fit font-bold transition-colors">
          <ArrowLeft size={20} />
          Back to Classes
        </button>
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl font-black text-brand-primary">{classData.className}</h1>
            <p className="text-brand-muted font-medium text-lg">{classData.subject} &middot; {classData.section}</p>
          </div>
          <ClayButton onClick={() => setShowStartModal(true)} className="gap-2 shrink-0">
            <Play size={20} fill="currentColor" />
            <span className="hidden sm:inline">Start Attendance</span>
          </ClayButton>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              'px-6 py-3 rounded-[20px] font-bold text-sm transition-all whitespace-nowrap',
              activeTab === tab.id 
                ? 'bg-white text-brand-primary shadow-clay-sm' 
                : 'text-brand-muted hover:bg-white/40'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col">
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-6">
            <ClayCard className="p-6 flex flex-col gap-4">
              <h3 className="text-xl font-bold mb-2">Class Info</h3>
              <InfoRow label="Schedule" value={classData.schedule} />
              <InfoRow label="Students Enrolled" value={students.length.toString()} />
              <InfoRow label="Attendance Radius" value={`${classData.attendanceRadius}m`} />
              <InfoRow label="QR Expiration" value={`${classData.qrExpirationSeconds}s`} />
            </ClayCard>
            {requests.length > 0 && (
              <ClayCard className="p-6 flex flex-col gap-4 border-2 border-brand-secondary/30">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold flex items-center gap-2 text-brand-secondary">
                    <UserPlus size={20} />
                    Pending Requests
                  </h3>
                  <ClayBadge variant="error">{requests.length}</ClayBadge>
                </div>
                <p className="text-brand-muted text-sm font-medium">There are students waiting to be approved for this class.</p>
                <ClayButton variant="secondary" onClick={() => setActiveTab('students')}>Review Requests</ClayButton>
              </ClayCard>
            )}
          </div>
        )}

        {activeTab === 'students' && (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Roster</h2>
              <ClayButton variant="secondary" className="gap-2 text-sm h-10 px-4">
                <UserPlus size={16} />
                Add Student
              </ClayButton>
            </div>
            
            <ClayCard className="p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/40 border-b border-white/60">
                      <th className="p-4 font-bold text-brand-muted">Student ID</th>
                      <th className="p-4 font-bold text-brand-muted">Name</th>
                      <th className="p-4 font-bold text-brand-muted">Status</th>
                      <th className="p-4 font-bold text-brand-muted">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-brand-muted font-medium">No students enrolled yet.</td>
                      </tr>
                    ) : (
                      students.map(s => (
                        <tr key={s.id} className="border-b border-white/40 last:border-0 hover:bg-white/20 transition-colors">
                          <td className="p-4 font-medium">{s.studentId}</td>
                          <td className="p-4 font-bold text-brand-text">{s.fullName}</td>
                          <td className="p-4"><ClayBadge variant="success">Enrolled</ClayBadge></td>
                          <td className="p-4">
                            <button className="text-brand-primary font-bold text-sm hover:underline">Edit</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </ClayCard>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="flex flex-col gap-6">
             <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Recent Sessions</h2>
            </div>
            <ClayCard className="p-12 flex flex-col items-center justify-center text-center gap-4 border-2 border-dashed border-brand-muted/20 bg-transparent shadow-none">
              <div className="w-16 h-16 rounded-full bg-white/50 flex items-center justify-center text-brand-muted">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-lg font-bold">No sessions yet</h3>
              <p className="text-brand-muted">Start an attendance session when your class begins.</p>
              <ClayButton onClick={() => setShowStartModal(true)}>Start Session</ClayButton>
            </ClayCard>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <ClayCard className="p-6">
            <p className="text-brand-muted font-medium">Class settings will be implemented in Phase 2.</p>
          </ClayCard>
        )}
      </div>

      {showStartModal && (
        <StartAttendanceModal 
          classId={classData.id} 
          classData={classData}
          onClose={() => setShowStartModal(false)}
        />
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/30 last:border-0">
      <span className="text-brand-muted font-medium">{label}</span>
      <span className="font-bold text-brand-text text-right">{value}</span>
    </div>
  );
}
