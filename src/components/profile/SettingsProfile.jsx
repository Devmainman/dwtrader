"use client";
// /settings — profile, verification, appearance and account forms in the app's shared design.
// Data: /users/me (name, account ID, package, photo), /verification/users (KYC + details),
// /trading/total-profit, /trading/total-amount, /referrals/stats.
import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Settings, Copy, Check, ChevronRight, BadgeCheck, Clock, CircleDashed, IdCard, ScanFace, Home, Sun, Moon } from "lucide-react";
import { Page, Panel, Tabs, formatMoney } from "../products/ui";
import { useUserAuth } from "../../context/UserAuthContext";
import { API_BASE_URL, STATIC_BASE_URL } from "../../api/config";
import { toast } from "../../lib/toast";
import { ModeSwitch } from "../navigation/ModeToggle";
import useMode from "../../hooks/useMode";
import PersonalInformation from "./PersonalInformation";
import EditProfile from "./editprofile/ProfileForm";
import UpdatePhoto from "./uploadphoto/SettingsEditUploadImage";
import ChangePassword from "./changeprofile/SettingsEditChangePassword";

function useProfile() {
  const { token } = useUserAuth();
  const [me, setMe] = useState(null);
  const [kyc, setKyc] = useState(null);
  const [stats, setStats] = useState(null);
  const load = useCallback(async () => {
    if (!token) return;
    const h = { headers: { Authorization: `Bearer ${token}` } };
    const [meRes, kycRes] = await Promise.allSettled([axios.get(`${API_BASE_URL}/users/me`, h), axios.get(`${API_BASE_URL}/verification/users`, h)]);
    if (meRes.status === "fulfilled") setMe(meRes.value.data);
    if (kycRes.status === "fulfilled") setKyc(kycRes.value.data);
    const [p, a, r] = await Promise.allSettled([
      axios.get(`${API_BASE_URL}/trading/total-profit`, h), axios.get(`${API_BASE_URL}/trading/total-amount`, h), axios.get(`${API_BASE_URL}/referrals/stats`, h)
    ]);
    setStats({
      profit: p.status === "fulfilled" ? p.value.data.totalProfit || 0 : 0,
      traded: a.status === "fulfilled" ? a.value.data.totalAmount || 0 : 0,
      referral: r.status === "fulfilled" ? r.value.data.totalEarned || 0 : 0
    });
  }, [token]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { const f = () => load(); window.addEventListener("avatarUpdated", f); return () => window.removeEventListener("avatarUpdated", f); }, [load]);
  return { me, kyc, stats };
}

