import { ClayCard } from '../components/ui/ClayCard';
import { ClayButton } from '../components/ui/ClayButton';
import { ClayBadge } from '../components/ui/ClayBadge';
import { CreditCard, Check } from 'lucide-react';

export function Billing() {
  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black">Billing & Plans</h1>
        <p className="text-brand-muted font-medium">Manage your subscription.</p>
      </div>

      <ClayCard className="p-6 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 border-none">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CreditCard className="text-brand-primary" />
              Trial Active
            </h2>
            <p className="text-brand-muted mt-1">You have 5 days remaining in your free trial.</p>
          </div>
          <ClayBadge variant="success" className="px-4 py-2">5 Days Left</ClayBadge>
        </div>
      </ClayCard>

      <div className="grid md:grid-cols-2 gap-6">
        <ClayCard className="p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-black text-brand-primary">Teacher Plan</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black">$9</span>
              <span className="text-brand-muted font-bold">/ month</span>
            </div>
            <p className="text-brand-muted mt-2">Perfect for individual teachers managing their own classes.</p>
          </div>

          <div className="flex flex-col gap-3 mt-4 flex-1">
            {['Unlimited classes', 'Unlimited students', 'Basic reports', 'Email support'].map(f => (
              <div key={f} className="flex items-center gap-3">
                <Check size={20} className="text-emerald-500" />
                <span className="font-bold text-brand-text">{f}</span>
              </div>
            ))}
          </div>

          <ClayButton className="w-full mt-auto">Upgrade Now</ClayButton>
        </ClayCard>

        <ClayCard className="p-8 flex flex-col gap-6 border-2 border-brand-primary/20">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-black text-brand-secondary">School Plan</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black">$99</span>
              <span className="text-brand-muted font-bold">/ month</span>
            </div>
            <p className="text-brand-muted mt-2">For small to medium schools wanting unified attendance.</p>
          </div>

          <div className="flex flex-col gap-3 mt-4 flex-1">
            {['Everything in Teacher', 'Admin dashboard', 'Custom export formats (SF2)', 'Priority support', 'Location restriction bypass'].map(f => (
              <div key={f} className="flex items-center gap-3">
                <Check size={20} className="text-brand-secondary" />
                <span className="font-bold text-brand-text">{f}</span>
              </div>
            ))}
          </div>

          <ClayButton variant="secondary" className="w-full mt-auto">Contact Sales</ClayButton>
        </ClayCard>
      </div>
    </div>
  );
}
