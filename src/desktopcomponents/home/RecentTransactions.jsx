import React from "react";

function RecentTransactions() {
  return (
    <section className="mt-5 w-full min-h-[551px] max-md:mr-2">
      <h3 className="text-xs tracking-normal leading-none text-stone-300">
        Recent Transactions
      </h3>
      <div className="flex flex-1 gap-2.5 items-start mt-1.5 h-full">
        <div className="overflow-hidden h-[523px] min-w-60 w-[354px]">
          <TransactionCard type="Withdrawal" status="Pending" />
          <TransactionCard type="Deposit" status="Pending" showProof={true} />
          <TransactionCard type="Deposit" status="Pending" showProof={true} />
          <TransactionCard type="Deposit" status="Completed" showProof={true} />
          <div className="flex overflow-hidden flex-col justify-center px-2.5 pt-2.5 mt-1.5 w-full rounded-xl bg-zinc-900 min-h-[123px]">
            <div className="w-full">
              <div className="flex justify-between items-center w-full">
                <div className="flex gap-1.5 items-end self-stretch my-auto">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/3c1311b0a06dabffe2ffa52bc421d9c42f67916889cb674e791b85291cb881fe?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                    alt="Bank icon"
                    className="object-contain w-10 aspect-[40]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pb-36 w-0.5 rounded-xl bg-stone-300 max-md:pb-24">
          <div className="flex shrink-0 rounded-xl bg-neutral-600 h-[37px] max-md:-mr-0.5" />
        </div>
      </div>
    </section>
  );
}

function TransactionCard({ type, status, showProof = false }) {
  const statusColor = status === "Pending" ? "bg-yellow-700" : "bg-green-700";

  return (
    <article className="flex overflow-hidden flex-col justify-center p-2.5 mt-1.5 w-full rounded-xl bg-[#1D1D1F] min-h-[123px]">
      <div className="w-full">
        <div className="flex justify-between items-center w-full">
          <div className="flex gap-1.5 items-end self-stretch my-auto">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/eb100add594afa2e3defef8806dce13fa655cec06569aaefd0b5f91f45276b16?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
              alt="Bank icon"
              className="object-contain shrink-0 w-10 aspect-square"
            />
            <div>
              <div className="text-[8px] text-stone-300">December 22, 2024</div>
              <div className="mt-1.5 text-[14px] font-medium tracking-normal leading-tight text-stone-300">
                Citi Bank
              </div>
            </div>
          </div>
          <div className="flex flex-col flex-1 shrink justify-center items-end self-stretch my-auto whitespace-nowrap basis-0">
            <div className="text-[8px] text-stone-300">Amount</div>
            <div className="mt-1.5 text-[14px] font-medium tracking-normal leading-tight text-stone-300">
              $7.89
            </div>
          </div>
        </div>
        <div className="flex gap-10 justify-between items-center mt-3 w-full text-[8px]">
          <div className="self-stretch my-auto leading-3 text-stone-300">
            Bank Name : eafasfsd
            <br />
            Account Name : afasgsa
            <br />
            Account Number : sfsgs
            <br />
            withdrawal token : 6137257094
          </div>
          <div className="self-stretch my-auto text-[10px] text-stone-300 w-[69px]">
            {type}
          </div>
          <div className="flex flex-col justify-center self-stretch my-auto text-center text-zinc-100">
            <div
              className={`gap-3 self-${
                showProof ? "start" : "stretch"
              } py-0.5 pr-2 pl-2 whitespace-nowrap ${statusColor} rounded`}
            >
              {status}
            </div>
            {showProof && (
              <div className="gap-3 self-stretch py-0.5 pr-2 pl-2 mt-2.5 bg-blue-600 rounded">
                View Poof
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default RecentTransactions;