function Header({ me, stats }) {
  const [copied, setCopied] = useState(false);
  const [imgOk, setImgOk] = useState(true);
  const cur = me?.currency || "USD";
  const name = me ? `${me.firstName || ""} ${me.lastName || ""}`.trim() || "User" : "";
  const initials = name.split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();
  const face = me?.verification?.faceImage;
  const avatar = face ? `${STATIC_BASE_URL}/Uploads/face_images/${face}` : null;
  const copy = () => navigator.clipboard?.writeText(me.accountId).then(() => { setCopied(true); toast.success("Account ID copied"); setTimeout(() => setCopied(false), 1400); });
  return (
    <section className="dash-panel">
      <div className="p-5 flex items-center gap-4">
        {avatar && imgOk ? <img src={avatar} alt="" onError={() => setImgOk(false)} className="w-14 h-14 rounded-full object-cover border border-white/10" />
          : <span className="w-14 h-14 rounded-full bg-[linear-gradient(135deg,var(--color-blue-400),var(--color-blue-700))] text-white text-[17px] font-semibold flex items-center justify-center">{initials || "·"}</span>}
        <div className="flex-1 min-w-0">
          {me ? <p className="text-[15px] font-semibold tracking-[-0.01em] truncate">{name}</p> : <span className="block h-4 w-32 rounded skeleton" />}
          {me?.accountId && (
            <button type="button" data-no-busy onClick={copy} className="mt-1 flex items-center gap-1.5 text-[11px] text-neutral-500 hover:text-zinc-100 max-w-full">
              <span className="font-mono truncate">ID {me.accountId}</span>{copied ? <Check className="w-3 h-3 text-emerald-400 shrink-0" /> : <Copy className="w-3 h-3 shrink-0" />}
            </button>
          )}
        </div>
        <Link to="/accountupgrade" className="shrink-0 flex items-center gap-1 h-8 pl-3 pr-2 rounded-full bg-blue-600/12 border border-blue-500/20 text-[11px] font-semibold text-blue-400 hover:bg-blue-600/20 transition">
          {me?.accountTypeName || "Basic"}<ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <dl className="grid grid-cols-3 border-t border-white/[.06]">
        {[["Total profit", stats?.profit], ["Total traded", stats?.traded], ["Referral earnings", stats?.referral]].map(([k, v], i) => (
          <div key={k} className={`px-4 py-3.5 ${i ? "border-l border-white/[.06]" : ""}`}>
            <dt className="text-[10px] text-neutral-500 truncate">{k}</dt>
            <dd className="mt-1 text-[13px] font-medium tabular-nums truncate">{stats ? formatMoney(v, cur) : <span className="block h-3.5 w-14 rounded skeleton" />}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Verification({ kyc }) {
  const v = kyc?.verification || {};
  const st = (done, sent) => (done ? "verified" : sent ? "pending" : "todo");
  const rows = [
    ["Identity", IdCard, st(v.identityVerified, v.identityDocuments?.length > 0)],
    ["Face", ScanFace, st(v.faceVerified, !!v.faceImage)],
    ["Address", Home, st(v.addressVerified, !!v.proofOfAddress?.image)]
  ];
  const S = { verified: ["Verified", "text-emerald-400 bg-emerald-500/12", BadgeCheck], pending: ["In review", "text-amber-400 bg-amber-500/12", Clock], todo: ["Not submitted", "text-neutral-400 bg-white/[.06]", CircleDashed] };
  const done = rows.filter((r) => r[2] === "verified").length;
  return (
    <Panel title="Verification" action={<span className="text-[11px] text-neutral-500">{kyc ? `${done} of 3 complete` : ""}</span>}>
      <div className="h-1 rounded-full bg-white/[.08] overflow-hidden -mt-1 mb-2"><span className="block h-full bg-emerald-400 transition-[width] duration-700" style={{ width: `${(done / 3) * 100}%` }} /></div>
      <ul className="divide-y divide-white/[.06]">
        {rows.map(([label, Icon, s]) => {
          const [text, tone, SIcon] = S[s];
          return (
            <li key={label} className="flex items-center gap-3 py-2.5">
              <span className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-neutral-400"><Icon className="w-4 h-4" /></span>
              <span className="flex-1 text-[13px]">{label}</span>
              {kyc ? <span className={`inline-flex items-center gap-1 h-6 px-2 rounded-full text-[10px] font-semibold ${tone}`}><SIcon className="w-3 h-3" />{text}</span> : <span className="h-5 w-16 rounded-full skeleton" />}
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

function Appearance() {
  const [mode, , , pref] = useMode();
  return (
    <section className="dash-panel p-4">
      <div className="flex items-center gap-3 mb-3">
        <span className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-neutral-400">{mode === "light" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}</span>
        <div className="flex-1"><p className="text-[13px] font-semibold">Appearance</p><p className="text-[11px] text-neutral-500">{pref === "system" ? `Matching your device (${mode})` : `${mode === "light" ? "Light" : "Dark"} mode`} · saved on this device</p></div>
      </div>
      <ModeSwitch />
    </section>
  );
}

const TABS = [{ value: "profile", label: "Profile" }, { value: "edit", label: "Edit profile" }, { value: "photo", label: "Photo" }, { value: "password", label: "Password" }];

function SettingsProfile() {
  const { me, kyc, stats } = useProfile();
  const [tab, setTab] = useState("profile");
  return (
    <Page title="Settings" subtitle="Your profile, verification and security" icon={Settings}>
      <div className="grid grid-cols-1 lg:grid-cols-[400px_minmax(0,1fr)] gap-4 items-start">
        <div className="space-y-4 min-w-0 lg:sticky lg:top-[84px]">
          <Header me={me} stats={stats} />
          <Verification kyc={kyc} />
          <Appearance />
        </div>
        <div className="min-w-0">
          <Tabs tabs={TABS} value={tab} onChange={setTab} />
          {tab === "profile" && <PersonalInformation data={kyc} />}
          {tab === "edit" && <div className="dash-panel p-4 sm:p-5"><EditProfile /></div>}
          {tab === "photo" && <div className="dash-panel p-4 sm:p-5"><UpdatePhoto /></div>}
          {tab === "password" && <div className="dash-panel p-4 sm:p-5"><ChangePassword /></div>}
        </div>
      </div>
    </Page>
  );
}

export default SettingsProfile;
