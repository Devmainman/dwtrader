import React from "react";
import MessageItem from "./MessageItem";

function ConversationList() {
  const messages = [
    {
      id: 1,
      sender: "Benson Showole",
      content: "No picture ticket",
      timestamp: "24 Nov, 2024 15:36pm",
      isSupport: false,
    },
    {
      id: 2,
      sender: "Customer support",
      content: "No picture ticket",
      timestamp: "24 Nov, 2024 15:36pm",
      isSupport: true,
    },
  ];

  return (
    <section className="mt-8">
      <h2 className="text-xs tracking-normal leading-none text-neutral-400">
        Conversations
      </h2>
      <div className="flex flex-col mt-6 max-w-full w-[345px] rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-none">

        {messages.map((message) => (
          <MessageItem
            key={message.id}
            sender={message.sender}
            content={message.content}
            timestamp={message.timestamp}
            isSupport={message.isSupport}
          />
        ))}
      </div>
    </section>
  );
}

export default ConversationList;
