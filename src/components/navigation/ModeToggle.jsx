// Light / dark switch. Dark is the default; the choice is remembered on this device.
import { Sun, Moon } from 'lucide-react';
import useMode from '../../hooks/useMode';

export default function ModeToggle({ className = '' }) {
  const [mode, toggle] = useMode();
  const dark = mode !== 'light';
  return (
    <button type="button" onClick={toggle} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} title={dark ? 'Light mode' : 'Dark mode'}
      className={`relative w-[52px] h-7 rounded-full border border-white/10 bg-white/[.06] transition-colors shrink-0 ${className}`}>
      <span className={`absolute top-[3px] left-[3px] w-5 h-5 rounded-full flex items-center justify-center shadow-md transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] ${dark ? 'translate-x-0 bg-zinc-800 text-blue-300' : 'translate-x-6 bg-amber-400 text-white'}`}>
        {dark ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
      </span>
    </button>
  );
}
