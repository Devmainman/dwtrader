import React from "react";
import MessageBubble from "./MessageBubble";
import ReplyInput from "./ReplyInput";

const ConversationSection = () => {
  // Sample messages
  const sampleMessages = [
    {
      user: "Support Agent",
      message: "Hello! How can I help you today?",
      timestamp: "10:30 AM",
      isSupport: true
    },
    {
      user: "Customer",
      message: "I'm having issues with my recent transaction. It's been pending for 2 days now.",
      timestamp: "10:32 AM",
      isSupport: false
    },
  ];

  return (
    <section className="flex flex-col gap-5 px-5 py-8 mt-5 border bg-neutral-800 border-neutral-600 rounded-[30px]">
      <h2 className="mb-5 text-sm font-medium tracking-normal leading-4 text-zinc-100">
        Conversations
      </h2>
      <div className="flex flex-col gap-5">
        {sampleMessages.map((msg, index) => (
          <MessageBubble
            key={index}
            user={msg.user}
            message={msg.message}
            timestamp={msg.timestamp}
            isSupport={msg.isSupport}
          />
        ))}
      </div>
      <ReplyInput />
      <button className="px-2.5 mx-auto w-full text-xs tracking-normal leading-4 text-center bg-blue-600 rounded-3xl h-[31px] max-w-[353px] text-zinc-100 flex items-center justify-center">
        Send
      </button>
    </section>
  );
};

export default ConversationSection;