// /accountupgrade — the plans the admin set up, as a swipeable carousel. The centred plan is
// raised with a turning glow border; side plans tilt and dim. Subscribing goes through the
// payment page; the upgrade applies once the payment is approved.
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Crown, Check, Signal, Clock, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { useUserAuth } from "../../context/UserAuthContext";
import { API_BASE_URL, STATIC_BASE_URL } from "../../api/config";
import { Page, Button, Modal, Loading, ErrorState, Empty, Progress, formatMoney } from "../products/ui";

const buzz = () => { try { if (navigator.userActivation?.hasBeenActive && window.matchMedia("(pointer: coarse)").matches) navigator.vibrate?.(6); } catch { /* */ } };

function PlanCard({ pkg, current, userSignal, onSubscribe, featured, active, index }) {
  const [imgOk, setImgOk] = useState(true);
  const need = Number(pkg.requiredSignal || 0);
  const short = need > userSignal;
  const isCurrent = current && current.toLowerCase() === String(pkg.name).toLowerCase();
  return (
    <article className={`plan-card ${active ? "is-active" : ""}`} style={{ animationDelay: `${120 + index * 90}ms` }}>
      <div className="plan-inner p-5 flex flex-col h-full">
        {featured && <span className="absolute top-4 right-4 inline-flex items-center gap-1 h-6 px-2.5 rounded-full bg-blue-600 text-white text-[10px] font-semibold plan-badge"><Sparkles className="w-3 h-3" />Popular</span>}
        <span className="plan-icon w-14 h-14 rounded-[18px] flex items-center justify-center overflow-hidden">
          {pkg.icon && imgOk ? <img src={`${STATIC_BASE_URL}${pkg.icon}`} alt="" className="w-9 h-9 object-contain" onError={() => setImgOk(false)} /> : <Crown className="w-6 h-6 text-white" strokeWidth={1.9} />}
        </span>
        <p className="mt-4 text-[17px] font-semibold tracking-[-0.02em]">{pkg.name}</p>
        {isCurrent ? <p className="text-[11px] text-emerald-400 mt-0.5">Your current plan</p> : <p className="text-[11px] text-neutral-500 mt-0.5">One-time upgrade</p>}
        <p className="mt-3 text-[32px] font-light tracking-[-0.03em] tabular-nums leading-none">{formatMoney(pkg.amount, pkg.currency)}</p>
        <div className="my-4 h-px bg-white/[.07]" />
        <ul className="space-y-2.5 flex-1">
          {(pkg.benefits || []).map((b, i) => (
            <li key={i} className="plan-benefit flex gap-2.5 text-[12px] text-neutral-300" style={{ animationDelay: `${active ? 80 + i * 60 : 0}ms` }}>
              <span className="w-[18px] h-[18px] rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0"><Check className="w-3 h-3" strokeWidth={3} /></span>{b}
            </li>
          ))}
        </ul>
        {need > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-[11px] mb-1.5"><span className="text-neutral-500 flex items-center gap-1"><Signal className="w-3 h-3" />Signal needed</span><span className={short ? "text-amber-400" : "text-emerald-400"}>{userSignal}% / {need}%</span></div>
            <Progress value={(userSignal / Math.max(1, need)) * 100} />
          </div>
        )}
        <Button onClick={() => onSubscribe(pkg)} disabled={isCurrent} variant={active ? "primary" : "secondary"} className="mt-5 w-full h-12 !text-[13px]">
          {isCurrent ? "Current plan" : pkg.paymentPending ? <><Clock className="w-4 h-4" />Payment in review</> : `Upgrade to ${pkg.name}`}
        </Button>
      </div>
    </article>
  );
}

