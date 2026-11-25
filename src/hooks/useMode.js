import { useEffect, useState } from 'react';
import { getMode, getModePref, setMode, onModeChange } from '../lib/theme';

/**
 * Light / dark mode: [mode on screen, cycle, setPref, pref].
 * pref is 'system' (follow the device), 'light' or 'dark'. cycle goes system → light → dark.
 */
export default function useMode() {
  const [mode, setM] = useState(getMode);
  const [pref, setP] = useState(getModePref);
  useEffect(() => onModeChange((m, p) => { setM(m); setP(p); }), []);
  const cycle = () => setMode(pref === 'system' ? 'light' : pref === 'light' ? 'dark' : 'system');
  return [mode, cycle, setMode, pref];
}
