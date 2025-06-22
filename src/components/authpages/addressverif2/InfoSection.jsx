import React from "react";
import CheckItem from "./CheckItem";

function InfoSection() {
  return (
    <section className="flex flex-col gap-3.5 px-3.5 py-4 mt-8 rounded-xl bg-zinc-900">
      <CheckItem>
        Thank you for registering with our platform! To ensure the security of
        your account and provide you with a seamless experience, we kindly
        request you to provide your address and upload a scanned copy or clear
        proof of address for verification purposes.
      </CheckItem>

      <CheckItem>
        The provided identity card should be one of the following:
      </CheckItem>

      <CheckItem>
        Please make sure that the uploaded document clearly displays your
        address:
      </CheckItem>

      <CheckItem>
        Rest assured that all information you provide will be handled with the
        utmost confidentiality and used solely for verification purposes in
        accordance with our privacy policy.
      </CheckItem>
    </section>
  );
}

export default InfoSection;
