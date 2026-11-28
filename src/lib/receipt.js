// Transaction receipts: a PNG to download and a clean page to print (or save as PDF).
const typeName = (t) => String(t || '').replace(/^admin_/, '').replace(/_/g, ' ');
const money = (v, cur) => { try { return new Intl.NumberFormat('en-US', { style: 'currency', currency: cur || 'USD' }).format(v); } catch { return `${cur} ${Number(v).toFixed(2)}`; } };
const cap = (s) => String(s || '').charAt(0).toUpperCase() + String(s || '').slice(1);

/** The lines a receipt shows, in order. */
export function receiptLines(t) {
  const m = t.metadata || {};
  return [
    ['Reference', t.reference],
    ['Date', new Date(t.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })],
    ['Type', cap(typeName(t.type))],
    ['Status', cap(t.status)],
    m.coin && ['Coin', `${m.quantity ?? ''} ${m.coin}`.trim()],
    m.price && ['Price', money(m.price, t.currency)],
    m.fee ? ['Fee', money(m.fee, t.currency)] : null,
    t.bankName && ['Method', t.bankName],
    t.accountName && ['Account name', t.accountName],
    t.accountNumber && ['Account number', t.accountNumber],
    m.txHash && ['Transaction hash', m.txHash]
  ].filter(Boolean);
}

const amountText = (t) => `${t.direction === 'in' ? '+' : '−'}${money(t.amount, t.currency)}`;

/** Draws the receipt on a canvas and downloads it as a PNG. */
export async function downloadReceipt(t, brand = '') {
  const lines = receiptLines(t);
  const W = 720; const pad = 48; const rowH = 46;
  const H = 330 + lines.length * rowH + 90;
  const s = 2; // retina
  const c = document.createElement('canvas');
  c.width = W * s; c.height = H * s;
  const g = c.getContext('2d');
  g.scale(s, s);
  const font = (w, px) => `${w} ${px}px "Plus Jakarta Sans", "Segoe UI", system-ui, sans-serif`;
  try { await document.fonts?.ready; } catch { /* ignore */ }

  // Card
  g.fillStyle = '#f4f3f0'; g.fillRect(0, 0, W, H);
  const r = 28; const x0 = 20; const y0 = 20; const w = W - 40; const h = H - 40;
  g.fillStyle = '#ffffff';
  g.beginPath(); g.moveTo(x0 + r, y0); g.arcTo(x0 + w, y0, x0 + w, y0 + h, r); g.arcTo(x0 + w, y0 + h, x0, y0 + h, r); g.arcTo(x0, y0 + h, x0, y0, r); g.arcTo(x0, y0, x0 + w, y0, r); g.closePath(); g.fill();

  // Header
  g.fillStyle = '#17161a'; g.font = font(700, 20); g.fillText(brand || 'Transaction receipt', pad, 78);
  if (brand) { g.fillStyle = '#8a8790'; g.font = font(500, 14); g.fillText('Transaction receipt', pad, 102); }
  const inflow = t.direction === 'in';
  g.fillStyle = inflow ? '#0f9f6e' : '#17161a'; g.font = font(300, 46); g.fillText(amountText(t), pad, 178);
  g.fillStyle = '#45424b'; g.font = font(500, 16); g.fillText(cap(t.label || typeName(t.type)).slice(0, 60), pad, 212);
  const ok = t.status === 'completed';
  const badge = cap(t.status);
  g.font = font(700, 13); const bw = g.measureText(badge).width + 26;
  g.fillStyle = ok ? 'rgba(16,185,129,.12)' : 'rgba(245,158,11,.14)';
  g.beginPath(); g.roundRect?.(W - pad - bw, 60, bw, 28, 14); g.fill();
  g.fillStyle = ok ? '#0f9f6e' : '#b45309'; g.fillText(badge, W - pad - bw + 13, 79);

  // Rows
  let y = 262;
  g.strokeStyle = '#ece9e4'; g.lineWidth = 1;
  lines.forEach(([k, v]) => {
    g.beginPath(); g.moveTo(pad, y - 28); g.lineTo(W - pad, y - 28); g.stroke();
    g.fillStyle = '#8a8790'; g.font = font(500, 14); g.fillText(k, pad, y);
    g.fillStyle = '#17161a'; g.font = font(600, 14);
    let val = String(v ?? '');
    while (g.measureText(val).width > W - pad * 2 - 170 && val.length > 4) val = `${val.slice(0, -4)}…`;
    g.textAlign = 'right'; g.fillText(val, W - pad, y); g.textAlign = 'left';
    y += rowH;
  });
  g.beginPath(); g.moveTo(pad, y - 28); g.lineTo(W - pad, y - 28); g.stroke();
  g.fillStyle = '#a19ea6'; g.font = font(500, 12);
  g.fillText(`Generated ${new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}. Keep this receipt for your records.`, pad, y + 6);

  const blob = await new Promise((res) => c.toBlob(res, 'image/png'));
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `receipt-${t.reference || 'transaction'}.png`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

/** Opens the browser's print dialog with a clean receipt (users can also save it as PDF). */
export function printReceipt(t, brand = '') {
  const rows = receiptLines(t).map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('');
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Receipt ${esc(t.reference)}</title>
<style>
  @page { margin: 18mm; }
  body { font-family: "Plus Jakarta Sans", "Segoe UI", system-ui, sans-serif; color: #17161a; margin: 0; }
  .card { max-width: 560px; margin: 0 auto; border: 1px solid #e7e4e0; border-radius: 18px; padding: 28px; }
  .top { display: flex; justify-content: space-between; align-items: flex-start; }
  h1 { font-size: 18px; margin: 0; } .sub { color: #8a8790; font-size: 12px; margin-top: 4px; }
  .badge { font-size: 11px; font-weight: 700; padding: 5px 10px; border-radius: 999px; background: ${t.status === 'completed' ? '#e7f8f1; color:#0f9f6e' : '#fdf3e3; color:#b45309'}; }
  .amt { font-size: 34px; font-weight: 300; margin: 22px 0 4px; color: ${t.direction === 'in' ? '#0f9f6e' : '#17161a'}; }
  .label { color: #45424b; font-size: 14px; }
  table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
  th, td { padding: 10px 0; border-top: 1px solid #ece9e4; } th { text-align: left; color: #8a8790; font-weight: 500; } td { text-align: right; font-weight: 600; word-break: break-all; }
  .foot { color: #a19ea6; font-size: 11px; margin-top: 18px; }
</style></head><body><div class="card">
  <div class="top"><div><h1>${esc(brand || 'Transaction receipt')}</h1>${brand ? '<div class="sub">Transaction receipt</div>' : ''}</div><span class="badge">${esc(cap(t.status))}</span></div>
  <div class="amt">${esc(amountText(t))}</div><div class="label">${esc(cap(t.label || typeName(t.type)))}</div>
  <table>${rows}</table>
  <div class="foot">Printed ${esc(new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }))}. Keep this receipt for your records.</div>
</div></body></html>`;
  const frame = document.createElement('iframe');
  frame.setAttribute('aria-hidden', 'true');
  frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
  document.body.appendChild(frame);
  const doc = frame.contentWindow.document;
  doc.open(); doc.write(html); doc.close();
  setTimeout(() => {
    frame.contentWindow.focus();
    frame.contentWindow.print();
    setTimeout(() => frame.remove(), 1500);
  }, 250);
}
