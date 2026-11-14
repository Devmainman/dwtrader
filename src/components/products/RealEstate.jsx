// Real Estate: projects in three tabs — Open, Closed, Your investments.
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, Search, Home } from 'lucide-react';
import { realEstateApi } from '../../api/products';
import {
  Page, Panel, Stat, Button, Badge, Modal, Field, inputClass, Progress, Tabs,
  Loading, ErrorState, Empty, useLoader, useAction, formatMoney, formatDate
} from './ui';

export const projectPath = (p) => `/real-estate/${encodeURIComponent(p.slug || p._id || p.id)}`;

/** "Invest now" dialog, shared by the projects list and the project page. */
export function InvestModal({ projectId, onClose, onInvested }) {
  const { data, loading, error } = useLoader(() => realEstateApi.project(projectId), [projectId]);
  const { busy, run } = useAction();
  const [amount, setAmount] = useState('');
  useEffect(() => setAmount(''), [projectId]);
  const p = data?.project;
  const currency = data?.currency;
  const n = Number(amount);
  const err = !p || amount === '' ? ''
    : n < p.localMinimum ? `The minimum investment is ${formatMoney(p.localMinimum, currency)}`
      : n > p.localRemaining + 0.01 ? `Only ${formatMoney(p.localRemaining, currency)} is still available`
        : n > (data?.availableBalance || 0) ? 'Not enough balance' : '';

  const submit = async () => {
    if (await run(() => realEstateApi.invest(p._id, n), `You invested in ${p.title}`)) { onInvested?.(); onClose(); }
  };

  return (
    <Modal
      open
      title={p ? `Invest in ${p.title}` : 'Invest'}
      onClose={onClose}
      footer={p && (<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button busy={busy} disabled={!n || !!err} onClick={submit}>Invest now</Button></>)}
    >
      {loading ? <Loading /> : error ? <ErrorState message={error} /> : p && (
        <>
          <div className="grid grid-cols-3 gap-2 text-sm mb-4">
            <div className="bg-neutral-900 rounded-lg p-2.5"><p className="text-xs text-neutral-500">Minimum</p><p className="font-semibold">{formatMoney(p.localMinimum, currency)}</p></div>
            <div className="bg-neutral-900 rounded-lg p-2.5"><p className="text-xs text-neutral-500">ROI</p><p className="font-semibold text-emerald-400">{p.roi}%</p></div>
            <div className="bg-neutral-900 rounded-lg p-2.5"><p className="text-xs text-neutral-500">Strategy</p><p className="font-semibold">{p.strategy}</p></div>
          </div>
          <Field label={`Amount (${currency})`} hint={`Available balance ${formatMoney(data.availableBalance, currency)}`}>
            <input type="number" min={p.localMinimum} step="any" autoFocus className={inputClass} value={amount} placeholder={String(p.localMinimum)} onChange={(e) => setAmount(e.target.value)} />
            {err && <span className="block text-xs text-red-300 mt-1">{err}</span>}
          </Field>
          {n > 0 && !err && (
            <p className="text-sm text-neutral-300">
              Target return: <span className="text-emerald-400 font-semibold">{formatMoney(n * (p.roi / 100), currency)}</span> over {p.durationMonths} months,
              plus your {formatMoney(n, currency)} back at the end of the term.
            </p>
          )}
          <p className="text-xs text-neutral-500 mt-3">Returns build up evenly over the term and can be collected as they're earned. Funds are committed until the term ends. Target returns are not guaranteed.</p>
        </>
      )}
    </Modal>
  );
}

function ProjectCard({ p, currency, onInvest }) {
  const navigate = useNavigate();
  const open = p.status === 'open';
  return (
    <div className="rounded-xl bg-[#1D1D1F] border border-neutral-800 overflow-hidden flex flex-col hover:border-neutral-700 transition">
      <button type="button" onClick={() => navigate(projectPath(p))} className="text-left flex-1 flex flex-col">
        <div className="aspect-[16/9] bg-neutral-800 relative w-full">
          {p.images?.[0] ? <img src={p.images[0]} alt="" className="w-full h-full object-cover" loading="lazy" /> : <Building2 className="w-10 h-10 text-neutral-500 absolute inset-0 m-auto" />}
          <div className="absolute top-3 left-3 flex gap-2">
            {open ? <Badge tone="success">Open</Badge> : <Badge>Closed</Badge>}
            {p.featured && open && <Badge tone="info">Featured</Badge>}
          </div>
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold leading-snug">{p.title}</h3>
          {p.summary && <p className="text-sm text-neutral-400 mt-1 line-clamp-2">{p.summary}</p>}
          {(p.location?.city || p.location?.country) && (
            <p className="text-xs text-neutral-500 flex items-center gap-1 mt-2"><MapPin className="w-3 h-3" />{[p.location?.city, p.location?.country].filter(Boolean).join(', ')}</p>
          )}
          <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
            <div><p className="text-neutral-500">Minimum</p><p className="font-semibold text-sm">{formatMoney(p.localMinimum, currency)}</p></div>
            <div><p className="text-neutral-500">ROI</p><p className="font-semibold text-sm text-emerald-400">{p.roi}%</p></div>
            <div><p className="text-neutral-500">Strategy</p><p className="font-semibold text-sm">{p.strategy}</p></div>
          </div>
          <div className="mt-3"><Progress value={p.fundedPercent} /><p className="text-xs text-neutral-500 mt-1">{p.fundedPercent}% funded</p></div>
        </div>
      </button>
      <div className="px-4 pb-4 flex gap-2">
        <Button variant="secondary" className="flex-1" onClick={() => navigate(projectPath(p))}>View</Button>
        {open && <Button className="flex-1" onClick={() => onInvest(p)}>Invest now</Button>}
      </div>
    </div>
  );
}

