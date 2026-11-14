// Connect your wallet: pick a wallet from the list (or add a new one).
// Browser wallets connect by signing a message; any wallet can also be linked by its
// PUBLIC address. This page never asks for a recovery phrase or private key.
import { useMemo, useState } from 'react';
import { Wallet, Search, Plus, ShieldAlert, CheckCircle2, Star, Trash2, Link2, ChevronRight } from 'lucide-react';
import { toast } from '../../lib/toast';
import { walletsApi, apiError } from '../../api/products';
import {
  Page, Panel, Button, Badge, Modal, Field, inputClass, Loading, ErrorState, useLoader, useAction
} from './ui';

// evm: can connect through an injected browser provider (window.ethereum).
// networks: which public-address formats make sense for this wallet.
const WALLETS = [
  { id: 'aktionariat', name: 'Aktionariat Wallet', evm: true, networks: ['evm'] },
  { id: 'binance', name: 'Binance', evm: true, networks: ['evm', 'bitcoin', 'solana', 'tron'] },
  { id: 'bitcoin-wallet', name: 'Bitcoin Wallet', evm: false, networks: ['bitcoin'] },
  { id: 'bitkeep', name: 'Bitkeep Wallet', evm: true, networks: ['evm', 'bitcoin', 'solana', 'tron'] },
  { id: 'bitpay', name: 'Bitpay', evm: false, networks: ['bitcoin', 'evm'] },
  { id: 'blockchain', name: 'Blockchain', evm: false, networks: ['bitcoin', 'evm'] },
  { id: 'coinbase', name: 'Coinbase', evm: true, networks: ['evm', 'bitcoin', 'solana'] },
  { id: 'coinbase-one', name: 'Coinbase One', evm: true, networks: ['evm', 'bitcoin', 'solana'] },
  { id: 'crypto-wallet', name: 'Crypto Wallet', evm: true, networks: ['evm', 'bitcoin'] },
  { id: 'exodus', name: 'Exodus Wallet', evm: true, networks: ['evm', 'bitcoin', 'solana', 'tron'] },
  { id: 'gemini', name: 'Gemini', evm: false, networks: ['evm', 'bitcoin'] },
  { id: 'imtoken', name: 'Imtoken', evm: true, networks: ['evm', 'bitcoin', 'tron'] },
  { id: 'infinito', name: 'Infinito Wallet', evm: true, networks: ['evm', 'bitcoin', 'tron'] },
  { id: 'infinity', name: 'Infinity Wallet', evm: true, networks: ['evm', 'bitcoin'] },
  { id: 'keyringpro', name: 'Keyringpro Wallet', evm: true, networks: ['evm'] },
  { id: 'metamask', name: 'Metamask', evm: true, networks: ['evm'] },
  { id: 'ownbit', name: 'Ownbit Wallet', evm: true, networks: ['evm', 'bitcoin', 'tron'] },
  { id: 'phantom', name: 'Phantom Wallet', evm: true, networks: ['solana', 'evm', 'bitcoin'] },
  { id: 'pulse', name: 'Pulse Wallet', evm: true, networks: ['evm'] },
  { id: 'rainbow', name: 'Rainbow', evm: true, networks: ['evm'] },
  { id: 'robinhood', name: 'Robinhood Wallet', evm: true, networks: ['evm', 'bitcoin', 'solana'] },
  { id: 'safepal', name: 'Safepal Wallet', evm: true, networks: ['evm', 'bitcoin', 'solana', 'tron'] },
  { id: 'sparkpoint', name: 'Sparkpoint Wallet', evm: true, networks: ['evm'] },
  { id: 'trust', name: 'Trust Wallet', evm: true, networks: ['evm', 'bitcoin', 'solana', 'tron'] },
  { id: 'uniswap', name: 'Uniswap', evm: true, networks: ['evm'] },
  { id: 'wallet-io', name: 'Wallet io', evm: true, networks: ['evm', 'bitcoin', 'tron'] }
];

