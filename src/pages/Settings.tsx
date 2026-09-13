import { ClayCard } from '../components/ui/ClayCard';
import { ClayButton } from '../components/ui/ClayButton';
import { ClayInput } from '../components/ui/ClayInput';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Settings() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black">Settings</h1>
        <p className="text-brand-muted font-medium">Manage your preferences and school defaults.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <ClayCard className="p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <SettingsIcon className="text-brand-primary" />
            Profile
          </h2>
          <div className="flex flex-col gap-4">
            <ClayInput label="Full Name" defaultValue={user?.displayName || ''} />
            <ClayInput label="Email" defaultValue={user?.email || ''} disabled />
            <ClayButton className="w-fit mt-4 gap-2"><Save size={18} /> Save Changes</ClayButton>
          </div>
        </ClayCard>

        <ClayCard className="p-8">
          <h2 className="text-xl font-bold mb-6">Export Format</h2>
          <p className="text-brand-muted text-sm font-medium mb-6">Different institutions may require different attendance reports.</p>
          
          <div className="flex flex-col gap-4">
            <label className="flex items-center gap-3 p-4 bg-white/40 rounded-[20px] shadow-clay-sm cursor-pointer border border-brand-primary/20">
              <input type="radio" name="exportFormat" defaultChecked className="w-5 h-5 accent-brand-primary" />
              <span className="font-bold">Default Attendance Format</span>
            </label>
            <label className="flex items-center gap-3 p-4 bg-white/40 rounded-[20px] cursor-pointer hover:shadow-clay-sm transition-shadow">
              <input type="radio" name="exportFormat" className="w-5 h-5 accent-brand-primary" />
              <span className="font-bold">DepEd SF2</span>
            </label>
            <label className="flex items-center gap-3 p-4 bg-white/40 rounded-[20px] cursor-pointer hover:shadow-clay-sm transition-shadow">
              <input type="radio" name="exportFormat" className="w-5 h-5 accent-brand-primary" />
              <span className="font-bold">Specialized / Custom Format</span>
            </label>
          </div>
        </ClayCard>
      </div>
    </div>
  );
}
