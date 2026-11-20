// Public Help Center (/help and /help/:slug): FAQ categories with their images,
// and each category's questions and answers. Everything comes from the admin's FAQ page.
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Plus, Search, LifeBuoy } from 'lucide-react';
import { Shell, getJSON, fileUrl } from './Blog';
import { renderMarkdown } from '../lib/markdown';

/** One category tile (image or a neutral mark, name, description, number of answers). */
export function HelpCategoryCard({ c, i = 0, to = `/help/${c.slug}` }) {
  return (
    <Link to={to} className="group ld-rise rounded-3xl border border-white/[.07] bg-white/[.02] hover:bg-white/[.04] transition overflow-hidden flex flex-col" style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}>
      <div className="aspect-[16/9] overflow-hidden bg-white/[.03] flex items-center justify-center">
        {c.image
          ? <img src={fileUrl(c.image)} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
          : <LifeBuoy className="w-10 h-10 text-[#52525b]" strokeWidth={1.4} />}
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-[family-name:var(--display)] text-[19px] tracking-[-.02em] text-white group-hover:text-[color:var(--blue-soft)] transition-colors">{c.name}</h3>
        {c.description && <p className="mt-1.5 text-[14px] text-[#a1a1aa] leading-relaxed line-clamp-2">{c.description}</p>}
        <p className="mt-auto pt-4 text-[12px] text-[#71717a] flex items-center gap-1.5">{c.questions} answer{c.questions === 1 ? '' : 's'}<ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" /></p>
      </div>
    </Link>
  );
}

function Answer({ item, open, onToggle }) {
  const html = useMemo(() => renderMarkdown(item.answer), [item.answer]);
  return (
    <div className={`ld-faq ${open ? 'is-open' : ''}`}>
      <button type="button" onClick={onToggle} aria-expanded={open}>
        <span>{item.question}</span>
        <Plus className="w-5 h-5 shrink-0" />
      </button>
      <div className="ld-faq-body"><div><div className="bl-prose !text-[15px] pb-6 pr-8" dangerouslySetInnerHTML={{ __html: html }} /></div></div>
    </div>
  );
}

export function HelpIndex() {
  const [cats, setCats] = useState(null);
  const [q, setQ] = useState('');
  const [results, setResults] = useState(null);
  const [open, setOpen] = useState(null);
  useEffect(() => { document.title = 'Help Center'; getJSON('/public/faq/categories').then(setCats).catch(() => setCats([])); }, []);
  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) { setResults(null); return undefined; }
    const t = setTimeout(() => getJSON(`/public/faq/search?q=${encodeURIComponent(term)}`).then(setResults).catch(() => setResults([])), 250);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <Shell>
      <section className="max-w-[1320px] mx-auto px-5 md:px-8">
        <p className="ld-label ld-rise">Help Center</p>
        <h1 className="ld-display mt-4 max-w-[16ch] ld-rise" style={{ animationDelay: '80ms' }}>How can we <em>help</em>?</h1>
        <div className="mt-8 max-w-[560px] relative ld-rise" style={{ animationDelay: '160ms' }}>
          <Search className="w-4 h-4 text-[#71717a] absolute left-4 top-1/2 -translate-y-1/2" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search questions"
            className="w-full h-12 rounded-full bg-white/[.04] border border-white/[.08] pl-11 pr-4 text-[15px] text-white placeholder:text-[#71717a] focus:outline-none focus:border-white/20" />
        </div>

        {results !== null ? (
          <div className="mt-12 max-w-[860px]">
            <p className="ld-label">{results.length ? `${results.length} answer${results.length === 1 ? '' : 's'}` : 'No answers match your search'}</p>
            <div className="mt-4">
              {results.map((r) => (
                <div key={r.id}>
                  <Answer item={r} open={open === r.id} onToggle={() => setOpen(open === r.id ? null : r.id)} />
                  {open === r.id && <Link to={`/help/${r.category.slug}`} className="text-[12px] text-[#a1a1aa] hover:text-white -mt-3 mb-4 inline-block">More in {r.category.name}</Link>}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-12">
            {cats === null ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{[0, 1, 2].map((i) => <div key={i} className="aspect-[4/3] rounded-3xl bg-white/[.04] animate-pulse" />)}</div>
            ) : !cats.length ? (
              <p className="ld-lead py-20 text-center">Help articles are on their way. Please check back soon.</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{cats.map((c, i) => <HelpCategoryCard key={c.id} c={c} i={i} />)}</div>
            )}
          </div>
        )}
      </section>
    </Shell>
  );
}

export function HelpCategoryPage() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(0);
  useEffect(() => {
    setData(null); setError(''); setOpen(0);
    getJSON(`/public/faq/categories/${encodeURIComponent(slug)}`).then((d) => { setData(d); document.title = `${d.category.name} · Help Center`; }).catch((e) => setError(e.message));
  }, [slug]);
  const c = data?.category;

  return (
    <Shell>
      {error ? (
        <section className="max-w-[720px] mx-auto px-5 text-center py-20">
          <h1 className="ld-h2">Topic not found</h1>
          <p className="ld-lead mt-4">It may have been moved or unpublished.</p>
          <Link to="/help" className="ld-btn ld-btn-light mt-8">Back to the Help Center</Link>
        </section>
      ) : !c ? (
        <div className="max-w-[860px] mx-auto px-5 space-y-4"><div className="h-12 rounded-xl bg-white/[.04] animate-pulse" /><div className="h-64 rounded-2xl bg-white/[.04] animate-pulse" /></div>
      ) : (
        <section className="max-w-[860px] mx-auto px-5 md:px-8">
          <Link to="/help" className="inline-flex items-center gap-2 text-[13px] text-[#a1a1aa] hover:text-white"><ArrowLeft className="w-4 h-4" />Help Center</Link>
          <div className="mt-8 flex items-center gap-5 ld-rise">
            {c.image && <img src={fileUrl(c.image)} alt="" className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover shrink-0" />}
            <div>
              <h1 className="ld-h2">{c.name}</h1>
              {c.description && <p className="ld-lead mt-2 !text-[16px]">{c.description}</p>}
            </div>
          </div>
          <div className="mt-10">
            {data.items.map((item, i) => <Answer key={item.id} item={item} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />)}
          </div>
          <div className="mt-16 ld-glass rounded-3xl p-7 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <p className="ld-h3">Still need help?</p>
              <p className="ld-lead mt-2">Open an account to reach our support team.</p>
            </div>
            <Link to="/auth" className="ld-btn ld-btn-light shrink-0">Contact support<ArrowRight className="w-4 h-4" /></Link>
          </div>
        </section>
      )}
    </Shell>
  );
}
