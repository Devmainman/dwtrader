import React, { useState } from "react";


function UploadAttachment({ onFileSelect }) {
  const fileInputRef = React.useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 2 * 1024 * 1024) {
      onFileSelect(file);
    } else {
      alert("File size exceeds 2MB limit");
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
          <p className="text-[8px] text-neutral-400">Image size must be less than 2MB</p>

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

function SubmitButton() {
  return (
    <button
      type="submit"
      className="mt-6 w-full py-3 text-xs bg-blue-600 rounded-3xl text-zinc-100"
    >
      Submit
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



function Support3() {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col pt-2 pb-6 mx-auto w-full max-w-[480px] rounded-3xl bg-neutral-900"
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
          options={[{ value: "", label: "--Select--" }]}
        />
        </div>
        

<div className="mb-4 flex justify-end">
  
  <textarea
    placeholder="Message"
    className="w-[243px] h-[102px] px-2.5 py-3 rounded-md bg-[#1D1D1F] text-neutral-400 resize-none outline-none"
    value={formData.message}
    onChange={(e) => handleChange("message", e.target.value)}
    rows="4"
  />
</div>


      </div>

      <UploadAttachment onFileSelect={(file) => handleChange("attachment", file)} />

      <SubmitButton />
    </form>
  );
}

export default Support3;
