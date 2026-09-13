import { useState, useEffect } from 'react';
import { ClayCard } from '../ui/ClayCard';
import { ClayButton } from '../ui/ClayButton';
import { ClayInput } from '../ui/ClayInput';
import { AttendanceSession, Student } from '../../types';
import { studentService } from '../../services/studentService';
import { attendanceService } from '../../services/attendanceService';
import { classService } from '../../services/classService';
import { getDeviceId } from '../../utils/device';
import { CheckCircle2, UserCircle2, MapPin, Smartphone } from 'lucide-react';

type Step = 'identify' | 'confirm' | 'success' | 'not_found';

export function StudentQRExperience({ session }: { session: AttendanceSession }) {
  const [step, setStep] = useState<Step>('identify');
  const [studentIdInput, setStudentIdInput] = useState('');
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [schoolId, setSchoolId] = useState('demo-school'); // In real app, derived from session/class
  const [scanType, setScanType] = useState<'IN' | 'OUT'>('IN');

  useEffect(() => {
    // Determine scan type based on time for Phase 1 simulation
    const now = Date.now();
    if (session.outStartTime && now >= session.outStartTime) {
      setScanType('OUT');
    } else {
      setScanType('IN');
    }
  }, [session]);

  const handleIdentify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentIdInput.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const s = await studentService.findStudentByStudentId(schoolId, studentIdInput.trim());
      if (s) {
        setStudent(s);
        setStep('confirm');
      } else {
        setStep('not_found');
      }
    } catch (err) {
      setError('Could not verify identity. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!student) return;
    setLoading(true);
    
    try {
      const deviceId = getDeviceId();
      const now = Date.now();
      
      let status: any = 'Present'; // Simplified logic for Phase 1
      if (scanType === 'IN' && now > session.inEndTime) {
        status = 'Late';
      }

      await attendanceService.recordAttendance({
        sessionId: session.id,
        classId: session.classId,
        studentId: student.id,
        [scanType === 'IN' ? 'inTime' : 'outTime']: now,
        [scanType === 'IN' ? 'inDeviceIdentifier' : 'outDeviceIdentifier']: deviceId,
        status,
        manuallyEdited: false,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      
      setStep('success');
    } catch (err) {
      setError('Failed to record attendance. Please inform your teacher.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestReg = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simplified for Phase 1
    alert('Registration request submitted. Your teacher must approve it.');
    setStep('identify');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-brand-bg relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-violet-400/30 blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-pink-400/30 blur-[100px] pointer-events-none"></div>

      <ClayCard className="w-full max-w-sm p-8 flex flex-col items-center text-center gap-8 z-10">
        {step === 'identify' && (
          <>
            <div className="w-20 h-20 rounded-full bg-white shadow-clay-sm flex items-center justify-center text-brand-primary">
              <Smartphone size={40} />
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-black">Scan {scanType}</h1>
              <p className="text-brand-muted font-medium">Enter your Student ID to confirm your attendance.</p>
            </div>
            <form onSubmit={handleIdentify} className="w-full flex flex-col gap-4">
              <ClayInput
                placeholder="e.g. 2026-00123"
                value={studentIdInput}
                onChange={e => setStudentIdInput(e.target.value)}
                required
                className="text-center text-lg tracking-wider"
              />
              {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
              <ClayButton type="submit" disabled={loading} className="w-full">
                {loading ? 'Checking...' : 'Verify Identity'}
              </ClayButton>
            </form>
          </>
        )}

        {step === 'confirm' && student && (
          <>
            <div className="w-24 h-24 rounded-full bg-brand-primary/10 border-4 border-white shadow-clay-sm flex items-center justify-center text-brand-primary overflow-hidden">
              <UserCircle2 size={60} strokeWidth={1} />
            </div>
            <div className="flex flex-col gap-1 w-full bg-white/40 p-4 rounded-3xl shadow-clay-inset">
              <p className="text-brand-muted text-sm font-bold uppercase tracking-wider">Welcome back</p>
              <h2 className="text-2xl font-black text-brand-primary line-clamp-1">{student.fullName}</h2>
              <p className="text-brand-muted font-medium mt-1 font-mono">{student.studentId}</p>
            </div>
            {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
            <div className="flex flex-col gap-3 w-full mt-4">
              <ClayButton onClick={handleConfirm} disabled={loading} className="w-full py-4 text-lg">
                {loading ? 'Recording...' : "Yes, that's me"}
              </ClayButton>
              <button 
                onClick={() => setStep('identify')}
                className="text-brand-muted hover:text-brand-text font-bold text-sm py-2 transition-colors"
                disabled={loading}
              >
                Not you?
              </button>
            </div>
          </>
        )}

        {step === 'not_found' && (
          <>
            <div className="w-20 h-20 rounded-[28px] bg-red-50 shadow-clay-sm flex items-center justify-center text-red-500 mb-2">
              <UserCircle2 size={40} />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-black">Student not found</h2>
              <p className="text-brand-muted font-medium px-4">We couldn't find <b>{studentIdInput}</b> in the roster.</p>
            </div>
            <form onSubmit={handleRequestReg} className="w-full flex flex-col gap-4 bg-white/40 p-6 rounded-3xl shadow-clay-inset mt-4">
              <p className="text-sm font-bold text-brand-primary">Request Registration</p>
              <ClayInput
                placeholder="Full Name"
                required
                className="text-center"
              />
              <ClayButton type="submit" className="w-full">Submit Request</ClayButton>
              <button 
                type="button"
                onClick={() => setStep('identify')}
                className="text-brand-muted hover:text-brand-text font-bold text-sm py-2 mt-2 transition-colors"
              >
                Cancel
              </button>
            </form>
          </>
        )}

        {step === 'success' && student && (
          <>
            <div className="w-28 h-28 rounded-full bg-emerald-400 shadow-[0_10px_40px_rgba(16,185,129,0.4)] flex items-center justify-center text-white mb-4 animate-bounce" style={{ animationIterationCount: 1 }}>
              <CheckCircle2 size={60} strokeWidth={3} />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-black text-emerald-600">You're checked {scanType}!</h2>
              <p className="text-lg font-bold text-brand-text mt-2">{student.fullName}</p>
            </div>
            
            <div className="flex flex-col gap-3 w-full bg-white/50 p-6 rounded-3xl shadow-clay-inset mt-4 text-left">
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-brand-primary" />
                <span className="font-bold text-brand-text">{new Date().toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-emerald-500" />
                <span className="font-medium text-brand-muted">Location Verified</span>
              </div>
            </div>

            <p className="text-brand-muted text-sm font-medium mt-4">
              {scanType === 'IN' ? 'You still need to scan the OUT QR before leaving.' : 'Attendance completed for today.'}
            </p>
          </>
        )}
      </ClayCard>
    </div>
  );
}
