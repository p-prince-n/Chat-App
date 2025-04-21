import React, { useEffect, useRef, useState } from "react";
import "../css/hideScrollBar.css"
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
// 👉 If using Lucide for icons, import the icon
import { ArrowDown } from "lucide-react";

export const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();

  const messageContainerRef = useRef(null); // 👉 Ref for scroll tracking
  const messageEndRef = useRef(null); // 👉 Ref for auto scroll to bottom
  const myLastMessageRef = useRef(null); // 👉 Ref to your last message
  const [showScrollButton, setShowScrollButton] = useState(false); // 👉 Button visibility state

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [
    selectedUser._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" }); // 👉 Auto-scroll to bottom
    }
  }, [messages]);

  // 👉 Track scroll position
  const handleScroll = () => {
    if (!messageContainerRef.current) return;
    const container = messageContainerRef.current;
  
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
  
    // Show the button only if user scrolled up at least 100px from the bottom
    setShowScrollButton(distanceFromBottom > 100);
  };
  

  // 👉 Scroll to last message sent by authUser
  const scrollToMyLastMessage = () => {
    if (myLastMessageRef.current) {
      myLastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 👉 Show skeleton while loading
  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      <ChatHeader />
      <div
        ref={messageContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-hidden" 
        // 👉 Add 'no-scrollbar' class here
      >
        
        {messages.map((message, index) => {
          const isMyMessage = message.senderId === authUser._id;

          // 👉 Identify your last sent message
          const isLastMyMessage =
            isMyMessage &&
            (index === messages.length - 1 ||
              messages.slice(index + 1).find((m) => m.senderId === authUser._id) ===
                undefined);

          return (
            <div
              key={message._id}
              className={`chat ${isMyMessage ? "chat-end" : "chat-start"}`}
              ref={isLastMyMessage ? myLastMessageRef : null} // 👉 Attach ref to last message from you
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      isMyMessage
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                  />
                </div>
              </div>
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
              <div className="chat-bubble flex flex-col">
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          );
        })}

        {/* 👉 Auto scroll to bottom ref */}
        <div ref={messageEndRef} />
      </div>

      {/* 👉 Floating down-arrow button */}
      {showScrollButton && (
        <button
          onClick={scrollToMyLastMessage}
          className="absolute bottom-20 right-4 bg-base-300 hover:bg-base-100 text-white p-3 rounded-full shadow-lg transition-all"
          title="Go to My Last Message"
        >
          
          <ArrowDown className="size-5 text-primary" />
         
        </button>
      )}

      <MessageInput />
    </div>
  );
};
