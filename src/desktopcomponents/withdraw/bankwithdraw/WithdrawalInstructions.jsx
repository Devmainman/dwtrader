import React from "react";

function InstructionItem({ children }) {
  return (
    <div className="flex gap-1.5 items-start mt-3.5 w-full">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/ec72992227cd154fb2146c3e5d8ce946243da6ff1a40a849a3ff6168b935b4d6?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
        className="object-contain shrink-0 aspect-square w-[18px]"
        alt="Bullet point"
      />
      <p className="flex-1 shrink basis-0 text-neutral-400 leading-4">
        {children}
      </p>
    </div>
  );
}

function WithdrawalInstructions() {
  return (
    <aside className="flex overflow-hidden flex-col grow justify-center px-3.5 py-4 w-full rounded-xl bg-[#1D1D1F] max-md:mt-10">
      <div className="w-full">
        <h3 className="flex-1 shrink gap-2.5 self-stretch w-full text-[14px] font-medium tracking-normal leading-tight basis-0 text-zinc-100">
          Withdrawal Instructions:
        </h3>
        <div className="mt-3.5 w-full text-[10px]">
          <p className="text-neutral-400">
            To initiate a withdrawal, please follow these simple steps:
          </p>
          <div className="mt-1.5 w-full leading-4 text-neutral-400">
            <div className="flex gap-1.5 items-start w-full">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/ec72992227cd154fb2146c3e5d8ce946243da6ff1a40a849a3ff6168b935b4d6?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                className="object-contain shrink-0 aspect-square w-[18px]"
                alt="Bullet point"
              />
              <p className="flex-1 shrink basis-0">
                Payment Details: Request a withdrawal by providing the necessary
                payment information, such as your preferred method and account
                details.
              </p>
            </div>

            <InstructionItem>
              Verification: Our team will promptly review your withdrawal
              request and ensure all the provided details are accurate and
              complete.
            </InstructionItem>

            <InstructionItem>
              Processing: Once verified, your withdrawal will be processed
              promptly. The processing time may vary based on your chosen
              payment method.
            </InstructionItem>

            <InstructionItem>
              Confirmation: You will receive an email notification confirming
              the successful completion of your withdrawal.
            </InstructionItem>

            <p className="mt-3.5 text-neutral-400">
              If you have any questions or require assistance, our dedicated
              support team is available to assist you throughout the withdrawal
              process.
            </p>

            <p className="mt-3.5 text-neutral-400">
              Once completed, our team will verify the payment and credit the
              amount to your account promptly. For any assistance, our dedicated
              support team is available to help you.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default WithdrawalInstructions;
