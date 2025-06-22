import React from "react";

function NotificationBody({ content }) {
  return (
    <section className="mt-7 w-full text-sm tracking-normal max-md:max-w-full">
      <h3 className="font-medium leading-tight text-zinc-100">Body:</h3>
      <p className="mt-2.5 leading-6 text-stone-300 max-md:max-w-full">
        {content}
      </p>
    </section>
  );
}

export default NotificationBody;
