import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClayCard } from '../ui/ClayCard';
import { ClayButton } from '../ui/ClayButton';
import { ClayInput } from '../ui/ClayInput';
import { attendanceService } from '../../services/attendanceService';
import { Class } from '../../types';
import { X, Clock } from 'lucide-react';
import { format, addMinutes, startOfMinute } from 'date-fns';

export function StartAttendanceModal({ classId, classData, onClose }: { classId: string, classData: Class, onClose: () => void }) {
  const navigate = useNavigate();
  const now = startOfMinute(new Date());
  
  const [formData, setFormData] = useState({
    date: format(now, 'yyyy-MM-dd'),
    inStart: format(now, 'HH:mm'),
    inEnd: format(addMinutes(now, 15), 'HH:mm'),
    outStart: format(addMinutes(now, 60), 'HH:mm'),
    outEnd: format(addMinutes(now, 75), 'HH:mm'),
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const toTimestamp = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const d = new Date(formData.date);
        d.setHours(hours, minutes, 0, 0);
        return d.getTime();
      };

      const sessionId = await attendanceService.createSession({
        classId,
        attendanceDate: formData.date,
        status: 'active',
        inStartTime: toTimestamp(formData.inStart),
        inEndTime: toTimestamp(formData.inEnd),
        outStartTime: toTimestamp(formData.outStart),
        outEndTime: toTimestamp(formData.outEnd),
        allowedRadius: classData.attendanceRadius,
        qrExpirationSeconds: classData.qrExpirationSeconds,
        createdAt: Date.now()
      });

      onClose();
      navigate(`/attendance/${sessionId}`); // Should redirect to live attendance screen
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-bg/60 backdrop-blur-sm">
      <ClayCard className="w-full max-w-md flex flex-col p-0 overflow-hidden shadow-[0_20px_60px_rgba(124,58,237,0.15)]">
        <div className="p-6 border-b border-white/50 flex justify-between items-center bg-white/50 backdrop-blur-md">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Clock className="text-brand-primary" />
            Start Session
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-full transition-colors text-brand-muted"><X size={24} /></button>
        </div>
        
        <div className="p-6">
          <form id="start-session-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
            <ClayInput
              type="date"
              label="Date"
              required
              value={formData.date}
              onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
            />
            
            <div className="flex flex-col gap-3 p-4 bg-brand-primary/5 rounded-[24px] border border-brand-primary/10">
              <span className="text-sm font-bold text-brand-primary uppercase tracking-wider ml-1">IN Window</span>
              <div className="grid grid-cols-2 gap-4">
                <ClayInput
                  type="time"
                  label="Start"
                  required
                  value={formData.inStart}
                  onChange={e => setFormData(p => ({ ...p, inStart: e.target.value }))}
                />
                <ClayInput
                  type="time"
                  label="End"
                  required
                  value={formData.inEnd}
                  onChange={e => setFormData(p => ({ ...p, inEnd: e.target.value }))}
                />
              </div>
            </div>

            {classData.requireOutScan && (
              <div className="flex flex-col gap-3 p-4 bg-brand-secondary/5 rounded-[24px] border border-brand-secondary/10">
                <span className="text-sm font-bold text-brand-secondary uppercase tracking-wider ml-1">OUT Window</span>
                <div className="grid grid-cols-2 gap-4">
                  <ClayInput
                    type="time"
                    label="Start"
                    required
                    value={formData.outStart}
                    onChange={e => setFormData(p => ({ ...p, outStart: e.target.value }))}
                  />
                  <ClayInput
                    type="time"
                    label="End"
                    required
                    value={formData.outEnd}
                    onChange={e => setFormData(p => ({ ...p, outEnd: e.target.value }))}
                  />
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="p-6 border-t border-white/50 flex gap-4 bg-white/50 backdrop-blur-md">
          <ClayButton variant="secondary" onClick={onClose} className="flex-1" type="button">Cancel</ClayButton>
          <ClayButton className="flex-1" type="submit" form="start-session-form" disabled={loading}>
            {loading ? 'Starting...' : 'Start Now'}
          </ClayButton>
        </div>
      </ClayCard>
    </div>
  );
}
