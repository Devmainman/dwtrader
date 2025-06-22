import React from "react";

const ReplyInput = () => {
  return (
    <section className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-neutral-400">Reply</label>
      <div className="flex gap-1.5">
        <input
          type="text"
          placeholder="Type in Text"
          className="flex-1 px-5 py-2.5 text-xs rounded-3xl border border-fuchsia-600 bg-zinc-900 h-[49px] text-stone-300"
        />
        <button className="flex justify-center items-center px-3 pt-2.5 pb-3 w-10 bg-blue-600 rounded-3xl">
          <div
            dangerouslySetInnerHTML={{
              __html:
                '<svg id="313:4444" layer-name="ep:upload-filled" width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-[18px] h-[18px]"> <path d="M9.5625 15.6875V12.3125H11.8125L9 8.9375L6.1875 12.3125H8.4375V15.6875H5.625V15.6594C5.5305 15.665 5.4405 15.6875 5.34375 15.6875C4.22487 15.6875 3.15181 15.243 2.36064 14.4519C1.56947 13.6607 1.125 12.5876 1.125 11.4688C1.125 9.30425 2.76188 7.54025 4.86225 7.29838C5.04641 6.33571 5.56026 5.4673 6.31543 4.84251C7.0706 4.21772 8.01988 3.8756 9 3.875C9.98026 3.87554 10.9297 4.21761 11.6851 4.84239C12.4404 5.46717 12.9545 6.33561 13.1389 7.29838C15.2393 7.54025 16.8739 9.30425 16.8739 11.4688C16.8739 12.5876 16.4294 13.6607 15.6382 14.4519C14.8471 15.243 13.774 15.6875 12.6551 15.6875C12.5606 15.6875 12.4695 15.665 12.3739 15.6594V15.6875H9.5625Z" fill="#F3F3F3"></path> </svg>',
            }}
          />
        </button>
      </div>
    </section>
  );
};

export default ReplyInput;
