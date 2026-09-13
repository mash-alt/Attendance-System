import { useState } from 'react';
import { ClayCard } from '../ui/ClayCard';
import { ClayButton } from '../ui/ClayButton';
import { ClayInput } from '../ui/ClayInput';
import { classService } from '../../services/classService';
import { useAuth } from '../../contexts/AuthContext';
import { X } from 'lucide-react';

export function CreateClassModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    className: '',
    subject: '',
    section: '',
    schedule: '',
    attendanceRadius: 150,
    qrExpirationSeconds: 30,
    lateGracePeriodMinutes: 15,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      setLoading(true);
      setError('');
      await classService.createClass({
        ...formData,
        teacherId: user.uid,
        schoolId: 'demo-school',
        requireOutScan: true,
        archived: false,
        createdAt: Date.now()
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to create class');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-bg/60 backdrop-blur-sm">
      <ClayCard className="w-full max-w-lg max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <div className="p-6 border-b border-white/50 flex justify-between items-center bg-white/30">
          <h2 className="text-2xl font-bold">Create Class</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-full transition-colors text-brand-muted"><X size={24} /></button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          <form id="create-class-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
            {error && <div className="text-red-500 font-bold bg-red-100 p-3 rounded-xl">{error}</div>}
            
            <ClayInput
              label="Class Name"
              placeholder="e.g. Physics 101"
              required
              value={formData.className}
              onChange={e => setFormData(p => ({ ...p, className: e.target.value }))}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <ClayInput
                label="Subject"
                placeholder="e.g. Science"
                required
                value={formData.subject}
                onChange={e => setFormData(p => ({ ...p, subject: e.target.value }))}
              />
              <ClayInput
                label="Section"
                placeholder="e.g. Section A"
                required
                value={formData.section}
                onChange={e => setFormData(p => ({ ...p, section: e.target.value }))}
              />
            </div>
            
            <ClayInput
              label="Schedule"
              placeholder="e.g. MWF 9:00 AM - 10:30 AM"
              required
              value={formData.schedule}
              onChange={e => setFormData(p => ({ ...p, schedule: e.target.value }))}
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-brand-muted ml-2">Attendance Radius</label>
                <select 
                  className="w-full bg-[#EBE7F5] rounded-[20px] px-6 py-4 text-brand-text outline-none shadow-clay-inset appearance-none font-medium"
                  value={formData.attendanceRadius}
                  onChange={e => setFormData(p => ({ ...p, attendanceRadius: Number(e.target.value) }))}
                >
                  <option value={50}>50 meters</option>
                  <option value={100}>100 meters</option>
                  <option value={150}>150 meters (Default)</option>
                  <option value={250}>250 meters</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-brand-muted ml-2">QR Expiration</label>
                <select 
                  className="w-full bg-[#EBE7F5] rounded-[20px] px-6 py-4 text-brand-text outline-none shadow-clay-inset appearance-none font-medium"
                  value={formData.qrExpirationSeconds}
                  onChange={e => setFormData(p => ({ ...p, qrExpirationSeconds: Number(e.target.value) }))}
                >
                  <option value={30}>30 seconds (Default)</option>
                  <option value={60}>60 seconds</option>
                  <option value={90}>90 seconds</option>
                </select>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-brand-muted ml-2">Late Grace Period (Minutes)</label>
              <select 
                className="w-full bg-[#EBE7F5] rounded-[20px] px-6 py-4 text-brand-text outline-none shadow-clay-inset appearance-none font-medium"
                value={formData.lateGracePeriodMinutes}
                onChange={e => setFormData(p => ({ ...p, lateGracePeriodMinutes: Number(e.target.value) }))}
              >
                <option value={0}>0 minutes</option>
                <option value={5}>5 minutes</option>
                <option value={10}>10 minutes</option>
                <option value={15}>15 minutes (Default)</option>
                <option value={30}>30 minutes</option>
              </select>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-white/50 flex gap-4 bg-white/30">
          <ClayButton variant="secondary" onClick={onClose} className="flex-1" type="button">Cancel</ClayButton>
          <ClayButton className="flex-1" type="submit" form="create-class-form" disabled={loading}>
            {loading ? 'Creating...' : 'Create Class'}
          </ClayButton>
        </div>
      </ClayCard>
    </div>
  );
}
