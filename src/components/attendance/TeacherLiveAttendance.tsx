import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClayCard } from '../ui/ClayCard';
import { ClayButton } from '../ui/ClayButton';
import { ClayBadge } from '../ui/ClayBadge';
import { AttendanceSession, AttendanceRecord, Class } from '../../types';
import { attendanceService } from '../../services/attendanceService';
import { classService } from '../../services/classService';
import { ArrowLeft, QrCode, StopCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

export function TeacherLiveAttendance({ session }: { session: AttendanceSession }) {
  const navigate = useNavigate();
  const [classData, setClassData] = useState<Class | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'IN' | 'OUT'>('IN');

  useEffect(() => {
    classService.getClass(session.classId).then(setClassData);
    const unsub = attendanceService.subscribeToRecords(session.id, setRecords);
    return () => unsub();
  }, [session]);

  const handleEndSession = async () => {
    if (confirm('Are you sure you want to end this attendance session?')) {
      await attendanceService.endSession(session.id);
      navigate(`/classes/${session.classId}`);
    }
  };

  if (!classData) return <div className="p-8 text-center animate-pulse">Loading Live View...</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full min-h-[80vh]">
      {/* Left Panel: QR Code and Controls */}
      <div className="flex flex-col gap-6 lg:w-[450px] shrink-0">
        <div className="flex flex-col gap-2">
          <button onClick={() => navigate(`/classes/${session.classId}`)} className="flex items-center gap-2 text-brand-muted hover:text-brand-primary w-fit font-bold transition-colors mb-2">
            <ArrowLeft size={20} />
            Back to Class
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-black">{classData.className}</h1>
              <p className="text-brand-muted font-medium">{classData.section} &middot; {session.attendanceDate}</p>
            </div>
            <ClayBadge variant={session.status === 'active' ? 'success' : 'default'} className="mt-2">
              {session.status.toUpperCase()}
            </ClayBadge>
          </div>
        </div>

        {/* Segmented Control */}
        <div className="flex p-1 bg-white/40 rounded-full shadow-clay-inset backdrop-blur-sm">
          {(['IN', 'OUT'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'flex-1 py-3 rounded-full font-bold text-sm transition-all',
                activeTab === tab
                  ? 'bg-brand-primary text-white shadow-[0_4px_12px_rgba(124,58,237,0.3)]'
                  : 'text-brand-muted hover:text-brand-text'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <ClayCard className="p-8 flex flex-col items-center justify-center gap-6">
          {/* Phase 1 Placeholder for QR */}
          <div className="w-64 h-64 bg-white rounded-3xl shadow-clay-inset p-4 flex flex-col items-center justify-center gap-4 relative">
            <QrCode size={120} className="text-brand-primary/20" />
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center rounded-3xl text-center p-4">
              <QrCode size={40} className="text-brand-primary mb-2" />
              <p className="font-bold text-brand-text">Dynamic QR Engine</p>
              <p className="text-xs text-brand-muted mt-1">To be implemented in Phase 2</p>
            </div>
          </div>
          
          <div className="bg-[#EBE7F5] rounded-full px-6 py-3 shadow-clay-inset">
            <p className="font-bold text-brand-primary text-sm text-center">QR refreshes in 24 seconds</p>
          </div>
          
          <div className="w-full flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-brand-muted">Allowed Radius</span>
              <span className="font-bold">{session.allowedRadius}m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Window</span>
              <span className="font-bold">
                {activeTab === 'IN' 
                  ? `${new Date(session.inStartTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${new Date(session.inEndTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
                  : (session.outStartTime ? `${new Date(session.outStartTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${new Date(session.outEndTime!).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : 'N/A')
                }
              </span>
            </div>
          </div>
        </ClayCard>

        <ClayButton variant="danger" className="w-full gap-2" onClick={handleEndSession}>
          <StopCircle size={20} />
          End Session
        </ClayButton>
      </div>

      {/* Right Panel: Live Roster */}
      <div className="flex-1 flex flex-col gap-4">
        <ClayCard className="flex-1 p-0 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/40 flex justify-between items-center bg-white/20">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              Live Attendance
            </h2>
            <ClayBadge variant="info" className="px-4 py-2">
              <span className="font-black text-sm">{records.length}</span> / -- Students {activeTab}
            </ClayBadge>
          </div>
          
          <div className="flex-1 overflow-y-auto p-0">
            {records.length === 0 ? (
              <div className="h-full flex items-center justify-center text-brand-muted font-medium p-8 text-center">
                Waiting for students to scan the {activeTab} QR code...
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-[#F4F1FA] shadow-sm z-10">
                  <tr>
                    <th className="p-4 font-bold text-brand-muted text-sm uppercase tracking-wider">Student ID</th>
                    <th className="p-4 font-bold text-brand-muted text-sm uppercase tracking-wider">Time</th>
                    <th className="p-4 font-bold text-brand-muted text-sm uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map(r => (
                    <tr key={r.id} className="border-b border-white/60 last:border-0 hover:bg-white/40 transition-colors">
                      <td className="p-4 font-bold">{r.studentId}</td>
                      <td className="p-4 font-medium text-brand-muted">
                        {new Date(activeTab === 'IN' ? (r.inTime || r.createdAt) : (r.outTime || r.updatedAt)).toLocaleTimeString()}
                      </td>
                      <td className="p-4">
                        <ClayBadge variant={
                          r.status === 'Present' ? 'success' : 
                          r.status === 'Late' ? 'warning' : 
                          r.status === 'Absent' ? 'error' : 'default'
                        }>{r.status}</ClayBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </ClayCard>
      </div>
    </div>
  );
}
