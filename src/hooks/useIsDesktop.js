import { useEffect, useState } from 'react';

// Same breakpoint App.jsx uses to choose the desktop layout (> 768px).
const QUERY = '(min-width: 769px)';

export default function useIsDesktop() {
  const [desktop, setDesktop] = useState(() => typeof window !== 'undefined' && window.matchMedia(QUERY).matches);
  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const on = () => setDesktop(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return desktop;
}
