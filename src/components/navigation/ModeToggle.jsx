// Appearance controls. `ModeToggle` is the round top-bar button (System → Light → Dark);
// `ModeSwitch` is the three-way segmented control for Settings.
import { Sun, Moon, MonitorSmartphone } from 'lucide-react';
import useMode from '../../hooks/useMode';

const ICON = { system: MonitorSmartphone, light: Sun, dark: Moon };
const LABEL = { system: 'Match device', light: 'Light', dark: 'Dark' };
const NEXT = { system: 'light', light: 'dark', dark: 'system' };

export default function ModeToggle({ className = '' }) {
  const [, cycle, , pref] = useMode();
  return (
    <button type="button" data-no-busy onClick={cycle} aria-label={`Appearance: ${LABEL[pref]}. Switch to ${LABEL[NEXT[pref]]}`} title={`Appearance: ${LABEL[pref]}`}
      className={`topbar-btn relative overflow-hidden ${className}`}>
      {Object.entries(ICON).map(([k, I]) => (
        <I key={k} aria-hidden strokeWidth={1.9}
          className={`absolute w-[18px] h-[18px] transition-all duration-500 ease-[cubic-bezier(.34,1.56,.64,1)] ${pref === k ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'} ${k === 'light' ? 'text-amber-400' : k === 'dark' ? 'text-blue-300' : ''}`} />
      ))}
    </button>
  );
}

export function ModeSwitch() {
  const [, , setPref, pref] = useMode();
  const keys = ['system', 'light', 'dark'];
  const i = keys.indexOf(pref);
  return (
    <div className="relative grid grid-cols-3 p-1 rounded-full bg-white/[.04] border border-white/[.07]" role="radiogroup" aria-label="Appearance" data-no-busy>
      <span aria-hidden className="absolute top-1 bottom-1 left-1 rounded-full bg-white/[.1] transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)]"
        style={{ width: 'calc((100% - 8px) / 3)', transform: `translateX(${i * 100}%)` }} />
      {keys.map((k) => {
        const I = ICON[k];
        return (
          <button key={k} type="button" role="radio" aria-checked={pref === k} onClick={() => setPref(k)}
            className={`relative h-8 rounded-full flex items-center justify-center gap-1.5 text-[11px] font-semibold transition-colors ${pref === k ? 'text-zinc-100' : 'text-neutral-500 hover:text-zinc-300'}`}>
            <I className="w-3.5 h-3.5" />{k === 'system' ? 'Auto' : LABEL[k]}
          </button>
        );
      })}
    </div>
  );
}
