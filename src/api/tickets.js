// Support tickets API.
import axios from 'axios';
import { API_BASE_URL, STATIC_BASE_URL } from './config';

const auth = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });
const form = (fields) => {
  const fd = new FormData();
  Object.entries(fields).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') fd.append(k, v); });
  return fd;
};

export const ticketsApi = {
  list: () => axios.get(`${API_BASE_URL}/tickets`, { headers: auth() }).then((r) => r.data.tickets || []),
  get: (id) => axios.get(`${API_BASE_URL}/tickets/${id}`, { headers: auth() }).then((r) => r.data.ticket),
  create: ({ subject, priority, message, attachment }) =>
    axios.post(`${API_BASE_URL}/tickets`, form({ subject, priority, message, attachment }), { headers: auth() }).then((r) => r.data.ticket),
  reply: (id, { text, attachment }) =>
    axios.post(`${API_BASE_URL}/tickets/${id}/messages`, form({ text, attachment }), { headers: auth() }).then((r) => r.data.ticket),
  close: (id) => axios.put(`${API_BASE_URL}/tickets/${id}/close`, {}, { headers: auth() }).then((r) => r.data.ticket)
};

export const fileUrl = (p) => (p ? (/^https?:/.test(p) ? p : `${STATIC_BASE_URL}${p}`) : '');

export const ticketDate = (d) => {
  if (!d) return '';
  const x = new Date(d);
  return `${x.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} ${x.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
};

export const apiMessage = (e) => e?.response?.data?.message || e?.message || 'Something went wrong';
