import React from "react";
import NotificationHeader from "./NotificationHeader";
import NotificationBody from "./NotificationBody";

function NotificationCard() {
  return (
    <div className="flex overflow-hidden gap-2.5 justify-center  rounded-xl">
      <article className="px-4 py-5 rounded-xl bg-neutral-800 min-w-60 w-[1098px] max-md:max-w-full">
        <NotificationHeader
          subject="Contract Document Notification"
          date="27 Nov, 2024"
        />
        <NotificationBody content='"To proceed, please download the required form, complete it with the necessary information, and send it back to our company. This form helps us gather important details to serve you better and maintain compliance with our policies. Once filled, you can submit the form via email or mail it to our office address as specified in the instructions. If you have any questions while filling out the form, don&apos;t hesitate to reach out to our support team for assistance. Thank you for your cooperation!"' />
      </article>
    </div>
  );
}

export default NotificationCard;
