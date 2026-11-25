// API client for cold storage, cards, wallets, stocks, staking and real estate.
import axios from 'axios';
import { API_BASE_URL } from './config';

const client = axios.create({ baseURL: API_BASE_URL, timeout: 20000 });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const unwrap = (p) => p.then((r) => r.data?.data ?? r.data);

/** Human-readable message from an axios error. */
export const apiError = (err, fallback = 'Something went wrong') =>
  err?.response?.data?.message || err?.response?.data?.error || err?.message || fallback;

export const portfolioApi = {
  summary: () => unwrap(client.get('/portfolio/summary')),
  holdings: () => unwrap(client.get('/portfolio/holdings'))
};

export const coldStorageApi = {
  list: () => unwrap(client.get('/cold-storage')),
  create: (body) => unwrap(client.post('/cold-storage', body)),
  deposit: (id, amount) => unwrap(client.post(`/cold-storage/${id}/deposit`, { amount })),
  unlock: (id, amount) => unwrap(client.post(`/cold-storage/${id}/unlock`, { amount })),
  cancelUnlock: (id) => unwrap(client.post(`/cold-storage/${id}/cancel-unlock`)),
  release: (id) => unwrap(client.post(`/cold-storage/${id}/release`)),
  close: (id) => unwrap(client.delete(`/cold-storage/${id}`))
};

export const walletsApi = {
  list: () => unwrap(client.get('/wallets')),
  nonce: () => unwrap(client.post('/wallets/nonce')),
  connect: (body) => unwrap(client.post('/wallets/connect', body)),
  watch: (body) => unwrap(client.post('/wallets/watch', body)),
  update: (id, body) => unwrap(client.patch(`/wallets/${id}`, body)),
  remove: (id) => unwrap(client.delete(`/wallets/${id}`))
};

export const stocksApi = {
  list: (params) => unwrap(client.get('/stocks', { params })),
  get: (symbol) => unwrap(client.get(`/stocks/${encodeURIComponent(symbol)}`)),
  portfolio: () => unwrap(client.get('/stocks/portfolio')),
  orders: (params) => unwrap(client.get('/stocks/orders', { params })),
  buy: (symbol, amount) => unwrap(client.post('/stocks/buy', { symbol, amount })),
  sell: (symbol, shares, all = false) => unwrap(client.post('/stocks/sell', { symbol, shares, all }))
};

export const stakingApi = {
  pools: () => unwrap(client.get('/staking/pools')),
  history: (status) => unwrap(client.get('/staking/history', { params: { status } })),
  stake: (poolId, amount) => unwrap(client.post('/staking/stake', { poolId, amount })),
  claim: (id) => unwrap(client.post(`/staking/positions/${id}/claim`)),
  unstake: (id) => unwrap(client.post(`/staking/positions/${id}/unstake`))
};

export const copyTradingApi = {
  traders: (params) => unwrap(client.get('/copy-trading/traders', { params })),
  trader: (traderId) => unwrap(client.get(`/copy-trading/traders/${encodeURIComponent(traderId)}`)),
  traderTrades: (traderId, params) => unwrap(client.get(`/copy-trading/traders/${encodeURIComponent(traderId)}/trades`, { params })),
  follow: (traderId) => unwrap(client.post(`/copy-trading/traders/${encodeURIComponent(traderId)}/follow`)),
  unfollow: (traderId) => unwrap(client.delete(`/copy-trading/traders/${encodeURIComponent(traderId)}/follow`)),
  copy: (traderId, amount, settings) => unwrap(client.post('/copy-trading/copy', { traderId, amount, settings })),
  copies: (status) => unwrap(client.get('/copy-trading/copies', { params: { status } })),
  copyDetail: (id, params) => unwrap(client.get(`/copy-trading/copies/${id}`, { params })),
  addFunds: (id, amount) => unwrap(client.post(`/copy-trading/copies/${id}/add-funds`, { amount })),
  pause: (id) => unwrap(client.post(`/copy-trading/copies/${id}/pause`)),
  resume: (id) => unwrap(client.post(`/copy-trading/copies/${id}/resume`)),
  settings: (id, body) => unwrap(client.put(`/copy-trading/copies/${id}/settings`, body)),
  stop: (id) => unwrap(client.post(`/copy-trading/copies/${id}/stop`)),
  closePosition: (id) => unwrap(client.post(`/copy-trading/positions/${id}/close`)),
  history: (params) => unwrap(client.get('/copy-trading/history', { params }))
};

export const realEstateApi = {
  projects: (status, params) => unwrap(client.get('/real-estate/projects', { params: { status, ...params } })),
  project: (id) => unwrap(client.get(`/real-estate/projects/${encodeURIComponent(id)}`)),
  invest: (id, amount) => unwrap(client.post(`/real-estate/projects/${encodeURIComponent(id)}/invest`, { amount })),
  investments: () => unwrap(client.get('/real-estate/investments')),
  claim: (id) => unwrap(client.post(`/real-estate/investments/${id}/claim`)),
  redeem: (id) => unwrap(client.post(`/real-estate/investments/${id}/redeem`))
};