const NETWORK_LABEL = { evm: 'Ethereum / EVM', bitcoin: 'Bitcoin', solana: 'Solana', tron: 'Tron' };
const CHAIN_NAMES = { 1: 'Ethereum', 10: 'Optimism', 56: 'BNB Chain', 137: 'Polygon', 8453: 'Base', 42161: 'Arbitrum' };
const COLORS = ['#EB25C6', '#0E7BF8', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#f97316'];

const walletById = (id) => WALLETS.find((w) => w.id === id);
const short = (a) => (a && a.length > 16 ? `${a.slice(0, 6)}…${a.slice(-4)}` : a);
const toHex = (str) => `0x${Array.from(new TextEncoder().encode(str)).map((b) => b.toString(16).padStart(2, '0')).join('')}`;

const getProvider = () => {
  const eth = typeof window !== 'undefined' ? window.ethereum : undefined;
  if (!eth) return null;
  if (Array.isArray(eth.providers) && eth.providers.length) return eth.providers.find((p) => p.isMetaMask) || eth.providers[0];
  return eth;
};

function WalletIcon({ name, size = 40 }) {
  const color = COLORS[[...name].reduce((h, c) => h + c.charCodeAt(0), 0) % COLORS.length];
  const letters = name.replace(/ wallet$/i, '').split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div style={{ width: size, height: size, background: `${color}26`, color }} className="rounded-xl flex items-center justify-center font-semibold text-sm shrink-0 border border-neutral-800">
      {letters}
    </div>
  );
}

/** Link one wallet: sign with the browser wallet, or save its public address. */
function ConnectModal({ wallet, allowedChains, onClose, onDone }) {
  const custom = wallet.id === 'custom';
  const [name, setName] = useState('');
  const [network, setNetwork] = useState(wallet.networks?.[0] || 'evm');
  const [address, setAddress] = useState('');
  const [signing, setSigning] = useState(false);
  const { busy, run } = useAction();
  const provider = getProvider();
  const walletName = custom ? name.trim() : wallet.name;
  const slug = custom ? (name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'other') : wallet.id;

  const signConnect = async () => {
    setSigning(true);
    try {
      const [addr] = await provider.request({ method: 'eth_requestAccounts' });
      const chainId = parseInt(await provider.request({ method: 'eth_chainId' }), 16);
      if (allowedChains?.length && !allowedChains.includes(chainId)) {
        throw new Error(`Switch your wallet to a supported network: ${allowedChains.map((c) => CHAIN_NAMES[c] || c).join(', ')}`);
      }
      const { message, nonce } = await walletsApi.nonce();
      const signature = await provider.request({ method: 'personal_sign', params: [toHex(message), addr] });
      await walletsApi.connect({ address: addr, signature, nonce, chainId, provider: slug, label: walletName });
      toast.success(`${walletName} connected`);
      onDone();
      onClose();
    } catch (err) {
      if (err?.code === 4001) toast.info('Request cancelled in your wallet');
      else toast.error(apiError(err));
    } finally {
      setSigning(false);
    }
  };

  const saveAddress = async () => {
    const res = await run(() => walletsApi.watch({ network, address: address.trim(), label: walletName || NETWORK_LABEL[network], provider: slug }), `${walletName || 'Wallet'} added`);
    if (res) { onDone(); onClose(); }
  };

  return (
    <Modal open title={custom ? 'Add new wallet' : `Connect ${wallet.name}`} onClose={onClose}>
      {!custom && (
        <div className="flex items-center gap-3 mb-4">
          <WalletIcon name={wallet.name} size={44} />
          <div><p className="font-semibold">{wallet.name}</p><p className="text-xs text-neutral-400">{wallet.networks.map((n) => NETWORK_LABEL[n]).join(' · ')}</p></div>
        </div>
      )}

      {!custom && wallet.evm && provider && (
        <>
          <Button className="w-full" busy={signing} onClick={signConnect}><Link2 className="w-4 h-4" />Connect with {wallet.name}</Button>
          <p className="text-xs text-neutral-500 mt-2">Your wallet will ask you to sign a message. Signing is free and cannot move your funds.</p>
          <div className="flex items-center gap-3 my-5 text-xs text-neutral-500"><span className="flex-1 h-px bg-neutral-800" />or add a public address<span className="flex-1 h-px bg-neutral-800" /></div>
        </>
      )}

      {custom && (
        <Field label="Wallet name"><input className={inputClass} maxLength={40} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ledger" /></Field>
      )}
      <Field label="Network">
        <select className={inputClass} value={network} onChange={(e) => setNetwork(e.target.value)}>
          {(custom ? Object.keys(NETWORK_LABEL) : wallet.networks).map((n) => <option key={n} value={n}>{NETWORK_LABEL[n]}</option>)}
        </select>
      </Field>
      <Field label="Public wallet address" hint="Copy it from the Receive screen in your wallet app.">
        <input className={`${inputClass} font-mono`} value={address} onChange={(e) => setAddress(e.target.value)} autoComplete="off" spellCheck={false} placeholder={network === 'evm' ? '0x…' : network === 'bitcoin' ? 'bc1…' : network === 'tron' ? 'T…' : ''} />
      </Field>
      <div className="flex gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-100 mb-4">
        <ShieldAlert className="w-4 h-4 shrink-0 text-amber-300" />
        <span>Only your <strong>public address</strong> is needed. Never type your recovery (seed) phrase or private key into any website.</span>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button busy={busy} disabled={!address.trim() || (custom && !name.trim())} onClick={saveAddress}>Add wallet</Button>
      </div>
    </Modal>
  );
}

