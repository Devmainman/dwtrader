import { useState } from 'react';
import { CreditCard, Plus, Snowflake, Sun, ArrowDownToLine, ArrowUpFromLine, Gauge, Trash2, Wifi } from 'lucide-react';
import { cardsApi } from '../../api/products';
import {
  Page, Panel, Button, Badge, Modal, Field, inputClass, AmountModal,
  Loading, ErrorState, Empty, useLoader, useAction, formatMoney
} from './ui';

const CARD_BG = {
  midnight: 'bg-[linear-gradient(135deg,#1f2937_0%,#0b0f19_100%)]',
  aurora: 'bg-[linear-gradient(135deg,#EB25C6_0%,#F5852F_100%)]',
  gold: 'bg-[linear-gradient(135deg,#d4a017_0%,#7a5c00_100%)]',
  rose: 'bg-[linear-gradient(135deg,#fb7185_0%,#9f1239_100%)]'
};

const STATUS = {
  pending: <Badge tone="warning">Pending review</Badge>,
  active: <Badge tone="success">Active</Badge>,
  frozen: <Badge tone="info">Frozen</Badge>,
  rejected: <Badge tone="danger">Declined</Badge>
};

function CardFace({ card }) {
  return (
    <div className={`relative w-full aspect-[1.586] max-w-sm rounded-xl p-5 text-white shadow-xl overflow-hidden ${CARD_BG[card.color] || CARD_BG.midnight} ${card.status === 'frozen' ? 'opacity-60 grayscale' : ''}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium opacity-90">{card.label || `${card.type === 'physical' ? 'Physical' : 'Virtual'} card`}</span>
        <Wifi className="w-5 h-5 rotate-90 opacity-80" />
      </div>
      <div className="w-10 h-7 rounded-md bg-amber-200/80 mt-5" />
      <p className="mt-4 font-mono text-base tracking-widest">{card.maskedNumber}</p>
      <div className="flex items-end justify-between mt-4 text-xs">
        <div>
          <p className="opacity-60">Card holder</p>
          <p className="font-medium tracking-wide">{card.holderName}</p>
        </div>
        <div>
          <p className="opacity-60">Expires</p>
          <p className="font-medium">{card.expiryMonth ? `${String(card.expiryMonth).padStart(2, '0')}/${String(card.expiryYear).slice(-2)}` : '--/--'}</p>
        </div>
        <p className="text-base font-semibold italic uppercase">{card.brand}</p>
      </div>
      {card.status === 'frozen' && (
        <div className="absolute inset-0 flex items-center justify-center"><Snowflake className="w-12 h-12 text-white/80" /></div>
      )}
    </div>
  );
}

function RequestCardModal({ open, onClose, config, currency, suggestedName, onDone }) {
  const { busy, run } = useAction();
  const [form, setForm] = useState({
    type: 'virtual', brand: 'visa', color: 'aurora', label: '', holderName: suggestedName || '',
    street: '', city: '', state: '', postalCode: '', country: ''
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const fee = form.type === 'physical' ? config?.physicalFee : config?.virtualFee;

  const submit = async () => {
    const { street, city, state, postalCode, country, ...rest } = form;
    const res = await run(() => cardsApi.request({
      ...rest,
      shippingAddress: form.type === 'physical' ? { street, city, state, postalCode, country } : undefined
    }), 'Card requested');
    if (res) { onDone(); onClose(); }
  };

  return (
    <Modal
      open={open}
      title="Get a new card"
      onClose={onClose}
      footer={(<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button busy={busy} onClick={submit}>Request card · {formatMoney(fee, currency)}</Button></>)}
    >
      <div className="grid grid-cols-2 gap-2 mb-4">
        {['virtual', 'physical'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setForm((f) => ({ ...f, type: t }))}
            className={`rounded-xl border px-3 py-3 text-left ${form.type === t ? 'border-[#EB25C6] bg-neutral-800/60' : 'border-neutral-800'}`}
          >
            <p className="font-medium capitalize">{t}</p>
            <p className="text-xs text-neutral-400">{formatMoney(t === 'physical' ? config?.physicalFee : config?.virtualFee, currency)} issuance fee</p>
          </button>
        ))}
      </div>
      <Field label="Name on card"><input className={inputClass} value={form.holderName} onChange={set('holderName')} maxLength={60} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Network">
          <select className={inputClass} value={form.brand} onChange={set('brand')}>
            <option value="visa">Visa</option>
            <option value="mastercard">Mastercard</option>
          </select>
        </Field>
        <Field label="Design">
          <select className={inputClass} value={form.color} onChange={set('color')}>
            <option value="aurora">Aurora</option>
            <option value="midnight">Midnight</option>
            <option value="gold">Gold</option>
            <option value="rose">Rose</option>
          </select>
        </Field>
      </div>
      <Field label="Nickname (optional)"><input className={inputClass} value={form.label} onChange={set('label')} maxLength={40} placeholder="Subscriptions" /></Field>
      {form.type === 'physical' && (
        <>
          <p className="text-sm font-medium mb-2">Shipping address</p>
          <Field label="Street"><input className={inputClass} value={form.street} onChange={set('street')} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="City"><input className={inputClass} value={form.city} onChange={set('city')} /></Field>
            <Field label="State"><input className={inputClass} value={form.state} onChange={set('state')} /></Field>
            <Field label="Postal code"><input className={inputClass} value={form.postalCode} onChange={set('postalCode')} /></Field>
            <Field label="Country"><input className={inputClass} value={form.country} onChange={set('country')} /></Field>
          </div>
        </>
      )}
    </Modal>
  );
}

export default function Cards() {
  const { data, loading, error, reload } = useLoader(() => cardsApi.list());
  const { busy, run } = useAction();
  const [requestOpen, setRequestOpen] = useState(false);
  const [modal, setModal] = useState(null); // { kind, card }

  if (loading && !data) return <Page title="Cards" icon={CreditCard}><Loading /></Page>;
  if (error && !data) return <Page title="Cards" icon={CreditCard}><ErrorState message={error} onRetry={reload} /></Page>;

  const { cards, currency, availableBalance, config, suggestedHolderName } = data;
  const act = async (fn, msg) => { const r = await run(fn, msg); if (r !== undefined) { setModal(null); reload(); } };
  const canRequest = cards.filter((c) => ['pending', 'active', 'frozen'].includes(c.status)).length < config.maxCardsPerUser;

  return (
    <Page
      title="Cards"
      subtitle="Spend from your balance with virtual and physical debit cards."
      icon={CreditCard}
      actions={canRequest && <Button onClick={() => setRequestOpen(true)}><Plus className="w-4 h-4" />New card</Button>}
    >
      {cards.length === 0 ? (
        <Panel>
          <Empty
            icon={CreditCard}
            title="You don't have a card yet"
            text={`Virtual cards are ready to use online once approved. Fee: ${formatMoney(config.virtualFee, currency)} (virtual) · ${formatMoney(config.physicalFee, currency)} (physical).`}
            action={<Button onClick={() => setRequestOpen(true)}><Plus className="w-4 h-4" />Get a card</Button>}
          />
        </Panel>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {cards.map((card) => (
            <Panel key={card._id}>
              <CardFace card={card} />
              <div className="flex items-center justify-between mt-4">
                <div>
                  <p className="text-xs text-neutral-400">Card balance</p>
                  <p className="text-xl font-semibold">{formatMoney(card.balance, card.currency)}</p>
                  <p className="text-xs text-neutral-500">Spending limit {formatMoney(card.spendingLimit, card.currency)}</p>
                </div>
                {STATUS[card.status]}
              </div>
              {card.status === 'rejected' && card.adminNote && <p className="text-xs text-red-300 mt-2">{card.adminNote}</p>}
              {card.status === 'pending' && <p className="text-xs text-neutral-400 mt-2">We're reviewing your request. You'll be notified once your card is active.</p>}
              {['active', 'frozen'].includes(card.status) && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {card.status === 'active' && (
                    <Button variant="secondary" onClick={() => setModal({ kind: 'fund', card })}><ArrowDownToLine className="w-4 h-4" />Add money</Button>
                  )}
                  <Button variant="secondary" disabled={!card.balance} onClick={() => setModal({ kind: 'unload', card })}><ArrowUpFromLine className="w-4 h-4" />Withdraw</Button>
                  <Button
                    variant="secondary"
                    busy={busy}
                    onClick={() => act(() => cardsApi.freeze(card._id, card.status === 'active'), card.status === 'active' ? 'Card frozen' : 'Card unfrozen')}
                  >
                    {card.status === 'active' ? <><Snowflake className="w-4 h-4" />Freeze</> : <><Sun className="w-4 h-4" />Unfreeze</>}
                  </Button>
                  <Button variant="ghost" onClick={() => setModal({ kind: 'limit', card })}><Gauge className="w-4 h-4" />Limit</Button>
                  <Button variant="ghost" onClick={() => setModal({ kind: 'cancel', card })}><Trash2 className="w-4 h-4" />Cancel</Button>
                </div>
              )}
            </Panel>
          ))}
        </div>
      )}

      <RequestCardModal
        open={requestOpen}
        onClose={() => setRequestOpen(false)}
        config={config}
        currency={currency}
        suggestedName={suggestedHolderName}
        onDone={reload}
      />
      <AmountModal
        open={modal?.kind === 'fund'}
        title="Add money to card"
        currency={currency}
        max={availableBalance}
        busy={busy}
        onClose={() => setModal(null)}
        onSubmit={(amount) => act(() => cardsApi.fund(modal.card._id, amount), 'Card funded')}
      />
      <AmountModal
        open={modal?.kind === 'unload'}
        title="Move card funds to balance"
        currency={currency}
        max={modal?.card?.balance}
        busy={busy}
        onClose={() => setModal(null)}
        onSubmit={(amount) => act(() => cardsApi.unload(modal.card._id, amount), 'Funds returned to your balance')}
      />
      <AmountModal
        open={modal?.kind === 'limit'}
        title="Set spending limit"
        label="Monthly limit"
        currency={currency}
        confirmLabel="Save"
        busy={busy}
        onClose={() => setModal(null)}
        onSubmit={(amount) => act(() => cardsApi.setLimit(modal.card._id, amount), 'Limit updated')}
      />
      <Modal
        open={modal?.kind === 'cancel'}
        title="Cancel this card?"
        onClose={() => setModal(null)}
        footer={(<><Button variant="secondary" onClick={() => setModal(null)}>Keep card</Button><Button variant="danger" busy={busy} onClick={() => act(() => cardsApi.cancel(modal.card._id), 'Card cancelled')}>Cancel card</Button></>)}
      >
        <p className="text-sm text-neutral-300">
          The card stops working immediately. Any card balance ({formatMoney(modal?.card?.balance, currency)}) returns to your main balance. This can't be undone.
        </p>
      </Modal>
    </Page>
  );
}
