// Public blog (/blog and /blog/:slug). Same look as the landing page: Geist type,
// near-black stage with a warm glow, the landing nav and footer. Articles and
// categories come from the admin panel.
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, Menu, X } from 'lucide-react';
import logo from '../assets/Group.svg';
import { API_BASE_URL, STATIC_BASE_URL } from '../api/config';
import { renderMarkdown } from '../lib/markdown';
import './landing.css';
import './blog.css';

export const fileUrl = (p) => (p ? (/^https?:/.test(p) ? p : `${STATIC_BASE_URL}${p}`) : '');
const day = (d) => (d ? new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '');
export const getJSON = (path) => fetch(`${API_BASE_URL}${path}`).then(async (r) => { const j = await r.json().catch(() => ({})); if (!r.ok) throw new Error(j.message || 'Not found'); return j.data; });

function useGeist() {
  useEffect(() => {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap';
    document.head.appendChild(l);
    return () => l.remove();
  }, []);
}

function useBrand() {
  const [brand, setBrand] = useState('');
  useEffect(() => { getJSON('/public/settings').then((d) => setBrand(d?.settings?.websiteName || d?.websiteName || '')).catch(() => {}); }, []);
  return brand;
}

export function Shell({ children }) {
  useGeist();
  const brand = useBrand();
  const [menu, setMenu] = useState(false);
  const year = new Date().getFullYear();
  const { pathname } = useLocation();
  useEffect(() => { setMenu(false); window.scrollTo(0, 0); }, [pathname]);
  return (
    <div className="ld bl">
      <div className="bl-glow" aria-hidden="true" />
      <header className="ld-nav is-solid">
        <div className="max-w-[1320px] mx-auto flex items-center justify-between h-16 md:h-[68px] px-5 md:px-8">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <img src={logo} alt="" className="w-8 h-8" />
            {brand && <span className="ld-brand">{brand}</span>}
          </Link>
          <nav className="hidden lg:flex items-center gap-1">
            <Link to="/" className="ld-navlink">Home</Link>
            <Link to="/blog" className={`ld-navlink ${pathname.startsWith('/blog') ? 'is-on' : ''}`}>Blog</Link>
            <Link to="/help" className={`ld-navlink ${pathname.startsWith('/help') ? 'is-on' : ''}`}>Help Center</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/auth" className="ld-btn ld-btn-ghost !h-10 !px-3 sm:!px-5 !text-[14px]">Log in</Link>
            <Link to="/signup" className="ld-btn ld-btn-light !h-10 !px-5 !text-[14px]">Get started</Link>
            <button type="button" className="ld-burger inline-flex lg:hidden" onClick={() => setMenu((v) => !v)} aria-label={menu ? 'Close menu' : 'Open menu'}>
              {menu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>
      <div className={`ld-sheet ${menu ? 'is-open' : ''}`} aria-hidden={!menu}>
        <div className="px-6 pt-32 pb-10 h-full overflow-y-auto flex flex-col">
          <Link to="/" className="ld-sheet-link">Home</Link>
          <Link to="/blog" className="ld-sheet-link">Blog</Link>
          <Link to="/help" className="ld-sheet-link">Help Center</Link>
          <div className="mt-auto pt-10 grid grid-cols-2 gap-3">
            <Link to="/auth" className="ld-btn ld-btn-glass">Log in</Link>
            <Link to="/signup" className="ld-btn ld-btn-light">Get started</Link>
          </div>
        </div>
      </div>

      <main className="relative z-[2] pt-28 md:pt-36 pb-20 min-h-screen">{children}</main>

      <footer className="ld-footer relative z-[2] px-5 md:px-8 pt-10 pb-8">
        <div className="max-w-[1320px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo} alt="" className="w-7 h-7" />
            {brand && <span className="ld-brand text-[16px]">{brand}</span>}
          </Link>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-[#a1a1aa]">
            <Link to="/" className="hover:text-white">Home</Link>
            <Link to="/blog" className="hover:text-white">Blog</Link>
            <Link to="/help" className="hover:text-white">Help Center</Link>
            <Link to="/auth" className="hover:text-white">Log in</Link>
            <Link to="/signup" className="hover:text-white">Open an account</Link>
          </nav>
        </div>
        <div className="max-w-[1320px] mx-auto mt-8 pt-6 border-t border-white/5 text-[12px] text-[#71717a]">
          <p>© {year}{brand ? ` ${brand}` : ''}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function Cover({ post, className = '' }) {
  return post.coverImage
    ? <img src={fileUrl(post.coverImage)} alt="" loading="lazy" className={`w-full h-full object-cover ${className}`} />
    : <div className={`w-full h-full bl-cover-fallback ${className}`}><span className="ld-label">{post.category?.name || 'Article'}</span></div>;
}

function PostCard({ post, i = 0, big = false }) {
  return (
    <Link to={`/blog/${post.slug}`} className={`bl-card group ld-rise ${big ? 'bl-card-big' : ''}`} style={{ animationDelay: `${Math.min(i, 8) * 70}ms` }}>
      <div className={`overflow-hidden rounded-2xl ${big ? 'aspect-[16/9] md:aspect-auto md:h-full' : 'aspect-[16/10]'}`}>
        <div className="w-full h-full transition-transform duration-700 group-hover:scale-[1.03]"><Cover post={post} /></div>
      </div>
      <div className={big ? 'md:py-4' : 'pt-4'}>
        <p className="ld-label !text-[10px] flex items-center gap-2">
          {post.category?.name && <span className="text-[color:var(--blue-soft)]">{post.category.name}</span>}
          <span>{day(post.publishedAt)}</span>
        </p>
        <h3 className={`mt-2 font-[family-name:var(--display)] tracking-[-.03em] text-white group-hover:text-[color:var(--blue-soft)] transition-colors ${big ? 'text-[26px] md:text-[34px] leading-[1.1] font-light' : 'text-[19px] leading-snug font-normal'}`}>{post.title}</h3>
        {post.excerpt && <p className={`mt-2 text-[#a1a1aa] leading-relaxed ${big ? 'text-[15px]' : 'text-[14px] line-clamp-3'}`}>{post.excerpt}</p>}
        <p className="mt-3 text-[12px] text-[#71717a] flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{post.readMinutes || 1} min read</p>
      </div>
    </Link>
  );
}

export function BlogIndex() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const active = new URLSearchParams(search).get('category') || '';
  const [cats, setCats] = useState([]);
  const [state, setState] = useState({ items: null, total: 0, page: 1, error: '' });

  useEffect(() => { getJSON('/public/blog/categories').then(setCats).catch(() => setCats([])); }, []);
  useEffect(() => {
    setState((s) => ({ ...s, items: null, error: '' }));
    getJSON(`/public/blog/posts?limit=12${active ? `&category=${encodeURIComponent(active)}` : ''}`)
      .then((d) => setState({ items: d.items, total: d.total, page: 1, error: '' }))
      .catch((e) => setState({ items: [], total: 0, page: 1, error: e.message }));
  }, [active]);
  const more = () => getJSON(`/public/blog/posts?limit=12&page=${state.page + 1}${active ? `&category=${encodeURIComponent(active)}` : ''}`)
    .then((d) => setState((s) => ({ ...s, items: [...s.items, ...d.items], page: s.page + 1 })));

  const [lead, ...rest] = state.items || [];
  const title = useMemo(() => cats.find((c) => c.slug === active)?.name, [cats, active]);

  return (
    <Shell>
      <section className="max-w-[1320px] mx-auto px-5 md:px-8">
        <p className="ld-label ld-rise">Blog</p>
        <h1 className="ld-display mt-4 max-w-[16ch] ld-rise" style={{ animationDelay: '80ms' }}>{title ? title : <>Notes on money, <em>markets</em> and the app.</>}</h1>
        {cats.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2 ld-rise" style={{ animationDelay: '160ms' }}>
            <button type="button" onClick={() => navigate('/blog')} className={`bl-chip ${!active ? 'is-on' : ''}`}>All</button>
            {cats.map((c) => <button key={c.slug} type="button" onClick={() => navigate(`/blog?category=${c.slug}`)} className={`bl-chip ${active === c.slug ? 'is-on' : ''}`}>{c.name}<span>{c.posts}</span></button>)}
          </div>
        )}

        <div className="mt-12">
          {state.items === null ? (
            <div className="grid md:grid-cols-3 gap-8">{[0, 1, 2].map((i) => <div key={i} className="aspect-[16/10] rounded-2xl bg-white/[.04] animate-pulse" />)}</div>
          ) : !state.items.length ? (
            <p className="ld-lead py-20 text-center">{state.error ? 'The blog could not be loaded right now.' : 'No articles here yet. Check back soon.'}</p>
          ) : (
            <>
              <div className="grid md:grid-cols-[1.35fr_1fr] gap-6 md:gap-10 items-stretch"><PostCard post={lead} big /></div>
              {rest.length > 0 && <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">{rest.map((p, i) => <PostCard key={p._id} post={p} i={i} />)}</div>}
              {state.items.length < state.total && <div className="mt-14 text-center"><button type="button" onClick={more} className="ld-btn ld-btn-glass">Load more</button></div>}
            </>
          )}
        </div>
      </section>
    </Shell>
  );
}

export function BlogPostPage() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    setData(null); setError('');
    getJSON(`/public/blog/posts/${encodeURIComponent(slug)}`).then((d) => { setData(d); document.title = d.post.title; }).catch((e) => setError(e.message));
  }, [slug]);
  const html = useMemo(() => (data ? renderMarkdown(data.post.content) : ''), [data]);
  const post = data?.post;

  return (
    <Shell>
      {error ? (
        <section className="max-w-[720px] mx-auto px-5 text-center py-20">
          <h1 className="ld-h2">Article not found</h1>
          <p className="ld-lead mt-4">It may have been moved or unpublished.</p>
          <Link to="/blog" className="ld-btn ld-btn-light mt-8">Back to the blog</Link>
        </section>
      ) : !post ? (
        <div className="max-w-[760px] mx-auto px-5 space-y-4"><div className="h-12 rounded-xl bg-white/[.04] animate-pulse" /><div className="aspect-[16/9] rounded-2xl bg-white/[.04] animate-pulse" /></div>
      ) : (
        <article>
          <header className="max-w-[820px] mx-auto px-5 md:px-8">
            <Link to="/blog" className="inline-flex items-center gap-2 text-[13px] text-[#a1a1aa] hover:text-white"><ArrowLeft className="w-4 h-4" />All articles</Link>
            <p className="ld-label mt-8 ld-rise flex flex-wrap items-center gap-3">
              {post.category && <Link to={`/blog?category=${post.category.slug}`} className="text-[color:var(--blue-soft)]">{post.category.name}</Link>}
              <span>{day(post.publishedAt)}</span>
              <span>{post.readMinutes || 1} min read</span>
            </p>
            <h1 className="ld-h2 mt-4 ld-rise" style={{ animationDelay: '80ms' }}>{post.title}</h1>
            {post.excerpt && <p className="ld-lead mt-5 !text-[17px] ld-rise" style={{ animationDelay: '160ms' }}>{post.excerpt}</p>}
            {post.authorName && <p className="mt-5 text-[13px] text-[#a1a1aa]">By {post.authorName}</p>}
          </header>
          {post.coverImage && (
            <div className="max-w-[1080px] mx-auto px-5 md:px-8 mt-10 ld-rise" style={{ animationDelay: '220ms' }}>
              <img src={fileUrl(post.coverImage)} alt="" className="w-full rounded-3xl object-cover max-h-[560px]" />
            </div>
          )}
          <div className="bl-prose max-w-[720px] mx-auto px-5 md:px-8 mt-12" dangerouslySetInnerHTML={{ __html: html }} />

          <div className="max-w-[720px] mx-auto px-5 md:px-8 mt-16">
            <div className="ld-glass rounded-3xl p-7 md:p-9 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div>
                <p className="ld-h3">Put it into practice.</p>
                <p className="ld-lead mt-2">Open a free account and start in minutes.</p>
              </div>
              <Link to="/signup" className="ld-btn ld-btn-light shrink-0">Get started<ArrowRight className="w-4 h-4" /></Link>
            </div>
          </div>

          {data.related?.length > 0 && (
            <section className="max-w-[1320px] mx-auto px-5 md:px-8 mt-24">
              <p className="ld-label">Keep reading</p>
              <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">{data.related.map((p, i) => <PostCard key={p._id} post={p} i={i} />)}</div>
            </section>
          )}
        </article>
      )}
    </Shell>
  );
}