function ProjectGrid({ status, onInvested }) {
  const [search, setSearch] = useState('');
  const { data, loading, error, reload } = useLoader(() => realEstateApi.projects(status), [status]);
  const [investId, setInvestId] = useState(null);
  const q = search.trim().toLowerCase();
  const list = (data?.projects || []).filter((p) => !q || `${p.title} ${p.summary} ${p.location?.city} ${p.location?.country}`.toLowerCase().includes(q));

  return (
    <>
      <div className="relative mb-4">
        <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
        <input className={`${inputClass} pl-9`} placeholder="Search projects" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      {loading && !data ? <Loading /> : error ? <ErrorState message={error} onRetry={reload} /> : list.length === 0 ? (
        <Panel><Empty icon={Building2} title={status === 'open' ? 'No open projects right now' : 'No closed projects yet'} text={status === 'open' ? 'New projects are added regularly.' : undefined} /></Panel>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((p) => <ProjectCard key={p._id} p={p} currency={data.currency} onInvest={(x) => setInvestId(x._id)} />)}
        </div>
      )}
      {investId && <InvestModal projectId={investId} onClose={() => setInvestId(null)} onInvested={() => { reload(); onInvested?.(); }} />}
    </>
  );
}

function YourInvestments({ investments }) {
  const navigate = useNavigate();
  const { busy, run } = useAction();
  const { data, loading, reload } = investments;
  const act = async (fn, msg) => { if (await run(fn, msg)) reload(); };
  if (loading && !data) return <Loading />;
  const items = data?.investments || [];
  const currency = data?.currency;
  if (!items.length) return <Panel><Empty icon={Home} title="You haven't invested in a project yet" text="Pick an open project to get started." /></Panel>;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <Stat label="Invested" value={formatMoney(data.totals.invested, currency)} />
        <Stat label="Target return" value={formatMoney(data.totals.expectedReturn, currency)} />
        <Stat label="Ready to collect" value={formatMoney(data.totals.unclaimedIncome, currency)} tone="up" />
        <Stat label="Collected" value={formatMoney(data.totals.incomeReceived, currency)} />
      </div>
      <Panel>
        <ul className="divide-y divide-neutral-800">
          {items.map((i) => (
            <li key={i._id} className="py-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <button type="button" className="text-left min-w-0" onClick={() => i.property && navigate(projectPath(i.property))}>
                  <p className="font-medium hover:underline">{i.property?.title || 'Project'}</p>
                  <p className="text-sm text-neutral-400">{formatMoney(i.amount, i.currency)} invested · {i.roi}% ROI · <span className="text-emerald-400">+{formatMoney(i.unclaimedIncome, i.currency)}</span> ready</p>
                  <p className="text-xs text-neutral-500">Invested {formatDate(i.startAt)} · matures {formatDate(i.maturityAt)} · collected {formatMoney(i.incomeClaimed, i.currency)} of {formatMoney(i.totalReturn, i.currency)}</p>
                </button>
                <div className="flex gap-2 shrink-0">
                  {i.status === 'active' && !i.matured && i.unclaimedIncome >= 0.01 && (
                    <Button variant="secondary" busy={busy} onClick={() => act(() => realEstateApi.claim(i._id), 'Returns collected')}>Collect</Button>
                  )}
                  {i.status === 'active' && i.matured && <Button busy={busy} onClick={() => act(() => realEstateApi.redeem(i._id), 'Investment redeemed')}>Redeem</Button>}
                  {i.status !== 'active' && <Badge tone="success">Completed · {formatMoney(i.payout, i.currency)}</Badge>}
                </div>
              </div>
              {i.status === 'active' && <div className="mt-3"><Progress value={i.progressPercent} /></div>}
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}

/** Open / Closed / Your investments. Shared by the Real Estate page and the Investing page. */
export function RealEstateSection() {
  const [tab, setTab] = useState('open');
  const investments = useLoader(() => realEstateApi.investments(), []);
  const count = (investments.data?.investments || []).filter((i) => i.status === 'active').length;
  return (
    <>
      <Tabs
        variant="underline"
        value={tab}
        onChange={setTab}
        tabs={[{ value: 'open', label: 'Open' }, { value: 'closed', label: 'Closed' }, { value: 'mine', label: count ? `Your investments (${count})` : 'Your investments' }]}
      />
      {tab === 'mine'
        ? <YourInvestments investments={investments} />
        : <ProjectGrid key={tab} status={tab} onInvested={investments.reload} />}
    </>
  );
}

export default function RealEstate() {
  return (
    <Page title="Real Estate" subtitle="Invest in real estate projects and earn fixed returns." icon={Building2}>
      <RealEstateSection />
    </Page>
  );
}
