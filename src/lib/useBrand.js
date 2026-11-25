// The site name the admin set (Settings → Website name), fetched once and shared.
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../api/config';

let cached = null;
let pending = null;
export default function useBrand() {
  const [name, setName] = useState(cached || '');
  useEffect(() => {
    if (cached !== null) return undefined;
    let alive = true;
    pending = pending || fetch(`${API_BASE_URL}/public/settings`).then((r) => r.json()).then((d) => { cached = d?.settings?.websiteName || ''; return cached; }).catch(() => { cached = ''; return ''; });
    pending.then((n) => alive && setName(n));
    return () => { alive = false; };
  }, []);
  return name;
}
