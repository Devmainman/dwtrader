// A single real-estate project: overview, breakdown, why this project / sponsor, documents.
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, FileText, ExternalLink, Check } from 'lucide-react';
import { realEstateApi } from '../../api/products';
import { STATIC_BASE_URL } from '../../api/config';
import { Panel, Button, Badge, Tabs, Progress, Loading, ErrorState, Empty, useLoader, formatMoney, formatDate } from './ui';
import { InvestModal } from './RealEstate';

const TYPE_LABEL = {
  residential: 'Residential', commercial: 'Commercial', industrial: 'Industrial', hospitality: 'Hospitality', land: 'Land',
  mixed_use: 'Mixed use', life_science: 'Life science', healthcare: 'Healthcare', retail: 'Retail', office: 'Office'
};

const docUrl = (u) => (/^https?:\/\//.test(u) ? u : `${STATIC_BASE_URL}${u}`);

function Bullets({ items }) {
  return (
    <ul className="space-y-2">
      {items.map((b) => (
        <li key={b} className="flex gap-2 text-sm text-neutral-300">
          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /><span>{b}</span>
        </li>
      ))}
    </ul>
  );
}

function Row({ label, value }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className="flex justify-between gap-4 py-2.5 text-sm">
      <dt className="text-neutral-400">{label}</dt>
      <dd className="font-medium text-right">{value}</dd>
    </div>
  );
}

export default function RealEstateProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error, reload } = useLoader(() => realEstateApi.project(id), [id]);
  const [tab, setTab] = useState('project');
  const [investing, setInvesting] = useState(false);
  const p = data?.project;
  const currency = data?.currency;

  const back = (
    <button type="button" onClick={() => navigate('/real-estate')} className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white mb-4">
      <ArrowLeft className="w-4 h-4" />Projects
    </button>
  );

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 pt-4 pb-32 md:pb-8 text-zinc-100">
      {back}
      {loading && !data ? <Loading /> : error ? <ErrorState message={error} onRetry={reload} /> : (
        <>
          <div className="rounded-xl overflow-hidden bg-neutral-800 aspect-[21/9] relative mb-5">
            {p.images?.[0] ? <img src={p.images[0]} alt="" className="w-full h-full object-cover" /> : <Building2 className="w-12 h-12 text-neutral-500 absolute inset-0 m-auto" />}
            <div className="absolute top-3 left-3">{p.status === 'open' ? <Badge tone="success">Open</Badge> : <Badge>Closed</Badge>}</div>
          </div>

          <h1 className="text-xl sm:text-xl font-semibold">{p.title}</h1>
          {p.summary && <p className="text-neutral-300 mt-2">{p.summary}</p>}
          {(p.location?.city || p.location?.country) && (
            <p className="text-sm text-neutral-500 flex items-center gap-1 mt-2"><MapPin className="w-3.5 h-3.5" />{[p.location?.address, p.location?.city, p.location?.country].filter(Boolean).join(', ')}</p>
          )}

          <Panel className="mt-5">
            <div className="grid grid-cols-3 gap-3">
              <div><p className="text-xs uppercase tracking-wide text-neutral-500">Minimum</p><p className="text-base sm:text-lg font-semibold mt-0.5">{formatMoney(p.localMinimum, currency)}</p></div>
              <div><p className="text-xs uppercase tracking-wide text-neutral-500">ROI</p><p className="text-base sm:text-lg font-semibold mt-0.5 text-emerald-400">{p.roi}%</p></div>
              <div><p className="text-xs uppercase tracking-wide text-neutral-500">Strategy</p><p className="text-base sm:text-lg font-semibold mt-0.5">{p.strategy}</p></div>
            </div>
            <div className="mt-4"><Progress value={p.fundedPercent} /></div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-2">
              <p className="text-xs text-neutral-500">{formatMoney(p.localRaised, currency)} of {formatMoney(p.localTarget, currency)} raised · {p.fundedPercent}% funded</p>
              {p.status === 'open'
                ? <Button onClick={() => setInvesting(true)}>Invest now</Button>
                : <span className="text-sm text-neutral-400">Closed to new investment{p.closedAt ? ` · ${formatDate(p.closedAt)}` : ''}</span>}
            </div>
            {data.myInvestment && <p className="text-sm text-sky-300 mt-3">You've invested {formatMoney(data.myInvestment.amount, currency)} in this project.</p>}
          </Panel>

          <div className="mt-6">
            <Tabs value={tab} onChange={setTab} tabs={[{ value: 'project', label: 'This project' }, { value: 'documents', label: `Documents${p.documents?.length ? ` (${p.documents.length})` : ''}` }]} />
          </div>

          {tab === 'project' ? (
            <div className="space-y-4">
              {p.overview && (
                <Panel title="Project overview">
                  <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-line">{p.overview}</p>
                </Panel>
              )}
              <Panel title="Project breakdown">
                <dl className="divide-y divide-neutral-800">
                  <Row label="Type" value={p.assetType || TYPE_LABEL[p.propertyType]} />
                  <Row label="Stories" value={p.stories || null} />
                  <Row label="Strategy" value={p.strategy} />
                  <Row label="Objective" value={p.objective} />
                  <Row label="Minimum" value={formatMoney(p.localMinimum, currency)} />
                  <Row label="ROI" value={`${p.roi}%`} />
                  <Row label="Term" value={`${p.durationMonths} months`} />
                  <Row label="Funding target" value={formatMoney(p.localTarget, currency)} />
                </dl>
              </Panel>
              {p.whyProject?.length > 0 && <Panel title="Why this project?"><Bullets items={p.whyProject} /></Panel>}
              {(p.whySponsor?.length > 0 || p.sponsor?.name) && (
                <Panel title="Why this sponsor?">
                  {p.sponsor?.name && <p className="text-sm font-semibold mb-1">{p.sponsor.name}</p>}
                  {p.sponsor?.about && <p className="text-sm text-neutral-400 mb-3">{p.sponsor.about}</p>}
                  {p.whySponsor?.length > 0 && <Bullets items={p.whySponsor} />}
                </Panel>
              )}
              <p className="text-xs text-neutral-500">Target returns are estimates, not guarantees. Real estate investments are illiquid; funds are committed for the full term.</p>
            </div>
          ) : (
            <Panel>
              {!p.documents?.length ? <Empty icon={FileText} title="No documents yet" text="Offering documents will appear here when they're published." /> : (
                <ul className="divide-y divide-neutral-800">
                  {p.documents.map((d) => (
                    <li key={d.url}>
                      <a href={docUrl(d.url)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 py-3 text-sm hover:text-sky-300">
                        <FileText className="w-4 h-4 text-neutral-400" /><span className="flex-1">{d.title}</span><ExternalLink className="w-4 h-4 text-neutral-500" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          )}

          {investing && <InvestModal projectId={p._id} onClose={() => setInvesting(false)} onInvested={reload} />}
        </>
      )}
    </div>
  );
}
