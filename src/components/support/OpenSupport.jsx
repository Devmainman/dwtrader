import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ticketsApi, apiMessage } from "../../api/tickets";
import { toast } from "../../lib/toast";


function UploadAttachment({ onFileSelect, file }) {
  const fileInputRef = React.useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size <= 2 * 1024 * 1024) {
      onFileSelect(file);
    } else {
      toast.error("File size exceeds 2MB limit");
      e.target.value = null;
    }
  };

  return (
    <section className="mt-5 w-full">
      <p className="text-xs text-neutral-500">
        <span className="font-semibold text-[#C7C7C7]">Upload attachment</span> (optional)
      </p>

      <div className="flex flex-col justify-center px-4 py-4 mt-3 w-full rounded-xl bg-[#1D1D1F]">
        <div className="flex flex-col items-center px-6 py-3 rounded-xl bg-neutral-800">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/6ec391f010ecf0794dc64df30ced5c6e4bd82f56d00ad2c01f0ad19a49756de6?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
            className="w-12"
            alt="Upload icon"
          />
          <h3 className="mt-2 text-xs font-medium text-zinc-100">Upload Image</h3>
          <p className="text-[8px] text-neutral-400">{file ? `Selected: ${file.name}` : "Image size must be less than 2MB"}</p>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="mt-3 px-4 py-1 text-[10px] bg-blue-600 rounded-3xl text-zinc-100"
          >
            Select Image
          </button>
        </div>
      </div>
    </section>
  );
}

function SubmitButton({ busy }) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="mt-6 w-full py-3 text-xs bg-blue-600 rounded-3xl text-zinc-100 disabled:opacity-60"
    >
      {busy ? "Submitting…" : "Submit"}
    </button>
  );
}

function FormField({ label, type, name, value, onChange, options, placeholder }) {
  return (
    <div className="mb-4">
      {label && <label className="block mb-1 text-[10px] text-white">{label}</label>}

      {type === "select" ? (
        <select
          className="w-[243px] px-2.5 py-3 rounded-md bg-[#1D1D1F] text-neutral-400 outline-none"
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((opt, idx) => (
            <option key={idx} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          className="w-[243px] px-2.5 py-3 rounded-md bg-[#1D1D1F] text-neutral-400 resize-none outline-none"
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-[243px] px-2.5 py-3 rounded-md bg-[#1D1D1F] text-neutral-400 outline-none"
        />
      )}
    </div>
  );
}



function Support3({ onCreated }) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    priority: "",
    message: "",
    attachment: null
  });

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject.trim()) return toast.error("Add a subject");
    if (!formData.priority) return toast.error("Choose a priority");
    if (!formData.message.trim()) return toast.error("Describe the issue in the message");
    setBusy(true);
    try {
      await ticketsApi.create(formData);
      toast.success("Ticket submitted", { description: "Our team will reply here and notify you." });
      setFormData({ subject: "", priority: "", message: "", attachment: null });
      if (onCreated) onCreated();
      else navigate("/support");
    } catch (err) {
      toast.error(apiMessage(err));
    } finally {
      setBusy(false);
    }
    return undefined;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col pt-2 pb-6 mx-auto w-full max-w-[480px] md:max-w-[640px] lg:max-w-[820px] lg:px-6 rounded-3xl bg-neutral-900"
    >
      <h2 className="text-[14px] font-medium text-white">Create Ticket</h2>

      <div className="mt-2.5  gap-5 w-full text-xs">
        <div className="gap-5 flex justify-between">
        <label className="block mt-3 text-neutral-400 mb-1">Subject</label>
        <FormField
          placeholder="Subject"
          type="text"
          name="subject"
          value={formData.subject}
          onChange={(value) => handleChange("subject", value)}
        />
        </div>

      <div className="gap-5 flex justify-between">
       <label className="block mt-3 text-neutral-400 mb-1">Priority</label>
        <FormField
          
          type="select"
          name="priority"
          value={formData.priority}
          onChange={(value) => handleChange("priority", value)}
          options={[{ value: "", label: "--Select--" }, { value: "Low", label: "Low" }, { value: "Medium", label: "Medium" }, { value: "High", label: "High" }]}
        />
        </div>
        

<div className="mb-4 flex justify-end">
  
  <textarea
    placeholder="Message"
    maxLength={4000}
    className="w-[243px] h-[102px] px-2.5 py-3 rounded-md bg-[#1D1D1F] text-neutral-400 resize-none outline-none"
    value={formData.message}
    onChange={(e) => handleChange("message", e.target.value)}
    rows="4"
  />
</div>


      </div>

      <UploadAttachment file={formData.attachment} onFileSelect={(file) => handleChange("attachment", file)} />

      <SubmitButton busy={busy} />
    </form>
  );
}

export default Support3;
