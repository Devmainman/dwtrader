import React from "react";

function InstructionsSidebar() {
  return (
    <aside className="flex overflow-hidden flex-col justify-center px-3.5 py-4 text-xs leading-none rounded-xl bg-zinc-900 min-w-60 text-neutral-400 w-[402px]">
      <div className="w-full">
        <div className="w-full">
          <div className="w-full">
            <p className="text-neutral-400">
              Thank you for registering with our platform! To ensure the
              security of your account and provide you with a seamless
              experience, we kindly request you to upload a scanned copy or
              clear photograph of your government-issued identity card for
              verification purposes.
            </p>
            <p className="mt-3.5 text-neutral-400">
              The provided identity card should be one of the following:
            </p>
            <ul>
              <li className="flex gap-1.5 items-center mt-3.5 w-full whitespace-nowrap">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/290eed2833e1286c06dece9ea7d1150d7b0e1dfe?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                  alt="Check Icon"
                  className="object-contain shrink-0 self-stretch my-auto aspect-square w-[18px]"
                />
                <span className="flex-1 shrink self-stretch my-auto basis-0">
                  Passport
                </span>
              </li>
              <li className="flex gap-1.5 items-center mt-3.5 w-full">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/290eed2833e1286c06dece9ea7d1150d7b0e1dfe?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                  alt="Check Icon"
                  className="object-contain shrink-0 self-stretch my-auto aspect-square w-[18px]"
                />
                <span className="flex-1 shrink self-stretch my-auto basis-0">
                  National Identity Card
                </span>
              </li>
              <li className="flex gap-1.5 items-center mt-3.5 w-full">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/290eed2833e1286c06dece9ea7d1150d7b0e1dfe?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                  alt="Check Icon"
                  className="object-contain shrink-0 self-stretch my-auto aspect-square w-[18px]"
                />
                <span className="flex-1 shrink self-stretch my-auto basis-0">
                  Driver's License
                </span>
              </li>
            </ul>
            <p className="mt-3.5 text-neutral-400">
              Please make sure that the uploaded document clearly displays the
              following details:
            </p>
            <ul>
              <li className="flex gap-1.5 items-center mt-3.5 w-full">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/290eed2833e1286c06dece9ea7d1150d7b0e1dfe?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                  alt="Check Icon"
                  className="object-contain shrink-0 self-stretch my-auto aspect-square w-[18px]"
                />
                <span className="flex-1 shrink self-stretch my-auto basis-0">
                  Your full name
                </span>
              </li>
              <li className="flex gap-1.5 items-center mt-3.5 w-full">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/290eed2833e1286c06dece9ea7d1150d7b0e1dfe?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                  alt="Check Icon"
                  className="object-contain shrink-0 self-stretch my-auto aspect-square w-[18px]"
                />
                <span className="flex-1 shrink self-stretch my-auto basis-0">
                  Date of birth
                </span>
              </li>
              <li className="flex gap-1.5 items-center mt-3.5 w-full whitespace-nowrap">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/290eed2833e1286c06dece9ea7d1150d7b0e1dfe?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                  alt="Check Icon"
                  className="object-contain shrink-0 self-stretch my-auto aspect-square w-[18px]"
                />
                <span className="flex-1 shrink self-stretch my-auto basis-0">
                  Photograph
                </span>
              </li>
              <li className="flex gap-1.5 items-center mt-3.5 w-full">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/290eed2833e1286c06dece9ea7d1150d7b0e1dfe?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                  alt="Check Icon"
                  className="object-contain shrink-0 self-stretch my-auto aspect-square w-[18px]"
                />
                <span className="flex-1 shrink self-stretch my-auto basis-0">
                  ID number
                </span>
              </li>
              <li className="flex gap-1.5 items-center mt-3.5 w-full">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/290eed2833e1286c06dece9ea7d1150d7b0e1dfe?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                  alt="Check Icon"
                  className="object-contain shrink-0 self-stretch my-auto aspect-square w-[18px]"
                />
                <span className="flex-1 shrink self-stretch my-auto basis-0">
                  Issuing authority
                </span>
              </li>
            </ul>
            <p className="mt-3.5 text-neutral-400">
              Rest assured that all information you provide will be handled with
              the utmost confidentiality and used solely for verification
              purposes in accordance with our privacy policy.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default InstructionsSidebar;
