// New support ticket. Inside /support (embedded) or on its own at /opensupport.
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LifeBuoy, ImagePlus, X } from "lucide-react";
import { ticketsApi, apiMessage } from "../../api/tickets";
import { toast } from "../../lib/toast";
import { Page, Field, inputClass, Button } from "../products/ui";

const PRIORITIES = [["Low", "General question"], ["Medium", "Something isn't working"], ["High", "Money or access issue"]];

function NewTicketForm({ onCreated, embedded = false }) {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [f, setF] = useState({ subject: "", priority: "", message: "", attachment: null });
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const pick = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("File size exceeds 2MB limit"); return; }
    set("attachment", file);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!f.subject.trim()) return toast.error("Add a subject");
    if (!f.priority) return toast.error("Choose a priority");
    if (!f.message.trim()) return toast.error("Describe the issue in the message");
    setBusy(true);
    try {
      await ticketsApi.create(f);
      toast.success("Ticket submitted", { description: "Our team will reply here and notify you." });
      setF({ subject: "", priority: "", message: "", attachment: null });
      if (onCreated) onCreated(); else navigate("/support");
    } catch (err) {
      toast.error(apiMessage(err));
    } finally {
      setBusy(false);
    }
    return undefined;
  };

  const form = (
    <form onSubmit={submit} className="dash-panel p-4 sm:p-5">
      <Field label="Subject">
        <input value={f.subject} onChange={(e) => set("subject", e.target.value)} maxLength={140} placeholder="e.g. My deposit hasn't arrived" className={inputClass} />
      </Field>
      <Field label="Priority">
        <div className="grid grid-cols-3 gap-2" data-no-busy>
          {PRIORITIES.map(([p, hint]) => (
            <button key={p} type="button" onClick={() => set("priority", p)}
              className={`text-left rounded-2xl border px-3 py-2.5 transition ${f.priority === p ? "border-blue-500/70 bg-blue-600/10" : "border-white/10 bg-white/[.02] hover:border-white/20"}`}>
              <span className="block text-[12px] font-semibold text-zinc-100">{p}</span>
              <span className="block text-[10px] text-neutral-500 leading-snug mt-0.5">{hint}</span>
            </button>
          ))}
        </div>
      </Field>
      <Field label="Message" hint={`${f.message.length}/4000`}>
        <textarea value={f.message} onChange={(e) => set("message", e.target.value)} maxLength={4000} rows={5} placeholder="Tell us what happened, and include any reference numbers."
          className={`${inputClass} h-auto py-3 resize-none leading-relaxed`} />
      </Field>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={pick} />
      {f.attachment ? (
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.02] px-3 py-2.5 mb-4">
          <ImagePlus className="w-4 h-4 text-blue-400" />
          <span className="flex-1 min-w-0 text-[12px] truncate">{f.attachment.name}</span>
          <button type="button" data-no-busy onClick={() => set("attachment", null)} className="w-7 h-7 rounded-full bg-white/[.06] flex items-center justify-center" aria-label="Remove attachment"><X className="w-3.5 h-3.5" /></button>
        </div>
      ) : (
        <button type="button" data-no-busy onClick={() => fileRef.current?.click()} className="w-full mb-4 rounded-2xl border border-dashed border-white/15 hover:border-white/25 bg-white/[.02] px-4 py-3.5 flex items-center gap-3 text-left transition">
          <span className="w-9 h-9 rounded-full bg-blue-600/12 text-blue-400 flex items-center justify-center"><ImagePlus className="w-4 h-4" /></span>
          <span><span className="block text-[12px] font-medium">Add a screenshot (optional)</span><span className="block text-[10px] text-neutral-500">Images up to 2 MB</span></span>
        </button>
      )}
      <Button type="submit" busy={busy} className="w-full h-12 !text-[13px]">{busy ? "Submitting…" : "Submit ticket"}</Button>
    </form>
  );

  if (embedded) return form;
  return (
    <Page title="New ticket" subtitle="Our team replies within the ticket" icon={LifeBuoy}>
      <div className="max-w-[640px]">{form}</div>
    </Page>
  );
}

export default NewTicketForm;