export default function WalletConnect() {
  const { data, loading, error, reload } = useLoader(() => walletsApi.list(), []);
  const { busy, run } = useAction();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const q = search.trim().toLowerCase();
  const wallets = useMemo(() => WALLETS.filter((w) => !q || w.name.toLowerCase().includes(q)), [q]);
  const linked = data?.wallets || [];

  return (
    <Page title="Connect your wallet" subtitle="Link the crypto wallets you use to your account." icon={Wallet}>
      {loading && !data ? <Loading /> : error ? <ErrorState message={error} onRetry={reload} /> : linked.length > 0 && (
        <Panel title="Your wallets" className="mb-5">
          <ul className="divide-y divide-neutral-800">
            {linked.map((w) => {
              const meta = walletById(w.provider);
              return (
                <li key={w._id} className="py-3 flex items-center gap-3">
                  <WalletIcon name={meta?.name || w.label || 'Wallet'} size={36} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium flex items-center gap-2 flex-wrap">
                      {w.label || meta?.name || 'Wallet'}
                      {w.verified && <Badge tone="success"><CheckCircle2 className="w-3 h-3 mr-1" />Connected</Badge>}
                      {w.isPrimary && <Badge tone="info">Primary</Badge>}
                    </p>
                    <p className="font-mono text-xs text-neutral-400 truncate" title={w.address}>{short(w.address)} · {w.network === 'evm' ? (CHAIN_NAMES[w.chainId] || 'EVM') : NETWORK_LABEL[w.network]}</p>
                  </div>
                  {!w.isPrimary && (
                    <button type="button" title="Make primary" disabled={busy} className="p-2 text-neutral-400 hover:text-white" onClick={async () => { if (await run(() => walletsApi.update(w._id, { isPrimary: true }), 'Primary wallet updated')) reload(); }}>
                      <Star className="w-4 h-4" />
                    </button>
                  )}
                  <button type="button" title="Remove" disabled={busy} className="p-2 text-neutral-400 hover:text-red-300" onClick={async () => { if (window.confirm('Remove this wallet?') && await run(() => walletsApi.remove(w._id), 'Wallet removed')) reload(); }}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        </Panel>
      )}

      <Panel>
        <div className="relative mb-4">
          <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
          <input className={`${inputClass} pl-9`} placeholder="Search for your wallet" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        {wallets.length === 0 ? (
          <p className="text-sm text-neutral-400 py-6 text-center">No wallet called “{search}”. Use <strong>Add new wallet</strong> below.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {wallets.map((w) => (
              <li key={w.id}>
                <button type="button" onClick={() => setSelected(w)} className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/60 transition text-left">
                  <WalletIcon name={w.name} />
                  <span className="flex-1 text-sm font-medium">{w.name}</span>
                  <ChevronRight className="w-4 h-4 text-neutral-500" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <Button variant="secondary" className="w-full mt-4" onClick={() => setSelected({ id: 'custom', name: 'New wallet', networks: Object.keys(NETWORK_LABEL) })}>
          <Plus className="w-4 h-4" />Add new wallet
        </Button>
      </Panel>

      <p className="text-xs text-neutral-500 mt-4 flex gap-1.5"><ShieldAlert className="w-3.5 h-3.5 shrink-0" />We will never ask for your recovery phrase or private key. Anyone who does is trying to steal your crypto.</p>

      {selected && <ConnectModal wallet={selected} allowedChains={data?.allowedChains} onClose={() => setSelected(null)} onDone={reload} />}
    </Page>
  );
}
