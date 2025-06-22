import React from "react";

function InfoSidebar() {
  const infoPoints = [
    "Thank you for registering with our platform! To ensure the security of your account and provide you with a seamless experience, we kindly request you to provide your address and upload a scanned copy or clear proof of address for verification purposes.",
    "The provided identity card should be one of the following:",
    "Please make sure that the uploaded document clearly displays your address:",
    "Rest assured that all information you provide will be handled with the utmost confidentiality and used solely for verification purposes in accordance with our privacy policy.",
  ];

  return (
    <aside className="flex overflow-hidden flex-col justify-center px-3.5 py-4 w-full text-xs rounded-xl bg-zinc-900 text-neutral-400 max-md:mt-2.5">
      <div className="w-full">
        <div className="w-full">
          {infoPoints.map((point, index) => (
            <div
              key={index}
              className="flex gap-2 items-start mt-0 w-full"
              style={{ marginTop: index > 0 ? "14px" : "0" }}
            >
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/290eed2833e1286c06dece9ea7d1150d7b0e1dfe?placeholderIfAbsent=true&apiKey=f833d316d5594ebfbfc925eb76aa82b8"
                alt="Info icon"
                className="object-contain shrink-0 aspect-square w-[18px]"
              />
              <p className="flex-1 shrink basis-0">{point}</p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default InfoSidebar;
