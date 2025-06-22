"use client";
import React, { useState } from "react";
import FileUpload from "./FileUpload";

function TicketForm() {
  const [formData, setFormData] = useState({
    subject: "Withdrawal Amount",
    priority: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
  };

  return (
    <section className="flex overflow-hidden flex-col px-5 py-6 mt-5 mr-32 max-w-full rounded-xl bg-zinc-900 w-[869px] max-md:px-5 max-md:mr-2.5">
      <h2 className="self-start text-sm font-medium tracking-normal leading-tight text-neutral-400">
        Open New Ticket
      </h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col mt-8 w-full max-md:max-w-full"
      >
        <div className="flex flex-wrap gap-10 justify-between items-center w-full max-md:max-w-full">
          <div className="self-stretch my-auto text-xs min-w-60 w-[437px] max-md:max-w-full">
            <div className="w-full max-md:max-w-full">
              <div className="flex gap-10 justify-between items-center w-full max-md:max-w-full">
                <label
                  htmlFor="subject"
                  className="gap-2.5 self-stretch my-auto font-medium whitespace-nowrap text-neutral-400"
                >
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  className="gap-2.5 self-stretch px-2.5 py-3 my-auto rounded-md bg-neutral-800 min-h-9 min-w-60 text-neutral-400 w-[243px]"
                />
              </div>
              <div className="flex gap-10 justify-between items-center mt-4 w-full whitespace-nowrap max-md:max-w-full">
                <label
                  htmlFor="priority"
                  className="gap-2.5 self-stretch my-auto font-medium text-neutral-400"
                >
                  Priority
                </label>
                <div className="flex overflow-hidden gap-2.5 items-center self-stretch px-2.5 py-2 my-auto rounded-lg border border-solid bg-neutral-900 border-neutral-600 min-h-8 min-w-60 text-stone-300 w-[243px]">
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="flex-1 shrink self-stretch my-auto basis-0 bg-transparent outline-none"
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/18b2bb6c05ebfc39636d2743e4809e1703dd784c6c7a984dcbb7169ca9063542?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                    className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
                    alt="Dropdown arrow"
                  />
                </div>
              </div>
              <div className="flex gap-10 justify-between items-start mt-4 w-full max-md:max-w-full">
                <label
                  htmlFor="message"
                  className="gap-2.5 self-stretch font-medium whitespace-nowrap text-neutral-400"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Input here"
                  className="gap-2.5 px-2.5 pt-2.5 pb-20 rounded-md bg-neutral-800 min-h-[100px] min-w-60 text-neutral-400 w-[243px] resize-none"
                />
              </div>
            </div>
          </div>
          <FileUpload />
        </div>
        <button
          type="submit"
          className="gap-2.5 self-center px-2.5 py-2 mt-10 max-w-full text-xs tracking-normal leading-none text-center whitespace-nowrap bg-blue-600 rounded-3xl min-h-[31px] text-zinc-100 w-[353px]"
        >
          Send
        </button>
      </form>
    </section>
  );
}

export default TicketForm;
