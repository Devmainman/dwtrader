// /signal-packages — signal packages from the admin (GET /public/signal-packages).
// Buying goes through /signal-payment, which adds the strength once the payment is approved.
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Signal, Check, Zap } from "lucide-react";
import { useUserAuth } from "../../context/UserAuthContext";
import { API_BASE_URL, STATIC_BASE_URL } from "../../api/config";
import { Page, Button, Loading, ErrorState, Empty, formatMoney } from "../products/ui";

function SignalPackage1() {
  const { token } = useUserAuth();
  const navigate = useNavigate();
  const [packages, setPackages] = useState(null);
  const [error, setError] = useState(null);

  const load = async () => {
    setError(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/public/signal-packages`, { headers: { Authorization: `Bearer ${token}` } });
      const data = res.data?.packages || res.data;
      setPackages(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load signal packages. Please try again later.");
      setPackages([]);
    }
  };
  useEffect(() => { if (token) load(); }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const buy = (pkg) => navigate(`/signal-payment?packageId=${pkg._id}&amount=${encodeURIComponent(pkg.amount)}`);

  return (
    <Page title="Signal packages" icon={Signal}>
      {error ? <ErrorState message={error} onRetry={load} />
        : !packages ? <Loading rows={3} />
          : !packages.length ? (
            <div className="dash-panel max-w-[640px]">
              <Empty icon={Signal} title="No signal packages right now" text="New packages will appear here as soon as they are available."
                action={<Button variant="secondary" onClick={() => navigate("/accountupgrade")}>See upgrade plans</Button>} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 max-w-[1080px]">
              {packages.map((pkg) => {
                const strength = pkg.strengthLabel || (pkg.strength != null ? `+${pkg.strength}%` : "");
                return (
                  <article key={pkg._id} className="dash-panel p-5 flex flex-col">
                    <div className="flex items-center gap-3">
                      <span className="w-11 h-11 rounded-2xl bg-white/[.05] border border-white/[.08] flex items-center justify-center overflow-hidden">
                        {pkg.icon ? <img src={`${STATIC_BASE_URL}${pkg.icon}`} alt="" className="w-8 h-8 object-contain" /> : <Zap className="w-5 h-5 text-blue-400" />}
                      </span>
                      <div className="flex-1 min-w-0"><p className="text-[15px] font-semibold tracking-[-0.01em] truncate">{pkg.name}</p></div>
                      {strength && <span className="inline-flex items-center gap-1 h-6 px-2 rounded-full bg-emerald-500/12 text-emerald-400 text-[11px] font-semibold"><Signal className="w-3 h-3" />{strength}</span>}
                    </div>
                    <p className="mt-4 text-[28px] font-light tracking-[-0.03em] tabular-nums leading-none">{formatMoney(pkg.amount, pkg.currency)}</p>
                    <ul className="mt-4 space-y-2 flex-1">
                      {(pkg.benefits || []).map((b, i) => <li key={i} className="flex gap-2 text-[12px] text-neutral-300"><Check className="w-4 h-4 text-emerald-400 shrink-0" />{b}</li>)}
                    </ul>
                    <Button onClick={() => buy(pkg)} className="mt-5 w-full h-11 !text-[13px]">Get {pkg.name}</Button>
                  </article>
                );
              })}
            </div>
          )}
    </Page>
  );
}

export default SignalPackage1;
