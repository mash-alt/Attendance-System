import { ClayCard } from '../components/ui/ClayCard';
import { ClayButton } from '../components/ui/ClayButton';
import { ClayInput } from '../components/ui/ClayInput';
import { FileText, Download } from 'lucide-react';

export function Reports() {
  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black">Reports</h1>
        <p className="text-brand-muted font-medium">Export attendance data for your classes.</p>
      </div>

      <ClayCard className="p-8 max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
            <FileText size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Generate Export</h2>
            <p className="text-brand-muted text-sm">Select parameters to download CSV/Excel.</p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-brand-muted ml-2">Class</label>
            <select className="w-full bg-[#EBE7F5] rounded-[20px] px-6 py-4 text-brand-text outline-none shadow-clay-inset appearance-none font-medium">
              <option>Select a class...</option>
              <option>Physics 101 - Section A</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ClayInput type="date" label="Start Date" />
            <ClayInput type="date" label="End Date" />
          </div>

          <ClayButton className="w-full gap-2 mt-4">
            <Download size={20} />
            Export Report
          </ClayButton>
        </div>
      </ClayCard>
    </div>
  );
}
