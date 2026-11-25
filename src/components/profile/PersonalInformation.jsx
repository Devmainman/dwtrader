"use client";
// Read-only personal details (from /verification/users), as a quiet definition list.
import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../context/UserAuthContext";

function PersonalInformation({ data: given }) {
  const { fetchWithAuth } = useUserAuth();
  const [data, setData] = useState(given || null);
  useEffect(() => { if (given) setData(given); }, [given]);
  useEffect(() => {
    if (given) return;
    fetchWithAuth("/verification/users").then((r) => setData(r.data)).catch(() => setData({}));
  }, [fetchWithAuth, given]);

  const rows = [
    ["Full name", data && (`${data.firstName || ""} ${data.lastName || ""}`.trim() || "—")],
    ["Account ID", data && (data.accountId || "—")],
    ["Email", data && (data.email || "—")],
    ["Mobile", data && (data.phoneNumber || "—")],
    ["Gender", data && (data.gender || "—")],
    ["Country", data && (data.country || "—")],
    ["Currency", data && (data.currency || "—")]
  ];
  return (
    <section className="dash-panel px-4 sm:px-5 pt-4 pb-1">
      <p className="text-[13px] font-semibold tracking-[-0.01em]">Personal information</p>
      <dl className="mt-1 divide-y divide-white/[.06]">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between gap-4 py-3">
            <dt className="text-[12px] text-neutral-500 shrink-0">{k}</dt>
            <dd className="text-[13px] text-zinc-100 text-right min-w-0 truncate capitalize-first">{v ?? <span className="inline-block h-3.5 w-24 rounded skeleton align-middle" />}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default PersonalInformation;
