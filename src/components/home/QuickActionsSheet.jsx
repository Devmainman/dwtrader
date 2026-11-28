// "More" from the dashboard hero: every money and product shortcut in one sheet.
import { useNavigate } from 'react-router-dom';
import {
  PieChart, History, Wallet, Gift, Users, Layers, Cpu, Copy, LineChart, Building2, CreditCard, Trophy, Lock, Bot, Bitcoin
} from 'lucide-react';
import { Sheet } from '../wallet/shared';

const GROUPS = [
  { title: 'Money', items: [
    { to: '/wallet', icon: Bitcoin, label: 'Crypto wallets' },
    { to: '/assets', icon: PieChart, label: 'Portfolio' },
    { to: '/transactionhistory', icon: History, label: 'History' },
    { to: '/wallets', icon: Wallet, label: 'Connect wallet' },
    { to: '/cold-storage', icon: Lock, label: 'Vault' },
    { to: '/cards', icon: CreditCard, label: 'Cards' }
  ] },
  { title: 'Grow', items: [
    { to: '/copytrade', icon: Copy, label: 'Copy trading' },
    { to: '/trade', icon: Bot, label: 'Plans' },
    { to: '/invest', icon: LineChart, label: 'Stocks' },
    { to: '/staking', icon: Layers, label: 'Staking' },
    { to: '/real-estate', icon: Building2, label: 'Real estate' },
    { to: '/mining', icon: Cpu, label: 'Mining' }
  ] },
  { title: 'Earn', items: [
    { to: '/rewards', icon: Trophy, label: 'Rewards' },
    { to: '/referrals', icon: Users, label: 'Refer & earn' },
    { to: '/ai-trader', icon: Gift, label: 'AI Trader' }
  ] }
];

export default function QuickActionsSheet({ onClose }) {
  const navigate = useNavigate();
  const go = (to) => { onClose(); navigate(to); };
  return (
    <Sheet title="Everything" note="All your money and products, one tap away." onClose={onClose}>
      <div className="space-y-4 pt-1">
        {GROUPS.map((g) => (
          <div key={g.title}>
            <p className="text-[11px] uppercase tracking-wide text-neutral-500 mb-2">{g.title}</p>
            <div className="grid grid-cols-4 gap-y-3 gap-x-2 ui-stagger">
              {g.items.map((a) => (
                <button key={a.to} type="button" onClick={() => go(a.to)} className="flex flex-col items-center gap-1.5 active:scale-90 transition-transform">
                  <span className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/[.06] border border-white/[.07] text-zinc-100"><a.icon className="w-5 h-5" strokeWidth={1.8} /></span>
                  <span className="text-[11px] text-neutral-400 text-center leading-tight">{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Sheet>
  );
}
