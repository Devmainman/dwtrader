"use client";
import React from "react";
import CheckItem from "./CheckItem";

function InstructionsPanel() {
  return (
    <section className="px-3.5 py-4 mt-16 rounded-xl bg-zinc-900">
      <p className="mb-3.5 text-xs text-neutral-400">
        Welcome to our secure and advanced facial verification system! To ensure
        the highest level of security and identity verification, we kindly
        request you to undergo facial recognition. Our facial verification
        process is designed to match your live image with the photo in your
        identification document, providing a seamless and reliable way to
        confirm your identity.
      </p>
      <p className="mb-3.5 text-xs text-neutral-400">
        To get started, please follow these steps:
      </p>

      <CheckItem text="Find a well-lit area with minimal shadows for the best results." />
      <CheckItem text="Position your face within the frame provided, ensuring your entire face is visible." />
      <CheckItem text="Keep your face straight and look directly into the camera." />
      <CheckItem text="Take a clear and unobstructed photo." />

      <p className="mb-3.5 text-xs text-neutral-400">
        Rest assured that your facial data will be handled with the utmost
        confidentiality and securely stored in compliance with our strict
        privacy policies. This verification process allows us to maintain a safe
        and trustworthy environment for all our users.
      </p>
      <p className="mb-3.5 text-xs text-neutral-400">
        Thank you for your cooperation. Should you encounter any issues or have
        any questions, our support team is available to assist you. Get ready to
        experience the convenience and security of facial verification with us!
      </p>
    </section>
  );
}

export default InstructionsPanel;
