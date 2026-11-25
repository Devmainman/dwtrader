"use client";
// /referrals — your invite link, what you've earned and who joined. Data: GET /referrals.
import * as React from "react";
import { Users, Copy, Check, Share2, Gift, UserPlus, Wallet } from "lucide-react";
import { useUserAuth } from "../../context/UserAuthContext";
import { Page, Panel, Stat, Loading, ErrorState, Empty, Button, formatMoney } from "../products/ui";
import { toast } from "../../lib/toast";

function AccountReferral1() {
  const { fetchWithAuth } = useUserAuth();
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  const load = React.useCallback(async () => {
    setError("");
    try { setData((await fetchWithAuth("/referrals")).data); } catch (e) { setError(e?.response?.data?.message || "Could not load your referrals"); }
  }, [fetchWithAuth]);
  React.useEffect(() => { load(); }, [load]);

  const cur = data?.currency || "USD";
  const link = data?.referralCode ? `${window.location.origin}/signup?ref=${data.referralCode}` : "";
  const copy = () => link && navigator.clipboard?.writeText(link).then(() => { setCopied(true); toast.success("Invite link copied"); setTimeout(() => setCopied(false), 1500); });
  const share = async () => {
    if (!link) return;
    if (navigator.share) { try { await navigator.share({ title: "Join me", text: "Sign up with my invite link", url: link }); } catch { /* cancelled */ } } else copy();
  };

  return (
    <Page title="Refer & earn" subtitle="Invite friends and earn a bonus for each one who joins" icon={Users}>
      {error ? <ErrorState message={error} onRetry={load} /> : !data ? <Loading rows={3} /> : (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-4 items-start max-w-[1080px]">
          <div className="space-y-4 min-w-0">
            <section className="dash-panel p-5">
              <p className="text-[11px] text-neutral-500">Your invite link</p>
              <div className="mt-2 flex items-center gap-2 rounded-2xl bg-white/[.04] border border-white/10 pl-3.5 pr-1.5 h-12">
                <span className="flex-1 min-w-0 truncate font-mono text-[12px] text-zinc-100">{link || "No referral code yet"}</span>
                <button type="button" data-no-busy onClick={copy} disabled={!link} className={`shrink-0 h-9 px-3 rounded-full text-[12px] font-semibold flex items-center gap-1.5 transition ${copied ? "bg-emerald-500/15 text-emerald-400" : "bg-white/[.08] text-zinc-100 hover:bg-white/[.12]"}`}>
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}{copied ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Button onClick={share} disabled={!link} className="flex-1 h-11 !text-[13px]"><Share2 className="w-4 h-4" />Share invite</Button>
                {data.referralCode && <span className="text-[11px] text-neutral-500">Code <span className="font-mono text-zinc-200">{data.referralCode}</span></span>}
              </div>
            </section>

            <div className="grid grid-cols-3 gap-2.5">
              <Stat label="Friends joined" value={data.totalReferrals || 0} />
              <Stat label="Total earned" value={formatMoney(data.totalEarned || 0, cur)} tone={data.totalEarned > 0 ? "up" : undefined} />
              <Stat label="Pending" value={formatMoney(data.pendingBonus || 0, cur)} />
            </div>

            <section className="dash-panel px-4 pt-4 pb-1">
              <p className="text-[13px] font-semibold tracking-[-0.01em]">Friends who joined</p>
              {!data.referrals?.length ? (
                <Empty icon={UserPlus} title="No one yet" text="Share your link. When a friend signs up with it, they appear here with the bonus you earned." />
              ) : (
                <ul className="divide-y divide-white/[.06] mt-1">
                  {data.referrals.map((r, i) => {
                    const u = r.user || {};
                    const name = `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.email || "New member";
                    return (
                      <li key={u._id || i} className="flex items-center gap-3 py-3">
                        <span className="w-9 h-9 rounded-full bg-white/[.06] border border-white/10 flex items-center justify-center text-[12px] font-semibold text-zinc-200">{name.slice(0, 1).toUpperCase()}</span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-[13px] text-zinc-100 truncate">{name}</span>
                          <span className="block text-[11px] text-neutral-500">Joined {new Date(r.joinedDate || u.joinedDate || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                        </span>
                        <span className="text-[13px] font-medium tabular-nums text-emerald-400">+{formatMoney(r.bonusEarned || 0, cur)}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </div>

          <Panel title="How it works">
            <ol className="space-y-3.5">
              {[
                [Share2, "Share your link", "Send it to friends or post it anywhere."],
                [UserPlus, "They sign up", "Your friend creates an account using your link."],
                [Gift, "You earn", `You get ${formatMoney(data.bonusPerReferral || 0, cur)} for each friend who joins.`],
                [Wallet, "It's added to your balance", "Your bonus shows in Total earned and in your history."]
              ].map(([Icon, t, d], i) => (
                <li key={t} className="flex gap-3">
                  <span className="w-8 h-8 rounded-full bg-blue-600/12 text-blue-400 flex items-center justify-center shrink-0"><Icon className="w-4 h-4" /></span>
                  <div><p className="text-[12px] font-semibold text-zinc-100">{i + 1}. {t}</p><p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">{d}</p></div>
                </li>
              ))}
            </ol>
          </Panel>
        </div>
      )}
    </Page>
  );
}

export default AccountReferral1;