export const marketApi = {
  quotes: (symbols) => unwrap(client.get('/trading/market/quotes', { params: { symbols: symbols.join(',') } })),
  open: (body) => unwrap(client.post('/trading/market/open', body)),
  positions: () => unwrap(client.get('/trading/market/positions')),
  history: (params) => unwrap(client.get('/trading/market/history', { params })),
  close: (id) => unwrap(client.post(`/trading/market/positions/${id}/close`)),
  updateStops: (id, body) => unwrap(client.patch(`/trading/market/positions/${id}`, body))
};

export const packagesApi = {
  packages: () => client.get('/user-trades/packages').then((r) => r.data),
  start: (packageId, amount) => client.post('/user-trades/create', { packageId, amount }).then((r) => r.data),
  activities: () => client.get('/trading/activities').then((r) => r.data),
  cancel: (id) => client.post(`/user-trades/${id}/cancel`).then((r) => r.data)
};

export const miningApi = {
  catalog: () => client.get('/mining/catalog').then((r) => r.data),
  stats: () => client.get('/mining/stats').then((r) => r.data.stats),
  equipment: () => client.get('/mining/equipment').then((r) => r.data.equipment),
  buy: (equipmentId) => client.post('/mining/purchase-equipment', { equipmentId }).then((r) => r.data),
  toggleMachine: (equipmentId, active) => client.post('/mining/activate-equipment', { equipmentId, active }).then((r) => r.data),
  start: (poolId) => client.post('/mining/start', { poolId }).then((r) => r.data),
  stop: () => client.post('/mining/stop').then((r) => r.data),
  rewards: (status) => client.get('/mining/rewards', { params: { status } }).then((r) => r.data.rewards),
  claim: () => client.post('/mining/claim-rewards').then((r) => r.data),
  boosters: () => client.get('/mining/boosters').then((r) => r.data),
  boost: (boosterId) => client.post('/mining/activate-booster', { boosterId }).then((r) => r.data),
  pools: () => client.get('/mining/pools').then((r) => r.data.pools),
  switchPool: (poolId) => client.post('/mining/switch-pool', { poolId }).then((r) => r.data),
  history: () => client.get('/mining/history', { params: { limit: 20 } }).then((r) => r.data.history)
};

/** Trader Rewards: milestones, progress and claims. */
export const rewardsApi = {
  get: () => unwrap(client.get('/rewards')),
  claim: (milestoneId) => unwrap(client.post(`/rewards/milestones/${milestoneId}/claim`)),
  cancel: (claimId) => unwrap(client.post(`/rewards/claims/${claimId}/cancel`))
};

/** Cards from the admin's Card Settings, and the user's card requests (purchase + activation payments). */
export const cardRequestsApi = {
  catalog: () => unwrap(client.get('/card-requests/catalog')),
  list: () => unwrap(client.get('/card-requests')),
  create: (productId, holder) => unwrap(client.post('/card-requests', { productId, holder })),
  cancel: (id) => unwrap(client.post(`/card-requests/${id}/cancel`)),
  pay: (id, which, formData) => unwrap(client.post(`/card-requests/${id}/pay/${which}`, formData, { timeout: 60000 })),
  details: (id) => unwrap(client.get(`/card-requests/${id}/details`)),
  setPin: (id, pin, confirmPin) => unwrap(client.post(`/card-requests/${id}/pin`, { pin, confirmPin })),
  changePin: (id, currentPin, newPin, confirmPin) => unwrap(client.put(`/card-requests/${id}/pin`, { currentPin, newPin, confirmPin }))
};

/** AI Smart Trader bots and the user's subscriptions. */
export const smartBotsApi = {
  list: () => unwrap(client.get('/smart-bots')),
  mine: () => unwrap(client.get('/smart-bots/subscriptions')),
  subscribe: (id, allocation) => unwrap(client.post(`/smart-bots/${id}/subscribe`, { allocation })),
  cancel: (id) => unwrap(client.post(`/smart-bots/subscriptions/${id}/cancel`))
};

/** Crypto wallets: balances at live prices, crypto deposits and fiat <-> crypto conversion. */
export const cryptoApi = {
  wallets: () => unwrap(client.get('/crypto/wallets')),
  depositOptions: () => unwrap(client.get('/crypto/deposit-options')),
  deposits: () => unwrap(client.get('/crypto/deposits')),
  deposit: (formData) => unwrap(client.post('/crypto/deposits', formData, { timeout: 60000 })),
  quote: (body) => unwrap(client.post('/crypto/convert/quote', body)),
  convert: (body) => client.post('/crypto/convert', body).then((r) => r.data),
  sparklines: (symbols) => unwrap(client.get('/crypto/sparklines', { params: { symbols: symbols.join(',') } })),
  activity: (limit = 5) => unwrap(client.get('/account/transactions', { params: { limit } })),
  activityPage: (params) => unwrap(client.get('/account/transactions', { params })),
  markets: () => unwrap(client.get('/crypto/markets')),
  history: (symbols, range) => unwrap(client.get('/crypto/history', { params: { symbols: symbols.join(','), range } }))
};
