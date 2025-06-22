import React from "react";
import InstructionItem from "./InstructionItem";

function InstructionsSidebar() {
  const instructions = [
    "Find a well-lit area with minimal shadows for the best results.",
    "Position your face within the frame provided, ensuring your entire face is visible.",
    "Keep your face straight and look directly into the camera.",
    "Take a clear and unobstructed photo.",
  ];

  return (
    <aside className="flex overflow-hidden flex-col justify-center px-3.5 py-4 w-full text-xs rounded-xl bg-zinc-900 text-neutral-400 max-md:mt-4">
      <div className="w-full">
        <div className="w-full">
          <div className="w-full">
            <p>
              Welcome to our secure and advanced facial verification system! To
              ensure the highest level of security and identity verification, we
              kindly request you to undergo facial recognition. Our facial
              verification process is designed to match your live image with the
              photo in your identification document, providing a seamless and
              reliable way to confirm your identity.
            </p>
            <p className="mt-3.5">To get started, please follow these steps:</p>

            {instructions.map((instruction, index) => (
              <InstructionItem key={index} text={instruction} />
            ))}

            <p className="mt-3.5">
              Rest assured that your facial data will be handled with the utmost
              confidentiality and securely stored in compliance with our strict
              privacy policies. This verification process allows us to maintain
              a safe and trustworthy environment for all our users.
            </p>
            <p className="mt-3.5">
              Thank you for your cooperation. Should you encounter any issues or
              have any questions, our support team is available to assist you.
              Get ready to experience the convenience and security of facial
              verification with us!
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default InstructionsSidebar;
