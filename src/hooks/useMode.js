import { useEffect, useState } from 'react';
import { getMode, setMode, onModeChange } from '../lib/theme';

/** The user's light / dark choice: [mode, toggle, setMode]. */
export default function useMode() {
  const [mode, set] = useState(getMode);
  useEffect(() => onModeChange(set), []);
  return [mode, () => setMode(mode === 'dark' ? 'light' : 'dark'), setMode];
}
