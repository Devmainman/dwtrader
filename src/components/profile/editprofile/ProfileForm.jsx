"use client";
// Edit profile: name, phone (with the country's dial code), gender and country.
// GET /verification/users to fill it, POST /verification/profile to save.
import React, { useState, useEffect, useMemo } from "react";
import { Check } from "lucide-react";
import { useUserAuth } from "../../../context/UserAuthContext";
import { COUNTRIES, findCountry } from "../../../lib/countries";
import { Field, inputClass, Button } from "../../products/ui";
import { toast } from "../../../lib/toast";

const GENDERS = [["male", "Male"], ["female", "Female"], ["other", "Other"]];
const E164 = /^\+[1-9]\d{6,14}$/;

function ProfileForm() {
  const { fetchWithAuth, refreshUser } = useUserAuth();
  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState(null);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    fetchWithAuth("/verification/users")
      .then(({ data }) => {
        const country = findCountry(data.country)?.code || "";
        const f = { firstName: data.firstName || "", lastName: data.lastName || "", phoneNumber: data.phoneNumber || "", gender: String(data.gender || "").toLowerCase(), country };
        setForm(f);
        setSaved(f);
      })
      .catch((e) => setLoadError(e?.response?.data?.message || "Could not load your profile"));
  }, [fetchWithAuth]);

  const dial = useMemo(() => findCountry(form?.country)?.dialCode || "", [form?.country]);
  const set = (k, v) => { setForm((p) => ({ ...p, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })); };
  const changed = form && saved && JSON.stringify(form) !== JSON.stringify(saved);

  const pickCountry = (code) => {
    const nextDial = findCountry(code)?.dialCode || "";
    setForm((p) => {
      // Swap the old dial code for the new one, keep the rest of the number.
      const oldDial = findCountry(p.country)?.dialCode || "";
      const local = p.phoneNumber && oldDial && p.phoneNumber.startsWith(oldDial) ? p.phoneNumber.slice(oldDial.length) : p.phoneNumber.replace(/^\+\d*/, "");
      return { ...p, country: code, phoneNumber: nextDial ? `${nextDial}${local}` : p.phoneNumber };
    });
    setErrors((e) => ({ ...e, country: undefined }));
  };

  const validate = () => {
    const e = {};
    if (form.firstName.trim().length < 2) e.firstName = "At least 2 characters";
    if (form.lastName.trim().length < 2) e.lastName = "At least 2 characters";
    if (!form.country) e.country = "Choose your country";
    if (!form.gender) e.gender = "Choose your gender";
    if (form.phoneNumber && !E164.test(form.phoneNumber)) e.phoneNumber = "Use international format, e.g. +233201234567";
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    try {
      await fetchWithAuth("/verification/profile", { method: "POST", data: { ...form, firstName: form.firstName.trim(), lastName: form.lastName.trim() } });
      setSaved(form);
      toast.success("Profile updated");
      refreshUser?.();
      window.dispatchEvent(new Event("avatarUpdated")); // the Settings header reloads too
    } catch (err) {
      const d = err?.response?.data;
      if (d?.errors) setErrors(d.errors);
      toast.error(d?.message || "Could not save your profile");
    } finally {
      setBusy(false);
    }
  };

  if (loadError) return <p className="text-[12px] text-red-400">{loadError}</p>;
  if (!form) {
    return (
      <div className="grid sm:grid-cols-2 gap-4">
        {[0, 1, 2, 3, 4].map((i) => <div key={i}><div className="h-3 w-20 rounded skeleton mb-2" /><div className="h-11 rounded-xl skeleton" /></div>)}
      </div>
    );
  }

  const err = (k) => errors[k] && <span className="block text-[11px] text-red-400 mt-1">{errors[k]}</span>;
  return (
    <form onSubmit={submit} noValidate>
      <p className="mb-4 text-[13px] font-semibold tracking-[-0.01em]">Edit profile</p>
      <div className="grid sm:grid-cols-2 gap-x-4">
        <Field label="First name">
          <input value={form.firstName} onChange={(e) => set("firstName", e.target.value)} autoComplete="given-name" className={`${inputClass} ${errors.firstName ? "!border-red-500/60" : ""}`} />
          {err("firstName")}
        </Field>
        <Field label="Last name">
          <input value={form.lastName} onChange={(e) => set("lastName", e.target.value)} autoComplete="family-name" className={`${inputClass} ${errors.lastName ? "!border-red-500/60" : ""}`} />
          {err("lastName")}
        </Field>
        <Field label="Country">
          <select value={form.country} onChange={(e) => pickCountry(e.target.value)} className={`${inputClass} appearance-none bg-[length:16px] bg-no-repeat bg-[right_12px_center] ${errors.country ? "!border-red-500/60" : ""}`}
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")" }}>
            <option value="">Choose your country</option>
            {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name} ({c.dialCode})</option>)}
          </select>
          {err("country")}
        </Field>
        <Field label="Phone number">
          <input type="tel" inputMode="tel" autoComplete="tel" value={form.phoneNumber} placeholder={dial ? `${dial} 20 123 4567` : "+233201234567"}
            onChange={(e) => set("phoneNumber", `+${e.target.value.replace(/[^\d]/g, "")}`.replace(/^\+$/, ""))}
            className={`${inputClass} tabular-nums ${errors.phoneNumber ? "!border-red-500/60" : ""}`} />
          {err("phoneNumber") || <span className="block text-[10px] text-neutral-500 mt-1">Optional · include the country code</span>}
        </Field>
        <Field label="Gender">
          <div className="grid grid-cols-3 gap-2" data-no-busy>
            {GENDERS.map(([v, l]) => (
              <button key={v} type="button" onClick={() => set("gender", v)}
                className={`h-11 rounded-xl border text-[13px] font-medium flex items-center justify-center gap-1.5 transition ${form.gender === v ? "border-blue-500/70 bg-blue-600/10 text-zinc-100" : "border-white/10 bg-white/[.02] text-neutral-400 hover:border-white/20"}`}>
                {form.gender === v && <Check className="w-3.5 h-3.5 text-blue-400" />}{l}
              </button>
            ))}
          </div>
          {err("gender")}
        </Field>
      </div>
      <div className="flex items-center gap-3 mt-1">
        <Button type="submit" busy={busy} disabled={!changed} className="h-11 px-6 !text-[13px]">{busy ? "Saving…" : "Save changes"}</Button>
        {!changed && !busy && <span className="text-[11px] text-neutral-500">No changes yet</span>}
      </div>
    </form>
  );
}

export default ProfileForm;
