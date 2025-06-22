"use client";
import React, { useState } from "react";
import CryptoHeader from "./CryptoHeader";
import CryptoFormFields from "./CryptoFormFields";
import UploadProof from "./UploadProof";
import DepositInstructions from "./DepositInstructions";

const CryptoDepositForm = () => {
  const [formData, setFormData] = useState({
    cryptoName: "Bitcoin",
    walletAddress: "bhxuw8y38yf38hb83b7yu hfux3y8fbu3h8ufh38 h",
    amount: "",
    proofImage: null,
  });

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const payload = new FormData();
    payload.append("cryptoName", formData.cryptoName);
    payload.append("walletAddress", formData.walletAddress);
    payload.append("amount", formData.amount);
  
    if (formData.proofImage) {
      payload.append("proofImage", formData.proofImage);
    }
  
    // 🧪 Just to verify what’s inside:
    for (let pair of payload.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }
  
    // Example: POST to backend
    // fetch("/api/deposit", {
    //   method: "POST",
    //   body: payload,
    // })
    //   .then((res) => res.json())
    //   .then((data) => {
    //     console.log("Success:", data);
    //   })
    //   .catch((error) => {
    //     console.error("Error:", error);
    //   });
  };
  

  const handleFileUpload = (file) => {
    setFormData((prev) => ({
      ...prev,
      proofImage: file,
    }));
  };

  return (
    <section className="p-5 w-full bg-neutral-900 min-h-screen">
      <form className="mx-auto max-w-[390px]" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 mb-6">
          <CryptoHeader cryptoName={formData.cryptoName} />
          <CryptoFormFields
            formData={formData}
            onInputChange={handleInputChange}
          />
        </div>

        <UploadProof
          onFileUpload={handleFileUpload}
          selectedFile={formData.proofImage}
        />

        <button
          type="submit"
          className="mb-6 w-full text-xs tracking-normal leading-4 bg-blue-600 rounded-3xl h-[42px] text-zinc-100"
        >
          Submit
        </button>

        <DepositInstructions />
      </form>
    </section>
  );
};

export default CryptoDepositForm;