function AccountUpgrade1() {
  const { token, user } = useUserAuth();
  const navigate = useNavigate();
  const [packages, setPackages] = useState(null);
  const [error, setError] = useState(null);
  const [userSignal, setUserSignal] = useState(0);
  const [blocked, setBlocked] = useState(null);
  const [active, setActive] = useState(0);
  const track = useRef(null);
  const activeRef = useRef(0);

  const load = async () => {
    setError(null);
    try {
      const { data } = await axios.get(`${API_BASE_URL}/public/packages/user-packages`, { headers: { Authorization: `Bearer ${token}` } });
      setPackages(data.packages || data);
      setUserSignal(Number(data.userSignal || 0));
    } catch {
      setError("Failed to load packages. Please try again later.");
      setPackages([]);
    }
  };
  useEffect(() => { if (token) load(); }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  // Scale / tilt / dim each card by its distance from the centre while swiping.
  const paint = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const mid = el.scrollLeft + el.clientWidth / 2;
    let best = 0; let bestD = Infinity;
    [...el.children].forEach((card, i) => {
      const c = card.offsetLeft + card.offsetWidth / 2;
      const d = (c - mid) / card.offsetWidth; // -1 … 1 for the neighbours
      const a = Math.min(1, Math.abs(d));
      card.style.setProperty("--d", d.toFixed(3));
      card.style.setProperty("--a", a.toFixed(3));
      if (Math.abs(d) < bestD) { bestD = Math.abs(d); best = i; }
    });
    if (best !== activeRef.current) { activeRef.current = best; setActive(best); buzz(); }
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el || !packages?.length) return undefined;
    let raf = 0;
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(paint); };
    el.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    // Start on the popular plan, then nudge once so people see they can swipe.
    const start = packages.length > 2 ? 1 : 0;
    requestAnimationFrame(() => {
      const card = el.children[start];
      if (card) el.scrollLeft = card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2;
      paint();
    });
    let nudge;
    try {
      if (!sessionStorage.getItem("plans:nudged") && packages.length > 1) {
        nudge = setTimeout(() => {
          el.scrollBy({ left: 56, behavior: "smooth" });
          setTimeout(() => el.scrollBy({ left: -56, behavior: "smooth" }), 420);
          sessionStorage.setItem("plans:nudged", "1");
        }, 1100);
      }
    } catch { /* private mode */ }
    return () => { el.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); clearTimeout(nudge); };
  }, [packages, paint]);

  const goTo = (i) => {
    const el = track.current;
    const card = el?.children[i];
    if (card) el.scrollTo({ left: card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2, behavior: "smooth" });
  };

  const subscribe = (pkg) => {
    if (pkg.paymentPending) { setBlocked({ pkg, reason: "pending" }); return; }
    if (Number(pkg.requiredSignal || 0) > userSignal) { setBlocked({ pkg, reason: "signal" }); return; }
    navigate(`/payment?amount=${encodeURIComponent(pkg.amount)}&packageId=${encodeURIComponent(pkg._id)}`);
  };

  const featuredIdx = packages?.length > 2 ? 1 : -1;
  return (
    <Page title="Upgrade" subtitle="Higher limits and more features" icon={Crown}>
      <section className="dash-panel p-4 mb-2 flex items-center gap-4 max-w-[760px] mx-auto">
        <span className="w-10 h-10 rounded-full bg-blue-600/12 text-blue-400 flex items-center justify-center"><Signal className="w-4 h-4" /></span>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between text-[12px]"><span className="text-neutral-400">Your signal strength</span><span className="font-semibold tabular-nums">{userSignal}%</span></div>
          <div className="mt-1.5"><Progress value={userSignal} /></div>
        </div>
        <Button variant="secondary" onClick={() => navigate("/signal-packages")}>Raise it</Button>
      </section>

      {error ? <ErrorState message={error} onRetry={load} />
        : !packages ? <Loading rows={3} />
          : !packages.length ? <div className="dash-panel"><Empty icon={Crown} title="No plans available right now" text="Check back soon." /></div>
            : (
              <div className="relative">
                <div ref={track} className="plans-track -mx-4 sm:-mx-5 lg:mx-0" role="list" aria-label="Plans">
                  {packages.map((pkg, i) => (
                    <div key={pkg._id} role="listitem" className="plan-slot">
                      <PlanCard pkg={pkg} index={i} active={i === active} current={user?.accountTypeName} userSignal={userSignal} onSubscribe={subscribe} featured={i === featuredIdx} />
                    </div>
                  ))}
                </div>
                {packages.length > 1 && (
                  <>
                    <button type="button" data-no-busy onClick={() => goTo(Math.max(0, active - 1))} disabled={active === 0} aria-label="Previous plan" className="!hidden md:!inline-flex topbar-btn !absolute left-2 top-1/2 -translate-y-1/2 disabled:opacity-0 transition-opacity"><ChevronLeft className="w-4 h-4" /></button>
                    <button type="button" data-no-busy onClick={() => goTo(Math.min(packages.length - 1, active + 1))} disabled={active === packages.length - 1} aria-label="Next plan" className="!hidden md:!inline-flex topbar-btn !absolute right-2 top-1/2 -translate-y-1/2 disabled:opacity-0 transition-opacity"><ChevronRight className="w-4 h-4" /></button>
                    <div className="flex justify-center gap-1.5 mt-1" data-no-busy>
                      {packages.map((p, i) => (
                        <button key={p._id} type="button" onClick={() => goTo(i)} aria-label={`Show ${p.name}`}
                          className={`h-2 rounded-full transition-all duration-500 ease-[cubic-bezier(.34,1.56,.64,1)] ${i === active ? "w-6 bg-blue-500" : "w-2 bg-white/20 hover:bg-white/35"}`} />
                      ))}
                    </div>
                    <p className="text-center text-[11px] text-neutral-500 mt-2 md:hidden">Swipe to compare plans</p>
                  </>
                )}
              </div>
            )}

      <Modal open={!!blocked} title={blocked?.reason === "signal" ? "Signal strength too low" : "Payment under review"} onClose={() => setBlocked(null)}
        footer={blocked?.reason === "signal"
          ? <><Button variant="secondary" onClick={() => setBlocked(null)}>Not now</Button><Button onClick={() => navigate("/signal-packages")}>Get signal</Button></>
          : <Button onClick={() => setBlocked(null)}>OK</Button>}>
        {blocked?.reason === "signal" ? (
          <>
            <p className="text-[12px] text-neutral-400 leading-relaxed">The {blocked.pkg.name} plan needs at least <span className="text-zinc-100 font-semibold">{blocked.pkg.requiredSignal}%</span> signal strength. Yours is <span className="text-zinc-100 font-semibold">{userSignal}%</span>.</p>
            <div className="mt-3"><Progress value={(userSignal / Math.max(1, blocked.pkg.requiredSignal)) * 100} /></div>
            <p className="mt-3 text-[12px] text-neutral-500">Buy a signal package to raise it, then come back to upgrade.</p>
          </>
        ) : blocked && (
          <p className="text-[12px] text-neutral-400 leading-relaxed">We already have your payment for the {blocked.pkg.name} plan. Your account upgrades as soon as it is approved, so there is no need to pay again.</p>
        )}
      </Modal>
    </Page>
  );
}

export default AccountUpgrade1;
